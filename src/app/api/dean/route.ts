import { prisma } from "@/lib/prisma";

export const runtime = "edge";

export async function GET(request: Request): Promise<Response> {
  // Dean API
  const departmentName = "Dean's Office";

  try {
    // Find Dean's Office
    const department = await prisma.department.findUnique({
      where: {
        name: departmentName,
      },
    });

    if (!department) {
      return Response.json(
        { error: "Dean's Office department not found" },
        { status: 404 }
      );
    }

    // Fetch all staff members in Dean's Office
    const staffEntities = await prisma.staff.findMany({
      where: {
        departmentId: department.id,
      },
      include: {
        room: {
          include: {
            location: true,
          },
        },
        department: true,
      },
    });

    // Transform to frontend format
    const staffDtos = staffEntities.map((staff) => {
      const fullName = staff.middleName
        ? `${staff.firstName} ${staff.middleName} ${staff.lastName}`
        : `${staff.firstName} ${staff.lastName}`;

      return {
        id: staff.id,
        fullName,
        position: staff.position,
        extNo: staff.extNo,
        source: staff.source,
        room: staff.room,
        department: staff.department,
      };
    });

    console.log(`Found ${staffDtos.length} staff members in Dean's Office`);
    return Response.json(staffDtos);
  } catch (error) {
    console.error("Error fetching Dean's Office staff:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
