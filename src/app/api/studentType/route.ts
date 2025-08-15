import { prisma } from "@/lib/prisma";
import { StudentTypeDto, StudentTypeEntity } from "@/types/studentType";


export async function GET(request: Request) : Promise<Response> {
    const studentTypeEntities : StudentTypeEntity[] = await prisma.studentType.findMany();
    const studentTypeDtos : string[] = studentTypeEntities.map((entity) => entity.name);
    return Response.json(studentTypeDtos)
}