/* eslint-disable no-console */
const { PrismaClient, SocialPlatform, StyleCategory } = require('../src/generated/prisma');

const heroData = require('../src/data/hero.json');
const aboutData = require('../src/data/about.json');
const contactData = require('../src/data/contact.json');
const portfolioData = require('../src/data/portfolio.json');
const stylesData = require('../src/data/styles.json');
const styleGalleryData = require('../src/data/styleGallery.json');
const workProcessData = require('../src/data/workProcess.json');

const prisma = new PrismaClient();

function slugify(input) {
	return String(input)
		.toLowerCase()
		.normalize('NFD')
		.replace(/\p{Diacritic}/gu, '')
		.replace(/[^a-z0-9\s-]/g, '')
		.trim()
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-');
}

async function seedHero() {
	if (!heroData) return;
	await prisma.hero.create({
		data: {
			title: heroData.title,
			description: heroData.description,
			buttonText: heroData.buttonText ?? null,
			// imageBase64 / imageMime omitted intentionally
		}
	});
}

async function seedAbout() {
	if (!aboutData) return;
	await prisma.about.create({
		data: {
			title: aboutData.title,
			paragraphs: aboutData.paragraphs ?? [],
			// imageBase64 / imageMime omitted intentionally
		}
	});
}

async function seedContact() {
	if (!contactData) return;
	const contact = await prisma.contactSettings.create({
		data: {
			title: contactData.title,
			description: contactData.description,
			formNameLabel: contactData.form?.name ?? 'Nombre',
			formEmailLabel: contactData.form?.email ?? 'Email',
			formMessageLabel: contactData.form?.message ?? 'Mensaje',
			submitSuccessText: contactData.submit?.success ?? 'Enviado',
			submitErrorText: contactData.submit?.error ?? 'Error',
		}
	});

	const socialEntries = [];
	const social = contactData.social ?? {};
	for (const key of Object.keys(social)) {
		const s = social[key];
		let platform;
		switch (key.toLowerCase()) {
			case 'instagram':
				platform = SocialPlatform.INSTAGRAM; break;
			case 'facebook':
				platform = SocialPlatform.FACEBOOK; break;
			case 'whatsapp':
				platform = SocialPlatform.WHATSAPP; break;
			default:
				continue;
		}
		socialEntries.push({
			platform,
			title: s.title ?? key,
			info: s.info ?? null,
			url: s.url ?? '',
			icon: s.icon ?? null,
			contactSettingsId: contact.id,
		});
	}
	if (socialEntries.length > 0) {
		await prisma.socialLink.createMany({ data: socialEntries });
	}
}

async function seedPortfolio() {
	const items = portfolioData?.dataPortfolio ?? [];
	if (items.length === 0) return;

	// Categories
	const categoryNames = Array.from(new Set(items.map(i => i.category).filter(Boolean)));
	await prisma.portfolioCategory.createMany({
		data: categoryNames.map(name => ({ name, slug: slugify(name) })),
		skipDuplicates: true,
	});
	const categories = await prisma.portfolioCategory.findMany();
	const categoryByName = new Map(categories.map(c => [c.name, c]));

	// Technique tags (from item.technique string)
	const techniqueNames = Array.from(new Set(items.map(i => i.technique).filter(Boolean)));
	await prisma.techniqueTag.createMany({
		data: techniqueNames.map(name => ({ name, slug: slugify(name) })),
		skipDuplicates: true,
	});
	const tags = await prisma.techniqueTag.findMany();
	const tagBySlug = new Map(tags.map(t => [t.slug, t]));

	for (const item of items) {
		const category = categoryByName.get(item.category);
		const created = await prisma.portfolioItem.create({
			data: {
				title: item.title,
				slug: slugify(item.title),
				description: item.description ?? '',
				dimensions: item.dimensions ?? null,
				order: Number(item.id) || 0,
				categoryId: category?.id,
			}
		});

		const techSlug = slugify(item.technique || '');
		const tag = tagBySlug.get(techSlug);
		if (tag) {
			await prisma.portfolioItem.update({
				where: { id: created.id },
				data: { techniques: { connect: [{ id: tag.id }] } },
			});
		}
	}
}

async function seedStyles() {
	const styles = stylesData?.styles ?? [];
	if (styles.length === 0) return;
	for (const s of styles) {
		let category = null;
		switch (String(s.category || '').toUpperCase()) {
			case 'NATURAL':
				category = StyleCategory.NATURAL; break;
			case 'MODERN':
				category = StyleCategory.MODERN; break;
			case 'CLASSIC':
				category = StyleCategory.CLASSIC; break;
			case 'HISTORIC':
				category = StyleCategory.HISTORIC; break;
			default:
				category = null; break;
		}
		await prisma.style.create({
			data: {
				name: s.name,
				slug: slugify(s.name),
				description: s.description ?? '',
				category,
				techniques: s.techniques ?? [],
				order: Number(s.id) || 0,
			}
		});
	}
}

async function seedStyleGallery() {
	await prisma.styleGallerySettings.create({
		data: {
			title: styleGalleryData.title,
			description: styleGalleryData.description,
		}
	});
	const styles = styleGalleryData?.styles ?? [];
	for (const s of styles) {
		await prisma.styleGalleryStyle.create({
			data: {
				name: s.name,
				description: s.description ?? '',
				icon: s.icon ?? null,
				techniques: s.techniques ?? [],
				examples: s.examples ?? null,
				order: Number(s.id) || 0,
			}
		});
	}
}

async function seedWorkProcess() {
	await prisma.workProcessSettings.create({
		data: {
			title: workProcessData.title,
			description: workProcessData.description,
			stepLabel: workProcessData.step ?? null,
		}
	});
	const steps = workProcessData?.stepsData ?? [];
	for (const st of steps) {
		await prisma.workStep.create({
			data: {
				title: st.title,
				description: st.description ?? '',
				icon: st.icon ?? null,
				order: Number(st.id) || 0,
			}
		});
	}
}

async function clearAll() {
	await prisma.$transaction([
		prisma.user.deleteMany(),
		prisma.portfolioImage.deleteMany(),
		prisma.portfolioItem.deleteMany(),
		prisma.techniqueTag.deleteMany(),
		prisma.portfolioCategory.deleteMany(),
		prisma.socialLink.deleteMany(),
		prisma.contactMessage.deleteMany(),
		prisma.contactSettings.deleteMany(),
		prisma.hero.deleteMany(),
		prisma.about.deleteMany(),
		prisma.style.deleteMany(),
		prisma.styleGalleryStyle.deleteMany(),
		prisma.styleGallerySettings.deleteMany(),
		prisma.workStep.deleteMany(),
		prisma.workProcessSettings.deleteMany(),
	]);
}

async function seedAdminUser() {
	const bcrypt = require('bcryptjs');
	// Default admin user for testing
	const email = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
	const passwordHash = bcrypt.hashSync('admin123', 10);
	await prisma.user.create({
		data: {
			name: 'Admin',
			email,
			passwordHash,
			role: 'ADMIN',
		}
	});
}

async function main() {
	console.log('Seeding database with initial content...');
	await clearAll();
	await seedAdminUser();
	await seedHero();
	await seedAbout();
	await seedContact();
	await seedPortfolio();
	await seedStyles();
	await seedStyleGallery();
	await seedWorkProcess();
	console.log('Seed completed.');
}

main()
	.catch((e) => {
		console.error(e);
		process.exitCode = 1;
	})
	.finally(async () => {
		await prisma.$disconnect();
	});


