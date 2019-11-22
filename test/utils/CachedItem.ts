import CachedItem from '../../src/utils/CachedItem';
import { Organization } from '../../src/apiClients/AirTableApiClient';
import sinon from 'sinon';
import test from 'ava';

const org: Organization = {
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

const cache: CachedItem<Organization> = new CachedItem<Organization>(3000);

const faketimer = sinon.useFakeTimers();

test.serial('my passing test', t => {
  t.pass();
});

test.serial('Get null if no value is set to CachedItem class', async t => {
  t.is(cache.get(), null);
});

test.serial('Set a valid value to CachedItem class', async t => {
  cache.set(org);
  t.deepEqual(cache.get(), org);
});

test.serial('Value in CachedItem class invalidated after ttl milliseconds', async t => {
  faketimer.tick(3000);
  t.is(cache.get(), null);
});
