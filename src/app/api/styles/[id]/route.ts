import { NextRequest } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { ApiResponse, withErrorHandling } from '@/utils/api/responseHelpers';
import { fileToBase64AndMime, parseDataUrl } from '@/utils/server/imageHelpers';

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
  const includeBase64 = searchParams.get('includeBase64') === 'true';

  const style = await prisma.style.findUnique({
    where: { id }
  });

  if (!style) {
    return ApiResponse.notFound('Style not found');
  }

  // Filter base64 data if not requested
  const response = {
    ...style,
    ...(includeBase64 ? {} : {
      imageBase64: undefined,
      ogImageBase64: undefined
    })
  };

  return ApiResponse.success(response);
});

export const PUT = withErrorHandling(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const contentType = req.headers.get('content-type') || '';

  const updateData: Record<string, unknown> = {};
  let mainImage: { base64: string | null; mime: string | null } | undefined;
  let ogImage: { base64: string | null; mime: string | null } | undefined;

  if (contentType.includes('multipart/form-data')) {
    const form = await req.formData();
    const name = form.get('name') as string;
    const slug = form.get('slug') as string;
    const description = form.get('description') as string;
    const category = form.get('category') as 'NATURAL' | 'MODERN' | 'CLASSIC' | 'HISTORIC';
    const techniquesStr = form.get('techniques') as string;
    const order = form.get('order') as string;
    const published = form.get('published') as string;
    const metaTitle = form.get('metaTitle') as string;
    const metaDescription = form.get('metaDescription') as string;

    if (name) {
      updateData.name = name.trim();
      if (!slug) {
        updateData.slug = createSlug(name);
      }
    }

    if (slug) updateData.slug = slug;
    if (description) updateData.description = description.trim();
    if (category) updateData.category = category;

    if (techniquesStr) {
      try {
        updateData.techniques = JSON.parse(techniquesStr);
      } catch {
        updateData.techniques = [techniquesStr];
      }
    }

    if (order) updateData.order = parseInt(order);
    if (published !== null) updateData.published = published !== 'false';
    if (metaTitle !== undefined) updateData.metaTitle = metaTitle?.trim() || null;
    if (metaDescription !== undefined) updateData.metaDescription = metaDescription?.trim() || null;

    const imageFile = form.get('image') as File | null;
    const ogImageFile = form.get('ogImage') as File | null;

    if (imageFile instanceof File) {
      mainImage = await fileToBase64AndMime(imageFile);
    } else {
      const imageBase64 = form.get('imageBase64') as string;
      if (imageBase64) {
        const parsed = parseDataUrl(imageBase64);
        mainImage = { base64: parsed.base64, mime: parsed.mime };
      }
    }

    if (ogImageFile instanceof File) {
      ogImage = await fileToBase64AndMime(ogImageFile);
    } else {
      const ogImageBase64 = form.get('ogImageBase64') as string;
      if (ogImageBase64) {
        const parsed = parseDataUrl(ogImageBase64);
        ogImage = { base64: parsed.base64, mime: parsed.mime };
      }
    }
  } else {
    const body = await req.json();
    const {
      name,
      slug,
      description,
      category,
      techniques,
      order,
      published,
      metaTitle,
      metaDescription,
      imageBase64,
      imageMime,
      ogImageBase64,
      ogImageMime
    } = body;

    if (name) {
      updateData.name = name.trim();
      if (!slug) {
        updateData.slug = createSlug(name);
      }
    }

    if (slug) updateData.slug = slug;
    if (description) updateData.description = description.trim();
    if (category !== undefined) updateData.category = category;
    if (techniques !== undefined) updateData.techniques = Array.isArray(techniques) ? techniques : [];
    if (order !== undefined) updateData.order = order;
    if (published !== undefined) updateData.published = published;
    if (metaTitle !== undefined) updateData.metaTitle = metaTitle?.trim() || null;
    if (metaDescription !== undefined) updateData.metaDescription = metaDescription?.trim() || null;

    if (imageBase64) {
      const parsed = parseDataUrl(imageBase64);
      mainImage = { base64: parsed.base64, mime: parsed.mime || imageMime || null };
    }

    if (ogImageBase64) {
      const parsed = parseDataUrl(ogImageBase64);
      ogImage = { base64: parsed.base64, mime: parsed.mime || ogImageMime || null };
    }
  }

  // Check if new slug already exists (excluding current record)
  if (updateData.slug) {
    const existing = await prisma.style.findFirst({
      where: {
        slug: updateData.slug,
        NOT: { id }
      }
    });

    if (existing) {
      return ApiResponse.badRequest('Style with this slug already exists');
    }
  }

  // Add image data to update
  if (mainImage?.base64) {
    updateData.imageBase64 = mainImage.base64;
    updateData.imageMime = mainImage.mime || 'image/jpeg';
  }

  if (ogImage?.base64) {
    updateData.ogImageBase64 = ogImage.base64;
    updateData.ogImageMime = ogImage.mime || 'image/jpeg';
  }

  const updated = await prisma.style.update({
    where: { id },
    data: updateData
  });

  // Filter base64 data from response
  const { imageBase64: _imageBase64, ogImageBase64: _ogImageBase64, ...response } = updated;

  return ApiResponse.success(response);
});

export const DELETE = withErrorHandling(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  await prisma.style.delete({
    where: { id }
  });

  return ApiResponse.success({ message: 'Style deleted successfully' });
});