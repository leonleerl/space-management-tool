import { prisma } from "@/lib/prisma";
import { RoomDtoArraySchema } from "@/lib/schemas/room.schema";

export const runtime = 'edge';

// get the rooms based on the location
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    if (!location) {
        return Response.json({ error: 'location is required' }, { status: 400 });
    }
    const rooms = await prisma.room.findMany({
        include: {
            location: true
        },
        where: {
            location: {
                name: location
            }
        }
    })
    return Response.json(rooms)
}

export async function POST(request: Request) : Promise<Response> {
    // Replace rooms only for involved locations, keep other locations intact
    const body = await request.json();
    const parseResult = RoomDtoArraySchema.safeParse(body);
    if (!parseResult.success) {
        return Response.json({ error: 'Invalid payload', details: parseResult.error.flatten() }, { status: 400 });
    }

    const payload = parseResult.data;

    if (!Array.isArray(payload) || payload.length === 0) {
        return Response.json({ message: 'No rooms to replace' });
    }

    // Validate every row has a location name
    const invalid = payload.find(r => !r.location || !r.location?.name || r.location.name.trim().length === 0);
    if (invalid) {
        return Response.json({ error: 'Each room requires location.name' }, { status: 400 });
    }

    // Resolve location ids from immutable room_locations table
    const locationNames = Array.from(new Set(payload.map(r => r.location!.name)));
    const locations = await prisma.roomLocation.findMany({ where: { name: { in: locationNames } } });
    const locationNameToId = new Map(locations.map(l => [l.name, l.id] as const));
    const missing = locationNames.filter(n => !locationNameToId.has(n));
    if (missing.length > 0) {
        return Response.json({ error: 'Unknown locations', details: missing }, { status: 400 });
    }

    const locationIds = locations.map(l => l.id);

    // Find existing rooms under these locations to safely detach dependents first
    const roomsToReplace = await prisma.room.findMany({
        where: { locationId: { in: locationIds } },
        select: { id: true },
    });
    const roomIdsToReplace = roomsToReplace.map(r => r.id);

    if (roomIdsToReplace.length > 0) {
        // Nullify FK on dependents referencing these rooms only
        await prisma.staff.updateMany({ where: { roomId: { in: roomIdsToReplace } }, data: { roomId: null } });
        await prisma.student.updateMany({ where: { roomId: { in: roomIdsToReplace } }, data: { roomId: null } });
    }

    // Delete only rooms for these locations
    await prisma.room.deleteMany({ where: { locationId: { in: locationIds } } });

    // Prepare data mapped to location ids
    const data = payload.map(r => ({
        roomNo: r.roomNo,
        keyLocker: r.keyLocker ?? null,
        locationId: locationNameToId.get(r.location!.name)!,
    }));

    if (data.length > 0) {
        await prisma.room.createMany({ data });
    }

    return Response.json({ message: 'Rooms replaced for selected locations successfully' });
}