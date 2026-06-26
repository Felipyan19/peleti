import { NextRequest } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { ApiResponse, withErrorHandling } from '@/utils/api/responseHelpers';
import { withAuthProtection } from '@/utils/api/authHelpers';
import { workStepUpdateSchema } from '@/utils/validation/workProcessValidation';

const prisma = new PrismaClient();

// GET /api/work-process/steps/[id] - Get work step by ID
export const GET = withErrorHandling(async (request: NextRequest, { params }: { params: { id: string } }) => {
  const { id } = params;

  const step = await prisma.workStep.findUnique({
    where: { id }
  });

  if (!step) {
    throw ApiResponse.notFound('Work step not found');
  }

  return ApiResponse.success(step);
});

// PUT /api/work-process/steps/[id] - Update work step by ID
export const PUT = withErrorHandling(withAuthProtection(async (request: NextRequest, { params }: { params: { id: string } }) => {
  const { id } = params;
  const body = await request.json();
  const validatedData = workStepUpdateSchema.parse(body);

  const updatedStep = await prisma.workStep.update({
    where: { id },
    data: validatedData
  });

  return ApiResponse.success(updatedStep);
}));

// DELETE /api/work-process/steps/[id] - Delete work step by ID
export const DELETE = withErrorHandling(withAuthProtection(async (request: NextRequest, { params }: { params: { id: string } }) => {
  const { id } = params;

  await prisma.workStep.delete({
    where: { id }
  });

  return ApiResponse.noContent();
}));
