const { PrismaClient } = require('../../src/generated/prisma');
const aboutData = require('../../src/data/about.json');
const { processImageWithFallback } = require('../utils/imageConverter');

const prisma = new PrismaClient();

async function seedAbout() {
  console.log('🌱 Seeding About data...');

  try {
    // Eliminar datos existentes
    await prisma.about.deleteMany();
    console.log('🗑️  Cleared existing About data');

    // Procesar imagen
    const imageData = processImageWithFallback(aboutData.image);

    // Crear registro About
    const about = await prisma.about.create({
      data: {
        title: aboutData.title,
        imageBase64: imageData.imageBase64,
        imageMime: imageData.imageMime,
        paragraphs: aboutData.paragraphs, // Ya es un array JSON
        metaTitle: aboutData.title,
        metaDescription: aboutData.paragraphs[0] || aboutData.title,
        published: true,
      },
    });

    console.log('✅ About data seeded successfully');
    console.log(`   - ID: ${about.id}`);
    console.log(`   - Title: ${about.title}`);
    console.log(`   - Paragraphs: ${aboutData.paragraphs.length} paragraphs`);

  } catch (error) {
    console.error('❌ Error seeding About data:', error);
    throw error;
  }
}

// Ejecutar si el script se llama directamente
if (require.main === module) {
  seedAbout()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

module.exports = { seedAbout };