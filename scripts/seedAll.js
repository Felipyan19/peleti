#!/usr/bin/env node

const { PrismaClient } = require('../src/generated/prisma');

// Importar todos los seeders
const { seedHero } = require('./migrations/seedHero');
const { seedAbout } = require('./migrations/seedAbout');
const { seedContact } = require('./migrations/seedContact');
const { seedPortfolio } = require('./migrations/seedPortfolio');
const { seedStyleGallery } = require('./migrations/seedStyleGallery');
const { seedStyles } = require('./migrations/seedStyles');
const { seedWorkProcess } = require('./migrations/seedWorkProcess');

const prisma = new PrismaClient();

async function seedAll() {
  console.log('🌱 Starting complete database seeding...\n');

  const startTime = Date.now();

  try {
    // Ejecutar seeders en orden
    const seeders = [
      { name: 'Hero', fn: seedHero },
      { name: 'About', fn: seedAbout },
      { name: 'Contact', fn: seedContact },
      { name: 'Portfolio', fn: seedPortfolio },
      { name: 'StyleGallery', fn: seedStyleGallery },
      { name: 'Styles', fn: seedStyles },
      { name: 'WorkProcess', fn: seedWorkProcess },
    ];

    for (const { name, fn } of seeders) {
      console.log(`\n📦 Seeding ${name}...`);
      await fn();
      console.log(`✅ ${name} completed\n`);
    }

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    console.log('🎉 Database seeding completed successfully!');
    console.log(`⏱️  Total time: ${duration}s`);

    // Mostrar estadísticas
    await showStatistics();

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

async function showStatistics() {
  try {
    console.log('\n📊 Database Statistics:');
    console.log('='.repeat(40));

    const stats = await Promise.all([
      prisma.hero.count(),
      prisma.about.count(),
      prisma.contactSettings.count(),
      prisma.socialLink.count(),
      prisma.portfolioCategory.count(),
      prisma.portfolioItem.count(),
      prisma.portfolioImage.count(),
      prisma.techniqueTag.count(),
      prisma.styleGallerySettings.count(),
      prisma.styleGalleryStyle.count(),
      prisma.style.count(),
      prisma.workProcessSettings.count(),
      prisma.workStep.count(),
    ]);

    const [
      heroCount,
      aboutCount,
      contactSettingsCount,
      socialLinkCount,
      portfolioCategoryCount,
      portfolioItemCount,
      portfolioImageCount,
      techniqueTagCount,
      styleGallerySettingsCount,
      styleGalleryStyleCount,
      styleCount,
      workProcessSettingsCount,
      workStepCount,
    ] = stats;

    console.log(`Hero entries: ${heroCount}`);
    console.log(`About entries: ${aboutCount}`);
    console.log(`Contact Settings: ${contactSettingsCount}`);
    console.log(`Social Links: ${socialLinkCount}`);
    console.log(`Portfolio Categories: ${portfolioCategoryCount}`);
    console.log(`Portfolio Items: ${portfolioItemCount}`);
    console.log(`Portfolio Images: ${portfolioImageCount}`);
    console.log(`Technique Tags: ${techniqueTagCount}`);
    console.log(`StyleGallery Settings: ${styleGallerySettingsCount}`);
    console.log(`StyleGallery Styles: ${styleGalleryStyleCount}`);
    console.log(`Styles: ${styleCount}`);
    console.log(`WorkProcess Settings: ${workProcessSettingsCount}`);
    console.log(`Work Steps: ${workStepCount}`);
    console.log('='.repeat(40));

  } catch (error) {
    console.error('❌ Error getting statistics:', error);
  }
}

// Función para limpiar toda la base de datos
async function clearAll() {
  console.log('🗑️  Clearing all data...');

  try {
    // Eliminar en orden correcto (relaciones primero)
    await prisma.$executeRaw`DELETE FROM "_ItemTechniques"`;
    await prisma.portfolioImage.deleteMany();
    await prisma.portfolioItem.deleteMany();
    await prisma.techniqueTag.deleteMany();
    await prisma.portfolioCategory.deleteMany();
    await prisma.socialLink.deleteMany();
    await prisma.contactSettings.deleteMany();
    await prisma.contactMessage.deleteMany();
    await prisma.styleGalleryStyle.deleteMany();
    await prisma.styleGallerySettings.deleteMany();
    await prisma.style.deleteMany();
    await prisma.workStep.deleteMany();
    await prisma.workProcessSettings.deleteMany();
    await prisma.about.deleteMany();
    await prisma.hero.deleteMany();

    console.log('✅ All data cleared');

  } catch (error) {
    console.error('❌ Error clearing data:', error);
    throw error;
  }
}

// Manejo de argumentos de línea de comandos
const command = process.argv[2];

async function main() {
  switch (command) {
    case 'clear':
      await clearAll();
      break;
    case 'stats':
      await showStatistics();
      break;
    default:
      await seedAll();
  }
}

// Ejecutar si el script se llama directamente
if (require.main === module) {
  main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

module.exports = { seedAll, clearAll, showStatistics };