const { PrismaClient } = require('../src/generated/prisma');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    const email = 'admin@peleti.com';
    const password = 'admin123';

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      console.log('User already exists:');
      console.log('Email:', email);
      console.log('Password: admin123');
      console.log('Role:', existingUser.role);
      return;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: 'Admin User',
        email,
        passwordHash,
        role: 'ADMIN'
      }
    });

    console.log('Test user created successfully:');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Role:', user.role);
    console.log('ID:', user.id);

  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();