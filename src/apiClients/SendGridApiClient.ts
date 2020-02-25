/**
 * Main client to interact with SendGrid API.
 *
 * The [[DynamicTemplateData]] interface is used to hold all the information required to send an email to a new user.
 * The [[SendGridApiClient]] class holds a function to send an email to a new user using SendGrid's API.
 */
import { InvalidParametersError } from '../errors';
import { MailData } from '@sendgrid/helpers/classes/mail';
import env from '../env';
import sgMail from '@sendgrid/mail';

/**
 * Interface to hold all data necessary for an email.
 *
 * @param name the name of the user.
 * @param interests a list of all the interests the user selected when applying.
 * @param organizations a list of all the organizations that matched the user's interests.
 * For each organization there is the organization's name, website URL, email, and phone number.
 */
export interface DynamicTemplateData {
  name: string;
  interests: string[];
  organizations: {
    name: string;
    website: string;
    email: string;
    phoneNumber: string;
  }[];
}

/**
 * Main client to interact with SendGrid's API to send an email.
 */
class SendGridApiClient {
  private apiKey: string;

  /**
   * Creates a new SendGrid API Client instance.
   *
   * @param apiKey Refers to the API key for accessing SendGrid.
   */
  constructor(apiKey: string) {
    if (apiKey === '') {
      throw new InvalidParametersError('API Key is empty.');
    }
    this.apiKey = apiKey;
  }

  /**
   * Send Email from SendGrid API Client
   *
   * @param senderEmailAddress The email address to be sent from.
   * @param recipientEmailAddress The email address being sent to.
   * @param emailSubject The subject line of the email.
   * @param templateId Refers to the template ID number in SendGrid for the specific email template.
   * @param dynamicTemplateData The [[DynamicTemplateData]] object that contains all of the unqiue information
   * for this email.
   * @returns a promise to a response object indicating whether the email was sent.
   */
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
