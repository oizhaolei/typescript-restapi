import 'dotenv/config';
import App from './app';
import IndexRoute from './routes/index.route';
import UsersRoute from './routes/users.route';

import validateEnv from './utils/validateEnv';

validateEnv();
const routes = [new IndexRoute(), new UsersRoute()];

const main = async () => {
  const app = await App(routes);
  const { PORT } = process.env;
  app.listen({ port: PORT }, () => {
    console.log(`🚀 Server ready and listening at ==> http://localhost:${PORT} in ${app.get('env')} mode`);
    console.log('  Press CTRL-C to stop\n');
  });
};

main().catch(error => {
  console.log(error, 'error');
});
