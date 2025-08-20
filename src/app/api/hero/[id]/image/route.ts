import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
	const hero = await prisma.hero.findUnique({ where: { id: params.id } });
	if (!hero || !hero.imageBase64 || !hero.imageMime) {
		return NextResponse.json({ error: 'Not found' }, { status: 404 });
	}
	const bytes = Buffer.from(hero.imageBase64, 'base64');
	return new NextResponse(bytes, {
		headers: {
			'Content-Type': hero.imageMime,
			'Cache-Control': 'public, max-age=3600, immutable',
		},
	});
}


