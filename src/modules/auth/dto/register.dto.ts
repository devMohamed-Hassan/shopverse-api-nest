import { GenderEnum, ProviderEnum, RoleEnum } from 'src/shared/types/user.types';
import z from 'zod';

export const registerSchema = z.strictObject({
  firstName: z.string().min(3).max(10).optional(),
  lastName: z.string().min(3).max(10).optional(),
  userName: z.string().min(3).max(27),
  email: z.email(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must not exceed 100 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    )
    .optional(),
  age: z.number().min(16).optional(),
  phone: z
    .string()
    .refine((value) => {
      const phoneRegex = /^(\+20)?1[0-2,5][0-9]{8}$/;
      return phoneRegex.test(value);
    })
    .optional(),
  role: z.enum(Object.values(RoleEnum)).default(RoleEnum.USER).optional(),
  gender: z.enum(Object.values(GenderEnum)).default(GenderEnum.MALE).optional(),
  provider: z
    .enum(Object.values(ProviderEnum))
    .default(ProviderEnum.SYSTEM)
    .optional(),
  credentialsChangedAt: z.date().optional(),
  emailOtp: z.object().optional(),
  passwordOtp: z.object().optional(),
});

export type RegisterDto = z.infer<typeof registerSchema>;
