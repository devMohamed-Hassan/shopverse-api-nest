import z from 'zod';

export const updateCouponSchema = z.strictObject({
  code: z.string().optional(),
  discountPrecent: z.number().optional(),
  expiresAt: z.date().optional(),
});
export type UpdateCouponDto = z.infer<typeof updateCouponSchema>;
