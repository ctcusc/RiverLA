import router, { NationBuilderPerson } from '/Users/madelyndubuk/CTC/RiverLA/src/routers/webhooks';
import env from '/Users/madelyndubuk/CTC/RiverLA/src/env';
import sinon from 'sinon';
import test from 'ava';

const request = require('supertest');
const express = require('express');
let bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
let person: any = {
  email: 'test@gmail.com',
  first_name: 'hi',
  phone: '1234567899',
  is_volunteer: true,
};

const user1: any = {
  nation_slug: 'larivercorp',
  payload: { person },
  token: 'UaFSno6V23BRE9u16fh9w3YtJZHuVyLcbt38SJmNhESFG5uBVdzLJ3g0zTp9GURy',
  version: 4,
};

const result1: NationBuilderPerson = {
  email: 'test@gmail.com',
  firstName: 'hi',
  phone: '1234567899',
};

test('404 error', async t => {
  const stub = sinon.stub(process.env, 'NATIONBUILDER_WEBHOOK_TOKEN').value('a');
  router.post('/nationbuilder/personCreated', function(req: any, res: any) {
    if (req.body.payload.person.is_volunteer) {
      const { email, first_name: firstName, phone } = req.body.payload.person;
      const nationBuilderPerson: NationBuilderPerson = {
        email,
        firstName,
        phone,
      };
      if (env.nationbuilderWebhookToken === 'aFSno6V23BRE9u16fh9w3YtJZHuVyLcbt38SJmNhESFG5uBVdzLJ3g0zTp9GURy') {
        res.json(nationBuilderPerson);
        res.status(200);
      } else {
        res.status(404).send({
          message: '404: Page Not Found',
        });
      }
    } else {
      if (env.nationbuilderWebhookToken === 'aFSno6V23BRE9u16fh9w3YtJZHuVyLcbt38SJmNhESFG5uBVdzLJ3g0zTp9GURy') {
        res.json({});
        res.status(200);
      } else {
        res.status(404).send({
          message: '404: Page Not Found',
        });
      }
    }
  });
  app.use(router);
  const res = await request(app)
    .post('/nationbuilder/personCreated')
    .send(user1);
  t.is(res.status, 404);
});

test('testing is_volunteer true', async t => {
  router.post('/nationbuilder/personCreated', function(req: any, res: any) {
    if (req.body.payload.person.is_volunteer) {
      const { email, first_name: firstName, phone } = req.body.payload.person;
      const nationBuilderPerson: NationBuilderPerson = {
        email,
        firstName,
        phone,
      };
      if (env.nationbuilderWebhookToken === 'aFSno6V23BRE9u16fh9w3YtJZHuVyLcbt38SJmNhESFG5uBVdzLJ3g0zTp9GURy') {
        res.json(nationBuilderPerson);
        res.status(200);
      } else {
        res.status(404).send({
          message: '404: Page Not Found',
        });
      }
    } else {
      if (env.nationbuilderWebhookToken === 'aFSno6V23BRE9u16fh9w3YtJZHuVyLcbt38SJmNhESFG5uBVdzLJ3g0zTp9GURy') {
        res.json({});
        res.status(200);
      } else {
        res.status(404).send({
          message: '404: Page Not Found',
        });
      }
    }
  });
  app.use(router);
  const res = await request(app)
    .post('/nationbuilder/personCreated')
    .send(user1);
  t.deepEqual(res.body, result1);
  t.deepEqual(res.status, 200);
});

person = {
  email: 'test@gmail.com',
  first_name: 'madelyn',
  phone: '1234567890',
  is_volunteer: false,
};

const user2: any = {
  nation_slug: 'larivercorp',
  payload: { person },
  token: 'UaFSno6V23BRE9u16fh9w3YtJZHuVyLcbt38SJmNhESFG5uBVdzLJ3g0zTp9GURy',
  version: 4,
};

test('testing is_volunteer false', async t => {
  router.post('/nationbuilder/personCreated', function(req: any, res: any) {
    if (req.body.payload.person.is_volunteer) {
      const { email, first_name: firstName, phone } = req.body.payload.person;
      const nationBuilderPerson: NationBuilderPerson = {
        email,
        firstName,
        phone,
      };
      if (env.nationbuilderWebhookToken === 'aFSno6V23BRE9u16fh9w3YtJZHuVyLcbt38SJmNhESFG5uBVdzLJ3g0zTp9GURy') {
        res.json(nationBuilderPerson);
        res.status(200);
      } else {
        res.status(404).send({
          message: '404: Page Not Found',
        });
      }
    } else {
      if (env.nationbuilderWebhookToken === 'aFSno6V23BRE9u16fh9w3YtJZHuVyLcbt38SJmNhESFG5uBVdzLJ3g0zTp9GURy') {
        res.json({});
        res.status(200);
      } else {
        res.status(404).send({
          message: '404: Page Not Found',
        });
      }
    }
  });
  app.use(router);
  const res = await request(app)
    .post('/nationbuilder/personCreated')
    .send(user2);
  t.deepEqual(res.body, {});
  t.is(res.status, 200);
});
