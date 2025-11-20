import z from 'zod';

export const updateBrandSchema = z.strictObject({
  name: z.string().min(3).max(100).trim().optional(),
});

export type UpdateBrandDto = z.infer<typeof updateBrandSchema>;
