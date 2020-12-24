import { Resolver, Mutation, Arg, Query } from "type-graphql";
import { Category, CategoryModel } from "../entities/Category";
import { CategoryInput } from "./types/category-input"

  
@Resolver()
export class CategoryResolver {

    @Query(_returns => Category, { nullable: false})
    async returnSingleCategory(@Arg("id") id: string){
      return await CategoryModel.findById({_id:id});
    };

    @Query(() => [Category])
    async returnAllCategories(){
      return await CategoryModel.find();
    };
  
    @Mutation(() => Category)
    async createCategory(@Arg("data"){name,description}: CategoryInput): Promise<Category> { 
      const category = (await CategoryModel.create({      
          name,
          description
      })).save();
      return category;
    };

   @Mutation(() => Boolean)
   async deleteCategory(@Arg("id") id: string) {
    await CategoryModel.deleteOne({id});
    return true;
  }



}
