import { NextResponse } from 'next/server';

export async function GET() {
	const spec = {
		openapi: '3.0.3',
		info: {
			title: 'Peleti API',
			version: '2.0.0',
			description: 'Complete CRUD API for Peleti artisan resin crafts website including Authentication, Content Management, Portfolio, Contact, Users, and Styles',
		},
		servers: [{ url: 'http://localhost:3000' }],
		tags: [
			{ name: 'Auth', description: 'Authentication endpoints' },
			{ name: 'Hero', description: 'Hero section management' },
			{ name: 'About', description: 'About section management' },
			{ name: 'Contact', description: 'Contact settings and messages' },
			{ name: 'Portfolio', description: 'Portfolio management' },
			{ name: 'Styles', description: 'Style catalog management' },
			{ name: 'StyleGallery', description: 'Style gallery management' },
			{ name: 'WorkProcess', description: 'Work process management' },
			{ name: 'Users', description: 'User management' },
		],
		paths: {
			// Auth
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

			// Hero
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
			'/api/hero/{id}/image': {
				parameters: [{ in: 'path', name: 'id', schema: { type: 'string', format: 'uuid' }, required: true }],
				get: {
					summary: 'Get hero main image',
					tags: ['Hero'],
					responses: { '200': { description: 'Image file', content: { 'image/*': { schema: { type: 'string', format: 'binary' } } } }, '404': { description: 'Not found' } },
				},
			},
			'/api/hero/{id}/og-image': {
				parameters: [{ in: 'path', name: 'id', schema: { type: 'string', format: 'uuid' }, required: true }],
				get: {
					summary: 'Get hero OG image',
					tags: ['Hero'],
					responses: { '200': { description: 'Image file', content: { 'image/*': { schema: { type: 'string', format: 'binary' } } } }, '404': { description: 'Not found' } },
				},
			},

			// About
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

			// Contact
			'/api/contact/settings': {
				get: {
					summary: 'List contact settings',
					tags: ['Contact'],
					responses: {
						'200': {
							description: 'List of contact settings with social links',
							content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/ContactSettingsWithLinks' } } } },
						},
					},
				},
				post: {
					summary: 'Create contact settings',
					tags: ['Contact'],
					requestBody: {
						required: true,
						content: {
							'application/json': { schema: { $ref: '#/components/schemas/ContactSettingsCreate' } },
						},
					},
					responses: { '201': { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/ContactSettingsWithLinks' } } } } },
				},
			},
			'/api/contact/settings/{id}': {
				parameters: [{ in: 'path', name: 'id', schema: { type: 'string', format: 'uuid' }, required: true }],
				get: {
					summary: 'Get contact settings by id',
					tags: ['Contact'],
					responses: { '200': { description: 'Ok', content: { 'application/json': { schema: { $ref: '#/components/schemas/ContactSettingsWithLinks' } } } }, '404': { description: 'Not found' } },
				},
				put: {
					summary: 'Update contact settings',
					tags: ['Contact'],
					requestBody: {
						required: true,
						content: {
							'application/json': { schema: { $ref: '#/components/schemas/ContactSettingsUpdate' } },
						},
					},
					responses: { '200': { description: 'Updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/ContactSettingsWithLinks' } } } }, '404': { description: 'Not found' } },
				},
				delete: {
					summary: 'Delete contact settings',
					tags: ['Contact'],
					responses: { '200': { description: 'Deleted' }, '404': { description: 'Not found' } },
				},
			},
			'/api/contact/social-links': {
				get: {
					summary: 'List social links',
					tags: ['Contact'],
					parameters: [
						{ in: 'query', name: 'contactSettingsId', schema: { type: 'string', format: 'uuid' }, required: false },
					],
					responses: {
						'200': {
							description: 'List of social links',
							content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/SocialLinkWithSettings' } } } },
						},
					},
				},
				post: {
					summary: 'Create social link',
					tags: ['Contact'],
					requestBody: {
						required: true,
						content: {
							'application/json': { schema: { $ref: '#/components/schemas/SocialLinkCreate' } },
						},
					},
					responses: { '201': { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/SocialLinkWithSettings' } } } } },
				},
			},
			'/api/contact/social-links/{id}': {
				parameters: [{ in: 'path', name: 'id', schema: { type: 'string', format: 'uuid' }, required: true }],
				get: {
					summary: 'Get social link by id',
					tags: ['Contact'],
					responses: { '200': { description: 'Ok', content: { 'application/json': { schema: { $ref: '#/components/schemas/SocialLinkWithSettings' } } } }, '404': { description: 'Not found' } },
				},
				put: {
					summary: 'Update social link',
					tags: ['Contact'],
					requestBody: {
						required: true,
						content: {
							'application/json': { schema: { $ref: '#/components/schemas/SocialLinkUpdate' } },
						},
					},
					responses: { '200': { description: 'Updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/SocialLinkWithSettings' } } } }, '404': { description: 'Not found' } },
				},
				delete: {
					summary: 'Delete social link',
					tags: ['Contact'],
					responses: { '200': { description: 'Deleted' }, '404': { description: 'Not found' } },
				},
			},
			'/api/contact/messages': {
				get: {
					summary: 'List contact messages',
					tags: ['Contact'],
					parameters: [
						{ in: 'query', name: 'status', schema: { type: 'string', enum: ['NEW', 'READ', 'ARCHIVED'] }, required: false },
						{ in: 'query', name: 'page', schema: { type: 'integer', minimum: 1 }, required: false },
						{ in: 'query', name: 'limit', schema: { type: 'integer', minimum: 1, maximum: 100 }, required: false },
					],
					responses: {
						'200': {
							description: 'List of contact messages',
							content: { 'application/json': { schema: { $ref: '#/components/schemas/ContactMessageListResponse' } } },
						},
					},
				},
				post: {
					summary: 'Create contact message',
					tags: ['Contact'],
					requestBody: {
						required: true,
						content: {
							'application/json': { schema: { $ref: '#/components/schemas/ContactMessageCreate' } },
						},
					},
					responses: { '201': { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/ContactMessage' } } } } },
				},
			},
			'/api/contact/messages/{id}': {
				parameters: [{ in: 'path', name: 'id', schema: { type: 'string', format: 'uuid' }, required: true }],
				get: {
					summary: 'Get contact message by id (marks as read)',
					tags: ['Contact'],
					responses: { '200': { description: 'Ok', content: { 'application/json': { schema: { $ref: '#/components/schemas/ContactMessage' } } } }, '404': { description: 'Not found' } },
				},
				put: {
					summary: 'Update contact message status',
					tags: ['Contact'],
					requestBody: {
						required: true,
						content: {
							'application/json': { schema: { $ref: '#/components/schemas/ContactMessageUpdate' } },
						},
					},
					responses: { '200': { description: 'Updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/ContactMessage' } } } }, '404': { description: 'Not found' } },
				},
				delete: {
					summary: 'Delete contact message',
					tags: ['Contact'],
					responses: { '200': { description: 'Deleted' }, '404': { description: 'Not found' } },
				},
			},

			// Portfolio Categories
			'/api/portfolio/categories': {
				get: {
					summary: 'List portfolio categories',
					tags: ['Portfolio'],
					parameters: [
						{ in: 'query', name: 'includeItemCount', schema: { type: 'boolean' }, required: false },
					],
					responses: {
						'200': {
							description: 'List of portfolio categories',
							content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/PortfolioCategory' } } } },
						},
					},
				},
				post: {
					summary: 'Create portfolio category',
					tags: ['Portfolio'],
					requestBody: {
						required: true,
						content: {
							'application/json': { schema: { $ref: '#/components/schemas/PortfolioCategoryCreate' } },
						},
					},
					responses: { '201': { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/PortfolioCategory' } } } } },
				},
			},
			'/api/portfolio/categories/{id}': {
				parameters: [{ in: 'path', name: 'id', schema: { type: 'string', format: 'uuid' }, required: true }],
				get: {
					summary: 'Get portfolio category by id',
					tags: ['Portfolio'],
					parameters: [
						{ in: 'query', name: 'includeItems', schema: { type: 'boolean' }, required: false },
					],
					responses: { '200': { description: 'Ok', content: { 'application/json': { schema: { $ref: '#/components/schemas/PortfolioCategory' } } } }, '404': { description: 'Not found' } },
				},
				put: {
					summary: 'Update portfolio category',
					tags: ['Portfolio'],
					requestBody: {
						required: true,
						content: {
							'application/json': { schema: { $ref: '#/components/schemas/PortfolioCategoryUpdate' } },
						},
					},
					responses: { '200': { description: 'Updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/PortfolioCategory' } } } }, '404': { description: 'Not found' } },
				},
				delete: {
					summary: 'Delete portfolio category',
					tags: ['Portfolio'],
					responses: { '200': { description: 'Deleted' }, '400': { description: 'Cannot delete category with items' }, '404': { description: 'Not found' } },
				},
			},

			// Portfolio Techniques
			'/api/portfolio/techniques': {
				get: {
					summary: 'List portfolio techniques',
					tags: ['Portfolio'],
					parameters: [
						{ in: 'query', name: 'includeItemCount', schema: { type: 'boolean' }, required: false },
					],
					responses: {
						'200': {
							description: 'List of portfolio techniques',
							content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/TechniqueTag' } } } },
						},
					},
				},
				post: {
					summary: 'Create portfolio technique',
					tags: ['Portfolio'],
					requestBody: {
						required: true,
						content: {
							'application/json': { schema: { $ref: '#/components/schemas/TechniqueTagCreate' } },
						},
					},
					responses: { '201': { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/TechniqueTag' } } } } },
				},
			},
			'/api/portfolio/techniques/{id}': {
				parameters: [{ in: 'path', name: 'id', schema: { type: 'string', format: 'uuid' }, required: true }],
				get: {
					summary: 'Get portfolio technique by id',
					tags: ['Portfolio'],
					parameters: [
						{ in: 'query', name: 'includeItems', schema: { type: 'boolean' }, required: false },
					],
					responses: { '200': { description: 'Ok', content: { 'application/json': { schema: { $ref: '#/components/schemas/TechniqueTag' } } } }, '404': { description: 'Not found' } },
				},
				put: {
					summary: 'Update portfolio technique',
					tags: ['Portfolio'],
					requestBody: {
						required: true,
						content: {
							'application/json': { schema: { $ref: '#/components/schemas/TechniqueTagUpdate' } },
						},
					},
					responses: { '200': { description: 'Updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/TechniqueTag' } } } }, '404': { description: 'Not found' } },
				},
				delete: {
					summary: 'Delete portfolio technique',
					tags: ['Portfolio'],
					responses: { '200': { description: 'Deleted' }, '400': { description: 'Cannot delete technique used by items' }, '404': { description: 'Not found' } },
				},
			},

			// Portfolio Items
			'/api/portfolio/items': {
				get: {
					summary: 'List portfolio items',
					tags: ['Portfolio'],
					parameters: [
						{ in: 'query', name: 'categoryId', schema: { type: 'string', format: 'uuid' }, required: false },
						{ in: 'query', name: 'published', schema: { type: 'boolean' }, required: false },
						{ in: 'query', name: 'includeImages', schema: { type: 'boolean' }, required: false },
						{ in: 'query', name: 'page', schema: { type: 'integer', minimum: 1 }, required: false },
						{ in: 'query', name: 'limit', schema: { type: 'integer', minimum: 1, maximum: 100 }, required: false },
					],
					responses: {
						'200': {
							description: 'List of portfolio items',
							content: { 'application/json': { schema: { $ref: '#/components/schemas/PortfolioItemListResponse' } } },
						},
					},
				},
				post: {
					summary: 'Create portfolio item',
					tags: ['Portfolio'],
					requestBody: {
						required: true,
						content: {
							'application/json': { schema: { $ref: '#/components/schemas/PortfolioItemCreate' } },
						},
					},
					responses: { '201': { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/PortfolioItem' } } } } },
				},
			},
			'/api/portfolio/items/{id}': {
				parameters: [{ in: 'path', name: 'id', schema: { type: 'string', format: 'uuid' }, required: true }],
				get: {
					summary: 'Get portfolio item by id',
					tags: ['Portfolio'],
					responses: { '200': { description: 'Ok', content: { 'application/json': { schema: { $ref: '#/components/schemas/PortfolioItem' } } } }, '404': { description: 'Not found' } },
				},
				put: {
					summary: 'Update portfolio item',
					tags: ['Portfolio'],
					requestBody: {
						required: true,
						content: {
							'application/json': { schema: { $ref: '#/components/schemas/PortfolioItemUpdate' } },
						},
					},
					responses: { '200': { description: 'Updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/PortfolioItem' } } } }, '404': { description: 'Not found' } },
				},
				delete: {
					summary: 'Delete portfolio item',
					tags: ['Portfolio'],
					responses: { '200': { description: 'Deleted' }, '404': { description: 'Not found' } },
				},
			},

			// Portfolio Images
			'/api/portfolio/images': {
				get: {
					summary: 'List portfolio images',
					tags: ['Portfolio'],
					parameters: [
						{ in: 'query', name: 'itemId', schema: { type: 'string', format: 'uuid' }, required: false },
						{ in: 'query', name: 'includeBase64', schema: { type: 'boolean' }, required: false },
					],
					responses: {
						'200': {
							description: 'List of portfolio images',
							content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/PortfolioImage' } } } },
						},
					},
				},
				post: {
					summary: 'Create portfolio image',
					tags: ['Portfolio'],
					requestBody: {
						required: true,
						content: {
							'application/json': { schema: { $ref: '#/components/schemas/PortfolioImageCreate' } },
							'multipart/form-data': { schema: { $ref: '#/components/schemas/PortfolioImageCreateMultipart' } },
						},
					},
					responses: { '201': { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/PortfolioImage' } } } } },
				},
			},
			'/api/portfolio/images/{id}': {
				parameters: [{ in: 'path', name: 'id', schema: { type: 'string', format: 'uuid' }, required: true }],
				get: {
					summary: 'Get portfolio image by id',
					tags: ['Portfolio'],
					parameters: [
						{ in: 'query', name: 'includeBase64', schema: { type: 'boolean' }, required: false },
						{ in: 'query', name: 'asImage', schema: { type: 'boolean' }, required: false },
					],
					responses: {
						'200': {
							description: 'Ok',
							content: {
								'application/json': { schema: { $ref: '#/components/schemas/PortfolioImage' } },
								'image/*': { schema: { type: 'string', format: 'binary' } }
							}
						},
						'404': { description: 'Not found' }
					},
				},
				put: {
					summary: 'Update portfolio image',
					tags: ['Portfolio'],
					requestBody: {
						required: true,
						content: {
							'application/json': { schema: { $ref: '#/components/schemas/PortfolioImageUpdate' } },
							'multipart/form-data': { schema: { $ref: '#/components/schemas/PortfolioImageUpdateMultipart' } },
						},
					},
					responses: { '200': { description: 'Updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/PortfolioImage' } } } }, '404': { description: 'Not found' } },
				},
				delete: {
					summary: 'Delete portfolio image',
					tags: ['Portfolio'],
					responses: { '200': { description: 'Deleted' }, '404': { description: 'Not found' } },
				},
			},

			// Styles
			'/api/styles': {
				get: {
					summary: 'List styles',
					tags: ['Styles'],
					parameters: [
						{ in: 'query', name: 'category', schema: { type: 'string', enum: ['NATURAL', 'MODERN', 'CLASSIC', 'HISTORIC'] }, required: false },
						{ in: 'query', name: 'published', schema: { type: 'boolean' }, required: false },
						{ in: 'query', name: 'includeBase64', schema: { type: 'boolean' }, required: false },
						{ in: 'query', name: 'page', schema: { type: 'integer', minimum: 1 }, required: false },
						{ in: 'query', name: 'limit', schema: { type: 'integer', minimum: 1, maximum: 100 }, required: false },
					],
					responses: {
						'200': {
							description: 'List of styles',
							content: { 'application/json': { schema: { $ref: '#/components/schemas/StyleListResponse' } } },
						},
					},
				},
				post: {
					summary: 'Create style',
					tags: ['Styles'],
					requestBody: {
						required: true,
						content: {
							'application/json': { schema: { $ref: '#/components/schemas/StyleCreate' } },
							'multipart/form-data': { schema: { $ref: '#/components/schemas/StyleCreateMultipart' } },
						},
					},
					responses: { '201': { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Style' } } } } },
				},
			},
			'/api/styles/{id}': {
				parameters: [{ in: 'path', name: 'id', schema: { type: 'string', format: 'uuid' }, required: true }],
				get: {
					summary: 'Get style by id',
					tags: ['Styles'],
					parameters: [
						{ in: 'query', name: 'includeBase64', schema: { type: 'boolean' }, required: false },
					],
					responses: { '200': { description: 'Ok', content: { 'application/json': { schema: { $ref: '#/components/schemas/Style' } } } }, '404': { description: 'Not found' } },
				},
				put: {
					summary: 'Update style',
					tags: ['Styles'],
					requestBody: {
						required: true,
						content: {
							'application/json': { schema: { $ref: '#/components/schemas/StyleUpdate' } },
							'multipart/form-data': { schema: { $ref: '#/components/schemas/StyleUpdateMultipart' } },
						},
					},
					responses: { '200': { description: 'Updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Style' } } } }, '404': { description: 'Not found' } },
				},
				delete: {
					summary: 'Delete style',
					tags: ['Styles'],
					responses: { '200': { description: 'Deleted' }, '404': { description: 'Not found' } },
				},
			},
			'/api/styles/{id}/image': {
				parameters: [{ in: 'path', name: 'id', schema: { type: 'string', format: 'uuid' }, required: true }],
				get: {
					summary: 'Get style main image',
					tags: ['Styles'],
					responses: { '200': { description: 'Image file', content: { 'image/*': { schema: { type: 'string', format: 'binary' } } } }, '404': { description: 'Not found' } },
				},
			},
			'/api/styles/{id}/og-image': {
				parameters: [{ in: 'path', name: 'id', schema: { type: 'string', format: 'uuid' }, required: true }],
				get: {
					summary: 'Get style OG image',
					tags: ['Styles'],
					responses: { '200': { description: 'Image file', content: { 'image/*': { schema: { type: 'string', format: 'binary' } } } }, '404': { description: 'Not found' } },
				},
			},

			// Users
			'/api/users': {
				get: {
					summary: 'List users',
					tags: ['Users'],
					parameters: [
						{ in: 'query', name: 'role', schema: { type: 'string', enum: ['ADMIN', 'USER'] }, required: false },
						{ in: 'query', name: 'includeBase64', schema: { type: 'boolean' }, required: false },
						{ in: 'query', name: 'page', schema: { type: 'integer', minimum: 1 }, required: false },
						{ in: 'query', name: 'limit', schema: { type: 'integer', minimum: 1, maximum: 100 }, required: false },
					],
					responses: {
						'200': {
							description: 'List of users',
							content: { 'application/json': { schema: { $ref: '#/components/schemas/UserListResponse' } } },
						},
					},
				},
				post: {
					summary: 'Create user',
					tags: ['Users'],
					requestBody: {
						required: true,
						content: {
							'application/json': { schema: { $ref: '#/components/schemas/UserCreate' } },
							'multipart/form-data': { schema: { $ref: '#/components/schemas/UserCreateMultipart' } },
						},
					},
					responses: { '201': { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } } },
				},
			},
			'/api/users/{id}': {
				parameters: [{ in: 'path', name: 'id', schema: { type: 'string', format: 'uuid' }, required: true }],
				get: {
					summary: 'Get user by id',
					tags: ['Users'],
					parameters: [
						{ in: 'query', name: 'includeBase64', schema: { type: 'boolean' }, required: false },
					],
					responses: { '200': { description: 'Ok', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } }, '404': { description: 'Not found' } },
				},
				put: {
					summary: 'Update user',
					tags: ['Users'],
					requestBody: {
						required: true,
						content: {
							'application/json': { schema: { $ref: '#/components/schemas/UserUpdate' } },
							'multipart/form-data': { schema: { $ref: '#/components/schemas/UserUpdateMultipart' } },
						},
					},
					responses: { '200': { description: 'Updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } }, '404': { description: 'Not found' } },
				},
				delete: {
					summary: 'Delete user',
					tags: ['Users'],
					responses: { '200': { description: 'Deleted' }, '400': { description: 'Cannot delete last admin' }, '404': { description: 'Not found' } },
				},
			},
			'/api/users/{id}/image': {
				parameters: [{ in: 'path', name: 'id', schema: { type: 'string', format: 'uuid' }, required: true }],
				get: {
					summary: 'Get user image',
					tags: ['Users'],
					responses: { '200': { description: 'Image file', content: { 'image/*': { schema: { type: 'string', format: 'binary' } } } }, '404': { description: 'Not found' } },
				},
			},

			// Style Gallery
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
					responses: { '200': { description: 'Deleted' }, '404': { description: 'Not found' } },
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
					responses: { '200': { description: 'Deleted' }, '404': { description: 'Not found' } },
				},
			},

			// Work Process
			'/api/work-process': {
				get: {
					summary: 'Get complete work process (settings + steps)',
					tags: ['WorkProcess'],
					responses: {
						'200': {
							description: 'Complete work process with settings and published steps',
							content: { 'application/json': { schema: { $ref: '#/components/schemas/WorkProcessResponse' } } },
						},
					},
				},
			},
			'/api/work-process/settings': {
				get: {
					summary: 'List work process settings',
					tags: ['WorkProcess'],
					responses: {
						'200': {
							description: 'List of work process settings',
							content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/WorkProcessSettings' } } } },
						},
					},
				},
				post: {
					summary: 'Create work process settings',
					tags: ['WorkProcess'],
					requestBody: {
						required: true,
						content: {
							'application/json': { schema: { $ref: '#/components/schemas/WorkProcessSettingsCreate' } },
						},
					},
					responses: { '201': { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/WorkProcessSettings' } } } } },
				},
			},
			'/api/work-process/settings/{id}': {
				parameters: [{ in: 'path', name: 'id', schema: { type: 'string', format: 'uuid' }, required: true }],
				get: {
					summary: 'Get work process settings by ID',
					tags: ['WorkProcess'],
					responses: { '200': { description: 'Ok', content: { 'application/json': { schema: { $ref: '#/components/schemas/WorkProcessSettings' } } } }, '404': { description: 'Not found' } },
				},
				put: {
					summary: 'Update work process settings by ID',
					tags: ['WorkProcess'],
					requestBody: {
						required: true,
						content: {
							'application/json': { schema: { $ref: '#/components/schemas/WorkProcessSettingsUpdate' } },
						},
					},
					responses: { '200': { description: 'Updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/WorkProcessSettings' } } } }, '404': { description: 'Not found' } },
				},
				delete: {
					summary: 'Delete work process settings by ID',
					tags: ['WorkProcess'],
					responses: { '200': { description: 'Deleted' }, '404': { description: 'Not found' } },
				},
			},
			'/api/work-process/steps': {
				get: {
					summary: 'List work steps',
					tags: ['WorkProcess'],
					parameters: [
						{ in: 'query', name: 'published', schema: { type: 'boolean' }, required: false },
						{ in: 'query', name: 'order', schema: { type: 'integer' }, required: false },
					],
					responses: {
						'200': {
							description: 'List of work steps',
							content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/WorkStep' } } } },
						},
					},
				},
				post: {
					summary: 'Create work step',
					tags: ['WorkProcess'],
					requestBody: {
						required: true,
						content: {
							'application/json': { schema: { $ref: '#/components/schemas/WorkStepCreate' } },
						},
					},
					responses: { '201': { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/WorkStep' } } } } },
				},
			},
			'/api/work-process/steps/{id}': {
				parameters: [{ in: 'path', name: 'id', schema: { type: 'string', format: 'uuid' }, required: true }],
				get: {
					summary: 'Get work step by ID',
					tags: ['WorkProcess'],
					responses: { '200': { description: 'Ok', content: { 'application/json': { schema: { $ref: '#/components/schemas/WorkStep' } } } }, '404': { description: 'Not found' } },
				},
				put: {
					summary: 'Update work step by ID',
					tags: ['WorkProcess'],
					requestBody: {
						required: true,
						content: {
							'application/json': { schema: { $ref: '#/components/schemas/WorkStepUpdate' } },
						},
					},
					responses: { '200': { description: 'Updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/WorkStep' } } } }, '404': { description: 'Not found' } },
				},
				delete: {
					summary: 'Delete work step by ID',
					tags: ['WorkProcess'],
					responses: { '200': { description: 'Deleted' }, '404': { description: 'Not found' } },
				},
			},
		},
		components: {
			schemas: {
				// Auth
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
								role: { type: 'string', enum: ['ADMIN', 'USER'] },
							},
						},
					},
				},

				// Users
				User: {
					type: 'object',
					properties: {
						id: { type: 'string', format: 'uuid' },
						name: { type: 'string', nullable: true },
						email: { type: 'string', format: 'email' },
						role: { type: 'string', enum: ['ADMIN', 'USER'] },
						imageBase64: { type: 'string', format: 'byte', nullable: true },
						imageMime: { type: 'string', nullable: true },
						createdAt: { type: 'string', format: 'date-time' },
						updatedAt: { type: 'string', format: 'date-time' },
					},
				},
				UserCreate: {
					type: 'object',
					required: ['email', 'password'],
					properties: {
						name: { type: 'string' },
						email: { type: 'string', format: 'email' },
						password: { type: 'string', minLength: 6 },
						role: { type: 'string', enum: ['ADMIN', 'USER'] },
						imageBase64: { type: 'string', format: 'byte', description: 'Base64 or data URL' },
						imageMime: { type: 'string' },
					},
				},
				UserCreateMultipart: {
					type: 'object',
					required: ['email', 'password'],
					properties: {
						name: { type: 'string' },
						email: { type: 'string', format: 'email' },
						password: { type: 'string', minLength: 6 },
						role: { type: 'string', enum: ['ADMIN', 'USER'] },
						image: { type: 'string', format: 'binary', description: 'Profile image file' },
						imageBase64: { type: 'string', description: 'Alternative: Base64 or data URL' },
					},
				},
				UserUpdate: {
					type: 'object',
					properties: {
						name: { type: 'string' },
						email: { type: 'string', format: 'email' },
						password: { type: 'string', minLength: 6 },
						role: { type: 'string', enum: ['ADMIN', 'USER'] },
						imageBase64: { type: 'string', format: 'byte', description: 'Base64 or data URL' },
						imageMime: { type: 'string' },
					},
				},
				UserUpdateMultipart: {
					type: 'object',
					properties: {
						name: { type: 'string' },
						email: { type: 'string', format: 'email' },
						password: { type: 'string', minLength: 6 },
						role: { type: 'string', enum: ['ADMIN', 'USER'] },
						image: { type: 'string', format: 'binary', description: 'Profile image file' },
						imageBase64: { type: 'string', description: 'Alternative: Base64 or data URL' },
					},
				},
				UserListResponse: {
					type: 'object',
					properties: {
						users: { type: 'array', items: { $ref: '#/components/schemas/User' } },
						total: { type: 'integer' },
						page: { type: 'integer' },
						limit: { type: 'integer' },
						totalPages: { type: 'integer' },
					},
				},

				// Contact
				ContactSettingsWithLinks: {
					type: 'object',
					properties: {
						id: { type: 'string', format: 'uuid' },
						title: { type: 'string' },
						description: { type: 'string' },
						formNameLabel: { type: 'string' },
						formEmailLabel: { type: 'string' },
						formMessageLabel: { type: 'string' },
						submitSuccessText: { type: 'string' },
						submitErrorText: { type: 'string' },
						socialLinks: { type: 'array', items: { $ref: '#/components/schemas/SocialLink' } },
						createdAt: { type: 'string', format: 'date-time' },
						updatedAt: { type: 'string', format: 'date-time' },
					},
				},
				ContactSettingsCreate: {
					type: 'object',
					required: ['title', 'description'],
					properties: {
						title: { type: 'string' },
						description: { type: 'string' },
						formNameLabel: { type: 'string' },
						formEmailLabel: { type: 'string' },
						formMessageLabel: { type: 'string' },
						submitSuccessText: { type: 'string' },
						submitErrorText: { type: 'string' },
						socialLinks: { type: 'array', items: { $ref: '#/components/schemas/SocialLinkCreate' } },
					},
				},
				ContactSettingsUpdate: {
					type: 'object',
					properties: {
						title: { type: 'string' },
						description: { type: 'string' },
						formNameLabel: { type: 'string' },
						formEmailLabel: { type: 'string' },
						formMessageLabel: { type: 'string' },
						submitSuccessText: { type: 'string' },
						submitErrorText: { type: 'string' },
					},
				},
				SocialLink: {
					type: 'object',
					properties: {
						id: { type: 'string', format: 'uuid' },
						platform: { type: 'string', enum: ['INSTAGRAM', 'FACEBOOK', 'WHATSAPP'] },
						title: { type: 'string' },
						info: { type: 'string', nullable: true },
						url: { type: 'string', format: 'uri' },
						icon: { type: 'string', nullable: true },
						contactSettingsId: { type: 'string', format: 'uuid' },
					},
				},
				SocialLinkWithSettings: {
					type: 'object',
					properties: {
						id: { type: 'string', format: 'uuid' },
						platform: { type: 'string', enum: ['INSTAGRAM', 'FACEBOOK', 'WHATSAPP'] },
						title: { type: 'string' },
						info: { type: 'string', nullable: true },
						url: { type: 'string', format: 'uri' },
						icon: { type: 'string', nullable: true },
						contactSettingsId: { type: 'string', format: 'uuid' },
						contactSettings: {
							type: 'object',
							properties: {
								id: { type: 'string', format: 'uuid' },
								title: { type: 'string' }
							}
						}
					},
				},
				SocialLinkCreate: {
					type: 'object',
					required: ['platform', 'title', 'url', 'contactSettingsId'],
					properties: {
						platform: { type: 'string', enum: ['INSTAGRAM', 'FACEBOOK', 'WHATSAPP'] },
						title: { type: 'string' },
						info: { type: 'string' },
						url: { type: 'string', format: 'uri' },
						icon: { type: 'string' },
						contactSettingsId: { type: 'string', format: 'uuid' },
					},
				},
				SocialLinkUpdate: {
					type: 'object',
					properties: {
						platform: { type: 'string', enum: ['INSTAGRAM', 'FACEBOOK', 'WHATSAPP'] },
						title: { type: 'string' },
						info: { type: 'string' },
						url: { type: 'string', format: 'uri' },
						icon: { type: 'string' },
					},
				},
				ContactMessage: {
					type: 'object',
					properties: {
						id: { type: 'string', format: 'uuid' },
						name: { type: 'string' },
						email: { type: 'string', format: 'email' },
						message: { type: 'string' },
						status: { type: 'string', enum: ['NEW', 'READ', 'ARCHIVED'] },
						createdAt: { type: 'string', format: 'date-time' },
					},
				},
				ContactMessageCreate: {
					type: 'object',
					required: ['name', 'email', 'message'],
					properties: {
						name: { type: 'string' },
						email: { type: 'string', format: 'email' },
						message: { type: 'string' },
					},
				},
				ContactMessageUpdate: {
					type: 'object',
					properties: {
						status: { type: 'string', enum: ['NEW', 'READ', 'ARCHIVED'] },
					},
				},
				ContactMessageListResponse: {
					type: 'object',
					properties: {
						messages: { type: 'array', items: { $ref: '#/components/schemas/ContactMessage' } },
						total: { type: 'integer' },
						page: { type: 'integer' },
						limit: { type: 'integer' },
						totalPages: { type: 'integer' },
					},
				},

				// Portfolio
				PortfolioCategory: {
					type: 'object',
					properties: {
						id: { type: 'string', format: 'uuid' },
						name: { type: 'string' },
						slug: { type: 'string' },
						createdAt: { type: 'string', format: 'date-time' },
						updatedAt: { type: 'string', format: 'date-time' },
						_count: {
							type: 'object',
							properties: {
								items: { type: 'integer' }
							}
						}
					},
				},
				PortfolioCategoryCreate: {
					type: 'object',
					required: ['name'],
					properties: {
						name: { type: 'string' },
						slug: { type: 'string' },
					},
				},
				PortfolioCategoryUpdate: {
					type: 'object',
					properties: {
						name: { type: 'string' },
						slug: { type: 'string' },
					},
				},
				TechniqueTag: {
					type: 'object',
					properties: {
						id: { type: 'string', format: 'uuid' },
						name: { type: 'string' },
						slug: { type: 'string' },
						createdAt: { type: 'string', format: 'date-time' },
						updatedAt: { type: 'string', format: 'date-time' },
						_count: {
							type: 'object',
							properties: {
								items: { type: 'integer' }
							}
						}
					},
				},
				TechniqueTagCreate: {
					type: 'object',
					required: ['name'],
					properties: {
						name: { type: 'string' },
						slug: { type: 'string' },
					},
				},
				TechniqueTagUpdate: {
					type: 'object',
					properties: {
						name: { type: 'string' },
						slug: { type: 'string' },
					},
				},
				PortfolioItem: {
					type: 'object',
					properties: {
						id: { type: 'string', format: 'uuid' },
						title: { type: 'string' },
						slug: { type: 'string' },
						description: { type: 'string' },
						dimensions: { type: 'string', nullable: true },
						order: { type: 'integer' },
						published: { type: 'boolean' },
						categoryId: { type: 'string', format: 'uuid' },
						category: { $ref: '#/components/schemas/PortfolioCategory' },
						techniques: { type: 'array', items: { $ref: '#/components/schemas/TechniqueTag' } },
						images: { type: 'array', items: { $ref: '#/components/schemas/PortfolioImage' } },
						metaTitle: { type: 'string', nullable: true },
						metaDescription: { type: 'string', nullable: true },
						ogImageBase64: { type: 'string', format: 'byte', nullable: true },
						ogImageMime: { type: 'string', nullable: true },
						createdAt: { type: 'string', format: 'date-time' },
						updatedAt: { type: 'string', format: 'date-time' },
						_count: {
							type: 'object',
							properties: {
								images: { type: 'integer' }
							}
						}
					},
				},
				PortfolioItemCreate: {
					type: 'object',
					required: ['title', 'description', 'categoryId'],
					properties: {
						title: { type: 'string' },
						slug: { type: 'string' },
						description: { type: 'string' },
						dimensions: { type: 'string' },
						categoryId: { type: 'string', format: 'uuid' },
						techniqueIds: { type: 'array', items: { type: 'string', format: 'uuid' } },
						order: { type: 'integer' },
						published: { type: 'boolean' },
						metaTitle: { type: 'string' },
						metaDescription: { type: 'string' },
					},
				},
				PortfolioItemUpdate: {
					type: 'object',
					properties: {
						title: { type: 'string' },
						slug: { type: 'string' },
						description: { type: 'string' },
						dimensions: { type: 'string' },
						categoryId: { type: 'string', format: 'uuid' },
						techniqueIds: { type: 'array', items: { type: 'string', format: 'uuid' } },
						order: { type: 'integer' },
						published: { type: 'boolean' },
						metaTitle: { type: 'string' },
						metaDescription: { type: 'string' },
					},
				},
				PortfolioItemListResponse: {
					type: 'object',
					properties: {
						items: { type: 'array', items: { $ref: '#/components/schemas/PortfolioItem' } },
						total: { type: 'integer' },
						page: { type: 'integer' },
						limit: { type: 'integer' },
						totalPages: { type: 'integer' },
					},
				},
				PortfolioImage: {
					type: 'object',
					properties: {
						id: { type: 'string', format: 'uuid' },
						itemId: { type: 'string', format: 'uuid' },
						imageBase64: { type: 'string', format: 'byte' },
						imageMime: { type: 'string' },
						alt: { type: 'string', nullable: true },
						order: { type: 'integer' },
						createdAt: { type: 'string', format: 'date-time' },
						item: {
							type: 'object',
							properties: {
								id: { type: 'string', format: 'uuid' },
								title: { type: 'string' },
								slug: { type: 'string' }
							}
						}
					},
				},
				PortfolioImageCreate: {
					type: 'object',
					required: ['itemId'],
					properties: {
						itemId: { type: 'string', format: 'uuid' },
						imageBase64: { type: 'string', format: 'byte', description: 'Base64 or data URL' },
						imageMime: { type: 'string' },
						alt: { type: 'string' },
						order: { type: 'integer' },
					},
				},
				PortfolioImageCreateMultipart: {
					type: 'object',
					required: ['itemId'],
					properties: {
						itemId: { type: 'string', format: 'uuid' },
						image: { type: 'string', format: 'binary', description: 'Image file' },
						imageBase64: { type: 'string', description: 'Alternative: Base64 or data URL' },
						alt: { type: 'string' },
						order: { type: 'string', description: 'integer as string' },
					},
				},
				PortfolioImageUpdate: {
					type: 'object',
					properties: {
						imageBase64: { type: 'string', format: 'byte', description: 'Base64 or data URL' },
						imageMime: { type: 'string' },
						alt: { type: 'string' },
						order: { type: 'integer' },
					},
				},
				PortfolioImageUpdateMultipart: {
					type: 'object',
					properties: {
						image: { type: 'string', format: 'binary', description: 'Image file' },
						imageBase64: { type: 'string', description: 'Alternative: Base64 or data URL' },
						alt: { type: 'string' },
						order: { type: 'string', description: 'integer as string' },
					},
				},

				// Styles
				Style: {
					type: 'object',
					properties: {
						id: { type: 'string', format: 'uuid' },
						name: { type: 'string' },
						slug: { type: 'string' },
						description: { type: 'string' },
						category: { type: 'string', enum: ['NATURAL', 'MODERN', 'CLASSIC', 'HISTORIC'], nullable: true },
						imageBase64: { type: 'string', format: 'byte', nullable: true },
						imageMime: { type: 'string', nullable: true },
						techniques: { type: 'array', items: { type: 'string' } },
						order: { type: 'integer' },
						published: { type: 'boolean' },
						metaTitle: { type: 'string', nullable: true },
						metaDescription: { type: 'string', nullable: true },
						ogImageBase64: { type: 'string', format: 'byte', nullable: true },
						ogImageMime: { type: 'string', nullable: true },
						createdAt: { type: 'string', format: 'date-time' },
						updatedAt: { type: 'string', format: 'date-time' },
					},
				},
				StyleCreate: {
					type: 'object',
					required: ['name', 'description'],
					properties: {
						name: { type: 'string' },
						slug: { type: 'string' },
						description: { type: 'string' },
						category: { type: 'string', enum: ['NATURAL', 'MODERN', 'CLASSIC', 'HISTORIC'] },
						techniques: { type: 'array', items: { type: 'string' } },
						order: { type: 'integer' },
						published: { type: 'boolean' },
						metaTitle: { type: 'string' },
						metaDescription: { type: 'string' },
						imageBase64: { type: 'string', format: 'byte', description: 'Base64 or data URL' },
						imageMime: { type: 'string' },
						ogImageBase64: { type: 'string', format: 'byte' },
						ogImageMime: { type: 'string' },
					},
				},
				StyleCreateMultipart: {
					type: 'object',
					required: ['name', 'description'],
					properties: {
						name: { type: 'string' },
						slug: { type: 'string' },
						description: { type: 'string' },
						category: { type: 'string', enum: ['NATURAL', 'MODERN', 'CLASSIC', 'HISTORIC'] },
						techniques: { type: 'string', description: 'JSON string array of techniques' },
						order: { type: 'string', description: 'integer as string' },
						published: { type: 'string', description: 'boolean as string (true/false)' },
						metaTitle: { type: 'string' },
						metaDescription: { type: 'string' },
						image: { type: 'string', format: 'binary', description: 'Main image file' },
						ogImage: { type: 'string', format: 'binary', description: 'OG image file' },
						imageBase64: { type: 'string', description: 'Alternative: Base64 or data URL for main image' },
						ogImageBase64: { type: 'string', description: 'Alternative: Base64 or data URL for OG image' },
					},
				},
				StyleUpdate: {
					type: 'object',
					properties: {
						name: { type: 'string' },
						slug: { type: 'string' },
						description: { type: 'string' },
						category: { type: 'string', enum: ['NATURAL', 'MODERN', 'CLASSIC', 'HISTORIC'] },
						techniques: { type: 'array', items: { type: 'string' } },
						order: { type: 'integer' },
						published: { type: 'boolean' },
						metaTitle: { type: 'string' },
						metaDescription: { type: 'string' },
						imageBase64: { type: 'string', format: 'byte', description: 'Base64 or data URL' },
						imageMime: { type: 'string' },
						ogImageBase64: { type: 'string', format: 'byte' },
						ogImageMime: { type: 'string' },
					},
				},
				StyleUpdateMultipart: {
					type: 'object',
					properties: {
						name: { type: 'string' },
						slug: { type: 'string' },
						description: { type: 'string' },
						category: { type: 'string', enum: ['NATURAL', 'MODERN', 'CLASSIC', 'HISTORIC'] },
						techniques: { type: 'string', description: 'JSON string array of techniques' },
						order: { type: 'string', description: 'integer as string' },
						published: { type: 'string', description: 'boolean as string (true/false)' },
						metaTitle: { type: 'string' },
						metaDescription: { type: 'string' },
						image: { type: 'string', format: 'binary', description: 'Main image file' },
						ogImage: { type: 'string', format: 'binary', description: 'OG image file' },
						imageBase64: { type: 'string', description: 'Alternative: Base64 or data URL for main image' },
						ogImageBase64: { type: 'string', description: 'Alternative: Base64 or data URL for OG image' },
					},
				},
				StyleListResponse: {
					type: 'object',
					properties: {
						styles: { type: 'array', items: { $ref: '#/components/schemas/Style' } },
						total: { type: 'integer' },
						page: { type: 'integer' },
						limit: { type: 'integer' },
						totalPages: { type: 'integer' },
					},
				},

				// Hero (existing)
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

				// About (existing)
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

				// Style Gallery (existing)
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

				// Work Process (existing)
				WorkProcessSettings: {
					type: 'object',
					properties: {
						id: { type: 'string', format: 'uuid' },
						title: { type: 'string' },
						description: { type: 'string' },
						stepLabel: { type: 'string', nullable: true },
						createdAt: { type: 'string', format: 'date-time' },
						updatedAt: { type: 'string', format: 'date-time' },
					},
				},
				WorkProcessSettingsCreate: {
					type: 'object',
					required: ['title', 'description'],
					properties: {
						title: { type: 'string', minLength: 1, maxLength: 255 },
						description: { type: 'string', minLength: 1, maxLength: 1000 },
						stepLabel: { type: 'string', maxLength: 100 },
					},
				},
				WorkProcessSettingsUpdate: {
					type: 'object',
					properties: {
						title: { type: 'string', minLength: 1, maxLength: 255 },
						description: { type: 'string', minLength: 1, maxLength: 1000 },
						stepLabel: { type: 'string', maxLength: 100 },
					},
				},
				WorkStep: {
					type: 'object',
					properties: {
						id: { type: 'string', format: 'uuid' },
						title: { type: 'string' },
						description: { type: 'string' },
						icon: { type: 'string', nullable: true },
						order: { type: 'integer', minimum: 0 },
						published: { type: 'boolean' },
						createdAt: { type: 'string', format: 'date-time' },
						updatedAt: { type: 'string', format: 'date-time' },
					},
				},
				WorkStepCreate: {
					type: 'object',
					required: ['title', 'description'],
					properties: {
						title: { type: 'string', minLength: 1, maxLength: 255 },
						description: { type: 'string', minLength: 1, maxLength: 1000 },
						icon: { type: 'string', maxLength: 100 },
						order: { type: 'integer', minimum: 0 },
						published: { type: 'boolean' },
					},
				},
				WorkStepUpdate: {
					type: 'object',
					properties: {
						title: { type: 'string', minLength: 1, maxLength: 255 },
						description: { type: 'string', minLength: 1, maxLength: 1000 },
						icon: { type: 'string', maxLength: 100 },
						order: { type: 'integer', minimum: 0 },
						published: { type: 'boolean' },
					},
				},
				WorkProcessResponse: {
					type: 'object',
					properties: {
						settings: { $ref: '#/components/schemas/WorkProcessSettings' },
						steps: { type: 'array', items: { $ref: '#/components/schemas/WorkStep' } },
					},
				},
			},
		},
	};
	return NextResponse.json(spec);
}