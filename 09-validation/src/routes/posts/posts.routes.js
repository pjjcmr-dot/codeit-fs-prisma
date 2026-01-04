import express from 'express';
import { postRepository } from '#repository';
import { HTTP_STATUS, PRISMA_ERROR, ERROR_MESSAGE } from '#constants';

export const postsRouter = express.Router();

// GET /api/posts - 모든 게시글 조회 (작성자 포함)
postsRouter.get('/', async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await postRepository.getPostsWithPagination(page, limit);
    res.json(result);
  } catch (_) {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ error: ERROR_MESSAGE.FAILED_TO_FETCH_POSTS });
  }
});

// GET /api/posts/search?q=검색어 - 게시글 검색
postsRouter.get('/search', async (req, res) => {
  try {
    const { q: search } = req.query;

    if (!search) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ error: ERROR_MESSAGE.SEARCH_QUERY_REQUIRED });
    }

    const posts = await postRepository.searchPosts(search);
    res.json({ posts });
  } catch (_) {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ error: ERROR_MESSAGE.FAILED_TO_SEARCH_POSTS });
  }
});

// GET /api/posts/published - 공개 게시글만 조회
postsRouter.get('/published', async (req, res) => {
  try {
    const posts = await postRepository.getPublishedPosts();
    res.json({ posts });
  } catch (_) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: ERROR_MESSAGE.FAILED_TO_FETCH_PUBLISHED_POSTS,
    });
  }
});

// GET /api/posts/:id - 특정 게시글 조회 (작성자 포함)
postsRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const post = await postRepository.findPostById(id, {
      author: true,
    });

    if (!post) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ error: ERROR_MESSAGE.POST_NOT_FOUND });
    }

    res.json(post);
  } catch (_) {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ error: ERROR_MESSAGE.FAILED_TO_FETCH_POST });
  }
});

// POST /api/posts - 새 게시글 생성
postsRouter.post('/', async (req, res) => {
  try {
    const { title, content, published, authorId } = req.body;

    if (!title) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ error: ERROR_MESSAGE.TITLE_REQUIRED });
    }

    if (!authorId) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ error: ERROR_MESSAGE.AUTHOR_ID_REQUIRED });
    }

    const newPost = await postRepository.createPost({
      title,
      content,
      published: published ?? false,
      authorId: Number(authorId),
    });

    res.status(HTTP_STATUS.CREATED).json(newPost);
  } catch (_) {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ error: ERROR_MESSAGE.FAILED_TO_CREATE_POST });
  }
});

// PUT /api/posts/:id - 게시글 정보 수정
postsRouter.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, published } = req.body;

    const updatedPost = await postRepository.updatePost(id, {
      title,
      content,
      published,
    });

    res.json(updatedPost);
  } catch (error) {
    if (error.code === PRISMA_ERROR.RECORD_NOT_FOUND) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ error: ERROR_MESSAGE.POST_NOT_FOUND });
    }
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ error: ERROR_MESSAGE.FAILED_TO_UPDATE_POST });
  }
});

// DELETE /api/posts/:id - 게시글 삭제
postsRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await postRepository.deletePost(id);
    res.status(HTTP_STATUS.NO_CONTENT).send();
  } catch (error) {
    if (error.code === PRISMA_ERROR.RECORD_NOT_FOUND) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ error: ERROR_MESSAGE.POST_NOT_FOUND });
    }
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ error: ERROR_MESSAGE.FAILED_TO_DELETE_POST });
  }
});

// POST /api/posts/with-comment - 게시글과 댓글 함께 생성
postsRouter.post('/with-comment', async (req, res) => {
  try {
    const { authorId, title, content, commentContent } = req.body;

    if (!authorId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: ERROR_MESSAGE.AUTHOR_ID_REQUIRED,
      });
    }

    if (!title) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ error: ERROR_MESSAGE.TITLE_REQUIRED });
    }

    if (!commentContent) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: ERROR_MESSAGE.COMMENT_CONTENT_REQUIRED,
      });
    }

    const result = await postRepository.createWithComment(
      authorId,
      { title, content, published: true },
      commentContent,
    );

    res.status(HTTP_STATUS.CREATED).json({
      message: '게시글과 댓글이 함께 생성되었습니다.',
      ...result,
    });
  } catch (_) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: ERROR_MESSAGE.FAILED_TO_CREATE_POST_WITH_COMMENT,
    });
  }
});

// POST /api/posts/batch - 여러 게시글 일괄 생성
postsRouter.post('/batch', async (req, res) => {
  try {
    const { posts } = req.body;

    if (!posts) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: ERROR_MESSAGE.POSTS_ARRAY_REQUIRED,
      });
    }

    if (!Array.isArray(posts)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: ERROR_MESSAGE.INVALID_POSTS_ARRAY,
      });
    }

    const result = await postRepository.createMultiple(posts);

    res.status(HTTP_STATUS.CREATED).json({
      message: `${result.length}개의 게시글이 생성되었습니다.`,
      posts: result,
    });
  } catch (_) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: ERROR_MESSAGE.FAILED_TO_CREATE_MULTIPLE_POSTS,
    });
  }
});

// DELETE /api/posts/:id - 게시글과 댓글 함께 삭제
postsRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await postRepository.deleteWithComments(id);

    res.json({
      message: '게시글과 댓글이 삭제되었습니다.',
      ...result,
    });
  } catch (error) {
    if (error.code === PRISMA_ERROR.RECORD_NOT_FOUND) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ error: ERROR_MESSAGE.POST_NOT_FOUND });
    }
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: ERROR_MESSAGE.FAILED_TO_DELETE_POST_WITH_COMMENTS,
    });
  }
});
