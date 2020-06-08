/**
 * Uses Express to respond to all client POST requests.
 */
import { AirTableFilters } from '../apiClients/AirTableApiClient';
import { DynamicTemplateData } from '../apiClients/SendGridApiClient';
import apiClients from '../apiClients';
import env from '../env';
import express from 'express';
const { airtableApiClient, sendgridApiClient, nationBuilderApiClient } = apiClients;

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
  console.log('Received event, validating...');
  if (env.nationbuilderWebhookToken === req.body.token) {
    if (req.body.payload.person.is_volunteer) {
      console.log(req.body.payload.person);
      try {
        const personId = req.body.payload.person.id;

        const { email, first_name: firstName, tags } = await nationBuilderApiClient.getPerson(personId);
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
        const sgRes = await sendgridApiClient.sendEmail(
          senderEmailAddress,
          recipientEmailAddress,
          emailSubject,
          env.riverLATemplateID,
          dynamicTemplateData,
        );
        console.log('Sending email to volunteer 📬');
        return res.send(sgRes);
      } catch (error) {
        console.log(error);
        res.status(400);
        return res.send({
          error: 'Error found in sending email within timeout',
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
