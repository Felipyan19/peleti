const { PrismaClient } = require('../../src/generated/prisma');
const styleGalleryData = require('../../src/data/styleGallery.json');

const prisma = new PrismaClient();

async function seedStyleGallery() {
  console.log('🌱 Seeding StyleGallery data...');

  try {
    // Eliminar datos existentes
    await prisma.styleGalleryStyle.deleteMany();
    await prisma.styleGallerySettings.deleteMany();
    console.log('🗑️  Cleared existing StyleGallery data');

    // Crear StyleGallerySettings
    const settings = await prisma.styleGallerySettings.create({
      data: {
        title: styleGalleryData.title,
        description: styleGalleryData.description,
      },
    });

    console.log('✅ StyleGallerySettings created:', settings.id);

    // Crear StyleGalleryStyles
    let order = 0;
    for (const style of styleGalleryData.styles) {
      const styleGalleryStyle = await prisma.styleGalleryStyle.create({
        data: {
          name: style.name,
          description: style.description,
          icon: style.icon,
          techniques: style.techniques, // Ya es un array, se guarda como JSON
          examples: style.examples,
          order: order++,
          published: true,
        },
      });

      console.log(`🎨 StyleGallery style created: ${style.name}`);
    }

    console.log('✅ StyleGallery data seeded successfully');
    console.log(`   - Settings ID: ${settings.id}`);
    console.log(`   - Styles created: ${styleGalleryData.styles.length}`);

  } catch (error) {
    console.error('❌ Error seeding StyleGallery data:', error);
    throw error;
  }
}

// Ejecutar si el script se llama directamente
if (require.main === module) {
  seedStyleGallery()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

module.exports = { seedStyleGallery };