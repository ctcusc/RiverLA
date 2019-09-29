import app from './app';
import env from './env';

app.listen(env.server.port, () => {
  console.log(`🚀 App listening on port ${env.server.port}`);
});
