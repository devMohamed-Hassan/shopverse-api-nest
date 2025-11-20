import z from 'zod';

export const forgotPasswordSchema = z.strictObject({
  email: z.string().email('Invalid email address'),
});

export type ForgotPasswordDto = z.infer<typeof forgotPasswordSchema>;

