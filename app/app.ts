import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { connect } from 'mongoose';

import errorMiddleware from './middlewares/error.middleware';
import { logger, stream } from './utils/logger';
import Routes from './interfaces/routes.interface';

import { Context } from './interfaces/context.interface';
import { authChecker } from './auth-checker';

const initializeMiddlewares = (app: express.Express) => {
  if (process.env.NODE_ENV === 'production') {
    app.use(morgan('combined', { stream }));
    app.use(cors({ origin: 'your.domain.com', credentials: true }));
  } else if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev', { stream }));
    app.use(cors({ origin: true, credentials: true }));
  }

  app.use(hpp());
  app.use(helmet());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
};

const initializeErrorHandling = (app: express.Express) => {
  app.use(errorMiddleware);
};

const initializeRoutes = (app: express.Express, routes: Routes[]) => {
  routes.forEach(route => {
    app.use('/', route.router);
  });
  app.get('/', (_, res) => {
    res.send('Hello World!');
  });
};

// create mongoose connection
const initializeMongoose = async () => {
  const { MONGODB_URI_LOCAL } = process.env;
  const mongoose = await connect(`${MONGODB_URI_LOCAL}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await mongoose.connection;
  logger.info('🟢 The database is connected.');
};

const initializeApollo = async (app: express.Express, resolvers: any) => {
  if (!resolvers || resolvers.length === 0) {
    return;
  }

  const schema = await buildSchema({
    resolvers,
    authChecker,
    emitSchemaFile: true,
    validate: false,
  });

  const server = new ApolloServer({
    schema,
    context: ({ req }) => {
      // Get the user token from the headers.
      const token = req.headers.authorization || '';
      console.log('token', token);

      // add the user to the context
      const ctx: Context = {
        user: {
          id: '1',
          username: 'fake user',
          password: 'fake pass',
          email: 'fake email',
          roles: ['REGULAR'],
          _doc: undefined,
        },
      };
      return ctx;
    },
  });
  server.applyMiddleware({ app });
};

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

export default async (routes: Routes[], resolvers: any): Promise<express.Express> => {
  const app = express();

  initializeMiddlewares(app);
  await initializeMongoose();
  await initializeApollo(app, resolvers);
  initializeSwagger(app);
  initializeRoutes(app, routes);
  initializeErrorHandling(app);

  return app;
};
