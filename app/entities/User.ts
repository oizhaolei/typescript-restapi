import { ObjectType, Field, ID } from "type-graphql";
import { prop as Property, getModelForClass } from "@typegoose/typegoose";

import { Ref } from "../types";

import { Cart } from "./Cart";


@ObjectType({ description: "The User model" })
export class User {
  @Field(() => ID)
  id: String;  

  @Field()
  @Property({ required: true })
  username: String;

  @Field()
  @Property({ required: true })
  email: String;

  @Field(_type => Cart)
  @Property({ ref: Cart, required: true })
  cart: Ref<Cart>
}


export const UserModel = getModelForClass(User);