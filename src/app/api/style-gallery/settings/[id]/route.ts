import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { mapStyleGallerySettingsForResponse } from '@/utils/server/imageHelpers';
import { ApiResponse, withErrorHandling } from '@/utils/api/responseHelpers';
import { validateStyleGallerySettingsParams, validateStyleGallerySettingsUpdate } from '@/utils/validation/styleGalleryValidation';

const prisma = new PrismaClient();

export const GET = withErrorHandling(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
	const { id } = await validateStyleGallerySettingsParams(params);
	
	const settings = await prisma.styleGallerySettings.findUnique({ where: { id } });
	if (!settings) {
		throw ApiResponse.notFound('StyleGallery settings not found');
	}
	
	const response = mapStyleGallerySettingsForResponse(settings);
	return ApiResponse.success(response);
});

export const PUT = withErrorHandling(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
	const { id } = await validateStyleGallerySettingsParams(params);
	const body = await req.json();
	
	// Check if settings exists
	const existingSettings = await prisma.styleGallerySettings.findUnique({ where: { id } });
	if (!existingSettings) {
		throw ApiResponse.notFound('StyleGallery settings not found');
	}

	// Validate the data
	const validatedData = validateStyleGallerySettingsUpdate(body);

	// Only update fields that are provided
	const updateData: Record<string, unknown> = {};
	Object.keys(validatedData).forEach(key => {
		if (validatedData[key as keyof typeof validatedData] !== undefined) {
			updateData[key] = validatedData[key as keyof typeof validatedData];
		}
	});

	const updated = await prisma.styleGallerySettings.update({
		where: { id },
		data: updateData,
	});

	const response = mapStyleGallerySettingsForResponse(updated);
	
	return ApiResponse.success(response);
});

export const DELETE = withErrorHandling(async (_: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
	const { id } = await validateStyleGallerySettingsParams(params);
	
	// Check if settings exists
	const existingSettings = await prisma.styleGallerySettings.findUnique({ where: { id } });
	if (!existingSettings) {
		throw ApiResponse.notFound('StyleGallery settings not found');
	}
	
	await prisma.styleGallerySettings.delete({ where: { id } });
	return ApiResponse.noContent();
});
