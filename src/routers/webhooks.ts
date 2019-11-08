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
  const { email, first_name: firstName, phone } = req.body.payload.person;
  const nationBuilderPerson: NationBuilderPerson = {
    email,
    firstName,
    phone,
  };
  res.json(nationBuilderPerson);
});

export default router;
