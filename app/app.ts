import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import mongoose from 'mongoose';

import passport from './utils/passport';
import errorMiddleware from './middlewares/error.middleware';
import { logger, stream } from './utils/logger';
import Routes from './interfaces/routes.interface';

const initializeMiddlewares = (app: express.Express) => {
  if (process.env.NODE_ENV === 'production') {
    app.use(morgan('combined', { stream }));
    app.use(cors({ origin: 'your.domain.com', credentials: true }));
  } else if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev', { stream }));
    app.use(cors({ origin: true, credentials: true }));
  }

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(hpp());
  app.use(
    helmet({
      contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
    }),
  );
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

export default async (routes: Routes[]): Promise<express.Express> => {
  const app = express();

  initializeMiddlewares(app);
  await initializeMongoose();
  initializeRoutes(app, routes);
  initializeSwagger(app);
  initializeErrorHandling(app);

  return app;
};
