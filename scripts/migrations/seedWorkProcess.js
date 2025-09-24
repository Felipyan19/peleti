const { PrismaClient } = require('../../src/generated/prisma');
const workProcessData = require('../../src/data/workProcess.json');

const prisma = new PrismaClient();

async function seedWorkProcess() {
  console.log('🌱 Seeding WorkProcess data...');

  try {
    // Eliminar datos existentes
    await prisma.workStep.deleteMany();
    await prisma.workProcessSettings.deleteMany();
    console.log('🗑️  Cleared existing WorkProcess data');

    // Crear WorkProcessSettings
    const settings = await prisma.workProcessSettings.create({
      data: {
        title: workProcessData.title,
        description: workProcessData.description,
        stepLabel: workProcessData.step,
      },
    });

    console.log('✅ WorkProcessSettings created:', settings.id);

    // Crear WorkSteps
    for (const step of workProcessData.stepsData) {
      const workStep = await prisma.workStep.create({
        data: {
          title: step.title,
          description: step.description,
          icon: step.icon,
          order: step.id - 1, // Los IDs empiezan en 1, los orders en 0
          published: true,
        },
      });

      console.log(`📋 WorkStep created: ${step.title}`);
    }

    console.log('✅ WorkProcess data seeded successfully');
    console.log(`   - Settings ID: ${settings.id}`);
    console.log(`   - Steps created: ${workProcessData.stepsData.length}`);

  } catch (error) {
    console.error('❌ Error seeding WorkProcess data:', error);
    throw error;
  }
}

// Ejecutar si el script se llama directamente
if (require.main === module) {
  seedWorkProcess()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

module.exports = { seedWorkProcess };