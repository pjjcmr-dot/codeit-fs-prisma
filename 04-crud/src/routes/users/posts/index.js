import express from 'express';
import { userPostsRouter as router } from './user-posts.routes.js';

export const userPostsRouter = express.Router({
  mergeParams: true,
});

userPostsRouter.use('/', router);
