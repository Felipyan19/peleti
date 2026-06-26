// About types for better type safety
export interface AboutCreateRequest {
  title: string;
  paragraphs: string[];
  metaTitle?: string;
  metaDescription?: string;
  imageBase64?: string;
  imageMime?: string;
  ogImageBase64?: string;
  ogImageMime?: string;
  published?: boolean;
}

export type AboutUpdateRequest = Partial<AboutCreateRequest>;

export interface AboutResponse {
  id: string;
  title: string;
  paragraphs: string[];
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

export interface AboutListResponse {
  abouts: AboutResponse[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiError {
  error: string;
  message?: string;
  details?: Record<string, unknown>;
}
