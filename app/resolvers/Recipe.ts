import { ObjectId } from 'mongodb';
import { Resolver, Query, FieldResolver, Authorized, Arg, Root, Mutation, Ctx } from 'type-graphql';

import { Recipe, RecipeModel } from '../entities/Recipe';
import { Rate } from '../entities/Rate';
import { User, UserModel } from '../entities/User';
import { RecipeInput } from './types/recipe-input';
import { RateInput } from './types/rate-input';
import { Context } from '../interfaces/context.interface';
import { ObjectIdScalar } from '../object-id.scalar';

@Resolver(_of => Recipe)
export class RecipeResolver {
  @Query(_returns => Recipe, { nullable: true })
  recipe(@Arg('recipeId', _type => ObjectIdScalar) recipeId: ObjectId) {
    return RecipeModel.findById(recipeId);
  }

  @Query(_returns => [Recipe])
  async recipes(): Promise<Recipe[]> {
    return await RecipeModel.find({});
  }

  @Authorized() // only logged users can add new recipe
  @Mutation(_returns => Recipe)
  async addRecipe(@Arg('recipe') recipeInput: RecipeInput, @Ctx() { user }: Context): Promise<Recipe> {
    const recipe = new RecipeModel({
      ...recipeInput,
      author: user,
    } as Recipe);

    await recipe.save();
    return recipe;
  }

  @Authorized('ADMIN') // only admin can remove the published recipe
  @Mutation()
  async deleteRecipe(@Arg('recipeId', _type => ObjectIdScalar) id: ObjectId) {
    await RecipeModel.deleteOne({ id });
    return true;
  }

  @Mutation(_returns => Recipe)
  async rate(@Arg('rate') rateInput: RateInput, @Ctx() { user }: Context): Promise<Recipe> {
    // find the recipe
    const recipe = await RecipeModel.findById(rateInput.recipeId);
    if (!recipe) {
      throw new Error('Invalid recipe ID');
    }

    // set the new recipe rate
    const newRate: Rate = {
      value: rateInput.value,
      user,
      date: new Date(),
    };

    // update the recipe
    recipe.ratings.push(newRate);
    await recipe.save();
    return recipe;
  }

  @FieldResolver()
  async author(@Root() recipe: Recipe): Promise<User> {
    return (await UserModel.findById(recipe.author))!;
  }
}
