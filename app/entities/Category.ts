import { prop as Property, getModelForClass } from '@typegoose/typegoose';

export class Category {
  id: string;

  @Property()
  name: string;

  @Property()
  description: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _doc: any;
}

export const CategoryModel = getModelForClass(Category);
