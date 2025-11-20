import {
  ApiResponse,
  PaginatedResponse,
} from 'src/shared/types/response.types';
import { HttpStatus } from '@nestjs/common';

export function createSuccessResponse<T>(
  data: T,
  message: string = 'Operation completed successfully',
  statusCode: number = HttpStatus.OK,
): ApiResponse<T> {
  return {
    success: true,
    message,
    data,
    statusCode,
    timestamp: new Date().toISOString(),
  };
}

export function createPaginatedResponse<T>(
  data: T[],
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  },
  message: string = 'Resources retrieved successfully',
  statusCode: number = HttpStatus.OK,
): PaginatedResponse<T> {
  return {
    success: true,
    message,
    data,
    pagination,
    statusCode,
    timestamp: new Date().toISOString(),
  };
}

interface OldFormatResponse<T> {
  message: string;
  result?: T;
  data?: T;
}

function isOldFormatResponse<T>(
  value: OldFormatResponse<T> | string | T,
): value is OldFormatResponse<T> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'message' in value &&
    typeof (value as { message: unknown }).message === 'string'
  );
}

export function transformResponse<T>(
  oldResponse: OldFormatResponse<T> | string | T,
): ApiResponse<T> {
  if (typeof oldResponse === 'string') {
    return createSuccessResponse<T>(undefined as T, oldResponse);
  }

  if (isOldFormatResponse(oldResponse)) {
    return createSuccessResponse<T>(
      oldResponse.result ?? oldResponse.data ?? (undefined as T),
      oldResponse.message,
    );
  }

  return createSuccessResponse<T>(oldResponse);
}
