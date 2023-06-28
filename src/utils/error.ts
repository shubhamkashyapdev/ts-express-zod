import { Response } from 'express';
import logger from '@utils/logger';

type ErrorType = {
  res: Response;
  err: unknown;
  status_code?: number;
};

export const handleError = ({
  res,
  err,
  status_code = 500,
}: ErrorType): void => {
  logger.error(err);
  if (err instanceof Error) {
    res.status(status_code).json({
      status_code: status_code,
      error: err.message,
    });
  }
};
