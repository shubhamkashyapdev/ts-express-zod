import mongoose from 'mongoose';
import CREDS from '@config/constants';
import logger from '@utils/logger';
export const connectDB = async () => {
  try {
    let env = '';
    if (CREDS.NODE_ENV === 'TESTING') {
      env = 'TESTING';
      await mongoose.connect(CREDS.TEST_MONGO_URI);
    }
    if (CREDS.NODE_ENV === 'DEVELOPMENT') {
      env = 'DEVELOPMENT';
      await mongoose.connect(CREDS.DEV_MONGO_URI);
    }
    if (CREDS.NODE_ENV === 'STAGING') {
      env = 'STAGING';
      await mongoose.connect(CREDS.STAGING_MONGO_URI);
    }
    if (CREDS.NODE_ENV === 'PRODUCTION') {
      env = 'PRODUCTION';
      await mongoose.connect(CREDS.PROD_MONGO_URI);
    }
    console.log(`MongoDB connection established in ${env} environment`);
  } catch (err) {
    if (err instanceof Error) {
      logger.fatal(`MongoDB connection failed: ${err.message}`);
    }
    console.error(err);
  }
};
