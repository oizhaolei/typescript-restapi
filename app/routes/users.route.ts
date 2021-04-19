import { Router } from 'express';

import UsersController from '../controllers/users.controller';
import Route from '../interfaces/routes.interface';
import AuthController from '../controllers/authController';

class UsersRoute implements Route {
  public path = '/users';
  public router = Router();
  public usersController: UsersController = new UsersController();
  public authController: AuthController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.usersController.getUsers);
    this.router.get(`${this.path}/:id`, this.usersController.getUserById);
    this.router.post(`${this.path}`, this.usersController.createUser);
    this.router.put(`${this.path}/:id`, this.usersController.updateUser);
    this.router.delete(`${this.path}/:id`, this.usersController.deleteUser);
    this.router.post('/register', this.usersController.registerUser);
    this.router.post('/login', this.usersController.authenticateUser);
    this.router.get(`${this.path}/profile`, this.authController.authenticateJWT, this.usersController.getProfile);
  }
}

export default UsersRoute;
