import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validateRequest.middleware';
import {
    changePassword,
    checkProfileComplete,
    deactivateAccount,
    getAllUsers,
    getProfile,
    updateProfile
} from '../controllers/user.controller';
import {
    updateProfileSchema,
    changePasswordSchema,
    deactivateAccountSchema,
    getAllUsersSchema
} from '../schemas/user.schema';

const userRouter = Router();

// All routes require authentication
userRouter.use(authenticate);

// Get current user profile
userRouter.get('/', getProfile);

// Get all users with query validation
userRouter.get('/all', validateRequest(getAllUsersSchema), getAllUsers);

// Update user profile with validation
userRouter.put('/', validateRequest(updateProfileSchema), updateProfile);

// Change password with validation
userRouter.put('/password', validateRequest(changePasswordSchema), changePassword);

// Check profile completeness
userRouter.get('/complete', checkProfileComplete);

// Deactivate account with validation
userRouter.put('/deactivate', validateRequest(deactivateAccountSchema), deactivateAccount);

export default userRouter;