/* istanbul ignore file */
import apiClients from './apiClients';
import app from './app';
import colors from 'colors/safe';
import env from './env';
import ngrok from 'ngrok';

app.listen(env.server.port, () => {
  console.log(apiClients.airtableApiClient);
  console.log(apiClients.sendgridApiClient);
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
