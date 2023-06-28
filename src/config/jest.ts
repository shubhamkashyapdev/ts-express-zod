import dotenv from 'dotenv';
dotenv.config();
import Redis from 'ioredis';
import mongoose from 'mongoose';
import CREDS from '@config/constants';
let rClient: Redis;

export const before = async () => {
  rClient = await new Redis();
  const URI = CREDS.TEST_MONGO_URI;
  await mongoose.connect(URI);
};

export const after = async () => {
  await rClient.quit();
  await mongoose.disconnect();
};
