import { NextRequest } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { ApiResponse, withErrorHandling } from '@/utils/api/responseHelpers';
import { withAuthProtection } from '@/utils/api/authHelpers';
import { workStepCreateSchema, workStepQuerySchema } from '@/utils/validation/workProcessValidation';

const prisma = new PrismaClient();

// GET /api/work-process/steps - Get all work steps
export const GET = withErrorHandling(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const queryParams = Object.fromEntries(searchParams.entries());
  const validatedQuery = workStepQuerySchema.parse(queryParams);

  const where: any = {};
  
  if (validatedQuery.published !== undefined) {
    where.published = validatedQuery.published;
  }

  const steps = await prisma.workStep.findMany({
    where,
    orderBy: { order: 'asc' }
  });

  return ApiResponse.success(steps);
});

// POST /api/work-process/steps - Create new work step
export const POST = withErrorHandling(withAuthProtection(async (request: NextRequest) => {
  const body = await request.json();
  const validatedData = workStepCreateSchema.parse(body);

  // If no order is provided, set it to the next available order
  if (validatedData.order === undefined) {
    const lastStep = await prisma.workStep.findFirst({
      orderBy: { order: 'desc' }
    });
    validatedData.order = lastStep ? lastStep.order + 1 : 0;
  }

  const step = await prisma.workStep.create({
    data: validatedData
  });

  return ApiResponse.created(step);
}));

// PUT /api/work-process/steps - Update multiple work steps (bulk update)
export const PUT = withErrorHandling(withAuthProtection(async (request: NextRequest) => {
  const body = await request.json();
  
  if (!Array.isArray(body)) {
    throw ApiResponse.badRequest('Expected array of work steps');
  }

  const updatePromises = body.map(async (stepData: any) => {
    const { id, ...updateData } = stepData;
    return prisma.workStep.update({
      where: { id },
      data: updateData
    });
  });

  const updatedSteps = await Promise.all(updatePromises);

  return ApiResponse.success(updatedSteps);
}));

// DELETE /api/work-process/steps - Delete all work steps
export const DELETE = withErrorHandling(withAuthProtection(async (request: NextRequest) => {
  await prisma.workStep.deleteMany();
  
  return ApiResponse.noContent();
}));
