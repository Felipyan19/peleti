/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import { GET as getHeroes, POST as createHero } from '@/app/api/hero/route';
import { GET as getHero, PUT as updateHero, DELETE as deleteHero } from '@/app/api/hero/[id]/route';

// Mock Prisma
jest.mock('@/generated/prisma', () => {
  const mockPrisma = {
    hero: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };
  
  return {
    PrismaClient: jest.fn().mockImplementation(() => mockPrisma),
  };
});

// Mock the response helpers
jest.mock('@/utils/api/responseHelpers', () => ({
  ApiResponse: {
    success: (data: any) => new Response(JSON.stringify(data), { status: 200 }),
    notFound: (message: string) => new Response(JSON.stringify({ error: message }), { status: 404 }),
    noContent: () => new Response(null, { status: 204 }),
  },
  withErrorHandling: (handler: any) => async (...args: any[]) => {
    try {
      return await handler(...args);
    } catch (error) {
      if (error instanceof Response) {
        return error;
      }
      throw error;
    }
  },
}));

// Mock image helpers
jest.mock('@/utils/server/imageHelpers', () => ({
  mapHeroForResponse: (hero: any, options: any) => hero,
  fileToBase64AndMime: jest.fn(),
  parseDataUrl: jest.fn(() => ({ base64: null, mime: null })),
  parseBoolean: jest.fn((val) => val === 'true' || val === true),
}));

// Mock validation
jest.mock('@/utils/validation/heroValidation', () => ({
  validateHeroQuery: jest.fn((params) => ({
    page: parseInt(params.get('page') || '1'),
    limit: parseInt(params.get('limit') || '10'),
    includeBase64: params.get('includeBase64') === 'true',
    published: params.get('published') ? params.get('published') === 'true' : undefined,
  })),
  validateHeroParams: jest.fn((params) => ({ id: params.id })),
  validateHeroUpdate: jest.fn((data) => data),
}));

describe('Hero API', () => {
  let mockPrisma: any;

  beforeEach(() => {
    jest.clearAllMocks();
    // Get the mocked Prisma instance
    const { PrismaClient } = require('@/generated/prisma');
    mockPrisma = new PrismaClient();
  });

  describe('GET /api/hero', () => {
    it('should return paginated list of heroes', async () => {
      const mockHeroes = [
        {
          id: '1',
          title: 'Test Hero',
          description: 'Test Description',
          buttonText: 'Click me',
          imageBase64: null,
          imageMime: null,
          metaTitle: null,
          metaDescription: null,
          ogImageBase64: null,
          ogImageMime: null,
          published: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrisma.hero.findMany.mockResolvedValue(mockHeroes);
      mockPrisma.hero.count.mockResolvedValue(1);

      const request = new NextRequest('http://localhost:3000/api/hero?page=1&limit=10');
      const response = await getHeroes(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.heroes).toHaveLength(1);
      expect(data.total).toBe(1);
      expect(data.page).toBe(1);
      expect(data.limit).toBe(10);
    });

    it('should filter by published status', async () => {
      mockPrisma.hero.findMany.mockResolvedValue([]);
      mockPrisma.hero.count.mockResolvedValue(0);

      const request = new NextRequest('http://localhost:3000/api/hero?published=true');
      await getHeroes(request);

      expect(mockPrisma.hero.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { published: true },
        })
      );
    });
  });

  describe('POST /api/hero', () => {
    it('should create a new hero with valid data', async () => {
      const heroData = {
        title: 'New Hero',
        description: 'New Description',
        buttonText: 'Click me',
        published: true,
      };

      const mockCreatedHero = {
        id: '1',
        ...heroData,
        imageBase64: null,
        imageMime: null,
        metaTitle: null,
        metaDescription: null,
        ogImageBase64: null,
        ogImageMime: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.hero.create.mockResolvedValue(mockCreatedHero);

      const request = new NextRequest('http://localhost:3000/api/hero', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(heroData),
      });

      const response = await createHero(request);
      expect(response.status).toBe(201);
    });

    it('should return 400 for missing required fields', async () => {
      const invalidData = {
        title: '', // Empty title
        description: 'Valid description',
      };

      const request = new NextRequest('http://localhost:3000/api/hero', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidData),
      });

      const response = await createHero(request);
      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/hero/[id]', () => {
    it('should return hero by id', async () => {
      const mockHero = {
        id: '1',
        title: 'Test Hero',
        description: 'Test Description',
        buttonText: 'Click me',
        imageBase64: null,
        imageMime: null,
        metaTitle: null,
        metaDescription: null,
        ogImageBase64: null,
        ogImageMime: null,
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.hero.findUnique.mockResolvedValue(mockHero);

      const request = new NextRequest('http://localhost:3000/api/hero/1');
      const response = await getHero(request, { params: { id: '1' } });

      expect(response.status).toBe(200);
    });

    it('should return 404 for non-existent hero', async () => {
      mockPrisma.hero.findUnique.mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/hero/non-existent');
      const response = await getHero(request, { params: { id: 'non-existent' } });

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/hero/[id]', () => {
    it('should update existing hero', async () => {
      const existingHero = {
        id: '1',
        title: 'Original Title',
        description: 'Original Description',
        buttonText: 'Original Button',
        imageBase64: null,
        imageMime: null,
        metaTitle: null,
        metaDescription: null,
        ogImageBase64: null,
        ogImageMime: null,
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedHero = {
        ...existingHero,
        title: 'Updated Title',
        updatedAt: new Date(),
      };

      mockPrisma.hero.findUnique.mockResolvedValue(existingHero);
      mockPrisma.hero.update.mockResolvedValue(updatedHero);

      const request = new NextRequest('http://localhost:3000/api/hero/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Updated Title' }),
      });

      const response = await updateHero(request, { params: { id: '1' } });
      expect(response.status).toBe(200);
    });

    it('should return 404 for non-existent hero', async () => {
      mockPrisma.hero.findUnique.mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/hero/non-existent', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Updated Title' }),
      });

      const response = await updateHero(request, { params: { id: 'non-existent' } });
      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/hero/[id]', () => {
    it('should delete existing hero', async () => {
      const existingHero = {
        id: '1',
        title: 'Test Hero',
        description: 'Test Description',
        buttonText: 'Click me',
        imageBase64: null,
        imageMime: null,
        metaTitle: null,
        metaDescription: null,
        ogImageBase64: null,
        ogImageMime: null,
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.hero.findUnique.mockResolvedValue(existingHero);
      mockPrisma.hero.delete.mockResolvedValue(existingHero);

      const request = new NextRequest('http://localhost:3000/api/hero/1', {
        method: 'DELETE',
      });

      const response = await deleteHero(request, { params: { id: '1' } });
      expect(response.status).toBe(204);
    });

    it('should return 404 for non-existent hero', async () => {
      mockPrisma.hero.findUnique.mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/hero/non-existent', {
        method: 'DELETE',
      });

      const response = await deleteHero(request, { params: { id: 'non-existent' } });
      expect(response.status).toBe(404);
    });
  });
});
