/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import { GET as getStyles, POST as createStyle } from '@/app/api/style-gallery/styles/route';
import { GET as getStyle, PUT as updateStyle, DELETE as deleteStyle } from '@/app/api/style-gallery/styles/[id]/route';
import { GET as getSettings, POST as createSettings } from '@/app/api/style-gallery/settings/route';

// Mock Prisma
jest.mock('@/generated/prisma', () => {
  const mockPrisma = {
    styleGalleryStyle: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    styleGallerySettings: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };
  
  return {
    PrismaClient: jest.fn().mockImplementation(() => mockPrisma),
  };
});

// Mock the response helpers
jest.mock('@/utils/api/responseHelpers', () => ({
  ApiResponse: {
    success: (data: any) => new Response(JSON.stringify({ success: true, data }), { status: 200 }),
    notFound: (message: string) => new Response(JSON.stringify({ success: false, error: message }), { status: 404 }),
    badRequest: (message: string) => new Response(JSON.stringify({ success: false, error: message }), { status: 400 }),
    noContent: () => new Response(null, { status: 204 }),
  },
  withErrorHandling: (handler: any) => handler,
}));

describe('StyleGallery API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/style-gallery/styles', () => {
    it('should return list of styles', async () => {
      const mockStyles = [
        {
          id: '1',
          name: 'Test Style',
          description: 'Test Description',
          icon: 'FaTest',
          techniques: ['Technique 1', 'Technique 2'],
          examples: 'Test Examples',
          order: 1,
          published: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const { PrismaClient } = require('@/generated/prisma');
      const mockPrisma = new PrismaClient();
      mockPrisma.styleGalleryStyle.findMany.mockResolvedValue(mockStyles);
      mockPrisma.styleGalleryStyle.count.mockResolvedValue(1);

      const request = new NextRequest('http://localhost:3000/api/style-gallery/styles');
      const response = await getStyles(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.styles).toHaveLength(1);
      expect(data.data.styles[0].name).toBe('Test Style');
    });
  });

  describe('POST /api/style-gallery/styles', () => {
    it('should create a new style', async () => {
      const mockStyle = {
        id: '1',
        name: 'New Style',
        description: 'New Description',
        icon: 'FaNew',
        techniques: ['New Technique'],
        examples: 'New Examples',
        order: 1,
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const { PrismaClient } = require('@/generated/prisma');
      const mockPrisma = new PrismaClient();
      mockPrisma.styleGalleryStyle.create.mockResolvedValue(mockStyle);

      const request = new NextRequest('http://localhost:3000/api/style-gallery/styles', {
        method: 'POST',
        body: JSON.stringify({
          name: 'New Style',
          description: 'New Description',
          techniques: ['New Technique'],
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await createStyle(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.name).toBe('New Style');
    });

    it('should return 400 for missing required fields', async () => {
      const request = new NextRequest('http://localhost:3000/api/style-gallery/styles', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Incomplete Style',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await createStyle(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBeDefined();
    });
  });

  describe('GET /api/style-gallery/settings', () => {
    it('should return settings', async () => {
      const mockSettings = {
        id: '1',
        title: 'Test Settings',
        description: 'Test Description',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const { PrismaClient } = require('@/generated/prisma');
      const mockPrisma = new PrismaClient();
      mockPrisma.styleGallerySettings.findFirst.mockResolvedValue(mockSettings);

      const response = await getSettings();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.title).toBe('Test Settings');
    });
  });

  describe('POST /api/style-gallery/settings', () => {
    it('should create settings', async () => {
      const mockSettings = {
        id: '1',
        title: 'New Settings',
        description: 'New Description',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const { PrismaClient } = require('@/generated/prisma');
      const mockPrisma = new PrismaClient();
      mockPrisma.styleGallerySettings.findFirst.mockResolvedValue(null);
      mockPrisma.styleGallerySettings.create.mockResolvedValue(mockSettings);

      const request = new NextRequest('http://localhost:3000/api/style-gallery/settings', {
        method: 'POST',
        body: JSON.stringify({
          title: 'New Settings',
          description: 'New Description',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await createSettings(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.title).toBe('New Settings');
    });
  });
});
