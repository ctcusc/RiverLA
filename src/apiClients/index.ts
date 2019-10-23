import SendGridApiClient from './SendgridApiClient';
import env from '../env';
import AirTableApiClient from './AirtableApiClient';

export default {
  sendgridApiClient: new SendGridApiClient(env.apiKeys.sendgrid),
  airtableApiClient: new AirTableApiClient(env.apiKeys.airtable),
};
