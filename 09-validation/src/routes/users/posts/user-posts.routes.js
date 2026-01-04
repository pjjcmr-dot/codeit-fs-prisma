import express from 'express';
import { usersRepository } from '#repository';
import { HTTP_STATUS, ERROR_MESSAGE } from '#constants';

// ⭐ mergeParams: true
// 부모 라우터(users)의 :id를 자식 라우터에서도 사용 가능
export const userPostsRouter = express.Router({
  mergeParams: true,
});

// GET /api/users/:id/posts - 사용자와 게시글 함께 조회
userPostsRouter.get('/', async (req, res) => {
  try {
    // mergeParams 덕분에 부모의 :id를 사용 가능
    const { id } = req.params;
    const user = await usersRepository.findUserWithPosts(Number(id));

    if (!user) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ error: ERROR_MESSAGE.USER_NOT_FOUND });
    }

    res.json(user);
  } catch (_) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: ERROR_MESSAGE.FAILED_TO_FETCH_USER_WITH_POSTS,
    });
  }
});
