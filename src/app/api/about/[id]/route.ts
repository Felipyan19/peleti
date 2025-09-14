import { NextRequest } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { fileToBase64AndMime, mapAboutForResponse, parseDataUrl, parseBoolean } from '@/utils/server/imageHelpers';
import { ApiResponse, withErrorHandling } from '@/utils/api/responseHelpers';
import { validateAboutUpdate, validateAboutParams } from '@/utils/validation/aboutValidation';

const prisma = new PrismaClient();

export const GET = withErrorHandling(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
	const { id } = await validateAboutParams(params);
	const includeBase64 = req.nextUrl.searchParams.get('includeBase64') === 'true';
	
	const about = await prisma.about.findUnique({ where: { id } });
	if (!about) {
		throw ApiResponse.notFound('About not found');
	}
	
	const response = mapAboutForResponse(about, { includeBase64 });
	return ApiResponse.success(response);
});

export const PUT = withErrorHandling(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
	const { id } = await validateAboutParams(params);
	const contentType = req.headers.get('content-type') || '';
	let aboutData: Record<string, unknown> = {};

	// Check if about exists
	const existingAbout = await prisma.about.findUnique({ where: { id } });
	if (!existingAbout) {
		throw ApiResponse.notFound('About not found');
	}

	if (contentType.includes('multipart/form-data')) {
		const form = await req.formData();

		const getStr = (name: string) => {
			const value = form.get(name);
			return typeof value === 'string' && value.trim().length > 0 ? value : undefined;
		};

		const getArray = (name: string) => {
			const value = form.get(name);
			if (typeof value === 'string' && value.trim().length > 0) {
				try {
					return JSON.parse(value);
				} catch {
					return undefined;
				}
			}
			return undefined;
		};

		aboutData = {
			title: getStr('title'),
			paragraphs: getArray('paragraphs'),
			metaTitle: getStr('metaTitle'),
			metaDescription: getStr('metaDescription'),
			published: parseBoolean(form.get('published')),
		};

		// Handle image files
		const imageFile = form.get('image') as File | null;
		const ogImageFile = form.get('ogImage') as File | null;

		if (imageFile instanceof File) {
			const main = await fileToBase64AndMime(imageFile);
			aboutData.imageBase64 = main.base64 ?? undefined;
			aboutData.imageMime = main.mime ?? undefined;
		} else {
			const imageBase64 = form.get('imageBase64') as string | null;
			if (typeof imageBase64 === 'string' && imageBase64.trim().length > 0) {
				const parsed = parseDataUrl(imageBase64);
				aboutData.imageBase64 = parsed.base64 ?? undefined;
				aboutData.imageMime = parsed.mime ?? undefined;
			}
		}

		if (ogImageFile instanceof File) {
			const og = await fileToBase64AndMime(ogImageFile);
			aboutData.ogImageBase64 = og.base64 ?? undefined;
			aboutData.ogImageMime = og.mime ?? undefined;
		} else {
			const ogImageBase64 = form.get('ogImageBase64') as string | null;
			if (typeof ogImageBase64 === 'string' && ogImageBase64.trim().length > 0) {
				const parsed = parseDataUrl(ogImageBase64);
				aboutData.ogImageBase64 = parsed.base64 ?? undefined;
				aboutData.ogImageMime = parsed.mime ?? undefined;
			}
		}
	} else {
		const body = await req.json();
		const { imageBase64, imageMime, ogImageBase64, ogImageMime, ...rest } = body;
		
		aboutData = {
			...rest,
			imageBase64: imageBase64 ? parseDataUrl(imageBase64).base64 : undefined,
			imageMime: imageBase64 ? (parseDataUrl(imageBase64).mime ?? imageMime) : undefined,
			ogImageBase64: ogImageBase64 ? parseDataUrl(ogImageBase64).base64 : undefined,
			ogImageMime: ogImageBase64 ? (parseDataUrl(ogImageBase64).mime ?? ogImageMime) : undefined,
		};
	}

	// Validate the data
	const validatedData = validateAboutUpdate(aboutData);

	// Only update fields that are provided
	const updateData: Record<string, unknown> = {};
	Object.keys(validatedData).forEach(key => {
		if (validatedData[key as keyof typeof validatedData] !== undefined) {
			updateData[key] = validatedData[key as keyof typeof validatedData];
		}
	});

	const updated = await prisma.about.update({
		where: { id },
		data: updateData,
	});

	const includeBase64 = req.nextUrl.searchParams.get('includeBase64') === 'true';
	const response = mapAboutForResponse(updated, { includeBase64 });
	
	return ApiResponse.success(response);
});

export const DELETE = withErrorHandling(async (_: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
	const { id } = await validateAboutParams(params);
	
	// Check if about exists
	const existingAbout = await prisma.about.findUnique({ where: { id } });
	if (!existingAbout) {
		throw ApiResponse.notFound('About not found');
	}
	
	await prisma.about.delete({ where: { id } });
	return ApiResponse.noContent();
});
