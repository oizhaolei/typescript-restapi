import { cleanEnv, port, str } from 'envalid';

const validateEnv = (): void => {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    PORT: port(),
    MONGODB_URI_LOCAL: str(),
    JWT_SECRET: str(),
  });
};

export default validateEnv;
