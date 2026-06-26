const { PrismaClient } = require('../../src/generated/prisma');
const contactData = require('../../src/data/contact.json');

const prisma = new PrismaClient();

// Mapeo de plataformas
const platformMap = {
  'instagram': 'INSTAGRAM',
  'facebook': 'FACEBOOK',
  'whatsapp': 'WHATSAPP'
};

async function seedContact() {
  console.log('🌱 Seeding Contact data...');

  try {
    // Eliminar datos existentes
    await prisma.socialLink.deleteMany();
    await prisma.contactSettings.deleteMany();
    console.log('🗑️  Cleared existing Contact data');

    // Crear ContactSettings
    const contactSettings = await prisma.contactSettings.create({
      data: {
        title: contactData.title,
        description: contactData.description,
        formNameLabel: contactData.form.name,
        formEmailLabel: contactData.form.email,
        formMessageLabel: contactData.form.message,
        submitSuccessText: contactData.submit.success,
        submitErrorText: contactData.submit.error,
      },
    });

    console.log('✅ ContactSettings created:', contactSettings.id);

    // Crear SocialLinks
    const socialLinks = [];
    for (const [key, social] of Object.entries(contactData.social)) {
      const socialLink = await prisma.socialLink.create({
        data: {
          platform: platformMap[key] || 'INSTAGRAM',
          title: social.title,
          info: social.info,
          url: social.url,
          icon: social.icon,
          contactSettingsId: contactSettings.id,
        },
      });

      socialLinks.push(socialLink);
      console.log(`   - ${social.title}: ${social.url}`);
    }

    console.log('✅ Contact data seeded successfully');
    console.log(`   - ContactSettings ID: ${contactSettings.id}`);
    console.log(`   - Social Links created: ${socialLinks.length}`);

  } catch (error) {
    console.error('❌ Error seeding Contact data:', error);
    throw error;
  }
}

// Ejecutar si el script se llama directamente
if (require.main === module) {
  seedContact()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

module.exports = { seedContact };