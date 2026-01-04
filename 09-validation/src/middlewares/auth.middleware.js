import { verifyToken } from '#utils/jwt.util.js';
import { prisma } from '#db';
import { HTTP_STATUS, ERROR_MESSAGE } from '#constants';

export const authMiddleware = async (req, res, next) => {
  try {
    const { accessToken } = req.cookies;

    if (!accessToken) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ error: ERROR_MESSAGE.NO_AUTH_TOKEN });
    }

    const payload = verifyToken(accessToken, 'access');

    if (!payload) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        error: ERROR_MESSAGE.INVALID_TOKEN,
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, name: true },
    });

    if (!user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        error: ERROR_MESSAGE.USER_NOT_FOUND_FROM_TOKEN,
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('인증 미들웨어 오류:', error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: ERROR_MESSAGE.AUTH_FAILED,
    });
  }
};
