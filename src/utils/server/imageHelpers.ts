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
	const mime: string | null = (file as any)?.type ? String((file as any).type) : null;
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

export function mapHeroForResponse(hero: any, options?: { includeBase64?: boolean }) {
	const includeBase64 = options?.includeBase64 === true;
	return {
		...hero,
		imageUrl: hero?.imageBase64 ? `/api/hero/${hero.id}/image` : null,
		ogImageUrl: hero?.ogImageBase64 ? `/api/hero/${hero.id}/og-image` : null,
		imageBase64: includeBase64 ? hero?.imageBase64 : undefined,
		ogImageBase64: includeBase64 ? hero?.ogImageBase64 : undefined,
	};
}


