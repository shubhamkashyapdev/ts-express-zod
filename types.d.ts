import type { IUser } from 'src/types/users';
import * as express from 'express';

declare global {
  namespace Express {
    interface Request {
      twitterId?: string;
      client: any;
      user: IUser | null;
    }
  }
}
