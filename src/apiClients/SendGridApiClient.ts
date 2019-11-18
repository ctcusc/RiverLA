// TODO: Need to come up with better name for interface
interface EmailData {
  name: string;
  interest: [
    {
      name: string;
    },
  ];
  organizations: [
    {
      name: string;
      website: string;
      email: string;
      phoneNumber: string;
    },
  ];
}

class SendGridApiClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    // remove this log when this API key is finally used somewhere
    console.log(`SendGridAPIClient initialized with api key ${this.apiKey}`);
  }

  sendEmail(senderEmailAddress: string, recipientEmailAddress: string, emailBody: string): void {
    console.log(`sendEmail called with arguments:`, senderEmailAddress, recipientEmailAddress, emailBody);
  }

  // TODO:  Need to come up with better name for function
  sendVolunteerMatchEmail(senderEmailAddress: string, recipientEmailAddress: string, emailData: EmailData): void {
    console.log(`Email Data: `, senderEmailAddress, recipientEmailAddress, emailData);
  }
}

export default SendGridApiClient;
