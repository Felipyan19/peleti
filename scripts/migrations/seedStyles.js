const { PrismaClient } = require('../../src/generated/prisma');
const stylesData = require('../../src/data/styles.json');
const { processImageWithFallback } = require('../utils/imageConverter');

const prisma = new PrismaClient();

// Función para crear slug a partir del nombre
function createSlug(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^a-z0-9\s-]/g, '') // Solo letras, números, espacios y guiones
    .replace(/\s+/g, '-') // Espacios a guiones
    .replace(/-+/g, '-') // Múltiples guiones a uno
    .trim();
}

// Mapeo de categorías a enum
const categoryMap = {
  'natural': 'NATURAL',
  'modern': 'MODERN',
  'classic': 'CLASSIC',
  'historic': 'HISTORIC'
};

async function seedStyles() {
  console.log('🌱 Seeding Styles data...');

  try {
    // Eliminar datos existentes
    await prisma.style.deleteMany();
    console.log('🗑️  Cleared existing Styles data');

    // Crear estilos
    let order = 0;
    for (const style of stylesData.styles) {
      // Procesar imagen
      const imageData = processImageWithFallback(style.image);

      // Crear estilo
      const styleRecord = await prisma.style.create({
        data: {
          name: style.name,
          slug: createSlug(style.name),
          description: style.description,
          category: categoryMap[style.category] || null,
          imageBase64: imageData.imageBase64,
          imageMime: imageData.imageMime,
          techniques: style.techniques, // Ya es un array, se guarda como JSON
          order: order++,
          published: true,
          metaTitle: style.name,
          metaDescription: style.description,
        },
      });

      console.log(`🎨 Style created: ${style.name} (${style.category})`);
    }

    console.log('✅ Styles data seeded successfully');
    console.log(`   - Styles created: ${stylesData.styles.length}`);

  } catch (error) {
    console.error('❌ Error seeding Styles data:', error);
    throw error;
  }
}

// Ejecutar si el script se llama directamente
if (require.main === module) {
  seedStyles()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

module.exports = { seedStyles };