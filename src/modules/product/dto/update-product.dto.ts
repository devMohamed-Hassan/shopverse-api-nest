import z from 'zod';

export const updateProductSchema = z.strictObject({
  name: z.string().min(3).max(200).optional(),
  description: z.string().min(3).max(1000).optional(),
  originalPrice: z.coerce.number().positive().optional(),
  discountPercent: z.coerce.number().min(0).max(100).optional(),
  salePrice: z.coerce.number().positive().optional(),
  stock: z.coerce.number().int().min(0).optional(),
  soldItems: z.coerce.number().int().min(0).optional(),
  brand: z.string().optional(),
  category: z.string().optional(),
});

export type UpdateProductDto = z.infer<typeof updateProductSchema>;
