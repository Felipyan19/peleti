import { NextRequest } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { ApiResponse, withErrorHandling } from '@/utils/api/responseHelpers';
import { withAuthProtection } from '@/utils/api/authHelpers';
import { workProcessSettingsCreateSchema, workProcessSettingsUpdateSchema } from '@/utils/validation/workProcessValidation';

const prisma = new PrismaClient();

// GET /api/work-process/settings - Get all work process settings
export const GET = withErrorHandling(async (_request: NextRequest) => {
  const settings = await prisma.workProcessSettings.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return ApiResponse.success(settings);
});

// POST /api/work-process/settings - Create new work process settings
export const POST = withErrorHandling(withAuthProtection(async (request: NextRequest) => {
  const body = await request.json();
  const validatedData = workProcessSettingsCreateSchema.parse(body);

  const settings = await prisma.workProcessSettings.create({
    data: validatedData
  });

  return ApiResponse.created(settings);
}));

// PUT /api/work-process/settings - Update work process settings (bulk update)
export const PUT = withErrorHandling(withAuthProtection(async (request: NextRequest) => {
  const body = await request.json();
  const validatedData = workProcessSettingsUpdateSchema.parse(body);

  // Get the first settings record (assuming single settings)
  const existingSettings = await prisma.workProcessSettings.findFirst();
  
  if (!existingSettings) {
    throw ApiResponse.notFound('Work process settings not found');
  }

  const updatedSettings = await prisma.workProcessSettings.update({
    where: { id: existingSettings.id },
    data: validatedData
  });

  return ApiResponse.success(updatedSettings);
}));

// DELETE /api/work-process/settings - Delete all work process settings
export const DELETE = withErrorHandling(withAuthProtection(async (_request: NextRequest) => {
  await prisma.workProcessSettings.deleteMany();
  
  return ApiResponse.noContent();
}));
