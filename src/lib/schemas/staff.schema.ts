import { z } from 'zod';

export const DepartmentDtoSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1),
}).nullable().optional();

export const RoomDtoSchema = z.object({
  id: z.number().optional(),
  roomNo: z.string().min(1),
  keyLocker: z.string().nullable().optional(),
  roomLocation: z.any().nullable().optional(),
}).nullable().optional();

export const StaffDtoSchema = z.object({
  id: z.number().optional(),
  fullName: z.string().min(1),
  position: z.string().nullable().optional(),
  extNo: z.string().nullable().optional(),
  source: z.string().nullable().optional(),
  room: RoomDtoSchema,
  department: DepartmentDtoSchema,
});

export const StaffDtoArraySchema = z.array(StaffDtoSchema);

export function parseFullName(fullName: string) {
  const parts = (fullName || '').split(' ').filter(Boolean);
  const firstName = parts[0] ?? '';
  const lastName = parts.length > 1 ? parts[parts.length - 1] : '';
  const middle = parts.slice(1, -1).join(' ');
  const middleName = middle.length > 0 ? middle : null;
  return { firstName, middleName, lastName };
}


