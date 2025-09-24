import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { ApiResponse, withErrorHandling } from '@/utils/api/responseHelpers';

const prisma = new PrismaClient();

export const GET = withErrorHandling(async (req: NextRequest, { params }: { params: { id: string } }) => {
  const { id } = params;

  const style = await prisma.style.findUnique({
    where: { id },
    select: {
      imageBase64: true,
      imageMime: true
    }
  });

  if (!style) {
    return ApiResponse.notFound('Style not found');
  }

  if (!style.imageBase64) {
    return ApiResponse.notFound('Image not found');
  }

  const buffer = Buffer.from(style.imageBase64, 'base64');

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': style.imageMime || 'image/jpeg',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
});