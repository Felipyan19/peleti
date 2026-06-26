import { NextRequest } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { fileToBase64AndMime, mapAboutForResponse, parseBoolean, parseDataUrl } from '@/utils/server/imageHelpers';
import { ApiResponse, withErrorHandling } from '@/utils/api/responseHelpers';
import { withAuthProtection } from '@/utils/api/authHelpers';
import { validateAboutQuery } from '@/utils/validation/aboutValidation';
import { AboutListResponse } from '@/types/about';

const prisma = new PrismaClient();

export const GET = withErrorHandling(async (req: NextRequest) => {
	const query = validateAboutQuery(req.nextUrl.searchParams);
	const { page, limit, includeBase64, published } = query;
	
	const skip = (page - 1) * limit;
	
	const where = published !== undefined ? { published } : {};
	
	const [abouts, total] = await Promise.all([
		prisma.about.findMany({
			where,
			orderBy: { createdAt: 'desc' },
			skip,
			take: limit,
		}),
		prisma.about.count({ where }),
	]);
	
	const mapped = abouts.map((a) => mapAboutForResponse(a, { includeBase64 }));
	
	const response: AboutListResponse = {
		abouts: mapped,
		total,
		page,
		limit,
	};
	
	return ApiResponse.success(response);
});

export const POST = withErrorHandling(withAuthProtection(async (req: NextRequest) => {
	const contentType = req.headers.get('content-type') || '';
	let title: string | null = null;
	let paragraphs: string[] = [];
	let metaTitle: string | null = null;
	let metaDescription: string | null = null;
	let publishedVal: boolean | undefined = undefined;
	let main: { base64: string | null; mime: string | null } = { base64: null, mime: null };
	let og: { base64: string | null; mime: string | null } = { base64: null, mime: null };

	if (contentType.includes('multipart/form-data')) {
		const form = await req.formData();
		title = (form.get('title') as string) ?? null;
		const paragraphsStr = (form.get('paragraphs') as string) ?? null;
		
		// Handle paragraphs parsing with proper validation
		if (paragraphsStr) {
			try {
				const parsed = JSON.parse(paragraphsStr);
				paragraphs = Array.isArray(parsed) ? parsed : [];
			} catch {
				// If JSON parsing fails, treat as a single paragraph
				paragraphs = [paragraphsStr];
			}
		} else {
			paragraphs = [];
		}
		
		metaTitle = (form.get('metaTitle') as string) ?? null;
		metaDescription = (form.get('metaDescription') as string) ?? null;
		publishedVal = parseBoolean(form.get('published'));

		const imageFile = form.get('image') as File | null;
		const ogImageFile = form.get('ogImage') as File | null;

		if (imageFile instanceof File) {
			main = await fileToBase64AndMime(imageFile);
		} else {
			const imageBase64 = (form.get('imageBase64') as string) ?? null;
			const parsed = parseDataUrl(imageBase64);
			main = { base64: parsed.base64, mime: parsed.mime };
		}

		if (ogImageFile instanceof File) {
			og = await fileToBase64AndMime(ogImageFile);
		} else {
			const ogImageBase64 = (form.get('ogImageBase64') as string) ?? null;
			const parsed = parseDataUrl(ogImageBase64);
			og = { base64: parsed.base64, mime: parsed.mime };
		}
	} else {
		const body = await req.json();
		const { title: t, paragraphs: p, imageBase64, imageMime, metaTitle: mt, metaDescription: md, ogImageBase64, ogImageMime, published } = body ?? {};
		title = t ?? null;
		paragraphs = Array.isArray(p) ? p : [];
		metaTitle = mt ?? null;
		metaDescription = md ?? null;
		publishedVal = typeof published === 'boolean' ? published : parseBoolean(published);

		const parsedMain = parseDataUrl(imageBase64);
		main = { base64: parsedMain.base64, mime: parsedMain.mime ?? (imageMime ?? null) };
		const parsedOg = parseDataUrl(ogImageBase64);
		og = { base64: parsedOg.base64, mime: parsedOg.mime ?? (ogImageMime ?? null) };
	}

	if (!title || paragraphs.length === 0) {
		throw ApiResponse.badRequest('title and paragraphs are required');
	}

	const created = await prisma.about.create({
		data: {
			title,
			paragraphs,
			imageBase64: main.base64 ?? null,
			imageMime: main.mime ?? null,
			metaTitle: metaTitle ?? null,
			metaDescription: metaDescription ?? null,
			ogImageBase64: og.base64 ?? null,
			ogImageMime: og.mime ?? null,
			published: publishedVal ?? true,
		},
	});

	const includeBase64 = req.nextUrl.searchParams.get('includeBase64') === 'true';
	return ApiResponse.created(mapAboutForResponse(created, { includeBase64 }));
}));
