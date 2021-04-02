import { prop as Property } from '@typegoose/typegoose';
import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class Role {
  @Field()
  @Property({ required: true })
  value: string;

  @Field()
  @Property({ required: true })
  title: string;
}
