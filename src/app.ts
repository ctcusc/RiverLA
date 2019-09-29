import express from 'express';
import webhookRouter from './routers/webhooks';

const app = express();
app.use('/webhooks', webhookRouter);

export default app;
