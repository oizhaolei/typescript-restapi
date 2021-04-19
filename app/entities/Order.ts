import { prop as Property, getModelForClass } from '@typegoose/typegoose';

import { Ref } from '../interfaces/types';

import { Product } from './Product';
import { User } from './User';

export class Order {
  id: string;

  @Property({ ref: User, required: true })
  user: Ref<User>;

  @Property({ required: true })
  payed: boolean;

  @Property({ default: new Date(), required: true, nullable: true })
  date: Date;

  @Property({ ref: () => Product })
  products: Ref<Product>[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _doc: any;
}

export const OrderModel = getModelForClass(Order);
