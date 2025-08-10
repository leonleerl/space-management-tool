import { prisma } from "@/lib/prisma";
import { StaffDto, StaffEntity } from "@/types/staff";

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
    
    const payload : StaffDto[] = await request.json();

    const parseName = (fullName: string) => {
        const parts = (fullName || '').split(' ').filter(Boolean);
        const firstName = parts[0] ?? '';
        const lastName = parts.length > 1 ? parts[parts.length - 1] : '';
        const middle = parts.slice(1, -1).join(' ');
        const middleName = middle.length > 0 ? middle : null;
        return { firstName, middleName, lastName };
    };

    const rows = payload.map((dto) => {
        const { firstName, middleName, lastName } = parseName(dto.fullName);
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