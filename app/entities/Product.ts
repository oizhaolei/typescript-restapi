import { ObjectType, Field, ID, Int } from 'type-graphql';
import { prop as Property, getModelForClass } from '@typegoose/typegoose';
import { Ref } from '../interfaces/types';
import { Category } from './Category';

@ObjectType({ description: 'The Product model' })
export class Product {
  @Field(() => ID)
  id: string;

  @Field()
  @Property()
  name: string;

  @Field()
  @Property()
  description: string;

  @Field()
  @Property()
  color: string;

  @Field(() => Int)
  @Property()
  stock: number;

  @Field(() => Int)
  @Property()
  price: number;

  @Field(() => Category)
  @Property({ ref: Category })
  category: Ref<Category>;
}

export const ProductModel = getModelForClass(Product);
