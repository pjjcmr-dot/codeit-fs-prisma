import express from 'express';
import { postsRouter } from './posts.routes.js';

export const postRouter = express.Router();

// Post CRUD 라우트 연결
postRouter.use('/', postsRouter);
