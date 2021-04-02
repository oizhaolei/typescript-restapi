import { Resolver, Mutation, Arg, Query } from 'type-graphql';
import { Category, CategoryModel } from '../entities/Category';
import { CategoryInput } from './types/category-input';

@Resolver(() => Category)
export class CategoryResolver {
  @Query(() => Category, { nullable: false })
  async returnSingleCategory(@Arg('id') id: string): Promise<Category | null> {
    return await CategoryModel.findById(id);
  }

  @Query(() => [Category])
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async returnAllCategories() {
    return await CategoryModel.find();
  }

  @Mutation(() => Category)
  async createCategory(@Arg('data') { name, description }: CategoryInput): Promise<Category> {
    const category = new CategoryModel({
      name,
      description,
    });
    await category.save();
    return category;
  }

  @Mutation(() => Boolean)
  async deleteCategory(@Arg('id') id: string): Promise<boolean> {
    console.log('deleteCategory:', id);
    await CategoryModel.deleteOne({ _id: id });
    return true;
  }

  @Mutation(() => Boolean)
  async deleteAllCategories(): Promise<boolean> {
    await CategoryModel.deleteMany({});
    return true;
  }
}
