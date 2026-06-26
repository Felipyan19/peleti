import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { fileToBase64AndMime, mapHeroForResponse, parseDataUrl, parseBoolean } from '@/utils/server/imageHelpers';
import { ApiResponse, withErrorHandling } from '@/utils/api/responseHelpers';
import { withAuthProtection } from '@/utils/api/authHelpers';
import { validateHeroUpdate, validateHeroParams } from '@/utils/validation/heroValidation';

const prisma = new PrismaClient();

 

export const GET = withErrorHandling(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
	const { id } = await validateHeroParams(params);
	const includeBase64 = req.nextUrl.searchParams.get('includeBase64') === 'true';
	
	const hero = await prisma.hero.findUnique({ where: { id } });
	if (!hero) {
		throw ApiResponse.notFound('Hero not found');
	}
	
	const response = mapHeroForResponse(hero, { includeBase64 });
	return ApiResponse.success(response);
});

export const PUT = withErrorHandling(withAuthProtection(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
	const { id } = await validateHeroParams(params);
	const contentType = req.headers.get('content-type') || '';
	let heroData: Record<string, unknown> = {};

	// Check if hero exists
	const existingHero = await prisma.hero.findUnique({ where: { id } });
	if (!existingHero) {
		throw ApiResponse.notFound('Hero not found');
	}

	if (contentType.includes('multipart/form-data')) {
		const form = await req.formData();

		const getStr = (name: string) => {
			const value = form.get(name);
			return typeof value === 'string' && value.trim().length > 0 ? value : undefined;
		};

		heroData = {
			title: getStr('title'),
			description: getStr('description'),
			buttonText: getStr('buttonText'),
			metaTitle: getStr('metaTitle'),
			metaDescription: getStr('metaDescription'),
			published: parseBoolean(form.get('published')),
		};

		// Handle image files
		const imageFile = form.get('image') as File | null;
		const ogImageFile = form.get('ogImage') as File | null;

		if (imageFile instanceof File) {
			const main = await fileToBase64AndMime(imageFile);
			heroData.imageBase64 = main.base64 ?? undefined;
			heroData.imageMime = main.mime ?? undefined;
		} else {
			const imageBase64 = form.get('imageBase64') as string | null;
			if (typeof imageBase64 === 'string' && imageBase64.trim().length > 0) {
				const parsed = parseDataUrl(imageBase64);
				heroData.imageBase64 = parsed.base64 ?? undefined;
				heroData.imageMime = parsed.mime ?? undefined;
			}
		}

		if (ogImageFile instanceof File) {
			const og = await fileToBase64AndMime(ogImageFile);
			heroData.ogImageBase64 = og.base64 ?? undefined;
			heroData.ogImageMime = og.mime ?? undefined;
		} else {
			const ogImageBase64 = form.get('ogImageBase64') as string | null;
			if (typeof ogImageBase64 === 'string' && ogImageBase64.trim().length > 0) {
				const parsed = parseDataUrl(ogImageBase64);
				heroData.ogImageBase64 = parsed.base64 ?? undefined;
				heroData.ogImageMime = parsed.mime ?? undefined;
			}
		}
	} else {
		const body = await req.json();
		const { imageBase64, imageMime, ogImageBase64, ogImageMime, ...rest } = body;
		
		heroData = {
			...rest,
			imageBase64: imageBase64 ? parseDataUrl(imageBase64).base64 : undefined,
			imageMime: imageBase64 ? (parseDataUrl(imageBase64).mime ?? imageMime) : undefined,
			ogImageBase64: ogImageBase64 ? parseDataUrl(ogImageBase64).base64 : undefined,
			ogImageMime: ogImageBase64 ? (parseDataUrl(ogImageBase64).mime ?? ogImageMime) : undefined,
		};
	}

	// Validate the data
	const validatedData = validateHeroUpdate(heroData);

	// Only update fields that are provided
	const updateData: Record<string, unknown> = {};
	Object.keys(validatedData).forEach(key => {
		if (validatedData[key as keyof typeof validatedData] !== undefined) {
			updateData[key] = validatedData[key as keyof typeof validatedData];
		}
	});

	const updated = await prisma.hero.update({
		where: { id },
		data: updateData,
	});

	const includeBase64 = req.nextUrl.searchParams.get('includeBase64') === 'true';
	const response = mapHeroForResponse(updated, { includeBase64 });

	return ApiResponse.success(response);
}));

export const DELETE = withErrorHandling(withAuthProtection(async (_: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
	const { id } = await validateHeroParams(params);
	
	// Check if hero exists
	const existingHero = await prisma.hero.findUnique({ where: { id } });
	if (!existingHero) {
		throw ApiResponse.notFound('Hero not found');
	}
	
	await prisma.hero.delete({ where: { id } });
	return ApiResponse.noContent();
}));

export const GET_IMAGE = withErrorHandling(async (_: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
	const { id } = await validateHeroParams(params);
	
	const hero = await prisma.hero.findUnique({ where: { id } });
	if (!hero || !hero.imageBase64 || !hero.imageMime) {
		throw ApiResponse.notFound('Hero image not found');
	}
	
	const bytes = Buffer.from(hero.imageBase64, 'base64');
	return new NextResponse(bytes, { 
		headers: { 
			'Content-Type': hero.imageMime, 
			'Cache-Control': 'public, max-age=3600, immutable' 
		} 
	});
});

export const GET_OG_IMAGE = withErrorHandling(async (_: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
	const { id } = await validateHeroParams(params);
	
	const hero = await prisma.hero.findUnique({ where: { id } });
	if (!hero || !hero.ogImageBase64 || !hero.ogImageMime) {
		throw ApiResponse.notFound('Hero OG image not found');
	}
	
	const bytes = Buffer.from(hero.ogImageBase64, 'base64');
	return new NextResponse(bytes, { 
		headers: { 
			'Content-Type': hero.ogImageMime, 
			'Cache-Control': 'public, max-age=3600, immutable' 
		} 
	});
});
