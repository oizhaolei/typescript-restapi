import { InputType, Field, ID } from 'type-graphql';
import { Order } from '../../entities/Order';
import { ObjectId } from 'mongodb';

@InputType()
export class OrderInput implements Partial<Order> {
  @Field(() => ID)
  user: ObjectId;

  @Field()
  payed: boolean;

  @Field()
  date: Date;

  @Field(() => ID)
  product: ObjectId;
}
