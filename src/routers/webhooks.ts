/* istanbul ignore file */
/**
 * Uses Express to respond to all client POST requests.
 */
import { AirTableFilters } from '../apiClients/AirTableApiClient';
import { DynamicTemplateData } from '../apiClients/SendGridApiClient';
import apiClients from '../apiClients';
import env from '../env';
import express from 'express';
const { airtableApiClient, sendgridApiClient } = apiClients;

const router = express.Router();

/**
 * Main function to handle client requests. Works by checking to see if the payload is valid,
 * grabbing the necessary parameters from the payload, parsing the interest categories, using the
 * [[AirTableFilters]] class to get the list of matched organizations, and then uses the [[SendGridApiClient]]
 * class to send a properly formatted email with this information.
 *
 * @param req - A Request object that contains the payload sent by the client.
 * @param res - A Response object that returns to the client the HTTP status code and any error message pertaining to the request.
 * @returns A Promise to resolve sending the appropriate response message.
 */
router.post('/nationbuilder/personCreated', async function(req, res) {
  if (env.nationbuilderWebhookToken === req.body.token) {
    if (req.body.payload.person.is_volunteer) {
      const { email, first_name: firstName, tags } = req.body.payload.person;
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

      console.log(listOfOrganizations);

      const senderEmailAddress = 'info@riverla.org';
      const recipientEmailAddress = email;
      const emailSubject = 'RiverLA has found you a volunteering match!';

      const dynamicTemplateData: DynamicTemplateData = {
        name: firstName,
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
      res.status(400);
      return res.send({
        error: 'The person is not a volunteer',
      });
    }
  }

  res.status(400);
  return res.send({
    error: 'The NationBuilder token does not match',
  });
});

export default router;
