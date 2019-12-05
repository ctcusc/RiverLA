import AirTableApiClient, { AirTableFilters, Organization } from '../../src/apiClients/AirTableApiClient';
import env from '../../src/env';
import nock from 'nock';
import sinon from 'sinon';
import test from 'ava';

const AIRTABLE_API_URL = `https://api.airtable.com/v0/${env.airtableBaseId}`;

const records: any = [
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
  {
    id: 'ghi789',
    fields: {
      Name: 'ctc',
      'River Section': 'Lower',
      Activity: 'Needs Volunteers',
      Description: 'test data',
      Email: 'fakeemail@chrysalis.org',
      'Phone Number': '(999) 999-9999',
      URL: 'https://changelives.org/',
      'Interest Categories': ['Social Justice and Recreation'],
    },
    createdTime: '2019-10-18T22:54:50.000Z',
  },
];

const org2: Organization = {
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

const org1: Organization = {
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

const org3: Organization = {
  name: 'ctc',
  riverSection: 'Lower',
  activity: 'Needs Volunteers',
  description: 'test data',
  email: 'fakeemail@chrysalis.org',
  phoneNumber: '(999) 999-9999',
  url: 'https://changelives.org/',
  interestCategories: ['Social Justice and Recreation'],
};

test.beforeEach(() => {
  nock.disableNetConnect();
});

test.afterEach(() => {
  nock.cleanAll();
  nock.enableNetConnect();
});

test.serial('Returns one page of results properly', async t => {
  const airtableApiClient: AirTableApiClient = new AirTableApiClient();

  nock(AIRTABLE_API_URL)
    .get('/Organizations')
    .query({ view: 'Grid view' })
    .reply(200, {
      records,
    });

  const organizations: Organization[] = await airtableApiClient.getOrganizations();
  const answer: Organization[] = [org1, org2, org3];
  t.deepEqual(organizations, answer);
});

test.serial('Returns one page of filtered river results properly', async t => {
  const airtableApiClient: AirTableApiClient = new AirTableApiClient();

  nock(AIRTABLE_API_URL)
    .get('/Organizations')
    .query({ view: 'Grid view' })
    .reply(200, {
      records,
    });

  const airTableFilters: AirTableFilters = {
    riverSections: ['Middle'],
  };

  const organizations: Organization[] = await airtableApiClient.getOrganizations(airTableFilters);
  const answer: Organization[] = [org2];
  t.deepEqual(organizations, answer);
});

test.serial('Returns one page of filtered interest categories results properly', async t => {
  const airtableApiClient: AirTableApiClient = new AirTableApiClient();

  nock(AIRTABLE_API_URL)
    .get('/Organizations')
    .query({ view: 'Grid view' })
    .reply(200, {
      records,
    });

  const airTableFilters: AirTableFilters = {
    interestCategories: ['Environmental Causes'],
  };

  const organizations: Organization[] = await airtableApiClient.getOrganizations(airTableFilters);
  const answer: Organization[] = [org2];
  t.deepEqual(organizations, answer);
});

test.serial('Returns one page of filtered both empty results properly', async t => {
  const airtableApiClient: AirTableApiClient = new AirTableApiClient();

  nock(AIRTABLE_API_URL)
    .get('/Organizations')
    .query({ view: 'Grid view' })
    .reply(200, {
      records,
    });

  const airTableFilters: AirTableFilters = {
    riverSections: ['Middle'],
    interestCategories: ['Social Justice and Recreation'],
  };

  const organizations: Organization[] = await airtableApiClient.getOrganizations(airTableFilters);
  const answer: Organization[] = [];
  t.deepEqual(organizations, answer);
});

test.serial('Returns one page of filtered both results properly', async t => {
  const airtableApiClient: AirTableApiClient = new AirTableApiClient();

  nock(AIRTABLE_API_URL)
    .get('/Organizations')
    .query({ view: 'Grid view' })
    .reply(200, {
      records,
    });

  const airTableFilters: AirTableFilters = {
    riverSections: ['Middle'],
    interestCategories: ['Social Justice and Recreation', 'Environmental Causes'],
  };

  const organizations: Organization[] = await airtableApiClient.getOrganizations(airTableFilters);
  const answer: Organization[] = [org2];
  t.deepEqual(organizations, answer);
});

test.serial('Returns one page of filtered two interest categories results properly', async t => {
  const airtableApiClient: AirTableApiClient = new AirTableApiClient();

  nock(AIRTABLE_API_URL)
    .get('/Organizations')
    .query({ view: 'Grid view' })
    .reply(200, {
      records,
    });

  const airTableFilters: AirTableFilters = {
    interestCategories: ['Social Justice and Recreation', 'Environmental Causes'],
  };

  const organizations: Organization[] = await airtableApiClient.getOrganizations(airTableFilters);
  const answer: Organization[] = [org2, org3];
  t.deepEqual(organizations, answer);
});

test.serial('Returns one page of filtered two river results properly', async t => {
  const airtableApiClient: AirTableApiClient = new AirTableApiClient();

  nock(AIRTABLE_API_URL)
    .get('/Organizations')
    .query({ view: 'Grid view' })
    .reply(200, {
      records,
    });

  const airTableFilters: AirTableFilters = {
    riverSections: ['Middle', 'Lower'],
  };

  const organizations: Organization[] = await airtableApiClient.getOrganizations(airTableFilters);
  const answer: Organization[] = [org2, org3];
  t.deepEqual(organizations, answer);
});

test.serial('Request to Airtable url made when cache is set to null by constructor', async t => {
  const airtableApiClient: AirTableApiClient = new AirTableApiClient();

  nock(AIRTABLE_API_URL)
    .get('/Organizations')
    .query({ view: 'Grid view' })
    .reply(200, {
      records,
    });

  const organizations: Organization[] = await airtableApiClient.getOrganizations();
  const answer: Organization[] = [org1, org2, org3];
  t.deepEqual(organizations, answer);
});

test.serial('Request to Airtable url not made when cache stores contents', async t => {
  const airtableApiClient: AirTableApiClient = new AirTableApiClient();

  nock(AIRTABLE_API_URL)
    .get('/Organizations')
    .query({ view: 'Grid view' })
    .reply(200, {
      records,
    });

  let organizations: Organization[] = await airtableApiClient.getOrganizations();

  nock(AIRTABLE_API_URL)
    .get('/Organizations')
    .query({ view: 'Grid view' })
    .reply(200, {
      org1,
    });

  organizations = await airtableApiClient.getOrganizations();
  const cache: Organization[] = [org1, org2, org3];
  t.deepEqual(organizations, cache);
});

test.serial('Request to AirTable url made when ttl milliseconds passed', async t => {
  const airtableApiClient: AirTableApiClient = new AirTableApiClient();
  const fakeTimer: sinon.SinonFakeTimers = sinon.useFakeTimers();

  nock(AIRTABLE_API_URL)
    .get('/Organizations')
    .query({ view: 'Grid view' })
    .reply(200, {
      records,
    });

  let organizations: Organization[] = await airtableApiClient.getOrganizations();
  fakeTimer.tick(1000);

  nock(AIRTABLE_API_URL)
    .get('/Organizations')
    .query({ view: 'Grid view' })
    .reply(200, {
      records: [org1],
    });

  organizations = await airtableApiClient.getOrganizations();
  //the value of organizations SHOULD be org1 but it is empty instead
  const answer: Organization[] = [org1];
  fakeTimer.restore();
  t.deepEqual(organizations, answer);
});
