import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
	const hero = await prisma.hero.findUnique({ where: { id: params.id } });
	if (!hero || !hero.ogImageBase64 || !hero.ogImageMime) {
		return NextResponse.json({ error: 'Not found' }, { status: 404 });
	}
	const bytes = Buffer.from(hero.ogImageBase64, 'base64');
	return new NextResponse(bytes, {
		headers: {
			'Content-Type': hero.ogImageMime,
			'Cache-Control': 'public, max-age=3600, immutable',
		},
	});
}


