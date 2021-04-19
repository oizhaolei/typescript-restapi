import { prop as Property } from '@typegoose/typegoose';

export class Role {
  @Property({ required: true })
  value: string;

  @Property({ required: true })
  title: string;
}
