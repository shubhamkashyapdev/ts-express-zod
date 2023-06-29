import { decodeJWT } from '@helpers/jwt.helpers';
import { IJWTPayload, IUser } from '@/types/users';
import { NextFunction, Response, Request } from 'express';
import { handleError } from '@utils/error';
import { resGeneric } from '@utils/utils';

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const tokenPayload = req.headers['authorization'];
  const token = tokenPayload?.split('Bearer')[1].trim();
  if (!token) {
    const response = resGeneric({ status_code: 401, message: 'Invalid token' });
    return res.status(400).json(response);
  }
  try {
    const jwtUser = await decodeJWT(token);
    if (!jwtUser) {
      const response = resGeneric({
        status_code: 404,
        message: 'User not found',
      });
      return res.status(404).json(response);
    }
    if (jwtUser) {
      req.user = jwtUser;
      next();
    }
  } catch (err) {
    if (err instanceof Error) {
      handleError({ res, err });
    }
  }
};
