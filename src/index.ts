import app from './app';
import env from './env';
import apiClients from './apiClients';

app.listen(env.server.port, () => {
  console.log(apiClients.airtableApiClient);
  console.log(apiClients.sendgridApiClient);
  console.log(`🚀 App listening on port ${env.server.port}`);
});
