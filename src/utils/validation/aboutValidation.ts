import { z } from 'zod';
import { ApiResponse } from '@/utils/api/responseHelpers';

// Validation schemas
const aboutQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  includeBase64: z.coerce.boolean().default(false),
  published: z.coerce.boolean().optional(),
});

const aboutParamsSchema = z.object({
  id: z.string().uuid('Invalid about ID format'),
});

const aboutCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title too long'),
  paragraphs: z.array(z.string().min(1, 'Paragraph cannot be empty')).min(1, 'At least one paragraph is required'),
  metaTitle: z.string().max(255, 'Meta title too long').optional(),
  metaDescription: z.string().max(500, 'Meta description too long').optional(),
  imageBase64: z.string().optional(),
  imageMime: z.string().optional(),
  ogImageBase64: z.string().optional(),
  ogImageMime: z.string().optional(),
  published: z.boolean().optional(),
});

const aboutUpdateSchema = aboutCreateSchema.partial();

// Validation functions
export function validateAboutQuery(searchParams: URLSearchParams) {
  try {
    return aboutQuerySchema.parse({
      page: searchParams.get('page') ?? undefined,
      limit: searchParams.get('limit') ?? undefined,
      includeBase64: searchParams.get('includeBase64') ?? undefined,
      published: searchParams.get('published') ?? undefined,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw ApiResponse.badRequest('Invalid query parameters', { issues: error.issues as unknown });
    }
    throw error;
  }
}

export function validateAboutParams(params: Promise<{ id: string }>) {
  return aboutParamsSchema.parseAsync(params);
}

export function validateAboutCreate(data: unknown) {
  try {
    return aboutCreateSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw ApiResponse.badRequest('Invalid about data', { issues: error.issues as unknown });
    }
    throw error;
  }
}

export function validateAboutUpdate(data: unknown) {
  try {
    return aboutUpdateSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw ApiResponse.badRequest('Invalid about update data', { issues: error.issues as unknown });
    }
    throw error;
  }
}
