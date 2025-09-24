import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { ApiResponse, withErrorHandling } from '@/utils/api/responseHelpers';

const prisma = new PrismaClient();

export const GET = withErrorHandling(async (_: NextRequest, { params }: { params: { id: string } }) => {
	const hero = await prisma.hero.findUnique({ where: { id: params.id } });
	if (!hero || !hero.imageBase64 || !hero.imageMime) {
		throw ApiResponse.notFound('Hero image not found');
	}
	const bytes = Buffer.from(hero.imageBase64, 'base64');
	return new NextResponse(bytes, {
		headers: {
			'Content-Type': hero.imageMime,
			'Cache-Control': 'public, max-age=3600, immutable',
		},
	});
});


