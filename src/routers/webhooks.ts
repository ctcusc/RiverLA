import env from '../env';
import express from 'express';

export interface NationBuilderPerson {
  email: string;
  firstName: string;
  phone: string;
}
const router = express.Router();

router.post('/nationbuilder/personCreated', function(req, res) {
  if (req.body.payload.person.is_volunteer) {
    const { email, first_name: firstName, phone } = req.body.payload.person;
    const nationBuilderPerson: NationBuilderPerson = {
      email,
      firstName,
      phone,
    };
    if (env.nationbuilderWebhookToken === 'aFSno6V23BRE9u16fh9w3YtJZHuVyLcbt38SJmNhESFG5uBVdzLJ3g0zTp9GURy') {
      res.json(nationBuilderPerson);
      res.status(200);
    } else {
      res.status(404).send({
        message: '404: Page Not Found',
      });
    }
  } else {
    if (env.nationbuilderWebhookToken === 'aFSno6V23BRE9u16fh9w3YtJZHuVyLcbt38SJmNhESFG5uBVdzLJ3g0zTp9GURy') {
      res.json({});
      res.status(200);
    } else {
      res.status(404).send({
        message: '404: Page Not Found',
      });
    }
  }
});

export default router;
