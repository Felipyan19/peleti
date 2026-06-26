/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import { GET as getSettings, POST as createSettings, PUT as updateSettings, DELETE as deleteSettings } from '@/app/api/work-process/settings/route';
import { GET as getStep, PUT as updateStep, DELETE as deleteStep } from '@/app/api/work-process/steps/[id]/route';
import { GET as getSteps, POST as createStep, PUT as updateSteps, DELETE as deleteSteps } from '@/app/api/work-process/steps/route';
import { GET as getWorkProcess } from '@/app/api/work-process/route';

// Mock response helpers
jest.mock('@/utils/api/responseHelpers', () => ({
  ApiResponse: {
    success: (data: any) => new Response(JSON.stringify(data), { status: 200 }),
    created: (data: any) => new Response(JSON.stringify(data), { status: 201 }),
    noContent: () => new Response(null, { status: 204 }),
    badRequest: (message: string) => new Response(JSON.stringify({ error: message }), { status: 400 }),
    unauthorized: (message: string) => new Response(JSON.stringify({ error: message }), { status: 401 }),
    forbidden: (message: string) => new Response(JSON.stringify({ error: message }), { status: 403 }),
    notFound: (message: string) => new Response(JSON.stringify({ error: message }), { status: 404 }),
  },
  withErrorHandling: (handler: any) => async (...args: any[]) => {
    try {
      return await handler(...args);
    } catch (error) {
      if (error instanceof Response) {
        return error;
      }
      if ((error as any)?.name === 'ZodError') {
        return new Response(JSON.stringify({ error: 'Invalid request data' }), { status: 400 });
      }
      throw error;
    }
  },
}));

// Mock auth helpers — bypass authentication for unit tests
jest.mock('@/utils/api/authHelpers', () => ({
  withAuthProtection: (handler: any) => handler,
  withAdminProtection: (handler: any) => handler,
  requireAdmin: jest.fn(),
  AUTH_COOKIE_NAME: 'test_auth_token',
  getSessionFromToken: jest.fn(),
}));

// Mock Prisma — shared singleton so routes and tests use the same instance
jest.mock('@/generated/prisma', () => {
  const mockPrisma = {
    workProcessSettings: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
    workStep: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
  };
  return {
    PrismaClient: jest.fn().mockImplementation(() => mockPrisma),
  };
});

describe('WorkProcess API', () => {
  let mockPrisma: any;

  beforeEach(() => {
    jest.clearAllMocks();
    const { PrismaClient } = require('@/generated/prisma');
    mockPrisma = new PrismaClient();
  });

  describe('WorkProcessSettings', () => {
    const mockSettings = {
      id: '1',
      title: 'Cómo creamos tus figuras',
      description: 'Cada pieza es creada con dedicación y atención al detalle.',
      stepLabel: 'Paso',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    describe('GET /api/work-process/settings', () => {
      it('should return all work process settings', async () => {
        mockPrisma.workProcessSettings.findMany.mockResolvedValue([mockSettings]);

        const request = new NextRequest('http://localhost:3000/api/work-process/settings');
        const response = await getSettings(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data).toEqual(JSON.parse(JSON.stringify([mockSettings])));
      });
    });

    describe('POST /api/work-process/settings', () => {
      it('should create new work process settings', async () => {
        mockPrisma.workProcessSettings.create.mockResolvedValue(mockSettings);

        const request = new NextRequest('http://localhost:3000/api/work-process/settings', {
          method: 'POST',
          body: JSON.stringify({
            title: 'Cómo creamos tus figuras',
            description: 'Cada pieza es creada con dedicación y atención al detalle.',
            stepLabel: 'Paso',
          }),
        });

        const response = await createSettings(request);
        const data = await response.json();

        expect(response.status).toBe(201);
        expect(data).toEqual(JSON.parse(JSON.stringify(mockSettings)));
      });

      it('should return 400 for invalid data', async () => {
        const request = new NextRequest('http://localhost:3000/api/work-process/settings', {
          method: 'POST',
          body: JSON.stringify({
            title: '', // Invalid: empty title
            description: 'Valid description',
          }),
        });

        const response = await createSettings(request);
        expect(response.status).toBe(400);
      });
    });

    describe('PUT /api/work-process/settings', () => {
      it('should update work process settings', async () => {
        mockPrisma.workProcessSettings.findFirst.mockResolvedValue(mockSettings);
        mockPrisma.workProcessSettings.update.mockResolvedValue({
          ...mockSettings,
          title: 'Updated title',
        });

        const request = new NextRequest('http://localhost:3000/api/work-process/settings', {
          method: 'PUT',
          body: JSON.stringify({
            title: 'Updated title',
          }),
        });

        const response = await updateSettings(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.title).toBe('Updated title');
      });
    });

    describe('DELETE /api/work-process/settings', () => {
      it('should delete all work process settings', async () => {
        mockPrisma.workProcessSettings.deleteMany.mockResolvedValue({ count: 1 });

        const request = new NextRequest('http://localhost:3000/api/work-process/settings', {
          method: 'DELETE',
        });

        const response = await deleteSettings(request);
        expect(response.status).toBe(204);
      });
    });
  });

  describe('WorkStep', () => {
    const mockStep = {
      id: '1',
      title: 'Diseño y molde',
      description: 'Bosquejamos la pieza y preparamos el molde personalizado.',
      icon: 'FaPaintBrush',
      order: 0,
      published: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    describe('GET /api/work-process/steps', () => {
      it('should return all work steps', async () => {
        mockPrisma.workStep.findMany.mockResolvedValue([mockStep]);

        const request = new NextRequest('http://localhost:3000/api/work-process/steps');
        const response = await getSteps(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data).toEqual(JSON.parse(JSON.stringify([mockStep])));
      });

      it('should filter by published status', async () => {
        mockPrisma.workStep.findMany.mockResolvedValue([mockStep]);

        const request = new NextRequest('http://localhost:3000/api/work-process/steps?published=true');
        const response = await getSteps(request);

        expect(response.status).toBe(200);
        expect(mockPrisma.workStep.findMany).toHaveBeenCalledWith({
          where: { published: true },
          orderBy: { order: 'asc' },
        });
      });
    });

    describe('POST /api/work-process/steps', () => {
      it('should create new work step', async () => {
        mockPrisma.workStep.findFirst.mockResolvedValue(null);
        mockPrisma.workStep.create.mockResolvedValue(mockStep);

        const request = new NextRequest('http://localhost:3000/api/work-process/steps', {
          method: 'POST',
          body: JSON.stringify({
            title: 'Diseño y molde',
            description: 'Bosquejamos la pieza y preparamos el molde personalizado.',
            icon: 'FaPaintBrush',
          }),
        });

        const response = await createStep(request);
        const data = await response.json();

        expect(response.status).toBe(201);
        expect(data).toEqual(JSON.parse(JSON.stringify(mockStep)));
      });
    });

    describe('GET /api/work-process/steps/[id]', () => {
      it('should return work step by ID', async () => {
        mockPrisma.workStep.findUnique.mockResolvedValue(mockStep);

        const request = new NextRequest('http://localhost:3000/api/work-process/steps/1');
        const response = await getStep(request, { params: Promise.resolve({ id: '1' }) });
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data).toEqual(JSON.parse(JSON.stringify(mockStep)));
      });

      it('should return 404 for non-existent step', async () => {
        mockPrisma.workStep.findUnique.mockResolvedValue(null);

        const request = new NextRequest('http://localhost:3000/api/work-process/steps/999');
        const response = await getStep(request, { params: Promise.resolve({ id: '999' }) });

        expect(response.status).toBe(404);
      });
    });

    describe('PUT /api/work-process/steps/[id]', () => {
      it('should update work step by ID', async () => {
        mockPrisma.workStep.update.mockResolvedValue({
          ...mockStep,
          title: 'Updated step',
        });

        const request = new NextRequest('http://localhost:3000/api/work-process/steps/1', {
          method: 'PUT',
          body: JSON.stringify({
            title: 'Updated step',
          }),
        });

        const response = await updateStep(request, { params: Promise.resolve({ id: '1' }) });
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.title).toBe('Updated step');
      });
    });

    describe('DELETE /api/work-process/steps/[id]', () => {
      it('should delete work step by ID', async () => {
        mockPrisma.workStep.delete.mockResolvedValue(mockStep);

        const request = new NextRequest('http://localhost:3000/api/work-process/steps/1', {
          method: 'DELETE',
        });

        const response = await deleteStep(request, { params: Promise.resolve({ id: '1' }) });
        expect(response.status).toBe(204);
      });
    });
  });

  describe('Complete WorkProcess', () => {
    describe('GET /api/work-process', () => {
      it('should return complete work process with settings and steps', async () => {
        const mockSettings = {
          id: '1',
          title: 'Cómo creamos tus figuras',
          description: 'Cada pieza es creada con dedicación y atención al detalle.',
          stepLabel: 'Paso',
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const mockSteps = [
          {
            id: '1',
            title: 'Diseño y molde',
            description: 'Bosquejamos la pieza y preparamos el molde personalizado.',
            icon: 'FaPaintBrush',
            order: 0,
            published: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ];

        mockPrisma.workProcessSettings.findFirst.mockResolvedValue(mockSettings);
        mockPrisma.workStep.findMany.mockResolvedValue(mockSteps);

        const request = new NextRequest('http://localhost:3000/api/work-process');
        const response = await getWorkProcess(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data).toEqual(JSON.parse(JSON.stringify({
          settings: mockSettings,
          steps: mockSteps,
        })));
      });
    });
  });
});
