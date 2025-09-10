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
    // Resolve locationId by location name first for reliable matching
    const foundLocation = await prisma.roomLocation.findUnique({
        where: { name: location }
    });

    if (!foundLocation) {
        // If not found by name, also accept numeric id for flexibility
        const numericId = Number(location);
        if (!Number.isNaN(numericId)) {
            const roomsById = await prisma.room.findMany({
                include: { location: true },
                where: { locationId: numericId }
            });
            return Response.json(roomsById);
        }
        return Response.json([]);
    }

    const rooms = await prisma.room.findMany({
        include: { location: true },
        where: { locationId: foundLocation.id }
    });
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

    // Resolve location ids from room_locations table; auto-create if missing
    const locationNames = Array.from(new Set(payload.map(r => r.location!.name)));
    let locations = await prisma.roomLocation.findMany({ where: { name: { in: locationNames } } });
    let locationNameToId = new Map(locations.map(l => [l.name, l.id] as const));
    const missing = locationNames.filter(n => !locationNameToId.has(n));
    if (missing.length > 0) {
        await prisma.roomLocation.createMany({ data: missing.map(name => ({ name })), skipDuplicates: true });
        // re-fetch to ensure we have ids
        locations = await prisma.roomLocation.findMany({ where: { name: { in: locationNames } } });
        locationNameToId = new Map(locations.map(l => [l.name, l.id] as const));
    }

    const locationIds = locations.map(l => l.id);

    for (const r of payload) {
    const locationId = locationNameToId.get(r.location!.name)!;

    await prisma.room.upsert({
        where: r.id && r.id > 0 ? { id: r.id } : { roomNo: r.roomNo },
        create: {
            roomNo: r.roomNo,
            keyLocker: r.keyLocker ?? null,
            locationId,
        },
        update: {
            keyLocker: r.keyLocker ?? null,
            locationId,
        },
    });

  }

    return Response.json({ message: 'Rooms upserted for selected locations successfully' });
}