// import { prisma } from "@/lib/prisma";

import { prisma } from "@/lib/prisma";
import { StudentEntity } from "@/types/student";


export async function GET(request: Request) : Promise<Response> {
    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department');

    const studentEntities = await prisma.student.findMany({
        where: {
            department: {
                name: department || ""
            }
        },
        include: {
            department: true,
            room: true,
            type: true
        }
    })
    return Response.json(studentEntities)
}