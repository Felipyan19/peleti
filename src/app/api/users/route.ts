import { NextRequest } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { ApiResponse, withErrorHandling } from '@/utils/api/responseHelpers';
import { fileToBase64AndMime, parseDataUrl } from '@/utils/server/imageHelpers';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const GET = withErrorHandling(async (req: NextRequest) => {
  const { searchParams } = req.nextUrl;
  const role = searchParams.get('role') as 'ADMIN' | 'USER' | null;
  const includeBase64 = searchParams.get('includeBase64') === 'true';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);

  const skip = (page - 1) * limit;
  const where = role ? { role } : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        imageBase64: includeBase64,
        imageMime: includeBase64,
        createdAt: true,
        updatedAt: true,
        // Never return passwordHash
      }
    }),
    prisma.user.count({ where })
  ]);

  return ApiResponse.success({
    users,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  });
});

export const POST = withErrorHandling(async (req: NextRequest) => {
  const contentType = req.headers.get('content-type') || '';

  let name: string | null = null;
  let email: string;
  let password: string;
  let role: 'ADMIN' | 'USER' = 'USER';
  let imageData: { base64: string | null; mime: string | null } = { base64: null, mime: null };

  if (contentType.includes('multipart/form-data')) {
    const form = await req.formData();
    name = (form.get('name') as string) || null;
    email = form.get('email') as string;
    password = form.get('password') as string;
    role = (form.get('role') as 'ADMIN' | 'USER') || 'USER';

    const imageFile = form.get('image') as File | null;

    if (imageFile instanceof File) {
      imageData = await fileToBase64AndMime(imageFile);
    } else {
      const imageBase64 = (form.get('imageBase64') as string) || null;
      const parsed = parseDataUrl(imageBase64);
      imageData = { base64: parsed.base64, mime: parsed.mime };
    }
  } else {
    const body = await req.json();
    const {
      name: n,
      email: e,
      password: p,
      role: r,
      imageBase64,
      imageMime
    } = body;

    name = n || null;
    email = e;
    password = p;
    role = r || 'USER';

    const parsed = parseDataUrl(imageBase64);
    imageData = { base64: parsed.base64, mime: parsed.mime || imageMime || null };
  }

  if (!email || !password) {
    return ApiResponse.badRequest('Email and password are required');
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return ApiResponse.badRequest('Invalid email format');
  }

  // Validate password strength
  if (password.length < 6) {
    return ApiResponse.badRequest('Password must be at least 6 characters long');
  }

  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() }
  });

  if (existingUser) {
    return ApiResponse.badRequest('User with this email already exists');
  }

  // Hash password
  const saltRounds = 12;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const created = await prisma.user.create({
    data: {
      name: name?.trim() || null,
      email: email.toLowerCase(),
      passwordHash,
      role,
      imageBase64: imageData.base64,
      imageMime: imageData.mime
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      imageBase64: false, // Don't return base64 in response
      imageMime: false,
      createdAt: true,
      updatedAt: true
    }
  });

  return ApiResponse.created(created);
});