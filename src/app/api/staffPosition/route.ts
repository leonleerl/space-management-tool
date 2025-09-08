import { prisma } from "@/lib/prisma";

export const runtime = 'edge';

export async function GET(): Promise<Response> {
    const positions = await prisma.staffPosition.findMany({ select: { name: true } });
    const names: string[] = positions.map(p => p.name);
    return Response.json(names);
}

export async function POST(request: Request): Promise<Response> {
    try {
        const body = await request.json();

        let namesUnknown: unknown;
        if (Array.isArray(body)) {
            namesUnknown = body;
        } else if (body && typeof body === 'object' && 'names' in body) {
            // allow { names: string[] } as well
            namesUnknown = (body as { names: unknown }).names;
        } else {
            return Response.json({ error: 'Invalid payload' }, { status: 400 });
        }

        if (!Array.isArray(namesUnknown)) {
            return Response.json({ error: 'Invalid payload' }, { status: 400 });
        }

        const normalizedNames = Array.from(new Set(
            (namesUnknown as unknown[])
                .map(v => typeof v === 'string' ? v.trim() : '')
                .filter(v => v.length > 0)
        ));

        const existing = await prisma.staffPosition.findMany({ select: { id: true, name: true } });
        const existingNames = existing.map(e => e.name);

        const toDeleteNames = existingNames.filter(name => !normalizedNames.includes(name));
        const toDelete = toDeleteNames.length > 0
            ? await prisma.staffPosition.findMany({ where: { name: { in: toDeleteNames } }, select: { id: true } })
            : [];
        const toDeleteIds = toDelete.map(t => t.id);

        await prisma.$transaction(async (tx) => {
            if (toDeleteIds.length > 0) {
                // Null out foreign keys first
                await tx.staff.updateMany({ where: { positionId: { in: toDeleteIds } }, data: { positionId: null } });
                await tx.staffPosition.deleteMany({ where: { id: { in: toDeleteIds } } });
            }

            for (const name of normalizedNames) {
                const exists = await tx.staffPosition.findFirst({ where: { name } });
                if (!exists) {
                    await tx.staffPosition.create({ data: { name } });
                }
            }
        });

        return Response.json({ message: 'Staff positions upserted successfully', count: normalizedNames.length });
    } catch (error) {
        console.error(error);
        return new Response('Internal Server Error', { status: 500 });
    }
}


