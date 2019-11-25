import express from 'express';

interface NationBuilderPerson {
  email: string;
  firstName: string;
  phone: string;
}

const router = express.Router();

router.post('/nationbuilder/personCreated', function(req: any, res: any) {
  if (req.body.payload.person.is_volunteer) {
    const { email, first_name: firstName, phone } = req.body.payload.person;
    const nationBuilderPerson: NationBuilderPerson = {
      email,
      firstName,
      phone,
    };
    console.log(nationBuilderPerson);
    res.json(nationBuilderPerson);
  }
});

export default router;
