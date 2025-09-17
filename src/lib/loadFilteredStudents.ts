import fs from 'fs/promises';
import path from 'path';

export type StudentRaw = {
    Name: string;
    "End Date": string | null;
    Comment: string | null;
    "Pod No": string | null;
    "Ext No": string;
    Type: string;
};

type StudentsFile = Record<string, StudentRaw[]>;

export type StudentEntry = Omit<StudentRaw, 'Pod No'> & { 'Pod No': string };

export async function loadFilteredStudents(key: string): Promise<StudentEntry[]> {
    const filePath = path.join(process.cwd(), 'public/data/maps/students.json');
    const raw = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(raw) as StudentsFile;
    const group = data[key] || [];
    return group
      .filter((entry): entry is StudentEntry => entry["Pod No"] !== null)
      .map((entry) => ({ ...entry, ["Pod No"]: String(entry["Pod No"]) }));
  }