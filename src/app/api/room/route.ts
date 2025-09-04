import { prisma } from "@/lib/prisma";

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