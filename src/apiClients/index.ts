import AirTableApiClient from './AirTableApiClient';
import SendGridApiClient from './SendGridApiClient';
import env from '../env';

export default {
  sendgridApiClient: new SendGridApiClient(env.apiKeys.sendgrid),
  airtableApiClient: new AirTableApiClient(),
};
