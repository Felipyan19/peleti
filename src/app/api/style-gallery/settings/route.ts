import { NextRequest } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { mapStyleGallerySettingsForResponse } from '@/utils/server/imageHelpers';
import { ApiResponse, withErrorHandling } from '@/utils/api/responseHelpers';
import { withAuthProtection } from '@/utils/api/authHelpers';
import { validateStyleGallerySettingsCreate } from '@/utils/validation/styleGalleryValidation';

const prisma = new PrismaClient();

export const GET = withErrorHandling(async () => {
	// Get the first (and only) settings record
	const settings = await prisma.styleGallerySettings.findFirst({
		orderBy: { createdAt: 'desc' },
	});
	
	if (!settings) {
		throw ApiResponse.notFound('StyleGallery settings not found');
	}
	
	const response = mapStyleGallerySettingsForResponse(settings);
	return ApiResponse.success(response);
});

export const POST = withErrorHandling(withAuthProtection(async (req: NextRequest) => {
	const body = await req.json();
	const { title, description } = body ?? {};

	if (!title || !description) {
		throw ApiResponse.badRequest('title and description are required');
	}

	// Validate the data
	const validatedData = validateStyleGallerySettingsCreate({
		title,
		description,
	});

	// Check if settings already exist
	const existingSettings = await prisma.styleGallerySettings.findFirst();
	if (existingSettings) {
		throw ApiResponse.conflict('StyleGallery settings already exist. Use PUT to update.');
	}

	const created = await prisma.styleGallerySettings.create({
		data: {
			title: validatedData.title,
			description: validatedData.description,
		},
	});

	return ApiResponse.created(mapStyleGallerySettingsForResponse(created));
}));
