import { NextResponse } from 'next/server';

export async function GET() {
	const spec = {
		openapi: '3.0.3',
		info: {
			title: 'Peleti API',
			version: '1.0.0',
			description: 'Auth and Hero CRUD endpoints',
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
					responses: {
						'200': {
							description: 'Array of heroes',
							content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Hero' } } } },
						},
					},
				},
				post: {
					summary: 'Create hero',
					tags: ['Hero'],
					requestBody: {
						required: true,
						content: { 'application/json': { schema: { $ref: '#/components/schemas/HeroCreate' } } },
					},
					responses: { '201': { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Hero' } } } } },
				},
			},
			'/api/hero/{id}': {
				parameters: [{ in: 'path', name: 'id', schema: { type: 'string', format: 'uuid' }, required: true }],
				get: {
					summary: 'Get hero by id',
					tags: ['Hero'],
					responses: { '200': { description: 'Ok', content: { 'application/json': { schema: { $ref: '#/components/schemas/Hero' } } } }, '404': { description: 'Not found' } },
				},
				put: {
					summary: 'Update hero',
					tags: ['Hero'],
					requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/HeroUpdate' } } } },
					responses: { '200': { description: 'Updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Hero' } } } }, '404': { description: 'Not found' } },
				},
				delete: {
					summary: 'Delete hero',
					tags: ['Hero'],
					responses: { '200': { description: 'Deleted' }, '404': { description: 'Not found' } },
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
			},
		},
	};
	return NextResponse.json(spec);
}
