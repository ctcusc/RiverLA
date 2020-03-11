/* istanbul ignore file */
import express, { NextFunction, Request, Response } from 'express';
import { HttpException } from './errors';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import logger from 'morgan';
import webhookRouter from './routers/webhooks';

const app = express();
app.use(helmet());
app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use('/webhooks', webhookRouter);

// error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: HttpException, req: Request, res: Response, next: NextFunction) => {
  res.status(err.code).json(err);
});

export default app;
