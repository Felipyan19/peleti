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
  const { searchParams } = req.nextUrl;
  const includeItems = searchParams.get('includeItems') === 'true';

  const category = await prisma.portfolioCategory.findUnique({
    where: { id },
    ...(includeItems && {
      include: {
        items: {
          where: { published: true },
          orderBy: { order: 'asc' },
          include: {
            images: {
              orderBy: { order: 'asc' },
              take: 1 // Only first image for list
            },
            techniques: true,
            _count: {
              select: {
                images: true
              }
            }
          }
        }
      }
    })
  });

  if (!category) {
    return ApiResponse.notFound('Category not found');
  }

  return ApiResponse.success(category);
});

export const PUT = withErrorHandling(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const body = await req.json();
  const { name, slug } = body;

  const updateData: Record<string, unknown> = {};

  if (name) {
    updateData.name = name.trim();
    updateData.slug = slug || createSlug(name);
  } else if (slug) {
    updateData.slug = slug;
  }

  // Check if new slug already exists (excluding current record)
  if (updateData.slug) {
    const existing = await prisma.portfolioCategory.findFirst({
      where: {
        slug: updateData.slug,
        NOT: { id }
      }
    });

    if (existing) {
      return ApiResponse.badRequest('Category with this slug already exists');
    }
  }

  const updated = await prisma.portfolioCategory.update({
    where: { id },
    data: updateData
  });

  return ApiResponse.success(updated);
});

export const DELETE = withErrorHandling(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  // Check if category has items
  const itemCount = await prisma.portfolioItem.count({
    where: { categoryId: id }
  });

  if (itemCount > 0) {
    return ApiResponse.badRequest('Cannot delete category with existing items');
  }

  await prisma.portfolioCategory.delete({
    where: { id }
  });

  return ApiResponse.success({ message: 'Category deleted successfully' });
});