import { userLoginZodSchema, userRegisterSchema } from '@schemas/users.schema';
import { z } from 'zod';

interface IUser {
  id?: string;
  _id: string;
  username: string;
  email: string;
  password: string;
  phone_verified: boolean;
  email_verified: boolean;
  is_verified: boolean;
}

type IUserRegisterParams = z.infer<typeof userRegisterSchema>;
type IUserLoginParams = z.infer<typeof userLoginZodSchema>;

interface IJWTPayload {
  id: string;
}
