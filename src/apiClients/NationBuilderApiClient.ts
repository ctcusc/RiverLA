/**
 * Function to get a person's tags after they have been created.
 *
 */
import { Request } from 'express';
import env from '../env';
import got from 'got';

async function getPerson(personId: number) {
  const nationBuilderAccessToken = env.apiKeys.nationbuilder;
  const queryString = personId + '?access_token=' + nationBuilderAccessToken;
  try {
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
    console.log(error.message);
    return error;
  }
}

export default getPerson;
