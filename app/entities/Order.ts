import { ObjectType, Field, ID } from 'type-graphql';
import { prop as Property, getModelForClass } from '@typegoose/typegoose';

import { Ref } from '../types';

import { Product } from './Product';
import { User } from './User';

@ObjectType({ description: 'The Order model' })
export class Order {
  @Field(() => ID)
  id: string;

  @Field(_type => User)
  @Property({ ref: User, required: true })
  user: Ref<User>;

  @Field()
  @Property({ required: true })
  payed: boolean;

  @Field()
  @Property({ default: new Date(), required: true, nullable: true })
  date: Date;

  @Field(_type => Product)
  @Property({ ref: Product, required: true })
  product: Ref<Product>;
  _doc: any;
}

export const OrderModel = getModelForClass(Order);
