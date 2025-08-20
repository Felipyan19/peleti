import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { fileToBase64AndMime, mapHeroForResponse, parseBoolean, parseDataUrl } from '@/utils/server/imageHelpers';

const prisma = new PrismaClient();

 

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
	const includeBase64 = req.nextUrl.searchParams.get('includeBase64') === 'true';
	const hero = await prisma.hero.findUnique({ where: { id: params.id } });
	if (!hero) return NextResponse.json({ error: 'Not found' }, { status: 404 });
	return NextResponse.json(mapHeroForResponse(hero, { includeBase64 }));
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
	try {
		const contentType = req.headers.get('content-type') || '';
		let title: string | undefined;
		let description: string | undefined;
		let buttonText: string | undefined;
		let metaTitle: string | undefined;
		let metaDescription: string | undefined;
		let publishedVal: boolean | undefined = undefined;
		let main: { base64: string | null; mime: string | null } = { base64: null, mime: null };
		let og: { base64: string | null; mime: string | null } = { base64: null, mime: null };

		if (contentType.includes('multipart/form-data')) {
			const form = await req.formData();
			title = (form.get('title') as string) ?? undefined;
			description = (form.get('description') as string) ?? undefined;
			buttonText = (form.get('buttonText') as string) ?? undefined;
			metaTitle = (form.get('metaTitle') as string) ?? undefined;
			metaDescription = (form.get('metaDescription') as string) ?? undefined;
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
			title = t;
			description = d;
			buttonText = bt;
			metaTitle = mt;
			metaDescription = md;
			publishedVal = typeof published === 'boolean' ? published : parseBoolean(published);

			const parsedMain = parseDataUrl(imageBase64);
			main = { base64: parsedMain.base64, mime: parsedMain.mime ?? (imageMime ?? null) };
			const parsedOg = parseDataUrl(ogImageBase64);
			og = { base64: parsedOg.base64, mime: parsedOg.mime ?? (ogImageMime ?? null) };
		}

		const updated = await prisma.hero.update({
			where: { id: params.id },
			data: {
				title,
				description,
				buttonText,
				imageBase64: main.base64 ?? undefined,
				imageMime: main.mime ?? undefined,
				metaTitle,
				metaDescription,
				ogImageBase64: og.base64 ?? undefined,
				ogImageMime: og.mime ?? undefined,
				published: publishedVal,
			},
		});
		const includeBase64 = req.nextUrl.searchParams.get('includeBase64') === 'true';
		return NextResponse.json(mapHeroForResponse(updated, { includeBase64 }));
	} catch (err) {
		console.error(err);
		return NextResponse.json({ error: 'Server error' }, { status: 500 });
	}
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
	try {
		await prisma.hero.delete({ where: { id: params.id } });
		return NextResponse.json({ ok: true });
	} catch (err) {
		return NextResponse.json({ error: 'Not found' }, { status: 404 });
	}
}

export async function GET_IMAGE(_: NextRequest, { params }: { params: { id: string } }) {
	const hero = await prisma.hero.findUnique({ where: { id: params.id } });
	if (!hero || !hero.imageBase64 || !hero.imageMime) return NextResponse.json({ error: 'Not found' }, { status: 404 });
	const bytes = Buffer.from(hero.imageBase64, 'base64');
	return new NextResponse(bytes, { headers: { 'Content-Type': hero.imageMime, 'Cache-Control': 'public, max-age=3600, immutable' } });
}

export async function GET_OG_IMAGE(_: NextRequest, { params }: { params: { id: string } }) {
	const hero = await prisma.hero.findUnique({ where: { id: params.id } });
	if (!hero || !hero.ogImageBase64 || !hero.ogImageMime) return NextResponse.json({ error: 'Not found' }, { status: 404 });
	const bytes = Buffer.from(hero.ogImageBase64, 'base64');
	return new NextResponse(bytes, { headers: { 'Content-Type': hero.ogImageMime, 'Cache-Control': 'public, max-age=3600, immutable' } });
}
