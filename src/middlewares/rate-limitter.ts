import { Request, Response, NextFunction } from 'express';
import { rClient } from '../config/redis';
import logger from '@utils/logger';

export const rateLimiter = (MAX_CALLS: number, WINDOW_SECONDS: number) => {
  return async function (req: Request, res: Response, next: NextFunction) {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const url = req.path;
    const key = `${url}:ip:${ip}`;

    // increment request hit
    const requests = await rClient.incr(key);

    if (requests <= 1) {
      await rClient.expire(key, WINDOW_SECONDS);
    }

    const ttl = await rClient.ttl(key);
    console.log('-------------------------------------------');
    console.log(
      `Number of requests made so far: ${requests} on: ${url} and the limiter will reset in ${ttl}`,
    );

    if (requests > MAX_CALLS) {
      return res.status(503).json({
        status: 'error',
        callsInMinute: MAX_CALLS,
        ttl,
      });
    } else {
      logger.info(
        `Number of requests made so far: ${requests} on: ${url} and the limiter will reset in ${ttl}`,
      );
      next();
    }
  };
};
