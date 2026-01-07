import express from 'express';
import { hashPassword, comparePassword } from '#utils/hash.util.js';
import { generateTokens } from '#utils/jwt.util.js';
import { setAuthCookies } from '#utils/cookie.util.js';
import { validate } from '#middlewares/validation.middleware.js';
import { HTTP_STATUS, ERROR_MESSAGE } from '#constants';
import { signUpSchema, loginSchema } from './auth.schemas.js';
import { usersRepository } from '#repository';

export const authRouter = express.Router();

authRouter.post('/signup', validate(signUpSchema), async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    const hashedPassword = await hashPassword(password);

    const user = await usersRepository.createUser({
      email,
      password: hashedPassword,
      name,
    });

    const tokens = generateTokens(user);
    setAuthCookies(res, tokens);

    const { password: _, ...userWithoutPassword } = user;
    res.status(HTTP_STATUS.CREATED).json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
});

authRouter.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await usersRepository.findUserByEmail(email);

    if (!user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        error: ERROR_MESSAGE.INVALID_CREDENTIALS,
      });
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        error: ERROR_MESSAGE.INVALID_CREDENTIALS,
      });
    }

    const tokens = generateTokens(user);
    setAuthCookies(res, tokens);

    const { password: _, ...userWithoutPassword } = user;
    res.status(HTTP_STATUS.OK).json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
});
