import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { ApiResponse, withErrorHandling } from '@/utils/api/responseHelpers';

const prisma = new PrismaClient();

export const GET = withErrorHandling(async (req: NextRequest) => {
  const settings = await prisma.contactSettings.findMany({
    include: {
      socialLinks: {
        orderBy: { platform: 'asc' }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return ApiResponse.success(settings);
});

export const POST = withErrorHandling(async (req: NextRequest) => {
  const body = await req.json();
  const {
    title,
    description,
    formNameLabel,
    formEmailLabel,
    formMessageLabel,
    submitSuccessText,
    submitErrorText,
    socialLinks
  } = body;

  if (!title || !description) {
    return ApiResponse.badRequest('Title and description are required');
  }

  const created = await prisma.contactSettings.create({
    data: {
      title,
      description,
      formNameLabel: formNameLabel || 'Name',
      formEmailLabel: formEmailLabel || 'Email',
      formMessageLabel: formMessageLabel || 'Message',
      submitSuccessText: submitSuccessText || 'Message sent!',
      submitErrorText: submitErrorText || 'Error sending message',
      socialLinks: socialLinks ? {
        create: socialLinks.map((link: any) => ({
          platform: link.platform,
          title: link.title,
          info: link.info,
          url: link.url,
          icon: link.icon
        }))
      } : undefined
    },
    include: {
      socialLinks: true
    }
  });

  return ApiResponse.created(created);
});