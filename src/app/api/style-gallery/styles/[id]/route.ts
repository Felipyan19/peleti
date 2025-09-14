import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { mapStyleGalleryStyleForResponse } from '@/utils/server/imageHelpers';
import { ApiResponse, withErrorHandling } from '@/utils/api/responseHelpers';
import { validateStyleGalleryStyleParams, validateStyleGalleryStyleUpdate } from '@/utils/validation/styleGalleryValidation';

const prisma = new PrismaClient();

export const GET = withErrorHandling(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
	const { id } = await validateStyleGalleryStyleParams(params);
	
	const style = await prisma.styleGalleryStyle.findUnique({ where: { id } });
	if (!style) {
		throw ApiResponse.notFound('Style not found');
	}
	
	const response = mapStyleGalleryStyleForResponse(style);
	return ApiResponse.success(response);
});

export const PUT = withErrorHandling(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
	const { id } = await validateStyleGalleryStyleParams(params);
	const body = await req.json();
	
	// Check if style exists
	const existingStyle = await prisma.styleGalleryStyle.findUnique({ where: { id } });
	if (!existingStyle) {
		throw ApiResponse.notFound('Style not found');
	}

	// Validate the data
	const validatedData = validateStyleGalleryStyleUpdate(body);

	// Only update fields that are provided
	const updateData: Record<string, unknown> = {};
	Object.keys(validatedData).forEach(key => {
		if (validatedData[key as keyof typeof validatedData] !== undefined) {
			updateData[key] = validatedData[key as keyof typeof validatedData];
		}
	});

	const updated = await prisma.styleGalleryStyle.update({
		where: { id },
		data: updateData,
	});

	const response = mapStyleGalleryStyleForResponse(updated);
	
	return ApiResponse.success(response);
});

export const DELETE = withErrorHandling(async (_: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
	const { id } = await validateStyleGalleryStyleParams(params);
	
	// Check if style exists
	const existingStyle = await prisma.styleGalleryStyle.findUnique({ where: { id } });
	if (!existingStyle) {
		throw ApiResponse.notFound('Style not found');
	}
	
	await prisma.styleGalleryStyle.delete({ where: { id } });
	return ApiResponse.noContent();
});
