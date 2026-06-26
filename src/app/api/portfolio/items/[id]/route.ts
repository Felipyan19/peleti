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

export const GET = withErrorHandling(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const item = await prisma.portfolioItem.findUnique({
    where: { id },
    include: {
      category: true,
      techniques: true,
      images: {
        orderBy: { order: 'asc' }
      },
      _count: {
        select: {
          images: true
        }
      }
    }
  });

  if (!item) {
    return ApiResponse.notFound('Portfolio item not found');
  }

  return ApiResponse.success(item);
});

export const PUT = withErrorHandling(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const body = await req.json();
  const {
    title,
    slug,
    description,
    dimensions,
    categoryId,
    techniqueIds,
    order,
    published,
    metaTitle,
    metaDescription
  } = body;

  const updateData: Record<string, unknown> = {};

  if (title) {
    updateData.title = title.trim();
    if (!slug) {
      updateData.slug = createSlug(title);
    }
  }

  if (slug) {
    // Check if new slug already exists (excluding current record)
    const existing = await prisma.portfolioItem.findFirst({
      where: {
        slug,
        NOT: { id }
      }
    });

    if (existing) {
      return ApiResponse.badRequest('Item with this slug already exists');
    }
    updateData.slug = slug;
  }

  if (description) updateData.description = description.trim();
  if (dimensions !== undefined) updateData.dimensions = dimensions?.trim() || null;
  if (order !== undefined) updateData.order = order;
  if (published !== undefined) updateData.published = published;
  if (metaTitle !== undefined) updateData.metaTitle = metaTitle?.trim() || null;
  if (metaDescription !== undefined) updateData.metaDescription = metaDescription?.trim() || null;

  // Handle category change
  if (categoryId) {
    const category = await prisma.portfolioCategory.findUnique({
      where: { id: categoryId }
    });

    if (!category) {
      return ApiResponse.notFound('Category not found');
    }
    updateData.categoryId = categoryId;
  }

  // Handle technique updates
  let techniqueUpdate = {};
  if (techniqueIds !== undefined) {
    if (techniqueIds.length > 0) {
      // Verify techniques exist
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

      techniqueUpdate = {
        set: techniqueIds.map((techId: string) => ({ id: techId }))
      };
    } else {
      techniqueUpdate = {
        set: []
      };
    }
  }

  const updated = await prisma.portfolioItem.update({
    where: { id },
    data: {
      ...updateData,
      ...(Object.keys(techniqueUpdate).length > 0 && {
        techniques: techniqueUpdate
      })
    },
    include: {
      category: true,
      techniques: true,
      images: {
        orderBy: { order: 'asc' }
      },
      _count: {
        select: {
          images: true
        }
      }
    }
  });

  return ApiResponse.success(updated);
});

export const DELETE = withErrorHandling(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  // Delete all related images first (cascade should handle this, but being explicit)
  await prisma.portfolioImage.deleteMany({
    where: { itemId: id }
  });

  await prisma.portfolioItem.delete({
    where: { id }
  });

  return ApiResponse.success({ message: 'Portfolio item deleted successfully' });
});