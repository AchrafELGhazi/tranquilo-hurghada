import express from 'express';
import {
     register,
     login,
     refreshToken,
     logout,
     currentUser,
} from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/refresh-token', refreshToken);
authRouter.post('/logout', authenticate, logout);
authRouter.get('/me', authenticate, currentUser);

export default authRouter;