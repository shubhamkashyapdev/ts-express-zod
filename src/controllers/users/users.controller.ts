import { Request, Response } from 'express';
import { UserModel } from '@models/index';
import { resGeneric } from '@utils/utils';
import {
  userByUsernameService,
  userLoginService,
  userRegisterService,
  userRequestOTPService,
} from 'src/services/users.service';
import { handleError } from '@utils/error';
import { rClient } from '@config/redis';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserModel.find();
    const response = resGeneric({
      status_code: 200,
      data: users,
      message: 'Users fetched successfully',
    });
    res.status(200).json(response);
  } catch (err) {
    handleError({ res, err });
  }
};

/**
 * Access: Protected
 * @param {username}
 * Description: Get user account information by username
 */
export const getUserByUsername = async (req: Request, res: Response) => {
  const username = req.params.username as string;
  try {
    const user = await userByUsernameService(username);
    if (!user) {
      const response = resGeneric({
        status_code: 404,
        message: 'User not found',
      });
      return res.status(404).json(response);
    }
    const response = resGeneric({
      status_code: 200,
      message: 'User fetched successfully',
      data: user,
    });
    res.status(200).json(response);
  } catch (err) {
    handleError({ res, err });
  }
};

/**
 * @TODO - Protected
 * Description: Phone number should not be extracted from body instead from the token (authenticated user)
 */
export const requestOTP = async (req: Request, res: Response) => {
  const type = req.params.type as 'phone' | 'email';
  if (type !== 'phone' && type !== 'email') {
    const response = resGeneric({
      status_code: 400,
      message: 'Invalid type',
    });
    return res.status(400).json(response);
  }
  try {
    const { phone, email } = req.body;
    if (type === 'phone' && (!phone || phone.length < 10)) {
      return res
        .status(400)
        .json({ error: 'Please provide a valid phone number' });
    }
    if (type === 'email' && !email) {
      const response = resGeneric({
        status_code: 400,
        message: 'Please provide a valid email address',
      });
      return res.status(400).json(response);
    }
    // check if phone is already verified
    const query = type === 'phone' ? { phone } : { email };
    const user = await UserModel.findOne(query);
    if (!user) {
      const response = resGeneric({
        status_code: 404,
        message: 'User not found',
      });
      return res.status(404).json(response);
    }
    if (type === 'phone' && user?.phone_verified === true) {
      const response = resGeneric({
        status_code: 400,
        message: 'Phone number already verified',
      });
      return res.status(400).json(response);
    }
    if (type === 'email' && user?.email_verified === true) {
      const response = resGeneric({
        status_code: 400,
        message: 'Email address already verified',
      });
      return res.status(400).json(response);
    }
    await userRequestOTPService(type === 'phone' ? phone : email);
    const response = resGeneric({
      status_code: 200,
      message: 'OTP sent successfully',
    });
    res.status(200).json(response);
  } catch (err) {
    if (err instanceof Error) {
      handleError({ res, err });
    }
  }
};

/**
 * @TODO - Protected
 * Description: Phone number should not be extracted from body instead from the token (authenticated user)
 */
export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const reqUser = req.user;
    const type = req.params.type as 'phone' | 'email';
    if (type !== 'phone' && type !== 'email') {
      const response = resGeneric({
        status_code: 400,
        message: 'Invalid type',
      });
      return res.status(400).json(response);
    }
    const { otp, phone, email } = req.body;
    if (!otp) {
      const response = resGeneric({
        status_code: 400,
        message: 'Please provide the OTP',
      });
      return res.status(400).json(response);
    }
    if (type === 'phone' && (!phone || phone.length < 10)) {
      return res
        .status(400)
        .json({ error: 'Please provide a valid phone number' });
    }
    if (type === 'email' && !email) {
      const response = resGeneric({
        status_code: 400,
        message: 'Please provide a valid email address',
      });
      return res.status(400).json(response);
    }
    const query = type === 'phone' ? { phone } : { email };
    const user = await UserModel.findOne(query);
    if (!user) {
      const response = resGeneric({
        status_code: 400,
        message: `Please provide a valid ${
          type === 'phone' ? 'phone number' : 'email address'
        }`,
      });
      return res.status(400).json(response);
    }
    // Verify OTP
    const redis_otp = await rClient.get(`${type === 'phone' ? phone : email}`);
    if (redis_otp !== otp) {
      const response = resGeneric({
        status_code: 400,
        message: 'Invalid OTP',
      });
      return res.status(400).json(response);
    }
    // set user's phone_verified or email_verified to true - based on type
    // if one of the service: email or phone is already verified then set is_verified to true
    if (type === 'phone') {
      user.phone_verified = true;
      if (user.email_verified === true) {
        user.is_verified = true;
      }
    } else {
      user.email_verified = true;
      if (user.phone_verified === true) {
        user.is_verified = true;
      }
    }
    user.save();
    const response = resGeneric({
      status_code: 200,
      message: 'OTP verified successfully',
    });
    res.status(200).json(response);
  } catch (err) {
    handleError({ res, err });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const params = req.body;
    const tokenRes = await userLoginService({
      password: params.password,
      username: params.username,
    });
    if (!tokenRes?.success && tokenRes?.message) {
      const response = resGeneric({
        status_code: 400,
        message: tokenRes.message,
      });
      return res.status(500).json(response);
    }
    const response = resGeneric({
      status_code: 200,
      data: tokenRes?.data as string,
      message: 'Logged in successfully',
    });
    res.status(200).json(response);
  } catch (err) {
    handleError({ res, err });
  }
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const newUser = await userRegisterService(req, res);
    if (!newUser) {
      const response = resGeneric({
        status_code: 500,
        message: 'Failed to register user',
      });
      return res.status(500).json(response);
    }
    const response = resGeneric({
      status_code: 200,
      message: 'User registration successful',
      data: newUser,
    });
    res.status(200).json(response);
  } catch (err) {
    handleError({ res, err });
  }
};
