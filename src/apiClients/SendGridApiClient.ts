import { InvalidParametersError } from '../errors';
import sgMail from '@sendgrid/mail';

class SendGridApiClient {
  private apiKey: string;

  constructor(apiKey: string) {
    if (apiKey == '') {
      throw new InvalidParametersError('API Key is empty.');
    }
    this.apiKey = apiKey;
    // remove this log when this API key is finally used somewhere
    console.log(`SendGridAPIClient initialized with api key ${this.apiKey}`);
  }

  async sendEmail(
    senderEmailAddress: string,
    recipientEmailAddress: string,
    emailBody: string,
    emailSubject: string,
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  ): Promise<any> {
    console.log(`sendEmail called with arguments:`, senderEmailAddress, recipientEmailAddress, emailBody, emailSubject);

    sgMail.setApiKey(this.apiKey);
    /* eslint-disable @typescript-eslint/camelcase*/
    const msg = {
      to: recipientEmailAddress,
      from: senderEmailAddress,
      subject: emailSubject,
      text: emailBody,
      mail_settings: {
        sandbox_mode: {
          enable: process.env.NODE_ENV === 'dev',
        },
      },
    };
    /* eslint-enable @typescript-eslint/camelcase*/

    return sgMail.send(msg);
  }
}

export default SendGridApiClient;
