import { ObjectId } from 'mongodb';
import { InputType, Field, ID, Int } from 'type-graphql';

@InputType()
export class RateInput {
  @Field(() => ID)
  recipeId: ObjectId;

  @Field(_type => Int)
  value: number;
}
