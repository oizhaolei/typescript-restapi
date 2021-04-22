import { prop as Property, getModelForClass } from '@typegoose/typegoose';

import { Ref } from '../interfaces/types';

import { Role } from './Role';
import { Cart } from './Cart';

export class User {
  static anonymous: User = new User();

  id: string;

  @Property({ required: true })
  username: string;

  @Property({ required: true })
  password: string;

  @Property({ required: true, unique: true })
  email: string;

  @Property({ type: () => Role, default: [] })
  roles: Role[];

  @Property({ ref: Cart })
  cart?: Ref<Cart>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _doc: any;
}

export const UserModel = getModelForClass(User);
