import { NextRequest } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { ApiResponse, withErrorHandling } from '@/utils/api/responseHelpers';
import { withAuthProtection } from '@/utils/api/authHelpers';
import { workProcessSettingsUpdateSchema } from '@/utils/validation/workProcessValidation';

const prisma = new PrismaClient();

// GET /api/work-process/settings/[id] - Get work process settings by ID
export const GET = withErrorHandling(async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const settings = await prisma.workProcessSettings.findUnique({
    where: { id }
  });

  if (!settings) {
    throw ApiResponse.notFound('Work process settings not found');
  }

  return ApiResponse.success(settings);
});

// PUT /api/work-process/settings/[id] - Update work process settings by ID
export const PUT = withErrorHandling(withAuthProtection(async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const body = await request.json();
  const validatedData = workProcessSettingsUpdateSchema.parse(body);

  const updatedSettings = await prisma.workProcessSettings.update({
    where: { id },
    data: validatedData
  });

  return ApiResponse.success(updatedSettings);
}));

// DELETE /api/work-process/settings/[id] - Delete work process settings by ID
export const DELETE = withErrorHandling(withAuthProtection(async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  await prisma.workProcessSettings.delete({
    where: { id }
  });

  return ApiResponse.noContent();
}));
