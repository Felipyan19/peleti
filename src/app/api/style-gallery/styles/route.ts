import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { mapStyleGalleryStyleForResponse } from '@/utils/server/imageHelpers';
import { ApiResponse, withErrorHandling } from '@/utils/api/responseHelpers';
import { validateStyleGalleryStyleQuery, validateStyleGalleryStyleCreate } from '@/utils/validation/styleGalleryValidation';
import { StyleGalleryStyleListResponse } from '@/types/styleGallery';

const prisma = new PrismaClient();

export const GET = withErrorHandling(async (req: NextRequest) => {
	const query = validateStyleGalleryStyleQuery(req.nextUrl.searchParams);
	const { page, limit, published } = query;
	
	const skip = (page - 1) * limit;
	
	const where = published !== undefined ? { published } : {};
	
	const [styles, total] = await Promise.all([
		prisma.styleGalleryStyle.findMany({
			where,
			orderBy: { order: 'asc' },
			skip,
			take: limit,
		}),
		prisma.styleGalleryStyle.count({ where }),
	]);
	
	const mapped = styles.map((s) => mapStyleGalleryStyleForResponse(s));
	
	const response: StyleGalleryStyleListResponse = {
		styles: mapped,
		total,
		page,
		limit,
	};
	
	return ApiResponse.success(response);
});

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { name, description, icon, techniques, examples, order, published } = body ?? {};

		if (!name || !description || !techniques || !Array.isArray(techniques)) {
			return NextResponse.json({ error: 'name, description, and techniques are required' }, { status: 400 });
		}

		// Validate the data
		const validatedData = validateStyleGalleryStyleCreate({
			name,
			description,
			icon,
			techniques,
			examples,
			order,
			published,
		});

		const created = await prisma.styleGalleryStyle.create({
			data: {
				name: validatedData.name,
				description: validatedData.description,
				icon: validatedData.icon ?? null,
				techniques: validatedData.techniques,
				examples: validatedData.examples ?? null,
				order: validatedData.order ?? 0,
				published: validatedData.published ?? true,
			},
		});

		return NextResponse.json(mapStyleGalleryStyleForResponse(created), { status: 201 });
	} catch (err) {
		console.error(err);
		return NextResponse.json({ error: 'Server error' }, { status: 500 });
	}
}
