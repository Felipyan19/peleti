import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { ApiResponse, withErrorHandling } from '@/utils/api/responseHelpers';
import { validateAboutParams } from '@/utils/validation/aboutValidation';

const prisma = new PrismaClient();

export const GET = withErrorHandling(async (_: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
	const { id } = await validateAboutParams(params);
	
	const about = await prisma.about.findUnique({ where: { id } });
	if (!about || !about.ogImageBase64 || !about.ogImageMime) {
		throw ApiResponse.notFound('About OG image not found');
	}
	
	const bytes = Buffer.from(about.ogImageBase64, 'base64');
	return new NextResponse(bytes, { 
		headers: { 
			'Content-Type': about.ogImageMime, 
			'Cache-Control': 'public, max-age=3600, immutable' 
		} 
	});
});
