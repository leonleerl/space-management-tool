// import { RoomEntity } from "@/types/room";

import { prisma } from "@/lib/prisma";

export async function GET(request: Request) : Promise<Response> {
    const { searchParams } = new URL(request.url);
    // roomLocation is required
    const roomLocation = searchParams.get('roomLocation');
    if (!roomLocation) {
        return Response.json({ error: 'roomLocation is required' }, { status: 400 });
    }

    // find the locationId based on the roomLocation
    const location = await prisma.roomLocation.findUnique({
        where: {
            name: roomLocation
        }
    });
    
    if (!location) {
        return Response.json({ error: 'location not found' }, { status: 404 });
    }

    // get all rooms with the location.id and include the students and staff    
    const rooms = await prisma.room.findMany({
        where: {
            locationId: location.id
        },
        include: {
            students: true,
            staff: true
        }
    });

    console.log(rooms);
    return Response.json(rooms);
}
