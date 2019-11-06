import apiClients from './apiClients';
import app from './app';
import env from './env';

app.listen(env.server.port, async () => {
  console.log(apiClients.airtableApiClient);
  console.log(apiClients.sendgridApiClient);
  console.log(`🚀 App listening on port ${env.server.port}`);
});
