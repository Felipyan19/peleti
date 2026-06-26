// Hero types for better type safety
export interface HeroCreateRequest {
  title: string;
  description: string;
  buttonText?: string;
  metaTitle?: string;
  metaDescription?: string;
  imageBase64?: string;
  imageMime?: string;
  ogImageBase64?: string;
  ogImageMime?: string;
  published?: boolean;
}

export type HeroUpdateRequest = Partial<HeroCreateRequest>;

export interface HeroResponse {
  id: string;
  title: string;
  description: string;
  buttonText?: string;
  imageUrl?: string;
  ogImageUrl?: string;
  imageBase64?: string;
  ogImageBase64?: string;
  metaTitle?: string;
  metaDescription?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HeroListResponse {
  heroes: HeroResponse[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiError {
  error: string;
  message?: string;
  details?: Record<string, unknown>;
}
