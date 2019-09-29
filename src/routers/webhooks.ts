import express from 'express';
const router = express.Router();

router.use('/', (_, res) => {
    res.send('webhook route');
});

export default router;
