import { NextRequest } from 'next/server';
import { GET as getSettings, POST as createSettings, PUT as updateSettings, DELETE as deleteSettings } from '@/app/api/work-process/settings/route';
import { GET as getStep, PUT as updateStep, DELETE as deleteStep } from '@/app/api/work-process/steps/[id]/route';
import { GET as getSteps, POST as createStep, PUT as updateSteps, DELETE as deleteSteps } from '@/app/api/work-process/steps/route';
import { GET as getWorkProcess } from '@/app/api/work-process/route';

// Mock Prisma
jest.mock('@/generated/prisma', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
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
  })),
}));

describe('WorkProcess API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
        const { PrismaClient } = require('@/generated/prisma');
        const mockPrisma = new PrismaClient();
        mockPrisma.workProcessSettings.findMany.mockResolvedValue([mockSettings]);

        const request = new NextRequest('http://localhost:3000/api/work-process/settings');
        const response = await getSettings(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data).toEqual([mockSettings]);
      });
    });

    describe('POST /api/work-process/settings', () => {
      it('should create new work process settings', async () => {
        const { PrismaClient } = require('@/generated/prisma');
        const mockPrisma = new PrismaClient();
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
        expect(data).toEqual(mockSettings);
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
        const { PrismaClient } = require('@/generated/prisma');
        const mockPrisma = new PrismaClient();
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
        const { PrismaClient } = require('@/generated/prisma');
        const mockPrisma = new PrismaClient();
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
        const { PrismaClient } = require('@/generated/prisma');
        const mockPrisma = new PrismaClient();
        mockPrisma.workStep.findMany.mockResolvedValue([mockStep]);

        const request = new NextRequest('http://localhost:3000/api/work-process/steps');
        const response = await getSteps(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data).toEqual([mockStep]);
      });

      it('should filter by published status', async () => {
        const { PrismaClient } = require('@/generated/prisma');
        const mockPrisma = new PrismaClient();
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
        const { PrismaClient } = require('@/generated/prisma');
        const mockPrisma = new PrismaClient();
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
        expect(data).toEqual(mockStep);
      });
    });

    describe('GET /api/work-process/steps/[id]', () => {
      it('should return work step by ID', async () => {
        const { PrismaClient } = require('@/generated/prisma');
        const mockPrisma = new PrismaClient();
        mockPrisma.workStep.findUnique.mockResolvedValue(mockStep);

        const request = new NextRequest('http://localhost:3000/api/work-process/steps/1');
        const response = await getStep(request, { params: { id: '1' } });
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data).toEqual(mockStep);
      });

      it('should return 404 for non-existent step', async () => {
        const { PrismaClient } = require('@/generated/prisma');
        const mockPrisma = new PrismaClient();
        mockPrisma.workStep.findUnique.mockResolvedValue(null);

        const request = new NextRequest('http://localhost:3000/api/work-process/steps/999');
        const response = await getStep(request, { params: { id: '999' } });

        expect(response.status).toBe(404);
      });
    });

    describe('PUT /api/work-process/steps/[id]', () => {
      it('should update work step by ID', async () => {
        const { PrismaClient } = require('@/generated/prisma');
        const mockPrisma = new PrismaClient();
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

        const response = await updateStep(request, { params: { id: '1' } });
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.title).toBe('Updated step');
      });
    });

    describe('DELETE /api/work-process/steps/[id]', () => {
      it('should delete work step by ID', async () => {
        const { PrismaClient } = require('@/generated/prisma');
        const mockPrisma = new PrismaClient();
        mockPrisma.workStep.delete.mockResolvedValue(mockStep);

        const request = new NextRequest('http://localhost:3000/api/work-process/steps/1', {
          method: 'DELETE',
        });

        const response = await deleteStep(request, { params: { id: '1' } });
        expect(response.status).toBe(204);
      });
    });
  });

  describe('Complete WorkProcess', () => {
    describe('GET /api/work-process', () => {
      it('should return complete work process with settings and steps', async () => {
        const { PrismaClient } = require('@/generated/prisma');
        const mockPrisma = new PrismaClient();
        
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
        expect(data).toEqual({
          settings: mockSettings,
          steps: mockSteps,
        });
      });
    });
  });
});
