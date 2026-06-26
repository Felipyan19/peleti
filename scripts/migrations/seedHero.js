const { PrismaClient } = require('../../src/generated/prisma');
const heroData = require('../../src/data/hero.json');
const { processImageWithFallback } = require('../utils/imageConverter');

const prisma = new PrismaClient();

async function seedHero() {
  console.log('🌱 Seeding Hero data...');

  try {
    // Eliminar datos existentes
    await prisma.hero.deleteMany();
    console.log('🗑️  Cleared existing Hero data');

    // Procesar imagen
    const imageData = processImageWithFallback(heroData.image);

    // Crear registro Hero
    const hero = await prisma.hero.create({
      data: {
        title: heroData.title,
        description: heroData.description,
        buttonText: heroData.buttonText,
        imageBase64: imageData.imageBase64,
        imageMime: imageData.imageMime,
        metaTitle: heroData.title,
        metaDescription: heroData.description,
        published: true,
      },
    });

    console.log('✅ Hero data seeded successfully');
    console.log(`   - ID: ${hero.id}`);
    console.log(`   - Title: ${hero.title}`);

  } catch (error) {
    console.error('❌ Error seeding Hero data:', error);
    throw error;
  }
}

// Ejecutar si el script se llama directamente
if (require.main === module) {
  seedHero()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

module.exports = { seedHero };