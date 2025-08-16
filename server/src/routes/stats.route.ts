import { Router } from 'express';
import { getDashboardStats } from '../controllers/stats.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { Role } from '@prisma/client';

const statsRouter = Router();

statsRouter.get(
    '/dashboard',
    authenticate,
    authorize([Role.ADMIN, Role.HOST]),
    getDashboardStats
);

export default statsRouter;