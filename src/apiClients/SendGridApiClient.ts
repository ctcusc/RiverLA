import { InvalidParametersError } from '../errors';
import { MailData } from '@sendgrid/helpers/classes/mail';
import env from '../env';
import sgMail from '@sendgrid/mail';

export interface DynamicTemplateData {
  name: string;
  interests: string[];
  organizations: {
    // TODO: consider making these parameters optional and doing logic to fill it in
    name: string;
    website: string;
    email: string;
    phoneNumber: string;
  }[];
}

class SendGridApiClient {
  private apiKey: string;

  constructor(apiKey: string) {
    if (apiKey === '') {
      throw new InvalidParametersError('API Key is empty.');
    }
    this.apiKey = apiKey;
  }

  async sendEmail(
    senderEmailAddress: string,
    recipientEmailAddress: string,
    emailSubject: string,
    templateId: string,
    dynamicTemplateData: DynamicTemplateData,
  ) {
    sgMail.setApiKey(this.apiKey);
    const mailData: MailData = {
      from: senderEmailAddress,
      to: recipientEmailAddress,
      subject: emailSubject,
      mailSettings: {
        sandboxMode: {
          enable: env.nodeEnv === 'development',
        },
      },
      templateId: templateId,
      dynamicTemplateData: dynamicTemplateData,
    };
    const [sgResponse] = await sgMail.send([mailData]);

    return sgResponse;
  }
}

export default SendGridApiClient;
