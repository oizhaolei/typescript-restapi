import { prop as Property, getModelForClass } from '@typegoose/typegoose';

import { Ref } from '../interfaces/types';

import { Product } from './Product';

export class Cart {
  id: string;

  @Property({ ref: () => Product })
  products: Ref<Product>[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _doc: any;
}

export const CartModel = getModelForClass(Cart);
