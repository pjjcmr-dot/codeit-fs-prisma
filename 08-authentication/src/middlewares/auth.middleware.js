import { verifyToken } from '../utils/jwt.util.js';
import { prisma } from '#db';

export const authMiddleware = async (req, res, next) => {
  try {
    const { accessToken } = req.cookies;

    if (!accessToken) {
      return res.status(401).json({ message: '인증 정보가 없습니다.' });
    }

    const payload = verifyToken(accessToken, 'access');

    if (!payload) {
      return res.status(401).json({
        message: '인증 정보가 유효하지 않습니다.',
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, name: true },
    });

    if (!user) {
      return res.status(401).json({
        message: '인증 정보와 일치하는 사용자가 없습니다.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('인증 미들웨어 오류:', error);
    return res.status(500).json({
      message: '인증 처리 중 오류가 발생했습니다.',
    });
  }
};
