/* istanbul ignore file */
import { AirTableFilters } from '../apiClients/AirTableApiClient';
import { DynamicTemplateData } from '../apiClients/SendGridApiClient';
import apiClients from '../apiClients';
import env from '../env';
import express from 'express';
const { airtableApiClient, sendgridApiClient } = apiClients;

// Redundant interface with DynamicTemplateData. Will be removed in next PR (needed for current Webhooks tests)
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
      const nationBuilderPerson: NationBuilderPerson = {
        // More redundancies
        email,
        firstName,
        phone,
      };
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

      const filters: AirTableFilters = {
        interestCategories,
      };
      const listOfOrganizations = await airtableApiClient.getOrganizations(filters);
      const senderEmailAddress = 'yac6791@gmail.com'; // TODO: ask RiverLA about sender email address
      const recipientEmailAddress = email;
      const emailSubject = 'Test email'; // TODO: ask RiverLA about subject of email sent

      const dynamicTemplateData: DynamicTemplateData = {
        name: nationBuilderPerson.firstName, // More redundancies
        interests: interestCategories.map(category => category.toLowerCase()),
        organizations: listOfOrganizations.map(org => ({
          name: org.name,
          website: org.url,
          email: org.email,
          phoneNumber: org.phoneNumber,
        })),
      };

      try {
        const sgRes = await sendgridApiClient.sendEmail(
          senderEmailAddress,
          recipientEmailAddress,
          emailSubject,
          env.riverLATemplateID,
          dynamicTemplateData,
        );
        return res.send(sgRes);
      } catch (error) {
        res.status(500);
        return res.send({
          error: error,
        });
      }
    } else {
      res.status(500);
      return res.send({
        error: 'person is not volunteer',
      });
    }
  }

  res.status(500);
  return res.send({
    error: 'Token does not match',
  });
});

export default router;
