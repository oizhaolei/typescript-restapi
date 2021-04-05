import bcrypt from 'bcrypt';
import { UserInput } from '../resolvers/types/user-input';
import HttpException from '../HttpException';
import { User, UserModel } from '../entities/User';

class UserService {
  public async findAllUser(): Promise<User[]> {
    const users: User[] = await UserModel.find();
    return users;
  }

  public async findUserById(userId: string): Promise<User> {
    const findUser = await UserModel.findOne({ _id: userId });
    if (!findUser) throw new HttpException(409, "You're not user");

    return findUser;
  }

  public async createUser(userData: UserInput): Promise<User> {
    const findUser = await UserModel.findOne({ email: userData.email });
    if (findUser) throw new HttpException(409, `You're email ${userData.email} already exists`);

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = new UserModel({
      ...userData,
      password: hashedPassword,
    });
    await user.save();
    return user;
  }

  public async updateUser(userId: string, userData: User): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const updateUserById = await UserModel.findByIdAndUpdate(userId, { ...userData, password: hashedPassword });
    if (!updateUserById) throw new HttpException(409, "You're not user");

    return updateUserById;
  }

  public async deleteUserData(userId: string): Promise<User> {
    const deleteUserById = await UserModel.findByIdAndDelete(userId);
    if (!deleteUserById) throw new HttpException(409, "You're not user");

    return deleteUserById;
  }
}

export default UserService;
