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

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
	const hero = await prisma.hero.findUnique({ where: { id: params.id } });
	if (!hero) return NextResponse.json({ error: 'Not found' }, { status: 404 });
	return NextResponse.json(hero);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
	try {
		const body = await req.json();
		const { title, description, buttonText, imageBase64, imageMime, metaTitle, metaDescription, ogImageBase64, ogImageMime, published } = body ?? {};

		const mainImage = parseDataUrl(imageBase64);
		const ogImage = parseDataUrl(ogImageBase64);

		const updated = await prisma.hero.update({
			where: { id: params.id },
			data: {
				title,
				description,
				buttonText: buttonText ?? null,
				imageBase64: mainImage.base64 ?? undefined,
				imageMime: (mainImage.mime ?? imageMime) ?? undefined,
				metaTitle: metaTitle ?? null,
				metaDescription: metaDescription ?? null,
				ogImageBase64: ogImage.base64 ?? undefined,
				ogImageMime: (ogImage.mime ?? ogImageMime) ?? undefined,
				published: typeof published === 'boolean' ? published : undefined,
			},
		});
		return NextResponse.json(updated);
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
