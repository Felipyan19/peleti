import { NextRequest } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { ApiResponse, withErrorHandling } from '@/utils/api/responseHelpers';
import { withAuthProtection } from '@/utils/api/authHelpers';

const prisma = new PrismaClient();

export const GET = withErrorHandling(async (req: NextRequest) => {
  const { searchParams } = req.nextUrl;
  const contactSettingsId = searchParams.get('contactSettingsId');

  const where = contactSettingsId ? { contactSettingsId } : {};

  const socialLinks = await prisma.socialLink.findMany({
    where,
    orderBy: { platform: 'asc' },
    include: {
      contactSettings: {
        select: {
          id: true,
          title: true
        }
      }
    }
  });

  return ApiResponse.success(socialLinks);
});

export const POST = withErrorHandling(withAuthProtection(async (req: NextRequest) => {
  const body = await req.json();
  const { platform, title, info, url, icon, contactSettingsId } = body;

  if (!platform || !title || !url || !contactSettingsId) {
    return ApiResponse.badRequest('Platform, title, url, and contactSettingsId are required');
  }

  // Verify contactSettings exists
  const contactSettings = await prisma.contactSettings.findUnique({
    where: { id: contactSettingsId }
  });

  if (!contactSettings) {
    return ApiResponse.notFound('Contact settings not found');
  }

  const created = await prisma.socialLink.create({
    data: {
      platform,
      title,
      info,
      url,
      icon,
      contactSettingsId
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

  return ApiResponse.created(created);
}));