import express from 'express';
const router = express.Router();

router.use('/', (_, res) => {
  res.send('webhook');
});

export default router;
