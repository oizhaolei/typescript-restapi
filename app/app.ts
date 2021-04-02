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
import mongoose from 'mongoose';

import errorMiddleware from './middlewares/error.middleware';
import { logger, stream } from './utils/logger';
import Routes from './interfaces/routes.interface';

import { Context } from './interfaces/context.interface';
import { verifyToken, authChecker } from './utils/auth-checker';

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
};

// create mongoose connection
const initializeMongoose = async () => {
  const { MONGODB_URI_LOCAL } = process.env;
  await mongoose.connect(`${MONGODB_URI_LOCAL}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  mongoose.set('debug', (coll: string, method: string, query: any, doc: any, options: any) => {
    logger.debug(`${coll}.${method}.(${JSON.stringify(query)})`, JSON.stringify(doc), options || '');
  });
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
    context: async ({ req }) => {
      // add the user to the context
      const user = await verifyToken(req);
      const ctx: Context = {
        user,
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
  initializeRoutes(app, routes);
  initializeSwagger(app);
  initializeErrorHandling(app);

  return app;
};
