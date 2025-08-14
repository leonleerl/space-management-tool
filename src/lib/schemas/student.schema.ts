import { z } from 'zod';
import { DepartmentDtoSchema, RoomDtoSchema } from './staff.schema';

export const StudentTypeDtoSchema = z
    .object({
        id: z.number().optional(),
        name: z.string().min(1),
    })
    .nullable()
    .optional();

export const StudentDtoSchema = z.object({
    id: z.number().optional(),
    fullName: z.string().min(1),
    comment: z.string().nullable().optional(),
    extNo: z.string().nullable().optional(),
    podNo: z.string().nullable().optional(),
    // Accept ISO string or Date or null
    endDate: z.union([z.string(), z.date()]).nullable().optional(),
    room: RoomDtoSchema,
    type: StudentTypeDtoSchema,
    department: DepartmentDtoSchema,
});

export const StudentDtoArraySchema = z.array(StudentDtoSchema);

export type StudentDtoParsed = z.infer<typeof StudentDtoSchema>;
export type StudentDtoArrayParsed = z.infer<typeof StudentDtoArraySchema>;


