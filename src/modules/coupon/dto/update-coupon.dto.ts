import z from 'zod';

export const updateCouponSchema = z.strictObject({
  code: z.string().optional(),
  discountPercent: z.number().min(1).max(100).optional(),
  expiresAt: z.date().optional(),
});
export type UpdateCouponDto = z.infer<typeof updateCouponSchema>;
