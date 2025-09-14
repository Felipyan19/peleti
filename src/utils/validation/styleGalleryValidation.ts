import { z } from 'zod';
import { ApiResponse } from '@/utils/api/responseHelpers';

// StyleGallery Style validation schemas
const styleGalleryStyleQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  published: z.coerce.boolean().optional(),
});

const styleGalleryStyleParamsSchema = z.object({
  id: z.string().uuid('Invalid style ID format'),
});

const styleGalleryStyleCreateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description too long'),
  icon: z.string().max(100, 'Icon too long').optional(),
  techniques: z.array(z.string().min(1, 'Technique cannot be empty')).min(1, 'At least one technique is required'),
  examples: z.string().max(500, 'Examples too long').optional(),
  order: z.number().int().min(0).optional().default(0),
  published: z.boolean().optional().default(true),
});

const styleGalleryStyleUpdateSchema = styleGalleryStyleCreateSchema.partial();

// StyleGallery Settings validation schemas
const styleGallerySettingsParamsSchema = z.object({
  id: z.string().uuid('Invalid settings ID format'),
});

const styleGallerySettingsCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title too long'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description too long'),
});

const styleGallerySettingsUpdateSchema = styleGallerySettingsCreateSchema.partial();

// StyleGallery Style validation functions
export function validateStyleGalleryStyleQuery(searchParams: URLSearchParams) {
  try {
    return styleGalleryStyleQuerySchema.parse({
      page: searchParams.get('page') ?? undefined,
      limit: searchParams.get('limit') ?? undefined,
      published: searchParams.get('published') ?? undefined,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw ApiResponse.badRequest('Invalid query parameters', { issues: error.issues as unknown });
    }
    throw error;
  }
}

export function validateStyleGalleryStyleParams(params: Promise<{ id: string }>) {
  return styleGalleryStyleParamsSchema.parseAsync(params);
}

export function validateStyleGalleryStyleCreate(data: unknown) {
  try {
    return styleGalleryStyleCreateSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw ApiResponse.badRequest('Invalid style data', { issues: error.issues as unknown });
    }
    throw error;
  }
}

export function validateStyleGalleryStyleUpdate(data: unknown) {
  try {
    return styleGalleryStyleUpdateSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw ApiResponse.badRequest('Invalid style update data', { issues: error.issues as unknown });
    }
    throw error;
  }
}

// StyleGallery Settings validation functions
export function validateStyleGallerySettingsParams(params: Promise<{ id: string }>) {
  return styleGallerySettingsParamsSchema.parseAsync(params);
}

export function validateStyleGallerySettingsCreate(data: unknown) {
  try {
    return styleGallerySettingsCreateSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw ApiResponse.badRequest('Invalid settings data', { issues: error.issues as unknown });
    }
    throw error;
  }
}

export function validateStyleGallerySettingsUpdate(data: unknown) {
  try {
    return styleGallerySettingsUpdateSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw ApiResponse.badRequest('Invalid settings update data', { issues: error.issues as unknown });
    }
    throw error;
  }
}
