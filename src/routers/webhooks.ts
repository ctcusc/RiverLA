/* istanbul ignore file */
import { AirTableFilters } from '../apiClients/AirTableApiClient';
import { DynamicTemplateData } from '../apiClients/SendGridApiClient';
import apiClients from '../apiClients';
import env from '../env';
import express from 'express';
const { airtableApiClient, sendgridApiClient } = apiClients;

interface Interests {
  water: boolean;
  environmental: boolean;
  people: boolean;
}

export interface NationBuilderPerson {
  email: string;
  firstName: string;
  phone: string;
  interests: Interests;
}

const router = express.Router();

function getInterestCategoriesFromPayload(interests: Interests) {
  const categories: string[] = [];
  if (interests.water) {
    categories.push('Water Organization');
  }
  if (interests.environmental) {
    categories.push('Environmental Causes');
  }
  if (interests.people) {
    categories.push('Social Justice and Recreation');
  }
  return categories;
}

router.post('/nationbuilder/personCreated', async function(req, res) {
  if (env.nationbuilderWebhookToken === req.body.token) {
    if (req.body.payload.person.is_volunteer) {
      const { email, first_name: firstName, phone, tags } = req.body.payload.person;
      let interests = {
        water: true,
        environmental: true,
        people: true,
      };
      if (!tags.includes('Action: Volunteer Yes: All activities')) {
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

      const interestCategories = getInterestCategoriesFromPayload(interests);
      const filters: AirTableFilters = {
        interestCategories: interestCategories,
        riverSections: [],
      };

      const listOfOrganizations = await airtableApiClient.getOrganizations(filters);
      const senderEmailAddress = 'yac6791@gmail.com'; // TODO: ask RiverLA about sender email address
      const recipientEmailAddress = 'yac6791@gmail.com'; // nationBuilderPerson.email
      const emailSubject = 'Test email'; // TODO: ask RiverLA about subject of email sent

      const dynamicTemplateData: DynamicTemplateData = {
        name: nationBuilderPerson.firstName,
        interests: interestCategories.map(category => ({ name: category.toLowerCase() })),
        organizations: listOfOrganizations.map(org => ({
          name: org.name,
          website: org.url,
          email: org.email,
          phoneNumber: org.phoneNumber,
        })),
      };

      const sgRes = await sendgridApiClient.sendEmail(
        senderEmailAddress,
        recipientEmailAddress,
        emailSubject,
        env.riverLATemplateID,
        dynamicTemplateData,
      );

      res.send(sgRes);
    }

    return res.sendStatus(200);
  }

  return res.sendStatus(404);
});

export default router;
