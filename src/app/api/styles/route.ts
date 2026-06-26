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

export const GET = withErrorHandling(async (req: NextRequest) => {
  const { searchParams } = req.nextUrl;
  const category = searchParams.get('category') as 'NATURAL' | 'MODERN' | 'CLASSIC' | 'HISTORIC' | null;
  const published = searchParams.get('published');
  const includeBase64 = searchParams.get('includeBase64') === 'true';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);

  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (category) where.category = category;
  if (published !== null) where.published = published === 'true';

  const [styles, total] = await Promise.all([
    prisma.style.findMany({
      where,
      orderBy: { order: 'asc' },
      skip,
      take: limit
    }),
    prisma.style.count({ where })
  ]);

  // Filter base64 data if not requested
  const filteredStyles = styles.map(style => ({
    ...style,
    ...(includeBase64 ? {} : {
      imageBase64: undefined,
      ogImageBase64: undefined
    })
  }));

  return ApiResponse.success({
    styles: filteredStyles,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  });
});

export const POST = withErrorHandling(async (req: NextRequest) => {
  const contentType = req.headers.get('content-type') || '';

  let name: string;
  let slug: string | undefined;
  let description: string;
  let category: 'NATURAL' | 'MODERN' | 'CLASSIC' | 'HISTORIC' | null = null;
  let techniques: string[] = [];
  let order: number = 0;
  let published: boolean = true;
  let metaTitle: string | null = null;
  let metaDescription: string | null = null;
  let mainImage: { base64: string | null; mime: string | null } = { base64: null, mime: null };
  let ogImage: { base64: string | null; mime: string | null } = { base64: null, mime: null };

  if (contentType.includes('multipart/form-data')) {
    const form = await req.formData();
    name = form.get('name') as string;
    slug = (form.get('slug') as string) || undefined;
    description = form.get('description') as string;
    category = (form.get('category') as 'NATURAL' | 'MODERN' | 'CLASSIC' | 'HISTORIC') || null;

    const techniquesStr = form.get('techniques') as string;
    if (techniquesStr) {
      try {
        techniques = JSON.parse(techniquesStr);
      } catch {
        techniques = [techniquesStr];
      }
    }

    order = parseInt((form.get('order') as string) || '0');
    published = (form.get('published') as string) !== 'false';
    metaTitle = (form.get('metaTitle') as string) || null;
    metaDescription = (form.get('metaDescription') as string) || null;

    const imageFile = form.get('image') as File | null;
    const ogImageFile = form.get('ogImage') as File | null;

    if (imageFile instanceof File) {
      mainImage = await fileToBase64AndMime(imageFile);
    } else {
      const imageBase64 = (form.get('imageBase64') as string) || null;
      const parsed = parseDataUrl(imageBase64);
      mainImage = { base64: parsed.base64, mime: parsed.mime };
    }

    if (ogImageFile instanceof File) {
      ogImage = await fileToBase64AndMime(ogImageFile);
    } else {
      const ogImageBase64 = (form.get('ogImageBase64') as string) || null;
      const parsed = parseDataUrl(ogImageBase64);
      ogImage = { base64: parsed.base64, mime: parsed.mime };
    }
  } else {
    const body = await req.json();
    const {
      name: n,
      slug: s,
      description: d,
      category: c,
      techniques: t,
      order: o,
      published: p,
      metaTitle: mt,
      metaDescription: md,
      imageBase64,
      imageMime,
      ogImageBase64,
      ogImageMime
    } = body;

    name = n;
    slug = s;
    description = d;
    category = c || null;
    techniques = Array.isArray(t) ? t : [];
    order = o || 0;
    published = p !== false;
    metaTitle = mt || null;
    metaDescription = md || null;

    const parsedMain = parseDataUrl(imageBase64);
    mainImage = { base64: parsedMain.base64, mime: parsedMain.mime || imageMime || null };

    const parsedOg = parseDataUrl(ogImageBase64);
    ogImage = { base64: parsedOg.base64, mime: parsedOg.mime || ogImageMime || null };
  }

  if (!name || !description) {
    return ApiResponse.badRequest('Name and description are required');
  }

  const generatedSlug = slug || createSlug(name);

  // Check if slug already exists
  const existing = await prisma.style.findUnique({
    where: { slug: generatedSlug }
  });

  if (existing) {
    return ApiResponse.badRequest('Style with this slug already exists');
  }

  const created = await prisma.style.create({
    data: {
      name: name.trim(),
      slug: generatedSlug,
      description: description.trim(),
      category,
      imageBase64: mainImage.base64,
      imageMime: mainImage.mime,
      techniques,
      order,
      published,
      metaTitle: metaTitle?.trim() || null,
      metaDescription: metaDescription?.trim() || null,
      ogImageBase64: ogImage.base64,
      ogImageMime: ogImage.mime
    }
  });

  // Filter base64 data from response
  const { imageBase64: _imageBase64, ogImageBase64: _ogImageBase64, ...response } = created;

  return ApiResponse.created(response);
});