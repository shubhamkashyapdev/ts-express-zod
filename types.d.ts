import { Admin, TwitterClient, User } from 'src/types';
import * as express from 'express';

declare global {
  namespace Express {
    interface Request {
      twitterId?: string;
      client: any;
      user: User | Admin | null;
    }
  }
}
