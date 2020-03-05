import { DynamicTemplateData } from '../src/apiClients/SendGridApiClient';
import apiClients from '../src/apiClients';
import app from '../src/app';
import env from '../src/env';
import express from 'express';
import request from 'supertest';
import sinon from 'sinon';
import test from 'ava';

const { sendgridApiClient, airtableApiClient } = apiClients;

const webtoken1 = 'abc';
const webtoken2 = 'def';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* eslint-disable @typescript-eslint/camelcase */
let person = {
  email: 'person1@gmail.com',
  first_name: 'person1',
  is_volunteer: true,
  tags: ['Action: Volunteer Yes: Water Organizations'],
};

const user1: any = {
  nation_slug: 'larivercorp',
  payload: { person },
  token: webtoken1,
  version: 4,
};

const result1: DynamicTemplateData = {
  name: 'person1',
  interests: [],
  organizations: [
    {
      name: 'org1',
      website: 'www.org1.com',
      email: 'org1@org1.com',
      phoneNumber: '1234567890',
    },
  ],
};

person = {
  email: 'person2@gmail.com',
  first_name: 'person2',
  is_volunteer: false,
  tags: ['Action: Volunteer Yes: Water Organizations'],
};

const user2: any = {
  nation_slug: 'larivercorp',
  payload: { person },
  token: webtoken1,
  version: 4,
};
/* eslint-enable @typescript-eslint/camelcase */

test.afterEach.always(() => {
  sinon.restore();
});

test.serial('webhook tokens do not match', async t => {
  sinon.stub(env, 'nationbuilderWebhookToken').value(webtoken2);
  const res = await request(app)
    .post('/webhooks/nationbuilder/personCreated')
    .send(user2);
  t.is(res.status, 400);
});

test.serial('testing is_volunteer true', async t => {
  sinon.stub(env, 'nationbuilderWebhookToken').value(webtoken1);
  t.log(process.env.NATIONBUILDER_WEBHOOK_TOKEN);
  sendgridApiClient.sendEmail = sinon.stub().returns(result1);
  airtableApiClient.getOrganizations = sinon.stub().returns(result1.organizations);
  const res = await request(app)
    .post('/webhooks/nationbuilder/personCreated')
    .send(user1);
  t.is(res.status, 200);
  t.deepEqual(res.body, result1);
});

test.serial('testing is_volunteer false', async t => {
  sinon.stub(env, 'nationbuilderWebhookToken').value(webtoken1);
  const res = await request(app)
    .post('/webhooks/nationbuilder/personCreated')
    .send(user2);
  t.is(res.status, 400);
});
