import { ContactDto, ContactEntity } from "@/types/contact";

// mock data, suppose to be fetched from database
const contacts : ContactEntity[] = [
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
        contactCategory: {
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
        contactCategory: {
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
        contactCategory: {
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
        contactCategory: {
            id: 2,
            name: 'AccFin'
        }
    }
]

export async function GET(request: Request) : Promise<Response> {

    const contactDtos : ContactDto[] = await Promise.resolve(contacts.map(contact => {
        if (!contact.middleName) {
            // if middleName is not provided, return fullName as firstName and lastName
            return {
                id: contact.id,
                fullName: `${contact.firstName} ${contact.lastName}`,
                position: contact.position,
                extNo: contact.extNo,
                source: contact.source,
                room: contact.room,
                contactCategory: contact.contactCategory
            }
        }
        return {
            id: contact.id,
            fullName: `${contact.firstName} ${contact.middleName} ${contact.lastName}`,
            position: contact.position,
            extNo: contact.extNo,
            source: contact.source,
            room: contact.room,
            contactCategory: contact.contactCategory
        }
    }))
    return Response.json(contactDtos);
}