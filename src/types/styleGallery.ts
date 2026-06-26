// StyleGallery types for better type safety
export interface StyleGalleryStyleCreateRequest {
  name: string;
  description: string;
  icon?: string;
  techniques: string[];
  examples?: string;
  order?: number;
  published?: boolean;
}

export type StyleGalleryStyleUpdateRequest = Partial<StyleGalleryStyleCreateRequest>;

export interface StyleGalleryStyleResponse {
  id: string;
  name: string;
  description: string;
  icon?: string;
  techniques: string[];
  examples?: string;
  order: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StyleGalleryStyleListResponse {
  styles: StyleGalleryStyleResponse[];
  total: number;
  page: number;
  limit: number;
}

export interface StyleGallerySettingsCreateRequest {
  title: string;
  description: string;
}

export type StyleGallerySettingsUpdateRequest = Partial<StyleGallerySettingsCreateRequest>;

export interface StyleGallerySettingsResponse {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiError {
  error: string;
  message?: string;
  details?: Record<string, unknown>;
}
