/* istanbul ignore file */
/**
 * Function to get a person's tags after they have been created.
 */
import { InvalidParametersError } from '../errors';
import { Request } from 'express';
import got from 'got';

/**
 * Main client to interact with NationBuilders's API to get a person from NationBuidler's database
 */
class NationBuilderApiClient {
  private apiKey: string;
  /**
   * Creates a new NationBuilder API Client instance.
   *
   * @param apiKey - Refers to the API key for accessing NationBuilder.
   */
  constructor(apiKey: string) {
    if (apiKey === '') {
      throw new InvalidParametersError('NationBuilder API Key is empty.');
    }
    this.apiKey = apiKey;
  }
  /**
   * Get person from NationBuilder
   *
   * @param personId - The id of the person we wish to get
   * @returns the person associated with the person id
   */
  async getPerson(personId: number) {
    try {
      const queryString = personId + '?access_token=' + this.apiKey;
      const temp = await got('https://larivercorp.nationbuilder.com/api/v1/people/' + queryString, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        responseType: 'json',
      });
      const requestBody: Request['body'] = temp.body;
      return requestBody.person;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}

export default NationBuilderApiClient;
