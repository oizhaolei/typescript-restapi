import { Resolver, FieldResolver, Root } from 'type-graphql';

import { Rate } from '../entities/Rate';
import { User, UserModel } from '../entities/User';

@Resolver(_of => Rate)
export class RateResolver {
  @FieldResolver()
  async user(@Root() rate: Rate): Promise<User> {
    return (await UserModel.findById(rate.user))!;
  }
}
