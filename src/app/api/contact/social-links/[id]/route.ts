import { NextRequest } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { ApiResponse, withErrorHandling } from '@/utils/api/responseHelpers';
import { withRequiredAdmin } from '@/utils/api/authHelpers';

const prisma = new PrismaClient();

export const GET = withErrorHandling(withRequiredAdmin(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const socialLink = await prisma.socialLink.findUnique({
    where: { id },
    include: {
      contactSettings: {
        select: {
          id: true,
          title: true
        }
      }
    }
  });

  if (!socialLink) {
    return ApiResponse.notFound('Social link not found');
  }

  return ApiResponse.success(socialLink);
}));

export const PUT = withErrorHandling(withRequiredAdmin(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const body = await req.json();
  const { platform, title, info, url, icon } = body;

  const updated = await prisma.socialLink.update({
    where: { id },
    data: {
      ...(platform && { platform }),
      ...(title && { title }),
      ...(info !== undefined && { info }),
      ...(url && { url }),
      ...(icon !== undefined && { icon })
    },
    include: {
      contactSettings: {
        select: {
          id: true,
          title: true
        }
      }
    }
  });

  return ApiResponse.success(updated);
}));

export const DELETE = withErrorHandling(withRequiredAdmin(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  await prisma.socialLink.delete({
    where: { id }
  });

  return ApiResponse.success({ message: 'Social link deleted successfully' });
}));
