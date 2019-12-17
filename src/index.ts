// Import modules
import apiClients from './apiClients';
import app from './app';
import colors from 'colors/safe';
import env from './env';
import ngrok from 'ngrok';
import { DynamicTemplateData } from './apiClients/SendGridApiClient';

app.listen(env.server.port, async () => {
  const dynamicTemplateData: DynamicTemplateData = {
    name: "Yash",
    interests: [
      {
        name: "first interest"
      },
      {
        name: "second interest"
      },
      {
        name: "third interest"
      },
    ],
    organizations: [
      {
        name: "name of org 1",
        website: "org1.com",
        email: "org1@gmail.com",
        phoneNumber: "1233333333",
      },
    ]
  };

  console.log(apiClients.airtableApiClient);
  try {
    await apiClients.sendgridApiClient.sendEmail("yac6791@gmail.com", "yac6791@gmail.com", "Subject", env.riverLATemplateID, dynamicTemplateData);
    console.log("got here")
  }
  catch(err) {
    console.log(err);
  }
  console.log(`🚀 App listening on port ${env.server.port}!`);
});

if (env.nodeEnv === 'development') {
  (async function(): Promise<void> {
    const ngrokUrl = await ngrok.connect();
    console.log(
      colors.bold(`
      [Instructions to test webhook]
      Go to ${colors.green('https://larivercorp.nationbuilder.com/admin/webhooks/new')} and
      add a new webhook with Endpoint URL: ${colors.green(`${ngrokUrl}/webhooks/nationbuilder/personCreated`)}.
      `),
    );
  })();
}
