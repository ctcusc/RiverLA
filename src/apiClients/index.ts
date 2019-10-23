import AirTableApiClient from './AirtableApiClient';
import SendGridApiClient from './SendgridApiClient';
import env from '../env';

export default {
  sendgridApiClient: new SendGridApiClient(env.apiKeys.sendgrid),
  airtableApiClient: new AirTableApiClient(env.apiKeys.airtable),
};
