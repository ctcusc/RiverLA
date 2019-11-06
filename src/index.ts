// Import modules
import ngrok = require('ngrok');

import apiClients from './apiClients';
import app from './app';
import env from './env';

app.listen(env.server.port, () => {
  console.log(apiClients.airtableApiClient);
  console.log(apiClients.sendgridApiClient);
  console.log(`🚀 App listening on port ${env.server.port}!`);
});

(async function() {
  const ngrokUrl = await ngrok.connect();
  console.log(
    `[Instructions to test webhook]
    Go to https://larivercorp.nationbuilder.com/admin/webhooks/new and
    add a new webhook with Endpoint URL: ${ngrokUrl}/webhooks/nationbuilder/personCreated.`,
  );
})();
