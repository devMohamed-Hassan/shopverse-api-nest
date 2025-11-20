import z from 'zod';

export const resetPasswordSchema = z.strictObject({
  email: z.string().email('Invalid email address'),
  otp: z.string().min(1, 'OTP is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
});

export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;

