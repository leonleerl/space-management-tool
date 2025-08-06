import { RoomEntity } from "@/types/room";

const rooms : RoomEntity[] = [
    {
        id: 1,
        roomNo: '240A',
        keyLocker: '1234567890',
        roomCategory: {
            id: 1,
            name: 'AccFin',
        }
    },
    {
        id: 2,
        roomNo: '240B',
        keyLocker: '0987654321',
        roomCategory: {
            id: 1,
            name: 'AccFin',
        }
    },
    {
        id: 3,
        roomNo: '240C',
        keyLocker: '1122334455',
        roomCategory: {
            id: 1,
            name: 'AccFin',
        }
    },
    {
        id: 4,
        roomNo: '240D',
        keyLocker: '1122334455',
        roomCategory: {
            id: 1,
            name: 'AccFin',
        }
    }
]


export async function GET(request: Request) : Promise<Response> {
    return Response.json(rooms);
}
