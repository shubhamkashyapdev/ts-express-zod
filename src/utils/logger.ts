import logger from 'pino';
import dayjs from 'dayjs';

const log = logger(
  {
    prettifier: true,
    timestamp: () =>
      `,"time:"${dayjs(Date.now() + 330 * 60 * 1000).format(
        'YYYY-MM-DD HH:mm:ss',
      )}`,
  },
  logger.destination(`${__dirname}/app.log`),
);

export default log;
