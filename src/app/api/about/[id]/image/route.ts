import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { ApiResponse, withErrorHandling } from '@/utils/api/responseHelpers';
import { validateAboutParams } from '@/utils/validation/aboutValidation';

const prisma = new PrismaClient();

export const GET = withErrorHandling(async (_: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
	const { id } = await validateAboutParams(params);
	
	const about = await prisma.about.findUnique({ where: { id } });
	if (!about || !about.imageBase64 || !about.imageMime) {
		throw ApiResponse.notFound('About image not found');
	}
	
	const bytes = Buffer.from(about.imageBase64, 'base64');
	return new NextResponse(bytes, { 
		headers: { 
			'Content-Type': about.imageMime, 
			'Cache-Control': 'public, max-age=3600, immutable' 
		} 
	});
});
