import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { ApiResponse, withErrorHandling } from '@/utils/api/responseHelpers';
import { fileToBase64AndMime, parseDataUrl } from '@/utils/server/imageHelpers';

const prisma = new PrismaClient();

export const GET = withErrorHandling(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const { searchParams } = req.nextUrl;
  const includeBase64 = searchParams.get('includeBase64') === 'true';
  const asImage = searchParams.get('asImage') === 'true';

  const image = await prisma.portfolioImage.findUnique({
    where: { id },
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

  if (!image) {
    return ApiResponse.notFound('Image not found');
  }

  // Return image as binary if requested
  if (asImage && image.imageBase64) {
    const buffer = Buffer.from(image.imageBase64, 'base64');
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': image.imageMime || 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  }

  // Return JSON response
  const response = {
    ...image,
    ...(includeBase64 ? {} : { imageBase64: undefined })
  };

  return ApiResponse.success(response);
});

export const PUT = withErrorHandling(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const contentType = req.headers.get('content-type') || '';

  let alt: string | undefined;
  let order: number | undefined;
  let imageData: { base64: string | null; mime: string | null } | undefined;

  if (contentType.includes('multipart/form-data')) {
    const form = await req.formData();
    alt = (form.get('alt') as string) || undefined;
    const orderStr = form.get('order') as string;
    order = orderStr ? parseInt(orderStr) : undefined;

    const imageFile = form.get('image') as File | null;

    if (imageFile instanceof File) {
      imageData = await fileToBase64AndMime(imageFile);
    } else {
      const imageBase64 = (form.get('imageBase64') as string) || null;
      if (imageBase64) {
        const parsed = parseDataUrl(imageBase64);
        imageData = { base64: parsed.base64, mime: parsed.mime };
      }
    }
  } else {
    const body = await req.json();
    const { alt: a, order: o, imageBase64, imageMime } = body;

    alt = a;
    order = o;

    if (imageBase64) {
      const parsed = parseDataUrl(imageBase64);
      imageData = { base64: parsed.base64, mime: parsed.mime || imageMime || null };
    }
  }

  const updateData: Record<string, unknown> = {};

  if (alt !== undefined) updateData.alt = alt?.trim() || null;
  if (order !== undefined) updateData.order = order;
  if (imageData?.base64) {
    updateData.imageBase64 = imageData.base64;
    updateData.imageMime = imageData.mime || 'image/jpeg';
  }

  const updated = await prisma.portfolioImage.update({
    where: { id },
    data: updateData,
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

  return ApiResponse.success(updated);
});

export const DELETE = withErrorHandling(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  await prisma.portfolioImage.delete({
    where: { id }
  });

  return ApiResponse.success({ message: 'Image deleted successfully' });
});