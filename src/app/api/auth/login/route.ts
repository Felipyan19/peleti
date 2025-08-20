import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

function getJwtSecret(): string {
	const secret = process.env.JWT_SECRET;
	if (!secret) {
		throw new Error('JWT_SECRET is not set');
	}
	return secret;
}

export async function POST(req: NextRequest) {
	try {
		const { email, password } = await req.json();
		if (typeof email !== 'string' || typeof password !== 'string') {
			return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
		}

		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) {
			return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
		}

		const isValid = await bcrypt.compare(password, user.passwordHash);
		if (!isValid) {
			return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
		}

		const token = jwt.sign(
			{ sub: user.id, email: user.email, role: user.role },
			getJwtSecret(),
			{ expiresIn: '1d' }
		);

		return NextResponse.json({
			token,
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				role: user.role,
			},
		});
	} catch (err) {
		console.error(err);
		return NextResponse.json({ error: 'Server error' }, { status: 500 });
	}
}
