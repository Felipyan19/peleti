const { PrismaClient } = require('../../src/generated/prisma');
const portfolioData = require('../../src/data/portfolio.json');
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

async function seedPortfolio() {
  console.log('🌱 Seeding Portfolio data...');

  try {
    // Eliminar datos existentes en orden correcto (relaciones)
    await prisma.$executeRaw`DELETE FROM "_ItemTechniques"`;
    await prisma.portfolioImage.deleteMany();
    await prisma.portfolioItem.deleteMany();
    await prisma.techniqueTag.deleteMany();
    await prisma.portfolioCategory.deleteMany();
    console.log('🗑️  Cleared existing Portfolio data');

    // Crear categorías únicas
    const categories = [...new Set(portfolioData.dataPortfolio.map(item => item.category))];
    const categoryMap = {};

    for (const categoryName of categories) {
      const category = await prisma.portfolioCategory.create({
        data: {
          name: categoryName,
          slug: createSlug(categoryName)
        }
      });
      categoryMap[categoryName] = category.id;
      console.log(`📁 Category created: ${categoryName}`);
    }

    // Crear técnicas únicas
    const techniques = [...new Set(portfolioData.dataPortfolio.map(item => item.technique))];
    const techniqueMap = {};

    for (const techniqueName of techniques) {
      const technique = await prisma.techniqueTag.create({
        data: {
          name: techniqueName,
          slug: createSlug(techniqueName)
        }
      });
      techniqueMap[techniqueName] = technique.id;
      console.log(`🔧 Technique created: ${techniqueName}`);
    }

    // Crear PortfolioItems
    let order = 0;
    for (const item of portfolioData.dataPortfolio) {
      // Procesar imagen
      const imageData = processImageWithFallback(item.image);

      // Crear PortfolioItem
      const portfolioItem = await prisma.portfolioItem.create({
        data: {
          title: item.title,
          slug: createSlug(item.title),
          description: item.description,
          dimensions: item.dimensions,
          order: order++,
          published: true,
          categoryId: categoryMap[item.category],
          metaTitle: item.title,
          metaDescription: item.description.substring(0, 160) + '...',
          techniques: {
            connect: [{ id: techniqueMap[item.technique] }]
          }
        }
      });

      // Crear imagen para el item
      await prisma.portfolioImage.create({
        data: {
          itemId: portfolioItem.id,
          imageBase64: imageData.imageBase64,
          imageMime: imageData.imageMime,
          alt: item.title,
          order: 0
        }
      });

      console.log(`🎨 Portfolio item created: ${item.title}`);
    }

    console.log('✅ Portfolio data seeded successfully');
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Techniques: ${techniques.length}`);
    console.log(`   - Items: ${portfolioData.dataPortfolio.length}`);

  } catch (error) {
    console.error('❌ Error seeding Portfolio data:', error);
    throw error;
  }
}

// Ejecutar si el script se llama directamente
if (require.main === module) {
  seedPortfolio()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

module.exports = { seedPortfolio };