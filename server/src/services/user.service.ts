import prisma from '../config/database';

interface UpdateUserProfileParams {
    phone?: string;
    dateOfBirth?: string;
    fullName?: string;
    email?: string;
}

export interface GetUsersQuery {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    sortBy?: 'fullName' | 'email' | 'createdAt' | 'updatedAt';
    sortOrder?: 'asc' | 'desc';
    isActive?: boolean;
}

export interface GetUsersResult {
    users: any[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

export const updateUserProfile = async (
    userId: string,
    updateData: UpdateUserProfileParams
): Promise<any> => {
    try {
        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true }
        });

        if (!existingUser) {
            throw new Error('User not found');
        }

        // Check email uniqueness if email is being updated
        if (updateData.email && updateData.email !== existingUser.email) {
            const emailExists = await prisma.user.findFirst({
                where: {
                    email: updateData.email,
                    NOT: { id: userId }
                }
            });

            if (emailExists) {
                throw new Error('Email is already in use by another user');
            }
        }

        // Prepare data for update
        const dataToUpdate: any = { ...updateData };

        // Convert dateOfBirth string to Date if provided
        if (updateData.dateOfBirth) {
            dataToUpdate.dateOfBirth = new Date(updateData.dateOfBirth);
        }

        // Update user
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                ...dataToUpdate,
                updatedAt: new Date()
            },
            select: {
                id: true,
                email: true,
                fullName: true,
                phone: true,
                dateOfBirth: true,
                role: true,
                isActive: true,
                createdAt: true,
                updatedAt: true
            }
        });

        return updatedUser;
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
};

export const getUserProfile = async (userId: string): Promise<any> => {
    try {
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
                updatedAt: true
            }
        });

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    } catch (error) {
        console.error('Error getting user profile:', error);
        throw error;
    }
};

export const checkUserProfileComplete = async (userId: string): Promise<{ isComplete: boolean; missing: string[] }> => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                phone: true,
                dateOfBirth: true,
                fullName: true,
                email: true
            }
        });

        if (!user) {
            throw new Error('User not found');
        }

        const missing: string[] = [];

        if (!user.phone) missing.push('phone');
        if (!user.dateOfBirth) missing.push('dateOfBirth');
        if (!user.fullName || user.fullName.trim().length < 2) missing.push('fullName');
        if (!user.email) missing.push('email');

        return {
            isComplete: missing.length === 0,
            missing
        };
    } catch (error) {
        console.error('Error checking user profile completeness:', error);
        throw error;
    }
};

export const getAllUsersService = async (query: GetUsersQuery): Promise<GetUsersResult> => {
    // Set default values
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
    const skip = (page - 1) * limit;
    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder || 'desc';
    const isActive = query.isActive !== undefined ? query.isActive : true;

    // Build where clause
    const where: any = { isActive };

    // Add search functionality
    if (query.search) {
        where.OR = [
            {
                fullName: {
                    contains: query.search,
                    mode: 'insensitive'
                }
            },
            {
                email: {
                    contains: query.search,
                    mode: 'insensitive'
                }
            }
        ];
    }

    // Add role filter
    if (query.role) {
        where.role = query.role;
    }

    // Execute queries in parallel
    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where,
            select: {
                id: true,
                fullName: true,
                email: true,
                phone: true,
                role: true,
                isActive: true,
                dateOfBirth: true,
                createdAt: true,
                updatedAt: true
            },
            orderBy: {
                [sortBy]: sortOrder
            },
            skip,
            take: limit
        }),
        prisma.user.count({ where })
    ]);

    const pages = Math.ceil(total / limit);

    return {
        users,
        pagination: {
            page,
            limit,
            total,
            pages
        }
    };
};