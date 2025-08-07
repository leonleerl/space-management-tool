import { StaffDto, StaffEntity } from "@/types/STAFF";

// mock data, suppose to be fetched from database
let staff : StaffEntity[] = [
    {
        id: 1,
        firstName: 'John',
        middleName: 'A',
        lastName: 'Doe',
        position: 'Manager',
        extNo: '1234567890',
        source: 'Academic',
        room: {
            id: 1,
            roomNo: '101',
            keyLocker: '1234567890',
            roomCategory: {
                id: 1,
                name: 'A205',
            }
        },
        staffCategory: {
            id: 1,
            name: 'AccFin'
        }
    },
    {
        id: 2,
        firstName: 'Jane',
        middleName: 'B',
        lastName: 'Doe',
        position: 'Manager',
        extNo: '1234567890',
        source: 'Academic',
        room: {
            id: 2,
            roomNo: '102',
            keyLocker: '0987654321',
            roomCategory: {
                id: 1,
                name: 'A206',
            }
        },
        staffCategory: {
            id: 1,
            name: 'AccFin'
        }
    },
    {
        id: 3,
        firstName: 'John',
        lastName: 'Smith',
        position: 'Manager',
        extNo: '1234567890',
        source: 'Research',
        room: {
            id: 3,
            roomNo: '103',
            keyLocker: '1122334455',
            roomCategory: {
                id: 1,
                name: 'A207',
            }
        },
        staffCategory: {
            id: 2,
            name: 'Economics'
        }
    },
    {
        id: 4,
        firstName: 'Tim',
        lastName: 'Cook',
        position: 'Manager',
        extNo: '1234567890',
        source: 'Academic',
        room: {
            id: 4,
            roomNo: '104',
            keyLocker: '1122334455',
            roomCategory: {
                id: 1,
                name: 'A208',
            }
        },
        staffCategory: {
            id: 2,
            name: 'AccFin'
        }
    }
]

export async function GET(request: Request) : Promise<Response> {
    const { searchParams } = new URL(request.url);
    const contactCategory = searchParams.get('contactCategory');

    if (contactCategory) {
        staff = staff.filter(staff => staff.staffCategory.name === contactCategory);
    }
    const staffDtos : StaffDto[] = await Promise.resolve(staff.map(staff => {
        if (!staff.middleName) {
            // if middleName is not provided, return fullName as firstName and lastName
            return {
                id: staff.id,
                fullName: `${staff.firstName} ${staff.lastName}`,
                position: staff.position,
                extNo: staff.extNo,
                source: staff.source,
                room: staff.room,
                staffCategory: staff.staffCategory
            }
        }
        return {
            id: staff.id,
            fullName: `${staff.firstName} ${staff.middleName} ${staff.lastName}`,
            position: staff.position,
            extNo: staff.extNo,
            source: staff.source,
            room: staff.room,
            staffCategory: staff.staffCategory
        }
    }))
    return Response.json(staffDtos);
}

export async function POST(request: Request) : Promise<Response> {
    const staff = await request.json();
    staff.push(staff);
    return Response.json(staff);
}