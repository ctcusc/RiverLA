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
  const nationBuilderPerson: NationBuilderPerson = {
    email: req.body.payload.person.email,
    firstName: req.body.payload.person.first_name,
    phone: req.body.payload.person.phone,
  };
  console.log('NationBuilderPerson', nationBuilderPerson, 'Created');
  res.send();
});

export default router;
