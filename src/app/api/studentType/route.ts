import { prisma } from "@/lib/prisma";
import { StudentTypeDto, StudentTypeEntity } from "@/types/studentType";

export const runtime = 'edge';

export async function GET() : Promise<Response> {
    const studentTypeEntities : StudentTypeEntity[] = await prisma.studentType.findMany();
    const studentTypeDtos : string[] = studentTypeEntities.map((entity) => entity.name);
    return Response.json(studentTypeDtos)
}

export async function POST(request: Request) : Promise<Response> {
    try {
        const body = await request.json();

        let names: unknown;
        if (Array.isArray(body)) {
            names = body;
        } else if (body && typeof body === 'object' && 'names' in body) {
            names = (body as StudentTypeDto).names;
        } else {
            return Response.json({ error: 'Invalid payload' }, { status: 400 });
        }

        if (!Array.isArray(names)) {
            return Response.json({ error: 'Invalid payload' }, { status: 400 });
        }

        const normalized = Array.from(new Set(
            (names as unknown[])
                .map(v => typeof v === 'string' ? v.trim() : '')
                .filter(v => v.length > 0)
        ));

        // Compute deletions (types that exist but are not in the submitted list)
        const existing = await prisma.studentType.findMany({ select: { id: true, name: true } });
        const toDeleteNames = existing
            .map(t => t.name)
            .filter(name => !normalized.includes(name));

        const toDelete = toDeleteNames.length > 0
            ? await prisma.studentType.findMany({ where: { name: { in: toDeleteNames } }, select: { id: true } })
            : [];
        const toDeleteIds = toDelete.map(t => t.id);

        // Use a single transaction to keep changes consistent
        await prisma.$transaction(async (tx) => {
            if (toDeleteIds.length > 0) {
                await tx.student.updateMany({ where: { typeId: { in: toDeleteIds } }, data: { typeId: null } });
                await tx.studentType.deleteMany({ where: { id: { in: toDeleteIds } } });
            }

            for (const name of normalized) {
                await tx.studentType.upsert({
                    where: { name },
                    update: {},
                    create: { name },
                });
            }
        });

        return Response.json({ message: 'Student types upserted successfully', count: normalized.length });
    } catch (error) {
        console.error(error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
