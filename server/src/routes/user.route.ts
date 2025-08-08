import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { changePassword, checkProfileComplete, deactivateAccount, getProfile, updateProfile } from '../controllers/user.controller';

const userRouter = Router();

// All routes require authentication
userRouter.use(authenticate);

// Get current user profile
userRouter.get('/', getProfile);

// Update user profile
userRouter.put('/', updateProfile);

// Change password
userRouter.put('/password', changePassword);

// Check if profile is complete
userRouter.get('/complete', checkProfileComplete);

// Deactivate account
userRouter.put('/deactivate', deactivateAccount);

export default userRouter;