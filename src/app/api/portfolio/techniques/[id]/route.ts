import { NextRequest } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { ApiResponse, withErrorHandling } from '@/utils/api/responseHelpers';
import { withAdminProtection } from '@/utils/api/authHelpers';

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

  const technique = await prisma.techniqueTag.findUnique({
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
            category: true,
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

  if (!technique) {
    return ApiResponse.notFound('Technique not found');
  }

  return ApiResponse.success(technique);
});

export const PUT = withErrorHandling(withAdminProtection(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
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

  // Check if new name or slug already exists (excluding current record)
  if (updateData.name || updateData.slug) {
    const conditions = [];
    if (updateData.name) conditions.push({ name: updateData.name });
    if (updateData.slug) conditions.push({ slug: updateData.slug });

    const existing = await prisma.techniqueTag.findFirst({
      where: {
        OR: conditions,
        NOT: { id }
      }
    });

    if (existing) {
      return ApiResponse.badRequest('Technique with this name or slug already exists');
    }
  }

  const updated = await prisma.techniqueTag.update({
    where: { id },
    data: updateData
  });

  return ApiResponse.success(updated);
}));

export const DELETE = withErrorHandling(withAdminProtection(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  // Check if technique is used by any items
  const itemCount = await prisma.portfolioItem.count({
    where: {
      techniques: {
        some: {
          id
        }
      }
    }
  });

  if (itemCount > 0) {
    return ApiResponse.badRequest('Cannot delete technique that is used by portfolio items');
  }

  await prisma.techniqueTag.delete({
    where: { id }
  });

  return ApiResponse.success({ message: 'Technique deleted successfully' });
}));
