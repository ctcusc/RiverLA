import { NationBuilderPerson } from '../src/routers/webhooks';
import app from '../src/app';
import env from '../src/env';
import express from 'express';
import request from 'supertest';
import sinon from 'sinon';
import test from 'ava';

const webtoken1 = 'abc';
const webtoken2 = 'def';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* eslint-disable @typescript-eslint/camelcase */
let person = {
  email: 'test@gmail.com',
  first_name: 'hi',
  phone: '1234567899',
  is_volunteer: true,
};

const user1: any = {
  nation_slug: 'larivercorp',
  payload: { person },
  token: webtoken1,
  version: 4,
};

const result1: NationBuilderPerson = {
  email: 'test@gmail.com',
  firstName: 'hi',
  phone: '1234567899',
};

person = {
  email: 'test@gmail.com',
  first_name: 'madelyn',
  phone: '1234567890',
  is_volunteer: false,
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
  t.deepEqual(res.status, 500);
});

test.serial('testing is_volunteer true', async t => {
  sinon.stub(env, 'nationbuilderWebhookToken').value(webtoken1);
  t.log(process.env.NATIONBUILDER_WEBHOOK_TOKEN);
  const res = await request(app)
    .post('/webhooks/nationbuilder/personCreated')
    .send(user1);
  t.deepEqual(res.status, 200);
  t.deepEqual(res.body, result1);
});

test.serial('testing is_volunteer false', async t => {
  sinon.stub(env, 'nationbuilderWebhookToken').value(webtoken1);
  const res = await request(app)
    .post('/webhooks/nationbuilder/personCreated')
    .send(user2);
  t.deepEqual(res.status, 400);
});
