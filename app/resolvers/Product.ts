import { Resolver, Mutation, Arg, Query, FieldResolver, Root } from "type-graphql";
import { Product, ProductModel } from "../entities/Product";
import { ProductInput } from "./types/product-input"

import { Category, CategoryModel } from "../entities/Category";



@Resolver(_of => Product)
export class ProductResolver {

  @Query(_returns => Product, { nullable: false })
  async returnSingleProduct(@Arg("id") id: string) {
    return await ProductModel.findById({ _id: id });
  };

  @Query(() => [Product])
  async returnAllProducts() {
    return await ProductModel.find();
  };

  @Mutation(() => Product)
  async createProduct(@Arg("data") { name, description, color, stock, price, category }: ProductInput): Promise<Product> {
    const product = new ProductModel({
      name,
      description,
      color,
      stock,
      price,
      category

    });
    await product.save();
    return product;
  };

  @Mutation(() => Boolean)
  async deleteProduct(@Arg("id") id: string) {
    await ProductModel.deleteOne({ id });
    return true;
  }


  @Mutation(() => Boolean)
  async deleteAllProducts() {
    await ProductModel.deleteMany({});
    return true;
  }

  @FieldResolver(_type => (Category))
  async category(@Root() product: Product): Promise<Category> {
    // console.log(product, "product!")
    return (await CategoryModel.findById(product._doc.category))!;
  }


}
