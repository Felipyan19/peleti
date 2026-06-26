import { NextRequest } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { ApiResponse, withErrorHandling } from '@/utils/api/responseHelpers';

const prisma = new PrismaClient();

export const GET = withErrorHandling(async (req: NextRequest) => {
  const { searchParams } = req.nextUrl;
  const status = searchParams.get('status') as 'NEW' | 'READ' | 'ARCHIVED' | null;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);

  const skip = (page - 1) * limit;
  const where = status ? { status } : {};

  const [messages, total] = await Promise.all([
    prisma.contactMessage.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    }),
    prisma.contactMessage.count({ where })
  ]);

  return ApiResponse.success({
    messages,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  });
});

export const POST = withErrorHandling(async (req: NextRequest) => {
  const body = await req.json();
  const { name, email, message } = body;

  if (!name || !email || !message) {
    return ApiResponse.badRequest('Name, email, and message are required');
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return ApiResponse.badRequest('Invalid email format');
  }

  const created = await prisma.contactMessage.create({
    data: {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      status: 'NEW'
    }
  });

  return ApiResponse.created(created);
});