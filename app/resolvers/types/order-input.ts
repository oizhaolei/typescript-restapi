import { InputType, Field, ID } from "type-graphql";
import { Order } from "../../entities/Order";
import { ObjectId } from "mongodb";


@InputType()
export class OrderInput implements Partial<Order> {

  @Field()
  user_id: String;

  @Field()
  payed: Boolean;

  @Field()
  date: Date;

  @Field(()=> ID)
  product: ObjectId;

}
