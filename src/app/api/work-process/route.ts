import { NextRequest } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { ApiResponse, withErrorHandling } from '@/utils/api/responseHelpers';

const prisma = new PrismaClient();

// GET /api/work-process - Get complete work process (settings + steps)
export const GET = withErrorHandling(async (request: NextRequest) => {
  const [settings, steps] = await Promise.all([
    prisma.workProcessSettings.findFirst({
      orderBy: { createdAt: 'desc' }
    }),
    prisma.workStep.findMany({
      where: { published: true },
      orderBy: { order: 'asc' }
    })
  ]);

  const response = {
    settings: settings || {
      id: '',
      title: '',
      description: '',
      stepLabel: '',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    steps
  };

  return ApiResponse.success(response);
});
