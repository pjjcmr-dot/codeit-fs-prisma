import { isProduction } from '#config';
import { flattenError } from 'zod';
import { HTTP_STATUS, ERROR_MESSAGE } from '#constants';

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const { fieldErrors } = flattenError(result.error);

    if (isProduction) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: ERROR_MESSAGE.INVALID_INPUT,
      });
    }

    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: ERROR_MESSAGE.VALIDATION_FAILED,
      details: fieldErrors,
    });
  }

  req.body = result.data;
  next();
};
