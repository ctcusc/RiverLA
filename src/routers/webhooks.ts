import express from 'express';

interface NationBuilderPerson {
  email: string;
  firstName: string;
  phone: string;
}

const router = express.Router();

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
