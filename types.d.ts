import { IUser } from 'src/types/users';
import * as express from 'express';

declare global {
  namespace Express {
    interface Request {
      user: IUser | null;
    }
  }
}
