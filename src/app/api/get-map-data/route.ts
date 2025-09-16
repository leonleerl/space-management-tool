import path from 'path';
import fs from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import { loadFilteredStudents } from '@/lib/loadFilteredStudents';
import { loadFilteredContacts } from '@/lib/loadFilteredContacts';
import { prisma } from '@/lib/prisma';
import { studentColors, mapToStudentKey, mapToContactKey, mapToRoomLocation, excludeRooms, roomFormatRegexps } from '@/types/constants';
import type { CellMeta } from "@/types/map";

export const runtime = 'nodejs';

interface ContactEntry {
  "Full Name": string;
  Position?: string;
  Room?: string | number;
  "Ext No"?: string | number;
  Source?: 'Academic' | 'Research';
}

interface StudentEntry {
  Name: string;
  "End Date": string | null;
  Comment: string | null;
  "Pod No": string;
  Type: string | null;
}

// moved to features/accommodation-map/constants

function getStudentBgColor(
  students: StudentEntry[],
  room: string
): string | undefined {
  const student = students.find(stu => String(stu["Pod No"]).trim() === room);
  if (student && student.Type && studentColors[student.Type]) {
    return studentColors[student.Type];
  }
  return undefined;
}

function getContactBgColor(
  contacts: ContactEntry[],
  room: string
): string | undefined {
  const contact = contacts.find(c => String(c.Room ?? '').trim() === room);
  if (!contact || !contact.Source) return undefined;
  if (contact.Source === 'Academic') return '#FEE2E2';
  if (contact.Source === 'Research') return '#DCFCE7';
  return undefined;
}

function buildSummary(entry: StudentEntry | ContactEntry): string {
  let name = '';
  let type = '';
  let position = '';
  let ext = '';

  if ('Name' in entry) {
    name = entry.Name || '';
    type = entry.Type ? ` (${entry.Type})` : '';
  }
  if ('Full Name' in entry) {
    name = entry['Full Name'] || name;
    position = entry.Position ? `\n${entry.Position}` : '';
    ext = entry['Ext No'] ? `\nExt: ${entry['Ext No']}` : '';
  }
  return `${name}${type}${position}${ext}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); 
    const mapName = body.mapName;

    if (!mapName) {
      return NextResponse.json({ error: 'Missing mapName' }, { status: 400 });
    }

    const basePath = path.join(process.cwd(), 'public/data/maps');
    const cellsPath = path.join(basePath, 'cells', `${mapName}_cells.json`);
    const layoutPath = path.join(basePath, 'layouts', `${mapName}_layout.json`);

    const [cellRaw, layoutRaw] = await Promise.all([
      fs.readFile(cellsPath, 'utf-8'),
      fs.readFile(layoutPath, 'utf-8'),
    ]);

    const layoutData = JSON.parse(layoutRaw);
    const cells: CellMeta[] = JSON.parse(cellRaw);

    const studentKey = mapToStudentKey[mapName];
    const contactKey = mapToContactKey[mapName];

    let students: StudentEntry[] = [];
    let contacts: ContactEntry[] = [];

    if (studentKey) {
      students = await loadFilteredStudents(studentKey);
    }

    if (contactKey) {
      contacts = await loadFilteredContacts(contactKey);
    }

    const roomMap: Record<string, string[]> = {};
    const commentMap: Record<string, string> = {};

    students.forEach((stu: StudentEntry) => {
      const room = String(stu["Pod No"]).trim();
      const summary = buildSummary(stu).trim();
      if (summary) {
        if (!roomMap[room]) roomMap[room] = [];
        roomMap[room].push(summary);
      }
      if (stu.Comment) commentMap[room] = stu.Comment;
    });

    contacts.forEach((person: ContactEntry) => {
      const room = String(person.Room ?? '').trim();
      if (!room) return;
      const summary = buildSummary(person).trim();
      if (summary) {
        if (!roomMap[room]) roomMap[room] = [];
        roomMap[room].push(summary);
      }
    });

    // Try to enrich with DB data when possible
    type DbPerson = { firstName: string; middleName: string | null; lastName: string; extNo: string | null };
    let roomsByNo: Map<string, { keyLocker: string | null; staff: DbPerson[]; students: DbPerson[] } > = new Map();
    const locationKey = mapToRoomLocation[mapName];
    if (locationKey) {
      try {
        const location = await prisma.roomLocation.findUnique({ where: { name: locationKey } });
        if (location) {
          const rooms = await prisma.room.findMany({
            where: { locationId: location.id },
            include: { staff: true, students: true }
          });
          roomsByNo = new Map(
            rooms.map(r => [r.roomNo, { keyLocker: r.keyLocker, staff: r.staff, students: r.students }])
          );
        }
      } catch (e) {
        // best-effort enrichment; fall back silently
        console.error('[get-map-data] db enrichment failed', e);
      }
    }

    const updatedCells = cells.map((cell) => {
      const room = String(cell.room ?? '').trim();
      let people = roomMap[room];
      const comment = commentMap[room];
      let keylocker = cell.keylocker?.trim();

      // merge DB enrichment if available
      const db = roomsByNo.get(room);
      if (db) {
        const names: string[] = [];
        if (db.staff?.length) {
          for (const s of db.staff) {
            const fullName = [s.firstName, s.middleName, s.lastName]
              .filter(v => v !== null && v !== undefined && String(v).trim().length > 0)
              .join(' ');
            if (fullName) names.push(fullName);
            if (s.extNo) names.push(`Ext: ${s.extNo}`);
          }
        }
        if (db.students?.length) {
          for (const stu of db.students) {
            const fullName = [stu.firstName, stu.middleName, stu.lastName]
              .filter(v => v !== null && v !== undefined && String(v).trim().length > 0)
              .join(' ');
            if (fullName) names.push(fullName);
            if (stu.extNo) names.push(`Ext: ${stu.extNo}`);
          }
        }
        // If DB has any people, override JSON people completely
        if (names.length) {
          people = names;
        }
        // Always prefer DB keyLocker over JSON when available
        if (db.keyLocker !== null && db.keyLocker !== undefined && String(db.keyLocker).trim() !== '') {
          keylocker = db.keyLocker;
        }
      }

      let content = '';
      if (people && people.length > 0) {
        content = `${room}\n${people.join('\n')}`;
      } else {
        content = cell.content?.trim() ? `${room}\n${cell.content}` : `${room}`;
      }

      if (keylocker && keylocker !== '') {
        content += `\nKey Locker: ${keylocker}`;
      }

      let bgColor: string;
      const hasOccupant =Array.isArray(people) && people.length > 0;

      if (hasOccupant) {
        bgColor = '#FFFFFF'; // occupied → white
      } else {
        bgColor = '#459C07'; // vacant → green
      }

      
      return {
        ...cell,
        content,
        comment: comment ?? cell.comment ?? null,
        bgColor,
      };
    });

    return NextResponse.json({
      cells: updatedCells,
      layout: layoutData,
    });
  } catch (error: unknown) {
    console.error('[populate error]', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}