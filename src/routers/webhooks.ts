import env from '../env';
import express from 'express';

export interface NationBuilderPerson {
  email: string;
  firstName: string;
  phone: string;
}
const router = express.Router();

router.post('/nationbuilder/personCreated', function(req, res) {
  if (env.nationbuilderWebhookToken === req.body.token) {
    if (req.body.payload.person.is_volunteer) {
      const { email, first_name: firstName, phone } = req.body.payload.person;
      const nationBuilderPerson: NationBuilderPerson = {
        email,
        firstName,
        phone,
      };
      return res.json(nationBuilderPerson);
    }

    return res.sendStatus(200);
  }

  return res.sendStatus(404);
});

export default router;
