import { prop as Property, getModelForClass } from '@typegoose/typegoose';
import { Ref } from '../interfaces/types';
import { Category } from './Category';

export class Product {
  id: string;

  @Property()
  name: string;

  @Property()
  description: string;

  @Property()
  color: string;

  @Property()
  stock: number;

  @Property()
  price: number;

  @Property({ ref: Category })
  category: Ref<Category>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _doc: any;
}

export const ProductModel = getModelForClass(Product);
