
export const APP_CONSTANTS = {
  DEFAULT_PORT: 5000,
  DEFAULT_SALT_ROUNDS: 10,
  DEFAULT_OTP_EXPIRATION_MINUTES: 10,
} as const;

export const JWT_CONSTANTS = {
  DEFAULT_ACCESS_TOKEN_EXPIRES_IN: '1h',
  DEFAULT_REFRESH_TOKEN_EXPIRES_IN: '7d',
} as const;

export const EMAIL_CONSTANTS = {
  DEFAULT_HOST: 'smtp.gmail.com',
  DEFAULT_PORT: 465,
  DEFAULT_SERVICE: 'gmail',
  DEFAULT_SENDER_NAME: 'Shopverse',
} as const;

export const VALIDATION_CONSTANTS = {
  MIN_PASSWORD_LENGTH: 3,
  MAX_PASSWORD_LENGTH: 20,
  MIN_NAME_LENGTH: 3,
  MAX_NAME_LENGTH: 10,
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 27,
  MIN_AGE: 16,
  PHONE_REGEX: /^(\+20)?1[0-2,5][0-9]{8}$/,
} as const;

export const FILE_CONSTANTS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
} as const;

export const MESSAGES = {
  SUCCESS: {
    CREATED: 'created successfully',
    UPDATED: 'updated successfully',
    DELETED: 'deleted successfully',
    RETRIEVED: 'retrieved successfully',
    LOGIN: 'Login successful',
    REGISTERED: 'User registered successfully. Please verify your email.',
    EMAIL_CONFIRMED: 'Email confirmed successfully',
    OTP_SENT: 'OTP sent to email successfully',
  },
  ERROR: {
    NOT_FOUND: 'not found',
    ALREADY_EXISTS: 'already exists',
    INVALID_CREDENTIALS: 'Invalid credentials',
    UNAUTHORIZED: 'Unauthorized',
    FORBIDDEN: 'Forbidden',
  },
} as const;

