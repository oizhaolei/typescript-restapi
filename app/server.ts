import 'dotenv/config';
import App from './app';
import IndexRoute from './routes/index.route';

import { UserResolver } from './resolvers/User';
import { ProductResolver } from './resolvers/Product';
import { CategoryResolver } from './resolvers/Category';
import { CartResolver } from './resolvers/Cart';
import { OrderResolver } from './resolvers/Order';
import { RecipeResolver } from './resolvers/Recipe';
import { RateResolver } from './resolvers/Rate';
import validateEnv from './utils/validateEnv';

validateEnv();
const routes = [new IndexRoute()];
const resolvers = [CategoryResolver, ProductResolver, UserResolver, CartResolver, OrderResolver, RecipeResolver, RateResolver];

const main = async () => {
  const app = await App(routes, resolvers);
  const { PORT } = process.env;
  app.listen({ port: PORT }, () => console.log(`🚀 Server ready and listening at ==> http://localhost:${PORT}`));
};

main().catch(error => {
  console.log(error, 'error');
});
