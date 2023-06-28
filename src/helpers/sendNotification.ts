import creds from '@config/constants';
import axios from 'axios';
import logger from '@utils/logger';
export const sendNotification = async (
  message: string,
  success_message: string,
  error_message: string,
) => {
  const payload = {
    text: message,
  };
  const response = await axios.post(creds.SLACK_WEBHOOK_URL || '', payload);
  if (response.data === 'ok') {
    logger.info(success_message);
    return success_message;
  } else {
    logger.error(error_message);
    throw new Error(error_message);
  }
};
