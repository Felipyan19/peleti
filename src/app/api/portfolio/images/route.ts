import { NextRequest } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { ApiResponse, withErrorHandling } from '@/utils/api/responseHelpers';
import { fileToBase64AndMime, parseDataUrl } from '@/utils/server/imageHelpers';

const prisma = new PrismaClient();

export const GET = withErrorHandling(async (req: NextRequest) => {
  const { searchParams } = req.nextUrl;
  const itemId = searchParams.get('itemId');
  const includeBase64 = searchParams.get('includeBase64') === 'true';

  const where = itemId ? { itemId } : {};

  const images = await prisma.portfolioImage.findMany({
    where,
    orderBy: [
      { itemId: 'asc' },
      { order: 'asc' }
    ],
    include: {
      item: {
        select: {
          id: true,
          title: true,
          slug: true
        }
      }
    }
  });

  // Filter base64 data if not requested
  const filteredImages = images.map(image => ({
    ...image,
    ...(includeBase64 ? {} : { imageBase64: undefined })
  }));

  return ApiResponse.success(filteredImages);
});

export const POST = withErrorHandling(async (req: NextRequest) => {
  const contentType = req.headers.get('content-type') || '';
  let itemId: string;
  let alt: string | null = null;
  let order: number = 0;
  let imageData: { base64: string | null; mime: string | null } = { base64: null, mime: null };

  if (contentType.includes('multipart/form-data')) {
    const form = await req.formData();
    itemId = form.get('itemId') as string;
    alt = (form.get('alt') as string) || null;
    order = parseInt((form.get('order') as string) || '0');

    const imageFile = form.get('image') as File | null;

    if (imageFile instanceof File) {
      imageData = await fileToBase64AndMime(imageFile);
    } else {
      const imageBase64 = (form.get('imageBase64') as string) || null;
      const parsed = parseDataUrl(imageBase64);
      imageData = { base64: parsed.base64, mime: parsed.mime };
    }
  } else {
    const body = await req.json();
    const { itemId: iId, alt: a, order: o, imageBase64, imageMime } = body;

    itemId = iId;
    alt = a || null;
    order = o || 0;

    const parsed = parseDataUrl(imageBase64);
    imageData = { base64: parsed.base64, mime: parsed.mime || imageMime || null };
  }

  if (!itemId) {
    return ApiResponse.badRequest('itemId is required');
  }

  if (!imageData.base64) {
    return ApiResponse.badRequest('Image data is required');
  }

  // Verify item exists
  const item = await prisma.portfolioItem.findUnique({
    where: { id: itemId }
  });

  if (!item) {
    return ApiResponse.notFound('Portfolio item not found');
  }

  const created = await prisma.portfolioImage.create({
    data: {
      itemId,
      imageBase64: imageData.base64,
      imageMime: imageData.mime || 'image/jpeg',
      alt: alt?.trim() || null,
      order
    },
    include: {
      item: {
        select: {
          id: true,
          title: true,
          slug: true
        }
      }
    }
  });

  return ApiResponse.created(created);
});