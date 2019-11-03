import test from 'ava';
import sinon from 'sinon';
import AirTableApiClient, { Organization } from '../../src/apiClients/AirTableApiClient';
//import env from '../../src/env';

test('Returns one page of results properly', async t => {
  const airtableApiClient: AirTableApiClient = new AirTableApiClient('keyzxy');
  const eachPageStub = sinon.stub().returns(records);
  sinon.stub(airtableApiClient.base, 'select').returns({ eachPage: eachPageStub });
  const organizations: Organization[] = await airtableApiClient.getAllOrganizations();
  //const getOrganizationsStub = sinon.stub(airtableApiClient, 'getAllOrganizations').callsFake(lastStub);
  //getOrganizationsStub();
  const answer: Organization[] = [org1, org2];
  t.deepEqual(organizations, answer);
});

const records: Object = {
  records: [
    {
      id: 'abc123',
      fields: {
        Name: 'Chrysalis Enterprises',
        'River Section': 'Upper',
        Activity: 'Needs Volunteers',
        Description:
          'Chrysalis is a nonprofit organization dedicated to creating a pathway to self-sufficiency for homeless and low-income individuals by providing the res...',
        Email: 'fakeemail@chrysalis.org',
        'Phone Number': '(123) 456-7890',
        URL: 'https://changelives.org/',
        'Interest Categories': ['Water Organizations'],
      },
      createdTime: '2019-10-15T18:32:03.000Z',
    },
    {
      id: 'def456',
      fields: {
        Name: 'Arroyo Seco Foundation',
        'River Section': 'Middle',
        Activity: 'Needs Volunteers',
        Description:
          'Volunteers are contributing in a big way to restoring the beauty and splendor of the Arroyo Seco, and you can make a difference too. Volunteers partic...',
        Email: 'info@arroyoseco.org',
        'Phone Number': '(098) 765-4321',
        URL: 'https://www.arroyoseco.org/getinvolved.htm',
        'Interest Categories': ['Water Organizations', 'Environmental Causes'],
      },
      createdTime: '2019-10-18T22:54:50.000Z',
    },
  ],
};

const org1: Organization = {
  name: 'Arroyo Seco Foundation',
  riverSection: 'Middle',
  activity: 'Needs Volunteers',
  description:
    'Volunteers are contributing in a big way to restoring the beauty and splendor of the Arroyo Seco, and you can make a difference too. Volunteers partic...',
  email: 'info@arroyoseco.org',
  phoneNumber: '(098) 765-4321',
  url: 'https://www.arroyoseco.org/getinvolved.htm',
  interestCategories: ['Water Organizations', 'Environmental Causes'],
};

const org2: Organization = {
  name: 'Chrysalis Enterprises',
  riverSection: 'Upper',
  activity: 'Needs Volunteers',
  description:
    'Chrysalis is a nonprofit organization dedicated to creating a pathway to self-sufficiency for homeless and low-income individuals by providing the res...',
  email: 'fakeemail@chrysalis.org',
  phoneNumber: '(123) 456-7890',
  url: 'https://changelives.org/',
  interestCategories: ['Water Organizations'],
};
