import { User } from '@prisma/client';
import prisma from '../config/database';
import { generateTokens, verifyToken } from '../utils/jwt';
import { hashPassword, comparePasswords } from '../utils/password';
import { determineUserRole } from '../utils/determinUserRole';
import { sendWelcomeEmail } from '../utils/emailService';
import logger from '../config/logger';

interface RegisterParams {
    email: string;
    password: string;
    fullName: string;
}

interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: Omit<User, 'password'>;
}

export const registerUser = async ({
    email,
    password,
    fullName,
}: RegisterParams): Promise<AuthResponse> => {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new Error('Email already in use');
    }

    const hashedPassword = await hashPassword(password);
    const role = determineUserRole(email);

    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            fullName,
            role,
        },
    });

    try {
        await sendWelcomeEmail(user.email, user.fullName);
        logger.info(`Welcome email sent to ${user.email}`);
    } catch (emailError) {
        logger.error(`Failed to send welcome email to ${user.email}:`, emailError);
    }

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
            fullName: true,
            phone: true,
            dateOfBirth: true,
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