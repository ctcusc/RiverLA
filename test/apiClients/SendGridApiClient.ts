import { DynamicTemplateData } from '../../src/apiClients/SendGridApiClient';
import { MailData } from '@sendgrid/helpers/classes/mail';
import { Response } from 'request';
import { ResponseError } from '@sendgrid/helpers/classes';
import SendGridApiClient from '../../src/apiClients/SendGridApiClient';
import env from '../../src/env';
import sgMail from '@sendgrid/mail';
import sinon from 'sinon';
import test from 'ava';

const fromEmail = 'anthony.wiencko@gmail.com';
const toEmail = 'wiencko@usc.edu';
const subject = 'this is the subject';
const templateId = 'this is the ID';
const data: DynamicTemplateData = {
  name: 'Anthony Wiencko',
  interests: ['Environmental Causes', 'Art'],
  organizations: [
    {
      name: 'Homeboy Industries',
      website: 'https://homeboyindustries.org/',
      email: 'dgoldstein@homeboyindustries.org',
      phoneNumber: '(323) 526-1254',
    },
  ],
};

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
});

test.serial('resolves to true when sgMail.send is successful', async t => {
  const sendgridApiClient = new SendGridApiClient('non-empty key');
  const sendgridResult: [Response, {}] = [{} as Response, {}];
  sendgridStub.resolves(sendgridResult);
  sinon.stub(env, 'nodeEnv').value('development');

  const result = await sendgridApiClient.sendEmail(fromEmail, toEmail, subject, templateId, data);
  t.is(result, sendgridResult[0]);
  t.true(
    sendgridStub.calledWith(
      sinon.match.array.deepEquals([
        {
          from: fromEmail,
          to: toEmail,
          subject: subject,
          mailSettings: {
            sandboxMode: {
              enable: env.nodeEnv === 'development',
            },
          },
          templateId: templateId,
          dynamicTemplateData: data,
        },
      ]),
    ),
  );
});

test.serial('rejects when sgMail.send rejects', async t => {
  sendgridStub.rejects();
  const sendgridApiClient = new SendGridApiClient('non-empty key');
  await t.throwsAsync(sendgridApiClient.sendEmail(fromEmail, toEmail, subject, templateId, data));
});
