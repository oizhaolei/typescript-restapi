import bcrypt from 'bcrypt';
import { UserInput } from '../entities/types/user-input';
import HttpException from '../HttpException';
import { User, UserModel } from '../entities/User';

class UserService {
  public userModel = UserModel;

  public async findAllUser(): Promise<User[]> {
    const users: User[] = await this.userModel.find();
    return users;
  }

  public async findUserById(userId: string): Promise<User> {
    const findUser = await this.userModel.findOne({ _id: userId });
    if (!findUser) throw new HttpException(409, 'user is not exists.');

    return findUser;
  }

  public async createUser(userData: UserInput): Promise<User> {
    const findUser = await this.userModel.findOne({ email: userData.email });
    if (findUser) throw new HttpException(409, `You're email ${userData.email} already exists`);

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = new this.userModel({
      ...userData,
      password: hashedPassword,
    });
    await user.save();
    return user;
  }

  public async updateUser(userId: string, userData: User): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const updateUserById = await this.userModel.findByIdAndUpdate(userId, { ...userData, password: hashedPassword });
    if (!updateUserById) throw new HttpException(409, 'user is not exists.');

    return updateUserById;
  }

  public async deleteUserData(userId: string): Promise<User> {
    const deleteUserById = await this.userModel.findByIdAndDelete(userId);
    if (!deleteUserById) throw new HttpException(409, 'user is not exists.');

    return deleteUserById;
  }
}

export default UserService;
