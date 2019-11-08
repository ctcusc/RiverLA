// Import modules
import apiClients from './apiClients';
import app from './app';
import env from './env';
import ngrok from 'ngrok';

app.listen(env.server.port, () => {
  console.log(apiClients.airtableApiClient);
  console.log(apiClients.sendgridApiClient);
  console.log(`🚀 App listening on port ${env.server.port}!`);
});

if (env.nodeEnv === 'development') {
  (async function() {
    const ngrokUrl = await ngrok.connect();
    console.log(
      `[Instructions to test webhook]
      Go to https://larivercorp.nationbuilder.com/admin/webhooks/new and
      add a new webhook with Endpoint URL: ${ngrokUrl}/webhooks/nationbuilder/personCreated.`,
    );
  })();
}
