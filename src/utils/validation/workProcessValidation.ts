import { z } from 'zod';

// WorkProcessSettings validation schemas
export const workProcessSettingsCreateSchema = z.object({
  title: z.string().min(1, 'El título es requerido').max(255, 'El título es demasiado largo'),
  description: z.string().min(1, 'La descripción es requerida').max(1000, 'La descripción es demasiado larga'),
  stepLabel: z.string().max(100, 'La etiqueta de paso es demasiado larga').optional(),
});

export const workProcessSettingsUpdateSchema = z.object({
  title: z.string().min(1, 'El título es requerido').max(255, 'El título es demasiado largo').optional(),
  description: z.string().min(1, 'La descripción es requerida').max(1000, 'La descripción es demasiado larga').optional(),
  stepLabel: z.string().max(100, 'La etiqueta de paso es demasiado larga').optional(),
});

// WorkStep validation schemas
export const workStepCreateSchema = z.object({
  title: z.string().min(1, 'El título es requerido').max(255, 'El título es demasiado largo'),
  description: z.string().min(1, 'La descripción es requerida').max(1000, 'La descripción es demasiado larga'),
  icon: z.string().max(100, 'El icono es demasiado largo').optional(),
  order: z.number().int().min(0, 'El orden debe ser mayor o igual a 0').optional(),
  published: z.boolean().optional(),
});

export const workStepUpdateSchema = z.object({
  title: z.string().min(1, 'El título es requerido').max(255, 'El título es demasiado largo').optional(),
  description: z.string().min(1, 'La descripción es requerida').max(1000, 'La descripción es demasiado larga').optional(),
  icon: z.string().max(100, 'El icono es demasiado largo').optional(),
  order: z.number().int().min(0, 'El orden debe ser mayor o igual a 0').optional(),
  published: z.boolean().optional(),
});

// Query parameter validation
export const workStepQuerySchema = z.object({
  published: z.string().optional().transform((val) => val === 'true' ? true : val === 'false' ? false : undefined),
  order: z.string().optional().transform((val) => val ? parseInt(val, 10) : undefined),
});

export type WorkProcessSettingsCreateInput = z.infer<typeof workProcessSettingsCreateSchema>;
export type WorkProcessSettingsUpdateInput = z.infer<typeof workProcessSettingsUpdateSchema>;
export type WorkStepCreateInput = z.infer<typeof workStepCreateSchema>;
export type WorkStepUpdateInput = z.infer<typeof workStepUpdateSchema>;
export type WorkStepQueryInput = z.infer<typeof workStepQuerySchema>;
