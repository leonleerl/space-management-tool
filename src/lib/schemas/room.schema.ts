import { z } from 'zod';

export const RoomLocationDtoSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1),
}).nullable().optional();

export const RoomDtoSchema = z.object({
  id: z.number().optional(),
  roomNo: z.string().min(1),
  keyLocker: z.string().nullable().optional(),
  location: RoomLocationDtoSchema,
});

export const RoomDtoArraySchema = z.array(RoomDtoSchema);


