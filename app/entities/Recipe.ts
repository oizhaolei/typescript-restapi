import { prop as Property, getModelForClass } from "@typegoose/typegoose";
import { Field, ObjectType, ID } from "type-graphql";

import { Rate } from "./Rate";
import { User } from "./User";
import { Ref } from "../types";

@ObjectType()
export class Recipe {
  @Field(() => ID)
  id: String;  

  @Field()
  @Property({ required: true })
  title: string;

  @Field({ nullable: true })
  @Property()
  description?: string;

  @Field(_type => [Rate])
  @Property({ type: () => Rate, default: [] })
  ratings: Rate[];

  @Field(_type => User)
  @Property({ ref: User, required: true })
  author: Ref<User>;
}

export const RecipeModel = getModelForClass(Recipe);
