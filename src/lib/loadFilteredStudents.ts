import fs from 'fs/promises';
import path from 'path';

export async function loadFilteredStudents(key: string) {
    const filePath = path.join(process.cwd(), 'public/data/maps/students.json');
    const raw = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(raw);
    const group = data[key] || [];
    return group.filter((entry: any) => entry["Pod No"] !== null);
  }