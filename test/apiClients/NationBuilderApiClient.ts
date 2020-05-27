import NationBuilderApiClient from '../../src/apiClients/NationBuilderApiClient';
import env from '../../src/env';
import sinon from 'sinon';
import test from 'ava';

const personId = 1234;

/* eslint-disable @typescript-eslint/camelcase */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const person1 = {
  email: 'person1@gmail.com',
  first_name: 'person1',
  is_volunteer: true,
  tags: [
    'Action: Volunteer Yes: Water Organizations',
    'Action: Volunteer Yes: Environmental',
    'Action: Volunteer Yes: People Organizations',
  ],
};
/* eslint-enable @typescript-eslint/camelcase */

test.serial('Checks person object is returned', async t => {
  sinon.stub(env, 'nodeEnv').value('development');
  sinon.stub(env.apiKeys, 'nationbuilder').value('access_token');

  const nationBuilderApiClient = new NationBuilderApiClient('non-empty-key');

  sinon.stub(nationBuilderApiClient, 'getPerson').resolves(person1);

  const personReturned = await nationBuilderApiClient.getPerson(personId);
  t.deepEqual(personReturned, person1);
});
