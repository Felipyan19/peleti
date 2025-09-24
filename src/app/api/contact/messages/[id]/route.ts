import { NextRequest } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { ApiResponse, withErrorHandling } from '@/utils/api/responseHelpers';

const prisma = new PrismaClient();

export const GET = withErrorHandling(async (req: NextRequest, { params }: { params: { id: string } }) => {
  const { id } = params;

  const message = await prisma.contactMessage.findUnique({
    where: { id }
  });

  if (!message) {
    return ApiResponse.notFound('Message not found');
  }

  // Mark as read if it was NEW
  if (message.status === 'NEW') {
    await prisma.contactMessage.update({
      where: { id },
      data: { status: 'READ' }
    });
    message.status = 'READ';
  }

  return ApiResponse.success(message);
});

export const PUT = withErrorHandling(async (req: NextRequest, { params }: { params: { id: string } }) => {
  const { id } = params;
  const body = await req.json();
  const { status } = body;

  if (status && !['NEW', 'READ', 'ARCHIVED'].includes(status)) {
    return ApiResponse.badRequest('Invalid status. Must be NEW, READ, or ARCHIVED');
  }

  const updated = await prisma.contactMessage.update({
    where: { id },
    data: {
      ...(status && { status })
    }
  });

  return ApiResponse.success(updated);
});

export const DELETE = withErrorHandling(async (req: NextRequest, { params }: { params: { id: string } }) => {
  const { id } = params;

  await prisma.contactMessage.delete({
    where: { id }
  });

  return ApiResponse.success({ message: 'Contact message deleted successfully' });
});