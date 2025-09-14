import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { mapStyleGallerySettingsForResponse } from '@/utils/server/imageHelpers';
import { ApiResponse, withErrorHandling } from '@/utils/api/responseHelpers';
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

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { title, description } = body ?? {};

		if (!title || !description) {
			return NextResponse.json({ error: 'title and description are required' }, { status: 400 });
		}

		// Validate the data
		const validatedData = validateStyleGallerySettingsCreate({
			title,
			description,
		});

		// Check if settings already exist
		const existingSettings = await prisma.styleGallerySettings.findFirst();
		if (existingSettings) {
			return NextResponse.json({ error: 'StyleGallery settings already exist. Use PUT to update.' }, { status: 409 });
		}

		const created = await prisma.styleGallerySettings.create({
			data: {
				title: validatedData.title,
				description: validatedData.description,
			},
		});

		return NextResponse.json(mapStyleGallerySettingsForResponse(created), { status: 201 });
	} catch (err) {
		console.error(err);
		return NextResponse.json({ error: 'Server error' }, { status: 500 });
	}
}
