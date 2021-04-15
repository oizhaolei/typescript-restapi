import { Resolver, Mutation, Arg, Query, FieldResolver, Root } from 'type-graphql';
import bcrypt from 'bcrypt';

import { User, UserModel } from '../entities/User';
import { UserInput } from './types/user-input';

import { Cart, CartModel } from '../entities/Cart';

@Resolver(() => User)
export class UserResolver {
  @Query(() => User, { nullable: false })
  async returnSingleUser(@Arg('id') id: string): Promise<User | null> {
    return await UserModel.findById(id);
  }

  @Query(() => [User])
  async returnAllUsers(): Promise<User[]> {
    return await UserModel.find();
  }

  @Mutation(() => User)
  async createUser(@Arg('data') { username, email, password, cart }: UserInput): Promise<User> {
    const hash = bcrypt.hashSync(password, 10);
    const user = new UserModel({
      username,
      email,
      password: hash,
      cart,
    });
    await user.save();
    return user;
  }

  @Mutation(() => Boolean)
  async deleteUser(@Arg('id') id: string): Promise<boolean> {
    await UserModel.deleteOne({ _id: id });
    return true;
  }

  @Mutation(() => Boolean)
  async deleteAllUsers(): Promise<boolean> {
    await UserModel.deleteMany({});
    return true;
  }

  @FieldResolver(() => Cart)
  async cart(@Root() user: User): Promise<Cart> {
    // console.log(user, "user!")
    return (await CartModel.findById(user.cart))!;
  }
}
