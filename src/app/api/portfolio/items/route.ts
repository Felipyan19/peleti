import { NextRequest } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { ApiResponse, withErrorHandling } from '@/utils/api/responseHelpers';

const prisma = new PrismaClient();

function createSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Only letters, numbers, spaces and hyphens
    .replace(/\s+/g, '-') // Spaces to hyphens
    .replace(/-+/g, '-') // Multiple hyphens to one
    .trim();
}

export const GET = withErrorHandling(async (req: NextRequest) => {
  const { searchParams } = req.nextUrl;
  const categoryId = searchParams.get('categoryId');
  const published = searchParams.get('published');
  const includeImages = searchParams.get('includeImages') !== 'false'; // Default true
  const page = parseInt(searchParams.get('page') || '1');
  const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);

  const skip = (page - 1) * limit;

  const where: any = {};
  if (categoryId) where.categoryId = categoryId;
  if (published !== null) where.published = published === 'true';

  const [items, total] = await Promise.all([
    prisma.portfolioItem.findMany({
      where,
      orderBy: { order: 'asc' },
      skip,
      take: limit,
      include: {
        category: true,
        techniques: true,
        ...(includeImages && {
          images: {
            orderBy: { order: 'asc' }
          }
        }),
        _count: {
          select: {
            images: true
          }
        }
      }
    }),
    prisma.portfolioItem.count({ where })
  ]);

  return ApiResponse.success({
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  });
});

export const POST = withErrorHandling(async (req: NextRequest) => {
  const body = await req.json();
  const {
    title,
    slug,
    description,
    dimensions,
    categoryId,
    techniqueIds = [],
    order = 0,
    published = true,
    metaTitle,
    metaDescription
  } = body;

  if (!title || !description || !categoryId) {
    return ApiResponse.badRequest('Title, description, and categoryId are required');
  }

  // Verify category exists
  const category = await prisma.portfolioCategory.findUnique({
    where: { id: categoryId }
  });

  if (!category) {
    return ApiResponse.notFound('Category not found');
  }

  // Verify techniques exist
  if (techniqueIds.length > 0) {
    const techniques = await prisma.techniqueTag.findMany({
      where: {
        id: {
          in: techniqueIds
        }
      }
    });

    if (techniques.length !== techniqueIds.length) {
      return ApiResponse.badRequest('One or more technique IDs are invalid');
    }
  }

  const generatedSlug = slug || createSlug(title);

  // Check if slug already exists
  const existing = await prisma.portfolioItem.findUnique({
    where: { slug: generatedSlug }
  });

  if (existing) {
    return ApiResponse.badRequest('Item with this slug already exists');
  }

  const created = await prisma.portfolioItem.create({
    data: {
      title: title.trim(),
      slug: generatedSlug,
      description: description.trim(),
      dimensions: dimensions?.trim() || null,
      categoryId,
      order,
      published,
      metaTitle: metaTitle?.trim() || null,
      metaDescription: metaDescription?.trim() || null,
      techniques: {
        connect: techniqueIds.map((id: string) => ({ id }))
      }
    },
    include: {
      category: true,
      techniques: true,
      images: true,
      _count: {
        select: {
          images: true
        }
      }
    }
  });

  return ApiResponse.created(created);
});