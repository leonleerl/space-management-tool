import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed process...');

  // Clear existing data (optional - remove if you want to keep existing data)
  console.log('Clearing existing data...');
  await prisma.session.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.student.deleteMany();
  await prisma.staff.deleteMany();
  await prisma.room.deleteMany();
  await prisma.roomLocation.deleteMany();

  // Create Student Types (based on your image)
  console.log('Creating student types...');
  const studentTypes = await Promise.all([
    prisma.studentType.upsert({
      where: { name: 'HDR' },
      update: {},
      create: { name: 'HDR' }
    }),
    prisma.studentType.upsert({
      where: { name: 'New PhD in 2025' },
      update: {},
      create: { name: 'New PhD in 2025' }
    }),
    prisma.studentType.upsert({
      where: { name: 'PhDs' },
      update: {},
      create: { name: 'PhDs' }
    }),
    prisma.studentType.upsert({
      where: { name: 'MPhil' },
      update: {},
      create: { name: 'MPhil' }
    }),
    prisma.studentType.upsert({
      where: { name: 'Visiting Student' },
      update: {},
      create: { name: 'Visiting Student' }
    }),
    prisma.studentType.upsert({
      where: { name: 'Research Assistant' },
      update: {},
      create: { name: 'Research Assistant' }
    }),
    prisma.studentType.upsert({
      where: { name: 'Casual Staff' },
      update: {},
      create: { name: 'Casual Staff' }
    })
  ]);

  // Seed room locations to ensure lookups exist
  console.log('Seeding room locations...');
  const roomLocationNames = [
    'AccountingFinanceLevel',
    'EconomicsLevel',
    'MarketingLevel',
    'ManagementOrganizationsLevel',
    'GroundFloorDA',
    'GroundFloorCSI',
    'DeaneryLevel2',
  ];
  await prisma.roomLocation.createMany({ data: roomLocationNames.map(name => ({ name })), skipDuplicates: true });

  // Get existing departments and room locations
  const departments = await prisma.department.findMany();
  const roomLocations = await prisma.roomLocation.findMany();

  console.log(`Found ${departments.length} departments and ${roomLocations.length} room locations`);

  // Create Rooms with format like "240A"
  console.log('Creating rooms...');
  const roomsData = [
    // Ground Floor rooms
    { roomNo: '101A', keyLocker: 'GF-01', locationName: 'GroundFloorCSI' },
    { roomNo: '102B', keyLocker: 'GF-02', locationName: 'GroundFloorCSI' },
    { roomNo: '103C', keyLocker: 'GF-03', locationName: 'GroundFloorDA' },
    { roomNo: '104D', keyLocker: 'GF-04', locationName: 'GroundFloorDA' },
    { roomNo: '105E', keyLocker: 'GF-05', locationName: 'GroundFloorCSI' },
    
    // Level 2 rooms
    { roomNo: '201A', keyLocker: 'L2-01', locationName: 'DeaneryLevel2' },
    { roomNo: '202B', keyLocker: 'L2-02', locationName: 'DeaneryLevel2' },
    { roomNo: '203C', keyLocker: 'L2-03', locationName: 'DeaneryLevel2' },
    { roomNo: '204D', keyLocker: 'L2-04', locationName: 'DeaneryLevel2' },
    
    // More rooms with different formats
    { roomNo: '240A', keyLocker: 'L2-40', locationName: 'DeaneryLevel2' },
    { roomNo: '241B', keyLocker: 'L2-41', locationName: 'DeaneryLevel2' },
    { roomNo: '242C', keyLocker: 'L2-42', locationName: 'DeaneryLevel2' },
    { roomNo: '301A', keyLocker: 'L3-01', locationName: 'GroundFloorCSI' },
    { roomNo: '302B', keyLocker: 'L3-02', locationName: 'GroundFloorDA' },
    { roomNo: '303C', keyLocker: 'L3-03', locationName: 'GroundFloorCSI' }
  ];

  const rooms = [];
  for (const roomData of roomsData) {
    const location = roomLocations.find(loc => loc.name === roomData.locationName);
    if (location) {
      const room = await prisma.room.create({
        data: {
          roomNo: roomData.roomNo,
          keyLocker: roomData.keyLocker,
          locationId: location.id
        }
      });
      rooms.push(room);
    }
  }

  console.log(`Created ${rooms.length} rooms`);

  // Create Staff with positions and sources
  console.log('Creating staff...');
  const staffPositions = [
    'Lecturer',
    'Senior Lecturer',
    'Associate Professor',
    'Professor',
    'Research Fellow',
    'Postdoctoral Researcher',
    'Teaching Assistant',
    'Administrative Officer'
  ];

  const staffSources = ['Academic', 'Research', 'Administrative', 'Visiting'];

  const staffData = [
    { firstName: 'John', lastName: 'Smith', position: 'Professor', source: 'Academic' },
    { firstName: 'Sarah', lastName: 'Johnson', position: 'Senior Lecturer', source: 'Academic' },
    { firstName: 'Michael', lastName: 'Brown', position: 'Associate Professor', source: 'Academic' },
    { firstName: 'Emily', lastName: 'Davis', position: 'Lecturer', source: 'Academic' },
    { firstName: 'David', lastName: 'Wilson', position: 'Research Fellow', source: 'Research' },
    { firstName: 'Lisa', lastName: 'Anderson', position: 'Postdoctoral Researcher', source: 'Research' },
    { firstName: 'James', lastName: 'Taylor', position: 'Senior Lecturer', source: 'Academic' },
    { firstName: 'Maria', lastName: 'Garcia', position: 'Lecturer', source: 'Academic' },
    { firstName: 'Robert', lastName: 'Martinez', position: 'Administrative Officer', source: 'Administrative' },
    { firstName: 'Jennifer', lastName: 'Lee', position: 'Teaching Assistant', source: 'Academic' },
    { firstName: 'William', lastName: 'Thompson', position: 'Professor', source: 'Academic' },
    { firstName: 'Amanda', lastName: 'White', position: 'Research Fellow', source: 'Research' },
    { firstName: 'Christopher', lastName: 'Harris', position: 'Associate Professor', source: 'Academic' },
    { firstName: 'Michelle', lastName: 'Clark', position: 'Lecturer', source: 'Academic' },
    { firstName: 'Daniel', lastName: 'Lewis', position: 'Postdoctoral Researcher', source: 'Research' }
  ];

  const staff = [];
  for (let i = 0; i < staffData.length; i++) {
    const staffMember = staffData[i];
    const department = departments[i % departments.length];
    const room = rooms[i % rooms.length];
    
    const createdStaff = await prisma.staff.create({
      data: {
        firstName: staffMember.firstName,
        middleName: i % 3 === 0 ? 'M' : null, // Add middle name for some staff
        lastName: staffMember.lastName,
        position: staffMember.position,
        source: staffMember.source,
        extNo: `${3000 + i}`, // Extension numbers starting from 3000
        departmentId: department.id,
        roomId: room.id
      }
    });
    staff.push(createdStaff);
  }

  console.log(`Created ${staff.length} staff members`);

  // Create Students
  console.log('Creating students...');
  const studentData = [
    { firstName: 'Alice', lastName: 'Johnson', type: 'PhDs' },
    { firstName: 'Bob', lastName: 'Smith', type: 'HDR' },
    { firstName: 'Charlie', lastName: 'Brown', type: 'MPhil' },
    { firstName: 'Diana', lastName: 'Wilson', type: 'New PhD in 2025' },
    { firstName: 'Edward', lastName: 'Davis', type: 'PhDs' },
    { firstName: 'Fiona', lastName: 'Miller', type: 'Visiting Student' },
    { firstName: 'George', lastName: 'Taylor', type: 'Research Assistant' },
    { firstName: 'Hannah', lastName: 'Anderson', type: 'HDR' },
    { firstName: 'Ian', lastName: 'Thomas', type: 'PhDs' },
    { firstName: 'Julia', lastName: 'Jackson', type: 'MPhil' },
    { firstName: 'Kevin', lastName: 'White', type: 'Casual Staff' },
    { firstName: 'Laura', lastName: 'Harris', type: 'PhDs' },
    { firstName: 'Mark', lastName: 'Martin', type: 'HDR' },
    { firstName: 'Nina', lastName: 'Thompson', type: 'New PhD in 2025' },
    { firstName: 'Oscar', lastName: 'Garcia', type: 'Research Assistant' },
    { firstName: 'Paula', lastName: 'Martinez', type: 'Visiting Student' },
    { firstName: 'Quinn', lastName: 'Robinson', type: 'PhDs' },
    { firstName: 'Rachel', lastName: 'Clark', type: 'MPhil' },
    { firstName: 'Steve', lastName: 'Rodriguez', type: 'HDR' },
    { firstName: 'Tina', lastName: 'Lewis', type: 'Casual Staff' }
  ];

  const students = [];
  for (let i = 0; i < studentData.length; i++) {
    const studentInfo = studentData[i];
    const department = departments[i % departments.length];
    const room = rooms[i % rooms.length];
    const studentType = studentTypes.find(type => type.name === studentInfo.type);
    
    // Create end date for some students (graduation dates)
    const endDate = i % 4 === 0 ? new Date(2025, 11, 31) : null; // December 31, 2025 for some students
    
    const createdStudent = await prisma.student.create({
      data: {
        firstName: studentInfo.firstName,
        middleName: i % 5 === 0 ? 'J' : null, // Add middle name for some students
        lastName: studentInfo.lastName,
        endDate: endDate,
        comment: i % 3 === 0 ? 'High performing student' : null,
        extNo: `${4000 + i}`, // Extension numbers starting from 4000
        podNo: `POD-${String(i + 1).padStart(3, '0')}`, // Pod numbers like POD-001
        departmentId: department.id,
        roomId: room.id,
        typeId: studentType?.id
      }
    });
    students.push(createdStudent);
  }

  console.log(`Created ${students.length} students`);

  // Create Admin users
  console.log('Creating admin users...');
  const admins = await Promise.all([
    prisma.admin.create({
      data: {
        username: 'admin',
        email: 'admin@university.edu',
        password: 'hashed_password_123' // In real app, this should be properly hashed
      }
    }),
    prisma.admin.create({
      data: {
        username: 'superuser',
        email: 'super@university.edu',
        password: 'hashed_password_456' // In real app, this should be properly hashed
      }
    })
  ]);

  console.log(`Created ${admins.length} admin users`);

  console.log('Seed completed successfully!');
  console.log(`Summary:`);
  console.log(`- Student Types: ${studentTypes.length}`);
  console.log(`- Rooms: ${rooms.length}`);
  console.log(`- Staff: ${staff.length}`);
  console.log(`- Students: ${students.length}`);
  console.log(`- Admins: ${admins.length}`);
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
