import z from 'zod';

export const updateCategorySchema = z.strictObject({
  name: z.string().min(3).max(100).trim().optional(),
  description: z.string().min(3).max(1000).optional(),
  brands: z.array(z.string()).optional(),
});

export type UpdateCategoryDto = z.infer<typeof updateCategorySchema>;
