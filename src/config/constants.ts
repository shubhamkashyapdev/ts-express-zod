export default {
  JWT_SECRET_KEY: `${process.env.JWT_SECRET_KEY}`,
  JWT_EXPIRATION_TIME: `${process.env.JWT_EXPIRATION_TIME}`,
  TEST_MONGO_URI: `${process.env.TEST_MONGO_URI}`,
  DEV_MONGO_URI: `${process.env.DEV_MONGO_URI}`,
  STAGING_MONGO_URI: `${process.env.STAGING_MONGO_URI}`,
  PROD_MONGO_URI: `${process.env.PROD_MONGO_URI}`,
  NODE_ENV: process.env.NODE_ENV,
  REDIS_URL: process.env.REDIS_URL,
  REDIS_PORT: process.env.REDIS_PORT,
  SLACK_WEBHOOK_URL: process.env.SLACK_WEBHOOK_URL,
  SLACK_CHANNEL: `${process.env.SLACK_CHANNEL}`,
  OPENAI_API_KEY: `${process.env.OPENAI_API_KEY}`,
};
