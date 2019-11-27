import env from '../env';
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
    if (env.nationbuilderWebhookToken == 'aFSno6V23BRE9u16fh9w3YtJZHuVyLcbt38SJmNhESFG5uBVdzLJ3g0zTp') {
      console.log(nationBuilderPerson);
      res.json(nationBuilderPerson);
      res.status(200);
    } else {
      res.sendStatus(404);
    }
  }
});

export default router;
