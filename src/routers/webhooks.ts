import express from 'express';
const router = express.Router();

router.use('/', (_, res, next) => {
  next();
});

router.post('/nationbuilder/personCreated', function(req, res) {
  // console.log(req.body.payload); // This contains the information from nationbuilder
  res.send('Got a POST request');
});

export default router;
