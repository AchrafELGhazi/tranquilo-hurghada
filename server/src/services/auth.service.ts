import { User, Role } from '@prisma/client';
import prisma from '../config/database';
import { generateTokens, verifyToken } from '../utils/jwt';
import { hashPassword, comparePasswords } from '../utils/password';

interface RegisterParams {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: Role;
}

interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: Omit<User, 'password'>;
}

export const registerUser = async ({
    email,
    password,
    firstName,
    lastName,
    role = Role.GUEST,
}: RegisterParams): Promise<AuthResponse> => {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new Error('Email already in use');
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            firstName,
            lastName,
            role,
        },
    });

    const tokens = generateTokens(user);
    const { password: _, ...userWithoutPassword } = user;

    return {
        ...tokens,
        user: userWithoutPassword,
    };
};

export const loginUser = async (
    email: string,
    password: string
): Promise<AuthResponse> => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error('Invalid credentials');
    }

    const passwordMatch = await comparePasswords(password, user.password);
    if (!passwordMatch) {
        throw new Error('Invalid credentials');
    }

    if (!user.isActive) {
        throw new Error('Account is deactivated');
    }

    const tokens = generateTokens(user);
    const { password: _, ...userWithoutPassword } = user;

    return {
        ...tokens,
        user: userWithoutPassword,
    };
};

export const refreshUserToken = async (
    refreshToken: string
): Promise<AuthResponse> => {
    const payload = verifyToken(refreshToken);
    if (!payload) {
        throw new Error('Invalid refresh token');
    }

    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user || !user.isActive) {
        throw new Error('User not found or inactive');
    }

    const tokens = generateTokens(user);
    const { password: _, ...userWithoutPassword } = user;

    return {
        ...tokens,
        user: userWithoutPassword,
    };
};

export const getCurrentUser = async (userId: string): Promise<Omit<User, 'password'>> => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    if (!user) {
        throw new Error('User not found');
    }

    return user;
};