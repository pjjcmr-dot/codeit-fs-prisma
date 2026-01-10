import jwt from 'jsonwebtoken';
import { config } from '#config';

// Access Token 생성 (15분 유효)
export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      userId: user.id,
      name: user.name,
    },
    config.JWT_ACCESS_SECRET,
    {
      expiresIn: '15m',
    },
  );
};

// Refresh Token 생성 (7일 유효)
export const generateRefreshToken = (user) => {
  return jwt.sign({ userId: user.id }, config.JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  });
};

// Access Token + Refresh Token 동시 생성
export const generateTokens = (user) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  return { accessToken, refreshToken };
};

// 토큰 검증
export const verifyToken = (token, tokenType = 'access') => {
  try {
    const secret =
      tokenType === 'access'
        ? config.JWT_ACCESS_SECRET
        : config.JWT_REFRESH_SECRET;
    return jwt.verify(token, secret);
  } catch (error) {
    console.error('Token verification error:', error.message);
    return null;
  }
};
