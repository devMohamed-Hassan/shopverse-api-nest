import z from 'zod';

export const cartItemSchema = z.strictObject({
  productId: z.string(),
  quantity: z.number(),
  price: z.number(),
  total: z.number(),
});
export const createCartSchema = z.strictObject({
  items: z.array(cartItemSchema),
  totalPrice: z.number(),
  coupon: z.string().optional(),
  discount: z.number().default(0),
  totalPriceAfterDiscount: z.number().optional(),
});
export type CreateCartDto = z.infer<typeof createCartSchema>;

export const addToCartSchema = z.strictObject({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().positive().min(1, 'Quantity must be at least 1'),
});
export type AddToCartDto = z.infer<typeof addToCartSchema>;

export const updateCartProductSchema = z.strictObject({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().nonnegative().min(0, 'Quantity cannot be negative'),
});
export type UpdateCartProductDto = z.infer<typeof updateCartProductSchema>;
