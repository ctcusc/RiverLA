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
}

const router = express.Router();

router.post('/nationbuilder/personCreated', async function(req, res) {
  if (env.nationbuilderWebhookToken === req.body.token) {
    if (req.body.payload.person.is_volunteer) {
      const { email, first_name: firstName, phone, tags } = req.body.payload.person;
      const allActivities = tags.includes('Action: Volunteer Yes: All activities');

      // Find the mapping for these at: https://airtable.com/tblRHydYMl58f1rO8/viwTkGdSzyYX1i7Bn?blocks=hide
      const interestCategories: string[] = [];
      if (tags.includes('Action: Volunteer Yes: Water Organizations') || allActivities) {
        interestCategories.push('Water Organizations');
      }
      if (tags.includes('Action: Volunteer Yes: Environmental') || allActivities) {
        interestCategories.push('Environmental Causes');
      }
      if (tags.includes('Action: Volunteer Yes: People Organizations') || allActivities) {
        interestCategories.push('Social Justice and Recreation');
      }

      const nationBuilderPerson: NationBuilderPerson = {
        email,
        firstName,
        phone,
      };

      const filters: AirTableFilters = {
        interestCategories,
      };
      console.log(interestCategories);
      const listOfOrganizations = await airtableApiClient.getOrganizations(filters);
      console.log('organizatoins:', listOfOrganizations);
      const senderEmailAddress = 'yac6791@gmail.com'; // TODO: ask RiverLA about sender email address
      const recipientEmailAddress = 'yac6791@gmail.com'; // nationBuilderPerson.email
      const emailSubject = 'Test email'; // TODO: ask RiverLA about subject of email sent

      const dynamicTemplateData: DynamicTemplateData = {
        name: nationBuilderPerson.firstName,
        interests: interestCategories.map(category => category.toLowerCase()),
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
