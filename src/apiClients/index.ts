import AirTableApiClient from './AirTableApiClient';
import NationBuilderApiClient from './NationBuilderApiClient';
import SendGridApiClient from './SendGridApiClient';
import env from '../env';

export default {
  sendgridApiClient: new SendGridApiClient(env.apiKeys.sendgrid),
  airtableApiClient: new AirTableApiClient(),
  nationBuilderApiClient: new NationBuilderApiClient(env.apiKeys.nationbuilder),
};
