import apiClients from '../apiClients';
import express from 'express';
const { airtableApiClient, sendgridApiClient } = apiClients;

interface NationBuilderPerson {
  email: string;
  firstName: string;
  phone: string;
  interests: {
    water: boolean;
    environmental: boolean;
    people: boolean;
  };
}

const router = express.Router();

router.post('/nationbuilder/personCreated', function(req, res) {
  const { email, first_name: firstName, phone, tags } = req.body.payload.person;
  let interests = {
    water: true,
    environmental: true,
    people: true,
  };
  if (tags.includes('Action: Volunteer Yes: All activities')) {
    interests = {
      water: true,
      environmental: true,
      people: true,
    };
  } else {
    interests = {
      water: tags.includes('Action: Volunteer Yes: Water Organizations'),
      environmental: tags.includes('Action: Volunteer Yes: Environmental'),
      people: tags.includes('Action: Volunteer Yes: People Organizations'),
    };
  }

  const nationBuilderPerson: NationBuilderPerson = {
    email,
    firstName,
    phone,
    interests,
  };

  console.log(sendgridApiClient, airtableApiClient); // adding to get rid of error
  //TODO: use airtableapi to bring in organization data and use it to send an email to the client.

  res.json(nationBuilderPerson); // TODO: don't need this anymore?
});

export default router;
