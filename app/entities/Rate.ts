import { prop as Property } from "@typegoose/typegoose";
import { ObjectType, Field, Int }  from "type-graphql";
import { User } from "./User";
import { Ref } from "../types";

@ObjectType()
export class Rate {
  @Field(_type => Int)
  @Property({ required: true })
  value: number;

  @Field()
  @Property({ default: new Date(), required: true })
  date: Date;

  @Field(_type => User)
  @Property({ ref: User, required: true })
  user: Ref<User>;
}
