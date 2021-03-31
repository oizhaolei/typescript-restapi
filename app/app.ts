import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { connect } from 'mongoose';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

import { UserResolver } from './resolvers/User';
import { ProductResolver } from './resolvers/Product';
import { CategoryResolver } from './resolvers/Category';
import { CartResolver } from './resolvers/Cart';
import { OrderResolver } from './resolvers/Order';
import { RecipeResolver } from './resolvers/Recipe';
import { RateResolver } from './resolvers/Rate';
import { User } from './entities/User';

export interface Context {
  user: User;
}
const initializeSwagger = (app: express.Express) => {
  const options = {
    swaggerDefinition: {
      info: {
        title: 'REST API',
        version: '1.0.0',
        description: 'Example docs',
      },
    },
    apis: ['swagger.yaml'],
  };

  const specs = swaggerJSDoc(options);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};

export default async () => {
  const schema = await buildSchema({
    resolvers: [CategoryResolver, ProductResolver, UserResolver, CartResolver, OrderResolver, RecipeResolver, RateResolver],
    emitSchemaFile: true,
    validate: false,
  });

  // create mongoose connection
  const mongoose = await connect('mongodb://localhost:27017/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await mongoose.connection;

  const server = new ApolloServer({
    schema,
    context: ({ req }) => {
      // Get the user token from the headers.
      const token = req.headers.authorization || '';
      console.log('token', token);

      // add the user to the context
      return {
        user: {
          nickname: 'fake user',
        },
      };
    },
  });

  const app = express();

  initializeSwagger(app);
  server.applyMiddleware({ app });
  app.get('/', (_, res) => {
    res.send('Hello World!');
  });
  return { app, server };
};
