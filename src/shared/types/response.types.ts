export interface ApiResponse<T = any> {
  message: string;
  result?: T;
  error?: string;
  statusCode?: number;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

