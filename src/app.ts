import bodyParser from 'body-parser';
import express from 'express';
import helmet from 'helmet';
import logger from 'morgan';
import webhookRouter from './routers/webhooks';

const app = express();
app.use(helmet());
app.use(logger('dev'))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use('/webhooks', webhookRouter);

export default app;
