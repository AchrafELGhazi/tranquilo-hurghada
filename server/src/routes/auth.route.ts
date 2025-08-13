import express from 'express';
import { register, login, refreshToken, logout, currentUser } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { registerSchema, loginSchema, refreshTokenSchema } from '../schemas/auth.schema';
import { validateRequest } from '../middleware/validateRequest.middleware';

const authRouter = express.Router();

authRouter.post('/register', validateRequest(registerSchema), register);
authRouter.post('/login', validateRequest(loginSchema), login);
authRouter.post('/refresh-token', validateRequest(refreshTokenSchema), refreshToken);
authRouter.post('/logout', authenticate, logout);
authRouter.get('/me', authenticate, currentUser);

export default authRouter;