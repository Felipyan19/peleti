import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { fileToBase64AndMime, mapHeroForResponse, parseBoolean, parseDataUrl } from '@/utils/server/imageHelpers';
import { ApiResponse, withErrorHandling } from '@/utils/api/responseHelpers';
import { validateHeroQuery } from '@/utils/validation/heroValidation';
import { HeroListResponse } from '@/types/hero';

const prisma = new PrismaClient();

export const GET = withErrorHandling(async (req: NextRequest) => {
	const query = validateHeroQuery(req.nextUrl.searchParams);
	const { page, limit, includeBase64, published } = query;
	
	const skip = (page - 1) * limit;
	
	const where = published !== undefined ? { published } : {};
	
	const [heroes, total] = await Promise.all([
		prisma.hero.findMany({
			where,
			orderBy: { createdAt: 'desc' },
			skip,
			take: limit,
		}),
		prisma.hero.count({ where }),
	]);
	
	const mapped = heroes.map((h) => mapHeroForResponse(h, { includeBase64 }));
	
	const response: HeroListResponse = {
		heroes: mapped,
		total,
		page,
		limit,
	};
	
	return ApiResponse.success(response);
});

export async function POST(req: NextRequest) {
	try {
		const contentType = req.headers.get('content-type') || '';
		let title: string | null = null;
		let description: string | null = null;
		let buttonText: string | null = null;
		let metaTitle: string | null = null;
		let metaDescription: string | null = null;
		let publishedVal: boolean | undefined = undefined;
		let main: { base64: string | null; mime: string | null } = { base64: null, mime: null };
		let og: { base64: string | null; mime: string | null } = { base64: null, mime: null };

		if (contentType.includes('multipart/form-data')) {
			const form = await req.formData();
			title = (form.get('title') as string) ?? null;
			description = (form.get('description') as string) ?? null;
			buttonText = (form.get('buttonText') as string) ?? null;
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
			const { title: t, description: d, buttonText: bt, imageBase64, imageMime, metaTitle: mt, metaDescription: md, ogImageBase64, ogImageMime, published } = body ?? {};
			title = t ?? null;
			description = d ?? null;
			buttonText = bt ?? null;
			metaTitle = mt ?? null;
			metaDescription = md ?? null;
			publishedVal = typeof published === 'boolean' ? published : parseBoolean(published);

			const parsedMain = parseDataUrl(imageBase64);
			main = { base64: parsedMain.base64, mime: parsedMain.mime ?? (imageMime ?? null) };
			const parsedOg = parseDataUrl(ogImageBase64);
			og = { base64: parsedOg.base64, mime: parsedOg.mime ?? (ogImageMime ?? null) };
		}

		if (!title || !description) {
			return NextResponse.json({ error: 'title and description are required' }, { status: 400 });
		}

		const created = await prisma.hero.create({
			data: {
				title,
				description,
				buttonText: buttonText ?? null,
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
		return NextResponse.json(mapHeroForResponse(created, { includeBase64 }), { status: 201 });
	} catch (err) {
		console.error(err);
		return NextResponse.json({ error: 'Server error' }, { status: 500 });
	}
}
