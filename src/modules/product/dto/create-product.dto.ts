import z from 'zod';

export const createProductSchema = z.strictObject({
  name: z.string().min(3).max(200),
  description: z.string().min(3).max(1000).optional(),
  originalPrice: z.coerce.number().positive(),
  discountPercent: z.coerce.number().min(0).max(100).optional(),
  salePrice: z.coerce.number().positive(),
  stock: z.coerce.number().int().min(0),
  soldItems: z.coerce.number().int().min(0).optional(),
  brand: z.string().optional(),
  category: z.string().optional(),
});

export type CreateProductDto = z.infer<typeof createProductSchema>;
