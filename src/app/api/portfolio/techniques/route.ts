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
  const includeItemCount = searchParams.get('includeItemCount') === 'true';

  const techniques = await prisma.techniqueTag.findMany({
    orderBy: { name: 'asc' },
    ...(includeItemCount && {
      include: {
        _count: {
          select: {
            items: {
              where: { published: true }
            }
          }
        }
      }
    })
  });

  return ApiResponse.success(techniques);
});

export const POST = withErrorHandling(async (req: NextRequest) => {
  const body = await req.json();
  const { name, slug } = body;

  if (!name) {
    return ApiResponse.badRequest('Name is required');
  }

  const generatedSlug = slug || createSlug(name);

  // Check if name or slug already exists
  const existing = await prisma.techniqueTag.findFirst({
    where: {
      OR: [
        { name: name.trim() },
        { slug: generatedSlug }
      ]
    }
  });

  if (existing) {
    return ApiResponse.badRequest('Technique with this name or slug already exists');
  }

  const created = await prisma.techniqueTag.create({
    data: {
      name: name.trim(),
      slug: generatedSlug
    }
  });

  return ApiResponse.created(created);
});