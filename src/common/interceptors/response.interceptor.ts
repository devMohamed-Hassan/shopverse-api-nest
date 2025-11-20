import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { ApiResponse } from 'src/shared/types/response.types';

interface OldFormatResponse {
  message: string;
  result?: unknown;
  data?: unknown;
}

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const statusCode = response.statusCode || HttpStatus.OK;

    return next.handle().pipe(
      map((data: unknown): ApiResponse => {
        if (
          data &&
          typeof data === 'object' &&
          'success' in data &&
          'message' in data &&
          typeof (data as ApiResponse).success === 'boolean'
        ) {
          const apiResponse = data as ApiResponse;
          return {
            success: apiResponse.success,
            message: apiResponse.message,
            data: apiResponse.data,
            statusCode: apiResponse.statusCode || statusCode,
            timestamp: apiResponse.timestamp || new Date().toISOString(),
          };
        }

        if (
          data &&
          typeof data === 'object' &&
          'message' in data &&
          typeof (data as OldFormatResponse).message === 'string'
        ) {
          const oldResponse = data as OldFormatResponse;
          return {
            success: true,
            message: oldResponse.message,
            data: oldResponse.result || oldResponse.data,
            statusCode,
            timestamp: new Date().toISOString(),
          };
        }

        if (typeof data === 'string') {
          return {
            success: true,
            message: data,
            data: undefined,
            statusCode,
            timestamp: new Date().toISOString(),
          };
        }

        return {
          success: true,
          message: 'Operation completed successfully',
          data: data,
          statusCode,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
