import express from 'express';
import { userPostsRouter } from './user-posts.routes.js';

export const postsRouter = express.Router({
  mergeParams: true,
});

postsRouter.use('/', userPostsRouter);
