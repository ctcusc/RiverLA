import { MailData } from '@sendgrid/helpers/classes/mail';
import { Response } from 'request';
import { ResponseError } from '@sendgrid/helpers/classes';

import SendGridApiClient from '../../src/apiClients/SendGridApiClient';
import sgMail from '@sendgrid/mail';
import sinon from 'sinon';
import test from 'ava';

const fromEmail = 'anthony.wiencko@gmail.com';
const toEmail = 'wiencko@usc.edu';
const body = 'this is the body';
const subject = 'this is the subject';

let sendgridStub: sinon.SinonStub<
  [MailData[], boolean?, ((err: Error | ResponseError, result: [Response, {}]) => void)?],
  Promise<[Response, {}]>
>;
test.beforeEach(() => {
  sendgridStub = sinon.stub(sgMail, 'send');
});

test.afterEach.always(() => {
  sinon.restore();
});

test.serial('throws an exception when an empty api key is passed into its constructor', t => {
  t.throws(() => {
    new SendGridApiClient('');
  });
  try {
    const sendgridApiClient = new SendGridApiClient('');
    //Unneccessary but I get an error if I don't have it
    sendgridApiClient.sendEmail(fromEmail, toEmail, subject, body);
  } catch (e) {
    t.pass();
  }
});

test.serial('resolves to true when sgMail.send is successful', async t => {
  try {
    const sendgridApiClient = new SendGridApiClient('non-empty key');
    sendgridStub.resolves(true);

    t.is(await sendgridApiClient.sendEmail(fromEmail, toEmail, subject, body), true);

    t.true(
      /* eslint-disable @typescript-eslint/camelcase*/
      sendgridStub.calledWith({
        to: toEmail,
        from: fromEmail,
        subject: subject,
        text: body,
        mail_settings: {
          sandbox_mode: {
            enable: process.env.NODE_ENV === 'dev',
          },
        },
        /* eslint-disable @typescript-eslint/camelcase*/
      }),
    );
  } catch (e) {
    t.fail();
  }
});

test.serial('rejects when sgMail.send rejects', async t => {
  sendgridStub.rejects();
  try {
    const sendgridApiClient = new SendGridApiClient('non-empty key');
    await sendgridApiClient.sendEmail(toEmail, fromEmail, subject, body);
  } catch (e) {
    t.pass();
  }
});
