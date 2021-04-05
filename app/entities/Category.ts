import { ObjectType, Field, ID } from 'type-graphql';
import { prop as Property, getModelForClass } from '@typegoose/typegoose';

@ObjectType({ description: 'The Category model' })
export class Category {
  @Field(() => ID)
  id: string;

  @Field()
  @Property()
  name: string;

  @Field()
  @Property()
  description: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _doc: any;
}

export const CategoryModel = getModelForClass(Category);
