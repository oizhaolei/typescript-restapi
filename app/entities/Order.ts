import { ObjectType, Field, ID } from 'type-graphql';
import { prop as Property, getModelForClass } from '@typegoose/typegoose';

import { Ref } from '../interfaces/types';

import { Product } from './Product';
import { User } from './User';

@ObjectType({ description: 'The Order model' })
export class Order {
  @Field(() => ID)
  id: string;

  @Field(() => User)
  @Property({ ref: User, required: true })
  user: Ref<User>;

  @Field()
  @Property({ required: true })
  payed: boolean;

  @Field()
  @Property({ default: new Date(), required: true, nullable: true })
  date: Date;

  @Field(() => Product)
  @Property({ ref: Product, required: true })
  product: Ref<Product>;
}

export const OrderModel = getModelForClass(Order);
