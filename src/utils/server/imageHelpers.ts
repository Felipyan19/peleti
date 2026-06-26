import type { HeroResponse } from '@/types/hero';
import type { AboutResponse } from '@/types/about';
import type { StyleGalleryStyleResponse, StyleGallerySettingsResponse } from '@/types/styleGallery';
export function parseDataUrl(data: string | null | undefined): { base64: string | null; mime: string | null } {
	if (!data || typeof data !== 'string') return { base64: null, mime: null };
	const match = data.match(/^data:(.+);base64,(.+)$/);
	if (match) {
		return { mime: match[1] || null, base64: match[2] || null };
	}
	return { base64: data, mime: null };
}

export async function fileToBase64AndMime(file: File | Blob | null | undefined): Promise<{ base64: string | null; mime: string | null }>
{
	if (!file) return { base64: null, mime: null };
	const arrayBuffer = await file.arrayBuffer();
	const base64 = Buffer.from(arrayBuffer).toString('base64');
	const mime: string | null = (file as File)?.type ? String((file as File).type) : null;
	return { base64, mime };
}

export function parseBoolean(input: unknown): boolean | undefined {
	if (input === undefined || input === null) return undefined;
	if (typeof input === 'boolean') return input;
	if (typeof input === 'string') {
		const v = input.trim().toLowerCase();
		if (v === 'true') return true;
		if (v === 'false') return false;
	}
	return undefined;
}

export function mapHeroForResponse(hero: Record<string, unknown>, options?: { includeBase64?: boolean }): HeroResponse {
	const includeBase64 = options?.includeBase64 === true;
	return {
		id: String(hero.id),
		title: String(hero.title),
		description: String(hero.description),
		buttonText: typeof hero?.buttonText === 'string' ? hero.buttonText : undefined,
		metaTitle: typeof hero?.metaTitle === 'string' ? hero.metaTitle : undefined,
		metaDescription: typeof hero?.metaDescription === 'string' ? hero.metaDescription : undefined,
		published: Boolean(hero.published),
		createdAt:
			typeof hero?.createdAt === 'string'
				? hero.createdAt
				: (hero?.createdAt && typeof hero.createdAt === 'object' && 'toISOString' in hero.createdAt
					? (hero.createdAt as { toISOString: () => string }).toISOString()
					: ''),
		updatedAt:
			typeof hero?.updatedAt === 'string'
				? hero.updatedAt
				: (hero?.updatedAt && typeof hero.updatedAt === 'object' && 'toISOString' in hero.updatedAt
					? (hero.updatedAt as { toISOString: () => string }).toISOString()
					: ''),
		imageUrl: hero?.imageBase64 ? `/api/hero/${hero.id}/image` : undefined,
		ogImageUrl: hero?.ogImageBase64 ? `/api/hero/${hero.id}/og-image` : undefined,
		imageBase64: includeBase64 && typeof hero?.imageBase64 === 'string' ? hero.imageBase64 : undefined,
		ogImageBase64: includeBase64 && typeof hero?.ogImageBase64 === 'string' ? hero.ogImageBase64 : undefined,
	};
}

export function mapAboutForResponse(about: Record<string, unknown>, options?: { includeBase64?: boolean }): AboutResponse {
	const includeBase64 = options?.includeBase64 === true;
	return {
		id: String(about.id),
		title: String(about.title),
		paragraphs: Array.isArray(about.paragraphs) ? about.paragraphs.map(String) : [],
		metaTitle: typeof about?.metaTitle === 'string' ? about.metaTitle : undefined,
		metaDescription: typeof about?.metaDescription === 'string' ? about.metaDescription : undefined,
		published: Boolean(about.published),
		createdAt:
			typeof about?.createdAt === 'string'
				? about.createdAt
				: (about?.createdAt && typeof about.createdAt === 'object' && 'toISOString' in about.createdAt
					? (about.createdAt as { toISOString: () => string }).toISOString()
					: ''),
		updatedAt:
			typeof about?.updatedAt === 'string'
				? about.updatedAt
				: (about?.updatedAt && typeof about.updatedAt === 'object' && 'toISOString' in about.updatedAt
					? (about.updatedAt as { toISOString: () => string }).toISOString()
					: ''),
		imageUrl: about?.imageBase64 ? `/api/about/${about.id}/image` : undefined,
		ogImageUrl: about?.ogImageBase64 ? `/api/about/${about.id}/og-image` : undefined,
		imageBase64: includeBase64 && typeof about?.imageBase64 === 'string' ? about.imageBase64 : undefined,
		ogImageBase64: includeBase64 && typeof about?.ogImageBase64 === 'string' ? about.ogImageBase64 : undefined,
	};
}

export function mapStyleGalleryStyleForResponse(style: Record<string, unknown>): StyleGalleryStyleResponse {
	return {
		id: String(style.id),
		name: String(style.name),
		description: String(style.description),
		icon: typeof style?.icon === 'string' ? style.icon : undefined,
		techniques: Array.isArray(style.techniques) ? style.techniques.map(String) : [],
		examples: typeof style?.examples === 'string' ? style.examples : undefined,
		order: typeof style?.order === 'number' ? style.order : 0,
		published: Boolean(style.published),
		createdAt:
			typeof style?.createdAt === 'string'
				? style.createdAt
				: (style?.createdAt && typeof style.createdAt === 'object' && 'toISOString' in style.createdAt
					? (style.createdAt as { toISOString: () => string }).toISOString()
					: ''),
		updatedAt:
			typeof style?.updatedAt === 'string'
				? style.updatedAt
				: (style?.updatedAt && typeof style.updatedAt === 'object' && 'toISOString' in style.updatedAt
					? (style.updatedAt as { toISOString: () => string }).toISOString()
					: ''),
	};
}

export function mapStyleGallerySettingsForResponse(settings: Record<string, unknown>): StyleGallerySettingsResponse {
	return {
		id: String(settings.id),
		title: String(settings.title),
		description: String(settings.description),
		createdAt:
			typeof settings?.createdAt === 'string'
				? settings.createdAt
				: (settings?.createdAt && typeof settings.createdAt === 'object' && 'toISOString' in settings.createdAt
					? (settings.createdAt as { toISOString: () => string }).toISOString()
					: ''),
		updatedAt:
			typeof settings?.updatedAt === 'string'
				? settings.updatedAt
				: (settings?.updatedAt && typeof settings.updatedAt === 'object' && 'toISOString' in settings.updatedAt
					? (settings.updatedAt as { toISOString: () => string }).toISOString()
					: ''),
	};
}


