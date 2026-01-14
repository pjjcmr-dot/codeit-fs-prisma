import express from 'express';
import { userRouter } from './users.routes.js';

export const router = express.Router();

// /api/users 경로에 User 라우터 연결
router.use('/users', userRouter);

// 향후 다른 라우터들도 여기에 추가
// router.use('/posts', postsRouter);
// router.use('/comments', commentsRouter);
