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
}

export default SendGridApiClient;
