import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, withErrorHandling } from '@/utils/api/responseHelpers';
import {
  clearAuthCookie,
  extractTokenFromRequest,
  getSessionFromToken,
  requireAuth,
} from '@/utils/api/authHelpers';

export const GET = withErrorHandling(async (req: NextRequest) => {
  const token = extractTokenFromRequest(req);
  const session = getSessionFromToken(token);

  if (!session) {
    return ApiResponse.unauthorized('No active session');
  }

  return ApiResponse.success({
    user: {
      id: session.sub,
      email: session.email,
      role: session.role,
    },
  });
});

export const DELETE = withErrorHandling(async (req: NextRequest) => {
  try {
    requireAuth(req);
  } catch {
    const response = NextResponse.json({ success: true });
    return clearAuthCookie(response);
  }

  const response = NextResponse.json({ success: true });
  return clearAuthCookie(response);
});
