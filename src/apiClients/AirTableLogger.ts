import apiClients from './index';
import env from '../env';

class AirTableLogger {
  async error(message: string, organizationId?: number) {
    if (env.nodeEnv === 'development') {
      console.log(message);
      if (organizationId != undefined) {
        console.log('OrganizationId: ' + organizationId);
      }
      return true;
    } else {
      return apiClients.airtableApiClient.logError(message, organizationId);
    }
  }
}

export default AirTableLogger;
