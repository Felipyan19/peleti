import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { ApiResponse, withErrorHandling } from '@/utils/api/responseHelpers';

const prisma = new PrismaClient();

export const GET = withErrorHandling(async (req: NextRequest, { params }: { params: { id: string } }) => {
  const { id } = params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      imageBase64: true,
      imageMime: true
    }
  });

  if (!user) {
    return ApiResponse.notFound('User not found');
  }

  if (!user.imageBase64) {
    return ApiResponse.notFound('User image not found');
  }

  const buffer = Buffer.from(user.imageBase64, 'base64');

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': user.imageMime || 'image/jpeg',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
});