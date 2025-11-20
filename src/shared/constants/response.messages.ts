export const RESPONSE_MESSAGES = {

  SUCCESS: 'Operation completed successfully',
  CREATED: 'Resource created successfully',
  UPDATED: 'Resource updated successfully',
  DELETED: 'Resource deleted successfully',
  RETRIEVED: 'Resource retrieved successfully',
  LIST_RETRIEVED: 'Resources retrieved successfully',
  NO_DATA: 'No data available',

  REGISTER_SUCCESS: 'User registered successfully. Please verify your email.',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logged out successfully',
  EMAIL_CONFIRMED: 'Email confirmed successfully',
  OTP_SENT: 'OTP sent to email successfully',
  PASSWORD_RESET: 'Password reset successfully',
  PASSWORD_CHANGED: 'Password changed successfully',
  PROFILE_RETRIEVED: 'Profile retrieved successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  PASSWORD_RESET_OTP_SENT: 'If the email exists, a password reset OTP has been sent',

  BRAND_CREATED: 'Brand created successfully',
  BRAND_UPDATED: 'Brand updated successfully',
  BRAND_DELETED: 'Brand removed successfully',
  BRAND_RETRIEVED: 'Brand retrieved successfully',
  BRANDS_RETRIEVED: 'Brands retrieved successfully',
  NO_BRANDS: 'No brands to view',

  CATEGORY_CREATED: 'Category created successfully',
  CATEGORY_UPDATED: 'Category updated successfully',
  CATEGORY_DELETED: 'Category removed successfully',
  CATEGORY_RETRIEVED: 'Category retrieved successfully',
  CATEGORIES_RETRIEVED: 'Categories retrieved successfully',
  NO_CATEGORIES: 'No categories to view',

  PRODUCT_CREATED: 'Product created successfully',
  PRODUCT_UPDATED: 'Product updated successfully',
  PRODUCT_DELETED: 'Product removed successfully',
  PRODUCT_RETRIEVED: 'Product retrieved successfully',
  PRODUCTS_RETRIEVED: 'Products retrieved successfully',
  NO_PRODUCTS: 'No products to view',

  COUPON_CREATED: 'Coupon created successfully',
  COUPON_UPDATED: 'Coupon updated successfully',
  COUPON_DELETED: 'Coupon removed successfully',
  COUPON_RETRIEVED: 'Coupon retrieved successfully',
  COUPONS_RETRIEVED: 'Coupons retrieved successfully',

  CART_ITEM_ADDED: 'Items added successfully',
  CART_ITEM_REMOVED: 'Item removed from cart successfully',
  CART_RETRIEVED: 'Cart retrieved successfully',
  CART_UPDATED: 'Cart updated successfully',
  CART_CLEARED: 'Cart cleared successfully',
} as const;

export type ResponseMessage = typeof RESPONSE_MESSAGES[keyof typeof RESPONSE_MESSAGES];

