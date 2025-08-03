import { Router } from 'express';
import authRouter from './auth.route';

const apiRouter = Router();

apiRouter.use('/auth', authRouter);
// apiRouter.use('/users', userRouter);

// Documentation route (only in development)
if (process.env.NODE_ENV === 'development') {
     // apiRouter.use('/docs', docsRouter);
}

export default apiRouter;