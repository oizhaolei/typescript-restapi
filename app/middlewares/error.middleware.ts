import { NextFunction, Request, Response } from 'express';
import HttpException from '../HttpException';
import log4js from '../utils/logger';

const logger = log4js('middlewares/error.middleware');

const errorMiddleware = (error: HttpException, _req: Request, res: Response, next: NextFunction): void => {
  try {
    logger.error('error', error);
    const status: number = error.status || 500;
    const message: string = error.message || 'Something went wrong';

    res.status(status).json({ message });
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;
