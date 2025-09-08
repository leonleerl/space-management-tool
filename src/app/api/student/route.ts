import { prisma } from "@/lib/prisma";
import { StudentEntity } from "@/types/student";
import { StudentDtoArraySchema, StudentDtoArrayParsed } from "@/lib/schemas/student.schema";
import { parseFullName } from "@/lib/schemas/staff.schema";

export const runtime = 'edge';


export async function GET(request: Request) : Promise<Response> {
    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department');

    const studentEntities : StudentEntity[] = await prisma.student.findMany({
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

export async function POST(request: Request) : Promise<Response> {
    const body = await request.json();
    const parseResult = StudentDtoArraySchema.safeParse(body);
    if (!parseResult.success) {
        return Response.json({ error: 'Invalid payload', details: parseResult.error.flatten() }, { status: 400 });
    }

    const payload : StudentDtoArrayParsed = parseResult.data as StudentDtoArrayParsed;

    const rows = payload.map((dto) => {
        const { firstName, middleName, lastName } = parseFullName(dto.fullName ?? "");
        const endDateValue = dto.endDate;
        let endDate: Date | null = null;
        if (endDateValue instanceof Date) {
            endDate = isNaN(endDateValue.getTime()) ? null : endDateValue;
        } else if (typeof endDateValue === 'string') {
            const d = new Date(endDateValue);
            endDate = isNaN(d.getTime()) ? null : d;
        }
        return {
            firstName,
            middleName,
            lastName,
            comment: dto.comment ?? null,
            extNo: dto.extNo ?? null,
            podNo: dto.podNo ?? null,
            endDate,
            roomNo: dto.room?.roomNo ?? null,
            departmentName: dto.department?.name ?? null,
            typeName: dto.type?.name ?? null,
        };
    });

    // Resolve optional foreign keys (roomId, departmentId, typeId)
    const roomNoSet = new Set(rows.map(r => r.roomNo).filter((v): v is string => !!v));
    const deptNameSet = new Set(rows.map(r => r.departmentName).filter((v): v is string => !!v));
    const typeNameSet = new Set(rows.map(r => r.typeName).filter((v): v is string => !!v));

    const rooms = roomNoSet.size > 0 ? await prisma.room.findMany({ where: { roomNo: { in: Array.from(roomNoSet) } } }) : [];

    // Ensure departments exist; create missing by name
    const deptNames = Array.from(deptNameSet);
    if (deptNames.length > 0) {
        await Promise.all(
            deptNames.map((name) =>
                prisma.department.upsert({ where: { name }, update: {}, create: { name } })
            )
        );
    }
    const depts = deptNames.length > 0 ? await prisma.department.findMany({ where: { name: { in: deptNames } } }) : [];

    // Ensure student types exist; create missing by name
    const typeNames = Array.from(typeNameSet);
    if (typeNames.length > 0) {
        await Promise.all(
            typeNames.map((name) =>
                prisma.studentType.upsert({ where: { name }, update: {}, create: { name } })
            )
        );
    }
    const types = typeNames.length > 0 ? await prisma.studentType.findMany({ where: { name: { in: typeNames } } }) : [];

    // Delete only student records within departments provided in the request
    if (depts.length > 0) {
        const deptIds = depts.map(d => d.id);
        await prisma.student.deleteMany({ where: { departmentId: { in: deptIds } } });
    }

    const roomNoToId = new Map(rooms.map(r => [r.roomNo, r.id] as const));
    const deptNameToId = new Map(depts.map(d => [d.name, d.id] as const));
    const typeNameToId = new Map(types.map(t => [t.name, t.id] as const));

    const data = rows.map(r => ({
        firstName: r.firstName,
        middleName: r.middleName,
        lastName: r.lastName,
        comment: r.comment,
        extNo: r.extNo,
        podNo: r.podNo,
        endDate: r.endDate,
        roomId: r.roomNo ? (roomNoToId.get(r.roomNo) ?? null) : null,
        departmentId: r.departmentName ? (deptNameToId.get(r.departmentName) ?? null) : null,
        typeId: r.typeName ? (typeNameToId.get(r.typeName) ?? null) : null,
    }));

    await prisma.student.createMany({ data });

    return Response.json({ message: 'Student inserted successfully' })
}