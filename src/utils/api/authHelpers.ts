import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { ApiResponse } from './responseHelpers';

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not set');
  }
  return secret;
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    const payload = jwt.verify(token, getJwtSecret()) as JwtPayload;
    return payload;
  } catch {
    return null;
  }
}

export function extractTokenFromRequest(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

export function requireAuth(req: NextRequest): JwtPayload {
  const token = extractTokenFromRequest(req);
  if (!token) {
    throw ApiResponse.unauthorized('Authorization token required');
  }

  const payload = verifyToken(token);
  if (!payload) {
    throw ApiResponse.unauthorized('Invalid or expired token');
  }

  return payload;
}

// Wrapper that protects non-GET requests with authentication
export function withAuthProtection<T extends unknown[], R>(
  handler: (...args: T) => Promise<R>
) {
  return async (req: NextRequest, ...args: T): Promise<R> => {
    // Allow GET requests without authentication
    if (req.method === 'GET') {
      return await handler(req, ...args);
    }

    // Require authentication for all other HTTP methods
    requireAuth(req);
    return await handler(req, ...args);
  };
}

// Wrapper that always requires authentication regardless of HTTP method
export function withRequiredAuth<T extends unknown[], R>(
  handler: (...args: T) => Promise<R>
) {
  return async (req: NextRequest, ...args: T): Promise<R> => {
    requireAuth(req);
    return await handler(req, ...args);
  };
}