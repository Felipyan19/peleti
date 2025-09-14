import { NextResponse } from 'next/server';

export async function GET() {
	const spec = {
		openapi: '3.0.3',
		info: {
			title: 'Peleti API',
			version: '1.0.0',
			description: 'Auth, Hero, About and StyleGallery CRUD endpoints',
		},
		servers: [{ url: 'http://localhost:3000' }],
		paths: {
			'/api/auth/login': {
				post: {
					summary: 'User login',
					tags: ['Auth'],
					requestBody: {
						required: true,
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/LoginRequest' },
							},
						},
					},
					responses: {
						'200': {
							description: 'Login success',
							content: {
								'application/json': {
									schema: { $ref: '#/components/schemas/LoginResponse' },
								},
							},
						},
						'401': { description: 'Invalid credentials' },
					},
				},
			},
			'/api/hero': {
				get: {
					summary: 'List heroes',
					tags: ['Hero'],
					parameters: [
						{ in: 'query', name: 'page', schema: { type: 'integer', minimum: 1 }, required: false },
						{ in: 'query', name: 'limit', schema: { type: 'integer', minimum: 1, maximum: 100 }, required: false },
						{ in: 'query', name: 'includeBase64', schema: { type: 'boolean' }, required: false },
						{ in: 'query', name: 'published', schema: { type: 'boolean' }, required: false },
					],
					responses: {
						'200': {
							description: 'List of heroes',
							content: { 'application/json': { schema: { $ref: '#/components/schemas/HeroListResponse' } } },
						},
					},
				},
				post: {
					summary: 'Create hero',
					tags: ['Hero'],
					requestBody: {
						required: true,
						content: {
							'application/json': { schema: { $ref: '#/components/schemas/HeroCreate' } },
							'multipart/form-data': { schema: { $ref: '#/components/schemas/HeroCreateMultipart' } },
						},
					},
					responses: { '201': { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Hero' } } } } },
				},
			},
			'/api/hero/{id}': {
				parameters: [{ in: 'path', name: 'id', schema: { type: 'string', format: 'uuid' }, required: true }],
				get: {
					summary: 'Get hero by id',
					tags: ['Hero'],
					parameters: [
						{ in: 'query', name: 'includeBase64', schema: { type: 'boolean' }, required: false },
					],
					responses: { '200': { description: 'Ok', content: { 'application/json': { schema: { $ref: '#/components/schemas/Hero' } } } }, '404': { description: 'Not found' } },
				},
				put: {
					summary: 'Update hero',
					tags: ['Hero'],
					requestBody: {
						required: true,
						content: {
							'application/json': { schema: { $ref: '#/components/schemas/HeroUpdate' } },
							'multipart/form-data': { schema: { $ref: '#/components/schemas/HeroUpdateMultipart' } },
						},
					},
					responses: { '200': { description: 'Updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Hero' } } } }, '404': { description: 'Not found' } },
				},
				delete: {
					summary: 'Delete hero',
					tags: ['Hero'],
					responses: { '204': { description: 'No Content' }, '404': { description: 'Not found' } },
				},
			},
			'/api/about': {
				get: {
					summary: 'List about sections',
					tags: ['About'],
					parameters: [
						{ in: 'query', name: 'page', schema: { type: 'integer', minimum: 1 }, required: false },
						{ in: 'query', name: 'limit', schema: { type: 'integer', minimum: 1, maximum: 100 }, required: false },
						{ in: 'query', name: 'includeBase64', schema: { type: 'boolean' }, required: false },
						{ in: 'query', name: 'published', schema: { type: 'boolean' }, required: false },
					],
					responses: {
						'200': {
							description: 'List of about sections',
							content: { 'application/json': { schema: { $ref: '#/components/schemas/AboutListResponse' } } },
						},
					},
				},
				post: {
					summary: 'Create about section',
					tags: ['About'],
					requestBody: {
						required: true,
						content: {
							'application/json': { schema: { $ref: '#/components/schemas/AboutCreate' } },
							'multipart/form-data': { schema: { $ref: '#/components/schemas/AboutCreateMultipart' } },
						},
					},
					responses: { '201': { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/About' } } } } },
				},
			},
			'/api/about/{id}': {
				parameters: [{ in: 'path', name: 'id', schema: { type: 'string', format: 'uuid' }, required: true }],
				get: {
					summary: 'Get about section by id',
					tags: ['About'],
					parameters: [
						{ in: 'query', name: 'includeBase64', schema: { type: 'boolean' }, required: false },
					],
					responses: { '200': { description: 'Ok', content: { 'application/json': { schema: { $ref: '#/components/schemas/About' } } } }, '404': { description: 'Not found' } },
				},
				put: {
					summary: 'Update about section',
					tags: ['About'],
					requestBody: {
						required: true,
						content: {
							'application/json': { schema: { $ref: '#/components/schemas/AboutUpdate' } },
							'multipart/form-data': { schema: { $ref: '#/components/schemas/AboutUpdateMultipart' } },
						},
					},
					responses: { '200': { description: 'Updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/About' } } } }, '404': { description: 'Not found' } },
				},
				delete: {
					summary: 'Delete about section',
					tags: ['About'],
					responses: { '204': { description: 'No Content' }, '404': { description: 'Not found' } },
				},
			},
			'/api/about/{id}/image': {
				parameters: [{ in: 'path', name: 'id', schema: { type: 'string', format: 'uuid' }, required: true }],
				get: {
					summary: 'Get about section main image',
					tags: ['About'],
					responses: { '200': { description: 'Image file', content: { 'image/*': { schema: { type: 'string', format: 'binary' } } } }, '404': { description: 'Not found' } },
				},
			},
			'/api/about/{id}/og-image': {
				parameters: [{ in: 'path', name: 'id', schema: { type: 'string', format: 'uuid' }, required: true }],
				get: {
					summary: 'Get about section OG image',
					tags: ['About'],
					responses: { '200': { description: 'Image file', content: { 'image/*': { schema: { type: 'string', format: 'binary' } } } }, '404': { description: 'Not found' } },
				},
			},
			'/api/style-gallery/styles': {
				get: {
					summary: 'List style gallery styles',
					tags: ['StyleGallery'],
					parameters: [
						{ in: 'query', name: 'page', schema: { type: 'integer', minimum: 1 }, required: false },
						{ in: 'query', name: 'limit', schema: { type: 'integer', minimum: 1, maximum: 100 }, required: false },
						{ in: 'query', name: 'published', schema: { type: 'boolean' }, required: false },
					],
					responses: {
						'200': {
							description: 'List of style gallery styles',
							content: { 'application/json': { schema: { $ref: '#/components/schemas/StyleGalleryStyleListResponse' } } },
						},
					},
				},
				post: {
					summary: 'Create style gallery style',
					tags: ['StyleGallery'],
					requestBody: {
						required: true,
						content: {
							'application/json': { schema: { $ref: '#/components/schemas/StyleGalleryStyleCreate' } },
						},
					},
					responses: { '201': { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/StyleGalleryStyle' } } } } },
				},
			},
			'/api/style-gallery/styles/{id}': {
				parameters: [{ in: 'path', name: 'id', schema: { type: 'string', format: 'uuid' }, required: true }],
				get: {
					summary: 'Get style gallery style',
					tags: ['StyleGallery'],
					responses: { '200': { description: 'Ok', content: { 'application/json': { schema: { $ref: '#/components/schemas/StyleGalleryStyle' } } } }, '404': { description: 'Not found' } },
				},
				put: {
					summary: 'Update style gallery style',
					tags: ['StyleGallery'],
					requestBody: {
						required: true,
						content: {
							'application/json': { schema: { $ref: '#/components/schemas/StyleGalleryStyleUpdate' } },
						},
					},
					responses: { '200': { description: 'Updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/StyleGalleryStyle' } } } }, '404': { description: 'Not found' } },
				},
				delete: {
					summary: 'Delete style gallery style',
					tags: ['StyleGallery'],
					responses: { '204': { description: 'No Content' }, '404': { description: 'Not found' } },
				},
			},
			'/api/style-gallery/settings': {
				get: {
					summary: 'Get style gallery settings',
					tags: ['StyleGallery'],
					responses: { '200': { description: 'Ok', content: { 'application/json': { schema: { $ref: '#/components/schemas/StyleGallerySettings' } } } }, '404': { description: 'Not found' } },
				},
				post: {
					summary: 'Create style gallery settings',
					tags: ['StyleGallery'],
					requestBody: {
						required: true,
						content: {
							'application/json': { schema: { $ref: '#/components/schemas/StyleGallerySettingsCreate' } },
						},
					},
					responses: { '201': { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/StyleGallerySettings' } } } } },
				},
			},
			'/api/style-gallery/settings/{id}': {
				parameters: [{ in: 'path', name: 'id', schema: { type: 'string', format: 'uuid' }, required: true }],
				get: {
					summary: 'Get style gallery settings by ID',
					tags: ['StyleGallery'],
					responses: { '200': { description: 'Ok', content: { 'application/json': { schema: { $ref: '#/components/schemas/StyleGallerySettings' } } } }, '404': { description: 'Not found' } },
				},
				put: {
					summary: 'Update style gallery settings',
					tags: ['StyleGallery'],
					requestBody: {
						required: true,
						content: {
							'application/json': { schema: { $ref: '#/components/schemas/StyleGallerySettingsUpdate' } },
						},
					},
					responses: { '200': { description: 'Updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/StyleGallerySettings' } } } }, '404': { description: 'Not found' } },
				},
				delete: {
					summary: 'Delete style gallery settings',
					tags: ['StyleGallery'],
					responses: { '204': { description: 'No Content' }, '404': { description: 'Not found' } },
				},
			},
		},
		components: {
			schemas: {
				LoginRequest: {
					type: 'object',
					required: ['email', 'password'],
					properties: {
						email: { type: 'string', format: 'email' },
						password: { type: 'string', format: 'password' },
					},
				},
				LoginResponse: {
					type: 'object',
					properties: {
						token: { type: 'string' },
						user: {
							type: 'object',
							properties: {
								id: { type: 'string', format: 'uuid' },
								name: { type: 'string', nullable: true },
								email: { type: 'string', format: 'email' },
								role: { type: 'string' },
							},
						},
					},
				},
				Hero: {
					type: 'object',
					properties: {
						id: { type: 'string', format: 'uuid' },
						title: { type: 'string' },
						description: { type: 'string' },
						buttonText: { type: 'string', nullable: true },
						imageBase64: { type: 'string', format: 'byte', nullable: true },
						imageMime: { type: 'string', nullable: true },
						metaTitle: { type: 'string', nullable: true },
						metaDescription: { type: 'string', nullable: true },
						ogImageBase64: { type: 'string', format: 'byte', nullable: true },
						ogImageMime: { type: 'string', nullable: true },
						published: { type: 'boolean' },
						createdAt: { type: 'string', format: 'date-time' },
						updatedAt: { type: 'string', format: 'date-time' },
					},
				},
				HeroCreate: {
					type: 'object',
					required: ['title', 'description'],
					properties: {
						title: { type: 'string' },
						description: { type: 'string' },
						buttonText: { type: 'string' },
						imageBase64: { type: 'string', format: 'byte', description: 'Base64 or data URL' },
						imageMime: { type: 'string' },
						metaTitle: { type: 'string' },
						metaDescription: { type: 'string' },
						ogImageBase64: { type: 'string', format: 'byte' },
						ogImageMime: { type: 'string' },
						published: { type: 'boolean' },
					},
				},
				HeroCreateMultipart: {
					type: 'object',
					required: ['title', 'description'],
					properties: {
						title: { type: 'string' },
						description: { type: 'string' },
						buttonText: { type: 'string' },
						image: { type: 'string', format: 'binary', description: 'Main image file' },
						ogImage: { type: 'string', format: 'binary', description: 'OG image file' },
						imageBase64: { type: 'string', description: 'Alternative: Base64 or data URL for main image' },
						ogImageBase64: { type: 'string', description: 'Alternative: Base64 or data URL for OG image' },
						metaTitle: { type: 'string' },
						metaDescription: { type: 'string' },
						published: { type: 'string', description: 'boolean as string (true/false)' },
					},
				},
				HeroUpdate: {
					type: 'object',
					properties: {
						title: { type: 'string' },
						description: { type: 'string' },
						buttonText: { type: 'string' },
						imageBase64: { type: 'string', format: 'byte', description: 'Base64 or data URL' },
						imageMime: { type: 'string' },
						metaTitle: { type: 'string' },
						metaDescription: { type: 'string' },
						ogImageBase64: { type: 'string', format: 'byte' },
						ogImageMime: { type: 'string' },
						published: { type: 'boolean' },
					},
				},
				HeroUpdateMultipart: {
					type: 'object',
					properties: {
						title: { type: 'string' },
						description: { type: 'string' },
						buttonText: { type: 'string' },
						image: { type: 'string', format: 'binary', description: 'Main image file' },
						ogImage: { type: 'string', format: 'binary', description: 'OG image file' },
						imageBase64: { type: 'string', description: 'Alternative: Base64 or data URL for main image' },
						ogImageBase64: { type: 'string', description: 'Alternative: Base64 or data URL for OG image' },
						metaTitle: { type: 'string' },
						metaDescription: { type: 'string' },
						published: { type: 'string', description: 'boolean as string (true/false)' },
					},
				},
				HeroListResponse: {
					type: 'object',
					properties: {
						heroes: { type: 'array', items: { $ref: '#/components/schemas/Hero' } },
						total: { type: 'integer' },
						page: { type: 'integer' },
						limit: { type: 'integer' },
					},
				},
				About: {
					type: 'object',
					properties: {
						id: { type: 'string', format: 'uuid' },
						title: { type: 'string' },
						paragraphs: { type: 'array', items: { type: 'string' } },
						imageBase64: { type: 'string', format: 'byte', nullable: true },
						imageMime: { type: 'string', nullable: true },
						metaTitle: { type: 'string', nullable: true },
						metaDescription: { type: 'string', nullable: true },
						ogImageBase64: { type: 'string', format: 'byte', nullable: true },
						ogImageMime: { type: 'string', nullable: true },
						published: { type: 'boolean' },
						createdAt: { type: 'string', format: 'date-time' },
						updatedAt: { type: 'string', format: 'date-time' },
					},
				},
				AboutCreate: {
					type: 'object',
					required: ['title', 'paragraphs'],
					properties: {
						title: { type: 'string' },
						paragraphs: { type: 'array', items: { type: 'string' } },
						imageBase64: { type: 'string', format: 'byte', description: 'Base64 or data URL' },
						imageMime: { type: 'string' },
						metaTitle: { type: 'string' },
						metaDescription: { type: 'string' },
						ogImageBase64: { type: 'string', format: 'byte' },
						ogImageMime: { type: 'string' },
						published: { type: 'boolean' },
					},
				},
				AboutCreateMultipart: {
					type: 'object',
					required: ['title', 'paragraphs'],
					properties: {
						title: { type: 'string' },
						paragraphs: { type: 'string', description: 'JSON string array of paragraphs' },
						image: { type: 'string', format: 'binary', description: 'Main image file' },
						ogImage: { type: 'string', format: 'binary', description: 'OG image file' },
						imageBase64: { type: 'string', description: 'Alternative: Base64 or data URL for main image' },
						ogImageBase64: { type: 'string', description: 'Alternative: Base64 or data URL for OG image' },
						metaTitle: { type: 'string' },
						metaDescription: { type: 'string' },
						published: { type: 'string', description: 'boolean as string (true/false)' },
					},
				},
				AboutUpdate: {
					type: 'object',
					properties: {
						title: { type: 'string' },
						paragraphs: { type: 'array', items: { type: 'string' } },
						imageBase64: { type: 'string', format: 'byte', description: 'Base64 or data URL' },
						imageMime: { type: 'string' },
						metaTitle: { type: 'string' },
						metaDescription: { type: 'string' },
						ogImageBase64: { type: 'string', format: 'byte' },
						ogImageMime: { type: 'string' },
						published: { type: 'boolean' },
					},
				},
				AboutUpdateMultipart: {
					type: 'object',
					properties: {
						title: { type: 'string' },
						paragraphs: { type: 'string', description: 'JSON string array of paragraphs' },
						image: { type: 'string', format: 'binary', description: 'Main image file' },
						ogImage: { type: 'string', format: 'binary', description: 'OG image file' },
						imageBase64: { type: 'string', description: 'Alternative: Base64 or data URL for main image' },
						ogImageBase64: { type: 'string', description: 'Alternative: Base64 or data URL for OG image' },
						metaTitle: { type: 'string' },
						metaDescription: { type: 'string' },
						published: { type: 'string', description: 'boolean as string (true/false)' },
					},
				},
				AboutListResponse: {
					type: 'object',
					properties: {
						abouts: { type: 'array', items: { $ref: '#/components/schemas/About' } },
						total: { type: 'integer' },
						page: { type: 'integer' },
						limit: { type: 'integer' },
					},
				},
				StyleGalleryStyle: {
					type: 'object',
					properties: {
						id: { type: 'string', format: 'uuid' },
						name: { type: 'string' },
						description: { type: 'string' },
						icon: { type: 'string' },
						techniques: { type: 'array', items: { type: 'string' } },
						examples: { type: 'string' },
						order: { type: 'integer' },
						published: { type: 'boolean' },
						createdAt: { type: 'string', format: 'date-time' },
						updatedAt: { type: 'string', format: 'date-time' },
					},
				},
				StyleGalleryStyleCreate: {
					type: 'object',
					required: ['name', 'description', 'techniques'],
					properties: {
						name: { type: 'string' },
						description: { type: 'string' },
						icon: { type: 'string' },
						techniques: { type: 'array', items: { type: 'string' } },
						examples: { type: 'string' },
						order: { type: 'integer' },
						published: { type: 'boolean' },
					},
				},
				StyleGalleryStyleUpdate: {
					type: 'object',
					properties: {
						name: { type: 'string' },
						description: { type: 'string' },
						icon: { type: 'string' },
						techniques: { type: 'array', items: { type: 'string' } },
						examples: { type: 'string' },
						order: { type: 'integer' },
						published: { type: 'boolean' },
					},
				},
				StyleGalleryStyleListResponse: {
					type: 'object',
					properties: {
						styles: { type: 'array', items: { $ref: '#/components/schemas/StyleGalleryStyle' } },
						total: { type: 'integer' },
						page: { type: 'integer' },
						limit: { type: 'integer' },
					},
				},
				StyleGallerySettings: {
					type: 'object',
					properties: {
						id: { type: 'string', format: 'uuid' },
						title: { type: 'string' },
						description: { type: 'string' },
						createdAt: { type: 'string', format: 'date-time' },
						updatedAt: { type: 'string', format: 'date-time' },
					},
				},
				StyleGallerySettingsCreate: {
					type: 'object',
					required: ['title', 'description'],
					properties: {
						title: { type: 'string' },
						description: { type: 'string' },
					},
				},
				StyleGallerySettingsUpdate: {
					type: 'object',
					properties: {
						title: { type: 'string' },
						description: { type: 'string' },
					},
				},
			},
		},
	};
	return NextResponse.json(spec);
}
