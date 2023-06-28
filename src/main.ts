import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response } from 'express';
import { connectDB } from '@config/connectDB';
import cors from 'cors';

// IMPORT ROUTERS
import userRouter from '@routers/users.router';

import { rClient } from '@config/redis';
import logger from '@utils/logger';
import { rateLimiter } from '@middlewares/rate-limitter';

const PORT = process.env.PORT || 4545;
export const app = express();
// MIDDLEWARES
app.use(express.json());
app.use(
  cors({
    origin: '*',
  }),
);

app.get('/', (req: Request, res: Response) => {
  res.redirect(`http://localhost:${PORT}/api/v1`);
});

app.get('/api/v1', rateLimiter(10, 30), (req, res) => {
  res.status(200).json({
    message: 'API IS WORKING',
    status_code: 200,
  });
});

// REGISTER ROUTERS
app.use('/api/v1/users', userRouter);

app.listen(PORT, async () => {
  console.log(
    `[ ready ] http://localhost:${PORT} IN ${process.env.NODE_ENV} ENVIRONMENT`,
  );
  await rClient.set('Ping', 'Pong');
  logger.info(await rClient.get('Ping'));
  connectDB();
});
