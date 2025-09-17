import fs from 'fs/promises';
import path from 'path';

type ContactWithoutSource = {
  Classification: string;
  "Full Name": string;
  Position: string;
  "Ext No": string;
  Room: number | string;
};

type ContactSource = 'Academic' | 'Research';

type ContactRecord = ContactWithoutSource & { Source: ContactSource };

type ContactListFile = {
  "Academic Staff"?: ContactWithoutSource[];
  "Research Fellows/Adjunct Professor"?: ContactWithoutSource[];
};

export async function loadFilteredContacts(classification: string): Promise<ContactRecord[]> {
  const filePath = path.join(process.cwd(), 'public/data/contact_list/contact_list.json');
  const raw = await fs.readFile(filePath, 'utf-8');
  const data = JSON.parse(raw) as ContactListFile;

  const academicStaff: ContactRecord[] = (data["Academic Staff"] || []).map((entry) => ({
    ...entry,
    Source: 'Academic',
  }));

  const researchFellows: ContactRecord[] = (data["Research Fellows/Adjunct Professor"] || []).map((entry) => ({
    ...entry,
    Source: 'Research',
  }));

  const combined = [...academicStaff, ...researchFellows];

  return combined.filter(
    (entry) => entry.Classification === classification
  );
}