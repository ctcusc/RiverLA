/**
 * Client to log errors in AirTable using the AirTable
 * API client.
 *
 * This class contains logError which asynchronosly logs errors
 * to Airtable.
 */

import { ErrorObject } from './AirTableApiClient';
import apiClients from './index';
import env from '../env';

class AirTableLogger {
  /**
   * Takes an error object and stores its information in AirTable.
   * If the NODE_ENV variable is set to development, the error is
   * logged to the console instead.
   *
   * @param error - Error object containing data about an error
   * @returns A promise to a boolean indicating if the error was
   * logged successfully. If in development mode, true is always
   * returned.
   */
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
