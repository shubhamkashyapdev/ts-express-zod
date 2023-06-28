import { encodeJWT } from '@helpers/jwt.helpers';
import { resourceNotFound } from '@helpers/resource.helpers';
import { UserModel } from '@models/index';
import { Response, Request } from 'express';
import { IUser, IUserLoginParams } from 'src/types/users';
import { sendNotification } from '@helpers/sendNotification';
import { rClient } from '@config/redis';

export const userByUsernameService = async (
  username: string,
): Promise<IUser | undefined> => {
  const user = (await UserModel.findOne({ username }).lean()) as
    | IUser
    | undefined;
  return user;
};

export const userLoginService = async (
  params: IUserLoginParams['body'],
): Promise<
  { success: boolean; message?: string; data?: string } | undefined
> => {
  try {
    const user = (await UserModel.findOne({
      username: params.username,
    }).lean()) as IUser;
    if (!user || user.password !== params.password) {
      return { success: false, message: 'Invalid username or password' };
    }
    if (!user.is_verified)
      return {
        success: false,
        message: 'Please verify your account before logging in',
      };
    const token = encodeJWT(user);
    return { success: true, data: token };
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }
  }
};

export const userRegisterService = async (
  req: Request,
  res: Response,
): Promise<IUser | undefined> => {
  try {
    const user = (await UserModel.findOne({
      username: req.body.username,
    }).lean()) as IUser | undefined;
    if (user) {
      resourceNotFound(user, 'User with provided username already exists', res);
    }
    const newUser = await UserModel.create(req.body);
    return newUser;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }
  }
};

export const userRequestOTPService = async (service: string) => {
  try {
    const otp = Math.floor(Math.random() * 99999)
      .toString()
      .substring(0, 4);
    //@TODO: send OTP to the phone number itself instead of slack
    await sendNotification(otp, 'OTP sent successfully', 'Failed to send OTP');
    // OTP is valid for 60 seconds
    rClient.set(`${service}`, otp, 'EX', 60);
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }
  }
};
