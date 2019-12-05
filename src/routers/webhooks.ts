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
      res.json(nationBuilderPerson);
      res.status(200);
    } else {
      res.json({});
      res.status(200);
    }
  } else {
    res.status(404).send({
      message: '404: Page Not Found',
    });
  }
});

export default router;
