import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { ApiResponse, withErrorHandling } from '@/utils/api/responseHelpers';

const prisma = new PrismaClient();

export const GET = withErrorHandling(async (_: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
	const hero = await prisma.hero.findUnique({ where: { id: (await params).id } });
	if (!hero || !hero.ogImageBase64 || !hero.ogImageMime) {
		throw ApiResponse.notFound('Hero OG image not found');
	}
	const bytes = Buffer.from(hero.ogImageBase64, 'base64');
	return new NextResponse(bytes, {
		headers: {
			'Content-Type': hero.ogImageMime,
			'Cache-Control': 'public, max-age=3600, immutable',
		},
	});
});


