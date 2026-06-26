import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@/generated/prisma';
import { ApiResponse, withErrorHandling } from '@/utils/api/responseHelpers';
import { setAuthCookie } from '@/utils/api/authHelpers';

const prisma = new PrismaClient();

function getJwtSecret(): string {
	const secret = process.env.JWT_SECRET;
	if (!secret) {
		throw new Error('JWT_SECRET is not set');
	}
	return secret;
}

export const POST = withErrorHandling(async (req: NextRequest) => {
	const { email, password } = await req.json();
	if (typeof email !== 'string' || typeof password !== 'string') {
		throw ApiResponse.badRequest('Invalid payload');
	}

	const user = await prisma.user.findUnique({ where: { email } });
	if (!user) {
		throw ApiResponse.unauthorized('Invalid credentials');
	}

	const isValid = await bcrypt.compare(password, user.passwordHash);
	if (!isValid) {
		throw ApiResponse.unauthorized('Invalid credentials');
	}

	const token = jwt.sign(
		{ sub: user.id, email: user.email, role: user.role },
		getJwtSecret(),
		{ expiresIn: '1d' }
	);

	const response = ApiResponse.success({
		token,
		user: {
			id: user.id,
			name: user.name,
			email: user.email,
			role: user.role,
		},
	});

	return setAuthCookie(response, token);
});
