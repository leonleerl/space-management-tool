import { prisma } from "@/lib/prisma";
import { StaffDto, StaffEntity } from "@/types/staff";
import { StaffDtoArraySchema, parseFullName } from "@/lib/schemas/staff.schema";

export const runtime = 'edge';

export async function GET(request: Request) : Promise<Response> {
    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department');

    const staffEntities : StaffEntity[] = await prisma.staff.findMany({
        where: {
            department: {
                name: department || ""
            }
        },
        include: {
            room: true,
            department: true
        }
    })

    const staffDtos : StaffDto[] = await Promise.resolve(staffEntities.map(staff => {
        if (!staff.middleName) {
            // if middleName is not provided, return fullName as firstName and lastName
            return {
                id: staff.id,
                fullName: `${staff.firstName} ${staff.lastName}`,
                position: staff.position,
                extNo: staff.extNo,
                source: staff.source,
                room: staff.room,
                department: staff.department
            }
        }
        return {
            id: staff.id,
            fullName: `${staff.firstName} ${staff.middleName} ${staff.lastName}`,
            position: staff.position,
            extNo: staff.extNo,
            source: staff.source,
            room: staff.room,
            department: staff.department
        }
    }))
    return Response.json(staffDtos);
}

export async function POST(request: Request) : Promise<Response> {
    await prisma.staff.deleteMany();

    const body = await request.json();
    const parseResult = StaffDtoArraySchema.safeParse(body);
    if (!parseResult.success) {
        return Response.json({ error: 'Invalid payload', details: parseResult.error.flatten() }, { status: 400 });
    }

    const payload : StaffDto[] = parseResult.data as StaffDto[];

    const rows = payload.map((dto) => {
        const { firstName, middleName, lastName } = parseFullName(dto.fullName);
        return {
            firstName,
            middleName,
            lastName,
            position: dto.position ?? null,
            extNo: dto.extNo ?? null,
            source: dto.source ?? null,
            roomNo: dto.room?.roomNo ?? null,
            departmentName: dto.department?.name ?? null,
        };
    });

    // Resolve optional foreign keys (roomId, departmentId)
    const roomNoSet = new Set(rows.map(r => r.roomNo).filter((v): v is string => !!v));
    const deptNameSet = new Set(rows.map(r => r.departmentName).filter((v): v is string => !!v));

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

    const roomNoToId = new Map(rooms.map(r => [r.roomNo, r.id] as const));
    const deptNameToId = new Map(depts.map(d => [d.name, d.id] as const));

    const data = rows.map(r => ({
        firstName: r.firstName,
        middleName: r.middleName,
        lastName: r.lastName,
        position: r.position,
        extNo: r.extNo,
        source: r.source,
        roomId: r.roomNo ? roomNoToId.get(r.roomNo) ?? null : null,
        departmentId: r.departmentName ? deptNameToId.get(r.departmentName) ?? null : null,
    }));

    await prisma.staff.createMany({ data });

    return Response.json({ message: 'Staff inserted successfully' });
}