import express from 'express';
import { userRouter } from './users/index.js';
import { postRouter } from './posts/index.js';

export const router = express.Router();

router.use('/users', userRouter);
router.use('/posts', postRouter);
