import bcrypt from 'bcrypt';
import passport from 'passport';
import { NextFunction, Request, Response } from 'express';
import { UserInput } from '../entities/types/user-input';
import { User } from '../entities/User';
import userService from '../services/users.service';
import { sign } from '../utils/auth-checker';

class UsersController {
  public userService = new userService();

  public getUsers = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findAllUsersData: User[] = await this.userService.findAllUser();
      res.status(200).json({ data: findAllUsersData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId: string = req.params.id;

    try {
      const findOneUserData: User = await this.userService.findUserById(userId);
      res.status(200).json({ data: findOneUserData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { user } = req;
    try {
      res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  };

  public createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userData: UserInput = req.body;

    try {
      const createUserData: User = await this.userService.createUser(userData);
      res.status(201).json({ data: createUserData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId: string = req.params.id;
    const userData: User = req.body;

    try {
      const updateUserData: User = await this.userService.updateUser(userId, userData);
      res.status(200).json({ data: updateUserData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId: string = req.params.id;

    try {
      const deleteUserData: User = await this.userService.deleteUserData(userId);
      res.status(200).json({ data: deleteUserData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };

  public registerUser = async (req: Request, res: Response): Promise<void> => {
    const hashedPassword = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    const userData: UserInput = {
      ...req.body,
      password: hashedPassword,
    };

    const user: User = await this.userService.createUser(userData);

    const token = sign(user._doc);
    res.status(200).send({
      token: token,
      user,
    });
  };

  public authenticateUser = (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    return passport.authenticate('local', function (err, user) {
      // no async/await because passport works only with callback ..
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ status: 'error', code: 'unauthorized' });
      } else {
        const token = sign(user._doc);
        res.status(200).send({ token: token });
      }
    });
  };
}

export default UsersController;
