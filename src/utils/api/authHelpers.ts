import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { ApiResponse } from './responseHelpers';

export const AUTH_COOKIE_NAME = 'peleti_admin_token';
const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24;

export interface JwtPayload {
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
    return jwt.verify(token, getJwtSecret()) as JwtPayload;
  } catch {
    return null;
  }
}

export function extractTokenFromRequest(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  return req.cookies.get(AUTH_COOKIE_NAME)?.value ?? null;
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

export function requireAdmin(req: NextRequest): JwtPayload {
  const payload = requireAuth(req);
  if (payload.role !== 'ADMIN') {
    throw ApiResponse.forbidden('Administrator access required');
  }

  return payload;
}

export function getSessionFromToken(token: string | null | undefined): JwtPayload | null {
  if (!token) {
    return null;
  }

  return verifyToken(token);
}

export function setAuthCookie(response: NextResponse, token: string) {
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: AUTH_COOKIE_MAX_AGE,
  });

  return response;
}

export function clearAuthCookie(response: NextResponse) {
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });

  return response;
}

export function withAuthProtection<TContext extends unknown[]>(
  handler: (req: NextRequest, ...context: TContext) => Promise<NextResponse>
) {
  return async (req: NextRequest, ...context: TContext): Promise<NextResponse> => {
    if (req.method === 'GET') {
      return await handler(req, ...context);
    }

    requireAdmin(req);
    return await handler(req, ...context);
  };
}

export function withRequiredAuth<TContext extends unknown[]>(
  handler: (req: NextRequest, ...context: TContext) => Promise<NextResponse>
) {
  return async (req: NextRequest, ...context: TContext): Promise<NextResponse> => {
    requireAuth(req);
    return await handler(req, ...context);
  };
}

export function withAdminProtection<TContext extends unknown[]>(
  handler: (req: NextRequest, ...context: TContext) => Promise<NextResponse>
) {
  return async (req: NextRequest, ...context: TContext): Promise<NextResponse> => {
    if (req.method === 'GET') {
      return await handler(req, ...context);
    }

    requireAdmin(req);
    return await handler(req, ...context);
  };
}

export function withRequiredAdmin<TContext extends unknown[]>(
  handler: (req: NextRequest, ...context: TContext) => Promise<NextResponse>
) {
  return async (req: NextRequest, ...context: TContext): Promise<NextResponse> => {
    requireAdmin(req);
    return await handler(req, ...context);
  };
}
