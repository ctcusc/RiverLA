interface NationBuilderPerson {
  email: string;
  firstName: string;
  phone: string;
}

import express from 'express';
const router = express.Router();

router.use('/', (_, res, next) => {
  next();
});

router.post('/nationbuilder/personCreated', function(req, res) {
  // eslint-disable-next-line @typescript-eslint/camelcase
  const { email, first_name, phone } = req.body.payload.person;
  const nationBuilderPerson: NationBuilderPerson = {
    email: email,
    // eslint-disable-next-line @typescript-eslint/camelcase
    firstName: first_name,
    phone: phone,
  };
  res.json(nationBuilderPerson);
});

export default router;
