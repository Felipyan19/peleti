/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import { GET as getAbouts, POST as createAbout } from '@/app/api/about/route';
import { GET as getAbout, PUT as updateAbout, DELETE as deleteAbout } from '@/app/api/about/[id]/route';

// Mock Prisma
jest.mock('@/generated/prisma', () => {
  const mockPrisma = {
    about: {
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
  mapAboutForResponse: (about: any, options: any) => about,
  fileToBase64AndMime: jest.fn(),
  parseDataUrl: jest.fn(() => ({ base64: null, mime: null })),
  parseBoolean: jest.fn((val) => val === 'true' || val === true),
}));

// Mock validation
jest.mock('@/utils/validation/aboutValidation', () => ({
  validateAboutQuery: jest.fn((params) => ({
    page: parseInt(params.get('page') || '1'),
    limit: parseInt(params.get('limit') || '10'),
    includeBase64: params.get('includeBase64') === 'true',
    published: params.get('published') ? params.get('published') === 'true' : undefined,
  })),
  validateAboutParams: jest.fn(async (params) => ({ id: (await params).id })),
  validateAboutUpdate: jest.fn((data) => data),
}));

describe('About API', () => {
  let mockPrisma: any;

  beforeEach(() => {
    jest.clearAllMocks();
    // Get the mocked Prisma instance
    const { PrismaClient } = require('@/generated/prisma');
    mockPrisma = new PrismaClient();
  });

  describe('GET /api/about', () => {
    it('should return paginated list of about sections', async () => {
      const mockAbouts = [
        {
          id: '1',
          title: 'Test About',
          paragraphs: ['Paragraph 1', 'Paragraph 2'],
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

      mockPrisma.about.findMany.mockResolvedValue(mockAbouts);
      mockPrisma.about.count.mockResolvedValue(1);

      const request = new NextRequest('http://localhost:3000/api/about?page=1&limit=10');
      const response = await getAbouts(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.abouts).toHaveLength(1);
      expect(data.total).toBe(1);
      expect(data.page).toBe(1);
      expect(data.limit).toBe(10);
    });

    it('should filter by published status', async () => {
      mockPrisma.about.findMany.mockResolvedValue([]);
      mockPrisma.about.count.mockResolvedValue(0);

      const request = new NextRequest('http://localhost:3000/api/about?published=true');
      await getAbouts(request);

      expect(mockPrisma.about.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { published: true },
        })
      );
    });
  });

  describe('POST /api/about', () => {
    it('should create a new about section with valid data', async () => {
      const aboutData = {
        title: 'New About',
        paragraphs: ['Paragraph 1', 'Paragraph 2'],
        published: true,
      };

      const mockCreatedAbout = {
        id: '1',
        ...aboutData,
        imageBase64: null,
        imageMime: null,
        metaTitle: null,
        metaDescription: null,
        ogImageBase64: null,
        ogImageMime: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.about.create.mockResolvedValue(mockCreatedAbout);

      const request = new NextRequest('http://localhost:3000/api/about', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aboutData),
      });

      const response = await createAbout(request);
      expect(response.status).toBe(201);
    });

    it('should return 400 for missing required fields', async () => {
      const invalidData = {
        title: '', // Empty title
        paragraphs: [], // Empty paragraphs
      };

      const request = new NextRequest('http://localhost:3000/api/about', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidData),
      });

      const response = await createAbout(request);
      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/about/[id]', () => {
    it('should return about section by id', async () => {
      const mockAbout = {
        id: '1',
        title: 'Test About',
        paragraphs: ['Paragraph 1', 'Paragraph 2'],
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

      mockPrisma.about.findUnique.mockResolvedValue(mockAbout);

      const request = new NextRequest('http://localhost:3000/api/about/1');
      const response = await getAbout(request, { params: Promise.resolve({ id: '1' }) });

      expect(response.status).toBe(200);
    });

    it('should return 404 for non-existent about section', async () => {
      mockPrisma.about.findUnique.mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/about/non-existent');
      const response = await getAbout(request, { params: Promise.resolve({ id: 'non-existent' }) });

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/about/[id]', () => {
    it('should update existing about section', async () => {
      const existingAbout = {
        id: '1',
        title: 'Original Title',
        paragraphs: ['Original Paragraph 1', 'Original Paragraph 2'],
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

      const updatedAbout = {
        ...existingAbout,
        title: 'Updated Title',
        updatedAt: new Date(),
      };

      mockPrisma.about.findUnique.mockResolvedValue(existingAbout);
      mockPrisma.about.update.mockResolvedValue(updatedAbout);

      const request = new NextRequest('http://localhost:3000/api/about/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Updated Title' }),
      });

      const response = await updateAbout(request, { params: Promise.resolve({ id: '1' }) });
      expect(response.status).toBe(200);
    });

    it('should return 404 for non-existent about section', async () => {
      mockPrisma.about.findUnique.mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/about/non-existent', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Updated Title' }),
      });

      const response = await updateAbout(request, { params: Promise.resolve({ id: 'non-existent' }) });
      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/about/[id]', () => {
    it('should delete existing about section', async () => {
      const existingAbout = {
        id: '1',
        title: 'Test About',
        paragraphs: ['Paragraph 1', 'Paragraph 2'],
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

      mockPrisma.about.findUnique.mockResolvedValue(existingAbout);
      mockPrisma.about.delete.mockResolvedValue(existingAbout);

      const request = new NextRequest('http://localhost:3000/api/about/1', {
        method: 'DELETE',
      });

      const response = await deleteAbout(request, { params: Promise.resolve({ id: '1' }) });
      expect(response.status).toBe(204);
    });

    it('should return 404 for non-existent about section', async () => {
      mockPrisma.about.findUnique.mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/about/non-existent', {
        method: 'DELETE',
      });

      const response = await deleteAbout(request, { params: Promise.resolve({ id: 'non-existent' }) });
      expect(response.status).toBe(404);
    });
  });
});
