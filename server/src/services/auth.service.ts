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

export const registerUser = async ({
     email,
     password,
     firstName,
     lastName,
     role = Role.USER,
}: RegisterParams): Promise<{ accessToken: string; refreshToken: string }> => {
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

     return generateTokens(user);
};

export const loginUser = async (
     email: string,
     password: string
): Promise<{ accessToken: string; refreshToken: string }> => {
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

     return generateTokens(user);
};

export const refreshUserToken = async (
     refreshToken: string
): Promise<{ accessToken: string; refreshToken: string }> => {
     const payload = verifyToken(refreshToken);
     if (!payload) {
          throw new Error('Invalid refresh token');
     }

     const user = await prisma.user.findUnique({ where: { id: payload.id } });
     if (!user) {
          throw new Error('User not found');
     }

     return generateTokens(user);
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