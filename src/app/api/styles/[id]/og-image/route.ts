import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { ApiResponse, withErrorHandling } from '@/utils/api/responseHelpers';

const prisma = new PrismaClient();

export const GET = withErrorHandling(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const style = await prisma.style.findUnique({
    where: { id },
    select: {
      ogImageBase64: true,
      ogImageMime: true
    }
  });

  if (!style) {
    return ApiResponse.notFound('Style not found');
  }

  if (!style.ogImageBase64) {
    return ApiResponse.notFound('OG image not found');
  }

  const buffer = Buffer.from(style.ogImageBase64, 'base64');

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': style.ogImageMime || 'image/jpeg',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
});