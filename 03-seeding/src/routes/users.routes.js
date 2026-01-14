import express from 'express';
import { userRepository } from '#repository';
import { HTTP_STATUS, PRISMA_ERROR, ERROR_MESSAGE } from '#constants';

export const userRouter = express.Router();

// GET /api/users - 모든 사용자 조회
userRouter.get('/', async (req, res) => {
  try {
    const users = await userRepository.findAllUsers();
    res.json(users);
  } catch (_) {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ error: ERROR_MESSAGE.FAILED_TO_FETCH_USERS });
  }
});

// GET /api/users/:id - 특정 사용자 조회
userRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userRepository.findUserById(id);

    if (!user) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ error: ERROR_MESSAGE.USER_NOT_FOUND });
    }

    res.json(user);
  } catch (_) {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ error: ERROR_MESSAGE.FAILED_TO_FETCH_USER });
  }
});

// POST /api/users - 새 사용자 생성
userRouter.post('/', async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ error: ERROR_MESSAGE.EMAIL_REQUIRED });
    }

    const newUser = await userRepository.createUser({
      email,
      name,
    });

    res.status(HTTP_STATUS.CREATED).json(newUser);
  } catch (error) {
    // Prisma 에러: 이메일 중복 (unique constraint)
    if (error.code === PRISMA_ERROR.UNIQUE_CONSTRAINT) {
      return res.status(HTTP_STATUS.CONFLICT).json({
        error: ERROR_MESSAGE.EMAIL_ALREADY_EXISTS,
      });
    }
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ error: ERROR_MESSAGE.FAILED_TO_CREATE_USER });
  }
});

// PATCH /api/users/:id - 사용자 정보 수정
userRouter.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { email, name } = req.body;

    const updatedUser = await userRepository.updateUser(id, {
      email,
      name,
    });

    res.json(updatedUser);
  } catch (error) {
    // Prisma 에러: 레코드를 찾을 수 없음
    if (error.code === PRISMA_ERROR.RECORD_NOT_FOUND) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ error: ERROR_MESSAGE.USER_NOT_FOUND });
    }
    // Prisma 에러: 이메일 중복
    if (error.code === PRISMA_ERROR.UNIQUE_CONSTRAINT) {
      return res.status(HTTP_STATUS.CONFLICT).json({
        error: ERROR_MESSAGE.EMAIL_ALREADY_EXISTS,
      });
    }
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ error: ERROR_MESSAGE.FAILED_TO_UPDATE_USER });
  }
});

// DELETE /api/users/:id - 사용자 삭제
userRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await userRepository.deleteUser(id);
    res.status(HTTP_STATUS.NO_CONTENT).send();
  } catch (error) {
    if (error.code === PRISMA_ERROR.RECORD_NOT_FOUND) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ error: ERROR_MESSAGE.USER_NOT_FOUND });
    }
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ error: ERROR_MESSAGE.FAILED_TO_DELETE_USER });
  }
});
