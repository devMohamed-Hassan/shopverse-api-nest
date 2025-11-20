import { OtpTypeEnum } from 'src/shared/types/user.types';
import z from 'zod';

export const resendOtpSchema = z.strictObject({
  email: z.email(),
  otpType: z.enum(Object.values(OtpTypeEnum)),
});

export type ResendOtpDto = z.infer<typeof resendOtpSchema>;
