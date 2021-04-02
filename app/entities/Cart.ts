import { ObjectType, Field, ID } from 'type-graphql';
import { prop as Property, getModelForClass } from '@typegoose/typegoose';

import { Ref } from '../interfaces/types';

import { Product } from './Product';

@ObjectType({ description: 'The  Cart model' })
export class Cart {
  @Field(() => ID)
  id: string;

  @Field(() => Product)
  @Property({ ref: Product, required: true })
  product: Ref<Product>;
}

export const CartModel = getModelForClass(Cart);
