import { resGeneric } from '@utils/utils';
import { Response } from 'express';

export const resourceNotFound = (
  resource: unknown,
  notFoundMessage: string,
  res: Response,
) => {
  if (!resource) {
    const response = resGeneric({
      status_code: 404,
      message: notFoundMessage,
    });
    res.status(404).json(response);
  }
};
