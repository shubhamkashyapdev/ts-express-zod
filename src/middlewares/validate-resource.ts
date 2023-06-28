import { handleError } from '@utils/error';
import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';

export const validateResource =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (err: unknown) {
      handleError({ res, err, status_code: 400 });
    }
  };
