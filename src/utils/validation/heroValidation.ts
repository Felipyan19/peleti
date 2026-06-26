import { z } from 'zod';

// Hero validation schemas
export const heroCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description must be less than 1000 characters'),
  buttonText: z.string().max(100, 'Button text must be less than 100 characters').optional(),
  metaTitle: z.string().max(200, 'Meta title must be less than 200 characters').optional(),
  metaDescription: z.string().max(300, 'Meta description must be less than 300 characters').optional(),
  imageBase64: z.string().optional(),
  imageMime: z.string().optional(),
  ogImageBase64: z.string().optional(),
  ogImageMime: z.string().optional(),
  published: z.boolean().optional().default(true),
});

export const heroUpdateSchema = heroCreateSchema.partial();

export const heroQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform((val: string) => Number(val)).optional().default(1),
  limit: z.string().regex(/^\d+$/).transform((val: string) => Number(val)).optional().default(10),
  includeBase64: z.string().transform((val: string) => val === 'true').optional().default(false),
  published: z.string().transform((val: string) => val === 'true').optional(),
});

export const heroParamsSchema = z.object({
  id: z.string().uuid('Invalid hero ID format'),
});

// Validation helper functions
export function validateHeroCreate(data: unknown) {
  return heroCreateSchema.parse(data);
}

export function validateHeroUpdate(data: unknown) {
  return heroUpdateSchema.parse(data);
}

export function validateHeroQuery(searchParams: URLSearchParams) {
  const query = Object.fromEntries(searchParams.entries());
  return heroQuerySchema.parse(query);
}

export async function validateHeroParams(params: Promise<{ id: string }>) {
  const resolvedParams = await params;
  return heroParamsSchema.parse(resolvedParams);
}
