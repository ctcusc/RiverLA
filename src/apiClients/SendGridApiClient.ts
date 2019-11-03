import sgMail from '@sendgrid/mail';

class SendGridApiClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    // remove this log when this API key is finally used somewhere
    console.log(`SendGridAPIClient initialized with api key ${this.apiKey}`);
  }

  async sendEmail(
    senderEmailAddress: string,
    recipientEmailAddress: string,
    emailBody: string,
    emailSubject: string,
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
    console.log(msg);
    //const res = await sgMail.send(msg);

    let res;
    try {
      res = await sgMail.send(msg);
    } catch (e) {
      res = e;
    }

    console.log(res);

    let code = -1;
    if (res.code != undefined) {
      code = res.code;
    } else if (res[0] != undefined) {
      code = res[0].statusCode;
    }

    console.log(code);
    return res;
  }
}

export default SendGridApiClient;
