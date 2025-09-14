import { NextResponse } from 'next/server';
import { ApiError } from '@/types/hero';

// Standardized API response helpers
export class ApiResponse {
  static success<T>(data: T, status: number = 200) {
    return NextResponse.json(data, { status });
  }

  static created<T>(data: T) {
    return NextResponse.json(data, { status: 201 });
  }

  static noContent() {
    return new NextResponse(null, { status: 204 });
  }

  static badRequest(error: string, details?: Record<string, unknown>) {
    const response: ApiError = { error, details };
    return NextResponse.json(response, { status: 400 });
  }

  static unauthorized(error: string = 'Unauthorized') {
    const response: ApiError = { error };
    return NextResponse.json(response, { status: 401 });
  }

  static forbidden(error: string = 'Forbidden') {
    const response: ApiError = { error };
    return NextResponse.json(response, { status: 403 });
  }

  static notFound(error: string = 'Resource not found') {
    const response: ApiError = { error };
    return NextResponse.json(response, { status: 404 });
  }

  static conflict(error: string = 'Resource already exists') {
    const response: ApiError = { error };
    return NextResponse.json(response, { status: 409 });
  }

  static unprocessableEntity(error: string, details?: Record<string, unknown>) {
    const response: ApiError = { error, details };
    return NextResponse.json(response, { status: 422 });
  }

  static internalServerError(error: string = 'Internal server error') {
    const response: ApiError = { error };
    return NextResponse.json(response, { status: 500 });
  }

  static serviceUnavailable(error: string = 'Service temporarily unavailable') {
    const response: ApiError = { error };
    return NextResponse.json(response, { status: 503 });
  }
}

// Error handling wrapper
export function withErrorHandling<T extends unknown[], R>(
  handler: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    try {
      return await handler(...args);
    } catch (error) {
      console.error('API Error:', error);
      // Pass through already-formed Next.js responses (e.g., thrown via ApiResponse.*)
      // Next.js supports throwing a Response/NextResponse to short-circuit handlers
      if (error instanceof NextResponse || error instanceof Response) {
        // rethrow so Next.js returns it as-is
        throw error as unknown as R;
      }

      // Handle Zod validation errors explicitly
      if ((error as { name?: string; issues?: unknown })?.name === 'ZodError') {
        throw ApiResponse.badRequest('Invalid request data', { issues: (error as { issues: unknown }).issues }) as unknown as R;
      }

      if (error instanceof Error) {
        if (error.message.includes('validation')) {
          throw ApiResponse.unprocessableEntity('Validation error', { message: error.message }) as unknown as R;
        }
        if (error.message.includes('not found')) {
          throw ApiResponse.notFound(error.message) as unknown as R;
        }
        if (error.message.includes('duplicate') || error.message.includes('unique')) {
          throw ApiResponse.conflict('Resource already exists') as unknown as R;
        }
      }

      throw ApiResponse.internalServerError() as unknown as R;
    }
  };
}
