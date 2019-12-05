import CachedItem from '../../src/utils/CachedItem';
import { Organization } from '../../src/apiClients/AirTableApiClient';
import sinon from 'sinon';
import test from 'ava';

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

let faketimer: sinon.SinonFakeTimers;

test.beforeEach(() => {
  faketimer = sinon.useFakeTimers();
});

test.afterEach(() => {
  faketimer.restore();
});

test.serial('Get null if no value is set to CachedItem class', t => {
  const cache: CachedItem<Organization> = new CachedItem<Organization>(3000);
  t.is(cache.get(), null);
});

test.serial('Set a valid value to CachedItem class', t => {
  const cache: CachedItem<Organization> = new CachedItem<Organization>(3000);
  cache.set(org1);
  t.deepEqual(cache.get(), org1);
});

test.serial('Value in CachedItem class invalidated after ttl milliseconds', t => {
  const cache: CachedItem<Organization> = new CachedItem<Organization>(3000);
  cache.set(org2);
  faketimer.tick(3000);
  t.is(cache.get(), null);
});

test.serial('New value set in the middle of the ttl interval not invalidated', t => {
  const cache: CachedItem<Organization> = new CachedItem<Organization>(3000);
  cache.set(org2);
  faketimer.tick(1000);
  cache.set(org3);
  faketimer.tick(2500);
  t.deepEqual(cache.get(), org3);
});
