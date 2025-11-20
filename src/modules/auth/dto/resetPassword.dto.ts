import z from 'zod';

export const resetPasswordSchema = z.strictObject({
  email: z.string().email('Invalid email address'),
  otp: z.string().min(1, 'OTP is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must not exceed 100 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    ),
});

export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;

