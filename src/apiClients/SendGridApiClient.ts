import { InvalidParametersError } from '../errors';
import { MailData } from '@sendgrid/helpers/classes/mail';
import sgMail from '@sendgrid/mail';

class SendGridApiClient {
  private apiKey: string;

  constructor(apiKey: string) {
    if (apiKey === '') {
      throw new InvalidParametersError('API Key is empty.');
    }
    this.apiKey = apiKey;
    // remove this log when this API key is finally used somewhere
  }

  async sendEmail(senderEmailAddress: string, recipientEmailAddress: string, emailBody: string, emailSubject: string) {
    sgMail.setApiKey(this.apiKey);
    const mailData: MailData = {
      to: recipientEmailAddress,
      from: senderEmailAddress,
      subject: emailSubject,
      text: emailBody,
      mailSettings: {
        sandboxMode: {
          enable: process.env.NODE_ENV === 'development',
        },
      },
    };
    const [sgResponse] = await sgMail.send([mailData]);
    return sgResponse;
  }
}

export default SendGridApiClient;
