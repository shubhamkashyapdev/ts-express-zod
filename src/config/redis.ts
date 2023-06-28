import Redis from 'ioredis';
import CREDS from '@config/constants';

export const rClient =
  CREDS.NODE_ENV === 'STAGING' || CREDS.NODE_ENV === 'PRODUCTION'
    ? new Redis(`redis://${CREDS.REDIS_URL}:${CREDS.REDIS_PORT}`)
    : new Redis();
