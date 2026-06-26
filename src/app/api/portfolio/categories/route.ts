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

export const GET = withErrorHandling(async (req: NextRequest) => {
  const { searchParams } = req.nextUrl;
  const includeItemCount = searchParams.get('includeItemCount') === 'true';

  const categories = await prisma.portfolioCategory.findMany({
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

  return ApiResponse.success(categories);
});

export const POST = withErrorHandling(withAdminProtection(async (req: NextRequest) => {
  const body = await req.json();
  const { name, slug } = body;

  if (!name) {
    return ApiResponse.badRequest('Name is required');
  }

  const generatedSlug = slug || createSlug(name);

  // Check if slug already exists
  const existing = await prisma.portfolioCategory.findUnique({
    where: { slug: generatedSlug }
  });

  if (existing) {
    return ApiResponse.badRequest('Category with this slug already exists');
  }

  const created = await prisma.portfolioCategory.create({
    data: {
      name: name.trim(),
      slug: generatedSlug
    }
  });

  return ApiResponse.created(created);
}));
