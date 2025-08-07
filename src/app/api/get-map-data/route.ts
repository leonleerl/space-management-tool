import path from 'path';
import fs from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import { loadFilteredStudents } from '@/lib/loadFilteredStudents';
import { loadFilteredContacts } from '@/lib/loadFilteredContacts';

interface CellMeta {
  rowStart: number;
  rowEnd: number;
  colStart: number;
  colEnd: number;
  content: string;
  bgColor?: string;
  [key: string]: any;
}

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

const studentColors: Record<string, string> = {
  "PhDs": "#D8E4C4",
  "New PhD in 2025": "#DB9E91",
  "Mphil": "#F0E68C",
  "Visiting Student": "#A78EC1",
  "Visitors": "#D3D3D3",
  "Casual Staff": "#F5F5DC",
  "Research Assistant": "#FFA07A",
  "HDR": "#7CB7C2",
  "Other": "#ADD8E6",
};

const mapToStudentKey: Record<string, string> = {
  'accounting_finance': 'AccFin',
  'economics': 'Economics',
  'marketing': 'Marketing',
  'mgmt_&_orgs': 'Mgmt & Orgs',
  'gf_da': 'GF-DA'
};

const mapToContactKey: Record<string, string> = {
  'accounting_finance': 'Accounting & Finance',
  'economics': 'Economics',
  'marketing': 'Marketing',
  'mgmt_&_orgs': 'Mgmt & Orgs',
  'deanery_lvl_2': 'Deans Office'
};

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

function buildSummary(entry: any): string {
  const name = entry.Name || entry["Full Name"] || '';
  const type = entry.Type ? ` (${entry.Type})` : '';
  const position = entry.Position ? `\n${entry.Position}` : '';
  const ext = entry["Ext No"] ? `\nExt: ${entry["Ext No"]}` : '';
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
      const summary = buildSummary(stu);
      if (!roomMap[room]) roomMap[room] = [];
      roomMap[room].push(summary);
      if (stu.Comment) commentMap[room] = stu.Comment;
    });

    contacts.forEach((person: ContactEntry) => {
      const room = String(person.Room ?? '').trim();
      if (!room) return;
      const summary = buildSummary(person);
      if (!roomMap[room]) roomMap[room] = [];
      roomMap[room].push(summary);
    });

    const updatedCells = cells.map((cell) => {
      const room = String(cell.room ?? '').trim();
      const people = roomMap[room];
      const comment = commentMap[room];
      const keylocker = cell.keylocker?.trim();

      let content = '';
      if (people && people.length > 0) {
        content = `${room}\n${people.join('\n')}`;
      } else {
        content = cell.content?.trim() ? `${room}\n${cell.content}` : `${room}`;
      }

      if (keylocker && keylocker !== '') {
        content += `\nKey Locker: ${keylocker}`;
      }

      const studentColor = getStudentBgColor(students, room);
      const contactColor = getContactBgColor(contacts, room);

      let bgColor: string | undefined = undefined;

      const excludeRooms = new Set([
        "CAFÉ",
        "Kitchen",
        "Fire Hydrant",
        "Woodside Courtyard",
        "Meeting Room",
        "Printer",
        "WC"
      ]);
      
      const isValidRoomFormat =
        /^[A-Z]+\d+[A-Z]*$/.test(room) ||  // e.g. G123, G37D
        /^\d+[A-Z]$/.test(room) ||        // e.g. 1204A
        /^\d+$/.test(room);               // e.g. 177
      
      if (studentColor) {
        bgColor = studentColor;
      } else if (contactColor) {
        bgColor = contactColor;
      } else if (
        (!people || people.length === 0) &&
        (!cell.content || cell.content.trim() === '') &&
        (!keylocker || keylocker === '') &&
        !excludeRooms.has(room) &&
        isValidRoomFormat
      ) {
        bgColor = '#E7FA03';
      } else {
        bgColor = cell.bgColor;
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
  } catch (error: any) {
    console.error('[populate error]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}