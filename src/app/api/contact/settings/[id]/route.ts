import { NextRequest } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { ApiResponse, withErrorHandling } from '@/utils/api/responseHelpers';
import { withAuthProtection } from '@/utils/api/authHelpers';

const prisma = new PrismaClient();

export const GET = withErrorHandling(async (req: NextRequest, { params }: { params: { id: string } }) => {
  const { id } = params;

  const settings = await prisma.contactSettings.findUnique({
    where: { id },
    include: {
      socialLinks: {
        orderBy: { platform: 'asc' }
      }
    }
  });

  if (!settings) {
    return ApiResponse.notFound('Contact settings not found');
  }

  return ApiResponse.success(settings);
});

export const PUT = withErrorHandling(withAuthProtection(async (req: NextRequest, { params }: { params: { id: string } }) => {
  const { id } = params;
  const body = await req.json();
  const {
    title,
    description,
    formNameLabel,
    formEmailLabel,
    formMessageLabel,
    submitSuccessText,
    submitErrorText
  } = body;

  const updated = await prisma.contactSettings.update({
    where: { id },
    data: {
      ...(title && { title }),
      ...(description && { description }),
      ...(formNameLabel && { formNameLabel }),
      ...(formEmailLabel && { formEmailLabel }),
      ...(formMessageLabel && { formMessageLabel }),
      ...(submitSuccessText && { submitSuccessText }),
      ...(submitErrorText && { submitErrorText })
    },
    include: {
      socialLinks: true
    }
  });

  return ApiResponse.success(updated);
}));

export const DELETE = withErrorHandling(withAuthProtection(async (req: NextRequest, { params }: { params: { id: string } }) => {
  const { id } = params;

  await prisma.contactSettings.delete({
    where: { id }
  });

  return ApiResponse.success({ message: 'Contact settings deleted successfully' });
}));