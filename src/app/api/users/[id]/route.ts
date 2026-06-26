import { NextRequest } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { ApiResponse, withErrorHandling } from '@/utils/api/responseHelpers';
import { withRequiredAdmin } from '@/utils/api/authHelpers';
import { fileToBase64AndMime, parseDataUrl } from '@/utils/server/imageHelpers';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const GET = withErrorHandling(withRequiredAdmin(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const { searchParams } = req.nextUrl;
  const includeBase64 = searchParams.get('includeBase64') === 'true';

  const user = await prisma.user.findUnique({
    where: { id },
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
  });

  if (!user) {
    return ApiResponse.notFound('User not found');
  }

  return ApiResponse.success(user);
}));

export const PUT = withErrorHandling(withRequiredAdmin(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const contentType = req.headers.get('content-type') || '';

  const updateData: Record<string, unknown> = {};
  let imageData: { base64: string | null; mime: string | null } | undefined;

  if (contentType.includes('multipart/form-data')) {
    const form = await req.formData();
    const name = form.get('name') as string;
    const email = form.get('email') as string;
    const password = form.get('password') as string;
    const role = form.get('role') as 'ADMIN' | 'USER';

    if (name !== undefined) updateData.name = name?.trim() || null;
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return ApiResponse.badRequest('Invalid email format');
      }

      // Check if email already exists (excluding current user)
      const existingUser = await prisma.user.findFirst({
        where: {
          email: email.toLowerCase(),
          NOT: { id }
        }
      });

      if (existingUser) {
        return ApiResponse.badRequest('User with this email already exists');
      }

      updateData.email = email.toLowerCase();
    }

    if (password) {
      if (password.length < 6) {
        return ApiResponse.badRequest('Password must be at least 6 characters long');
      }
      const saltRounds = 12;
      updateData.passwordHash = await bcrypt.hash(password, saltRounds);
    }

    if (role) updateData.role = role;

    const imageFile = form.get('image') as File | null;

    if (imageFile instanceof File) {
      imageData = await fileToBase64AndMime(imageFile);
    } else {
      const imageBase64 = form.get('imageBase64') as string;
      if (imageBase64) {
        const parsed = parseDataUrl(imageBase64);
        imageData = { base64: parsed.base64, mime: parsed.mime };
      }
    }
  } else {
    const body = await req.json();
    const {
      name,
      email,
      password,
      role,
      imageBase64,
      imageMime
    } = body;

    if (name !== undefined) updateData.name = name?.trim() || null;

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return ApiResponse.badRequest('Invalid email format');
      }

      // Check if email already exists (excluding current user)
      const existingUser = await prisma.user.findFirst({
        where: {
          email: email.toLowerCase(),
          NOT: { id }
        }
      });

      if (existingUser) {
        return ApiResponse.badRequest('User with this email already exists');
      }

      updateData.email = email.toLowerCase();
    }

    if (password) {
      if (password.length < 6) {
        return ApiResponse.badRequest('Password must be at least 6 characters long');
      }
      const saltRounds = 12;
      updateData.passwordHash = await bcrypt.hash(password, saltRounds);
    }

    if (role) updateData.role = role;

    if (imageBase64) {
      const parsed = parseDataUrl(imageBase64);
      imageData = { base64: parsed.base64, mime: parsed.mime || imageMime || null };
    }
  }

  // Add image data to update
  if (imageData?.base64) {
    updateData.imageBase64 = imageData.base64;
    updateData.imageMime = imageData.mime || 'image/jpeg';
  }

  const updated = await prisma.user.update({
    where: { id },
    data: updateData,
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

  return ApiResponse.success(updated);
}));

export const DELETE = withErrorHandling(withRequiredAdmin(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  // Check if this is the last admin user
  const user = await prisma.user.findUnique({
    where: { id },
    select: { role: true }
  });

  if (!user) {
    return ApiResponse.notFound('User not found');
  }

  if (user.role === 'ADMIN') {
    const adminCount = await prisma.user.count({
      where: { role: 'ADMIN' }
    });

    if (adminCount === 1) {
      return ApiResponse.badRequest('Cannot delete the last admin user');
    }
  }

  await prisma.user.delete({
    where: { id }
  });

  return ApiResponse.success({ message: 'User deleted successfully' });
}));
