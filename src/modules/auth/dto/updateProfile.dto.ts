import { GenderEnum } from 'src/shared/types/user.types';
import z from 'zod';

export const updateProfileSchema = z.strictObject({
  firstName: z.string().min(3).max(10).optional(),
  lastName: z.string().min(3).max(10).optional(),
  userName: z.string().min(3).max(27).optional(),
  age: z.number().min(16).optional(),
  phone: z
    .string()
    .refine((value) => {
      const phoneRegex = /^(\+20)?1[0-2,5][0-9]{8}$/;
      return phoneRegex.test(value);
    })
    .optional(),
  gender: z.enum(Object.values(GenderEnum)).optional(),
});

export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;

