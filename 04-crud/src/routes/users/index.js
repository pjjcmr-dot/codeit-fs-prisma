import express from 'express';
import { usersRouter } from './users.routes.js';
import { userPostsRouter } from './posts/index.js';

export const userRouter = express.Router();

userRouter.use('/', usersRouter);
userRouter.use('/:id/posts', userPostsRouter);
