import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

function parseDataUrl(data: string | null | undefined): { base64: string | null; mime: string | null } {
	if (!data || typeof data !== 'string') return { base64: null, mime: null };
	const match = data.match(/^data:(.+);base64,(.+)$/);
	if (match) {
		return { mime: match[1] || null, base64: match[2] || null };
	}
	return { base64: data, mime: null };
}

export async function GET() {
	const heroes = await prisma.hero.findMany({ orderBy: { createdAt: 'desc' } });
	return NextResponse.json(heroes);
}

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { title, description, buttonText, imageBase64, imageMime, metaTitle, metaDescription, ogImageBase64, ogImageMime, published } = body ?? {};

		if (!title || !description) {
			return NextResponse.json({ error: 'title and description are required' }, { status: 400 });
		}

		const mainImage = parseDataUrl(imageBase64);
		const ogImage = parseDataUrl(ogImageBase64);

		const created = await prisma.hero.create({
			data: {
				title,
				description,
				buttonText: buttonText ?? null,
				imageBase64: mainImage.base64 ?? null,
				imageMime: (mainImage.mime ?? imageMime) ?? null,
				metaTitle: metaTitle ?? null,
				metaDescription: metaDescription ?? null,
				ogImageBase64: ogImage.base64 ?? null,
				ogImageMime: (ogImage.mime ?? ogImageMime) ?? null,
				published: typeof published === 'boolean' ? published : true,
			},
		});

		return NextResponse.json(created, { status: 201 });
	} catch (err) {
		console.error(err);
		return NextResponse.json({ error: 'Server error' }, { status: 500 });
	}
}
