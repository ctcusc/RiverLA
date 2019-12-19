import { ErrorObject } from './AirTableApiClient';
import apiClients from './index';
import env from '../env';

class AirTableLogger {
  async logError(error: ErrorObject) {
    if (env.nodeEnv === 'development') {
      console.log(error);
      return true;
    } else {
      return apiClients.airtableApiClient.logError(error);
    }
  }
}

export default AirTableLogger;
