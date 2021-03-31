import { ObjectType, Field, ID } from 'type-graphql';
import { prop as Property, getModelForClass } from '@typegoose/typegoose';

import { Ref } from '../types';

import { Cart } from './Cart';

@ObjectType({ description: 'The User model' })
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  @Property({ required: true })
  username: string;

  @Property({ required: true })
  password: string;

  @Field()
  @Property({ required: true })
  email: string;

  @Field(_type => Cart)
  @Property({ ref: Cart, required: true })
  cart: Ref<Cart>;
  _doc: any;
}

export const UserModel = getModelForClass(User);
