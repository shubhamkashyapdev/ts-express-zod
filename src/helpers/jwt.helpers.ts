import jwt from 'jsonwebtoken';
import creds from '@config/constants';
import { UserModel } from '@models/index';
import { IJWTPayload, IUser } from '@/types/users';

export const encodeJWT = (user: IUser): string => {
  const payload: IJWTPayload = {
    id: user._id,
  };
  const token = jwt.sign(payload, creds.JWT_SECRET_KEY, {
    expiresIn: creds.JWT_EXPIRATION_TIME,
  });
  return token;
};

export const decodeJWT = async (token: string): Promise<IUser | undefined> => {
  const decoded = jwt.verify(token, creds.JWT_SECRET_KEY) as IJWTPayload;
  const user = (await UserModel.findById(decoded.id).lean()) as
    | IUser
    | undefined;
  return user;
};
