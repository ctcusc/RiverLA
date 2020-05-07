import env from '../../src/env';
import getPerson from '../../src/apiClients/NationBuilderApiClient';
import sinon from 'sinon';
import test from 'ava';

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
  sinon.stub(env, 'nationBuilderAccessToken').value('access_token');
  const getPersonStub = sinon.stub(getPerson, 'getPerson').returns(person1);
  t.deepEqual(getPersonStub.result, person1);
});
