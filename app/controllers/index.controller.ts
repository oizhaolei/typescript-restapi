import { NextFunction, Request, Response } from 'express';

class IndexController {
  public index = (_req: Request, res: Response, next: NextFunction): void => {
    try {
      res.json({
        msg: 'Hello World!',
      });
    } catch (error) {
      next(error);
    }
  };
}

export default IndexController;
