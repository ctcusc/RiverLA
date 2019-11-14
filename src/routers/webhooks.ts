import express from 'express';
const router = express.Router();

router.use('/', (_, res) => {
  res.send('webhook routers');
});

export default router;
