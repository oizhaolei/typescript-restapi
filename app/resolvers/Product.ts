import { Resolver, Mutation, Arg, Query, FieldResolver, Root } from 'type-graphql';
import { Product, ProductModel } from '../entities/Product';
import { ProductInput } from './types/product-input';

import { Category, CategoryModel } from '../entities/Category';

@Resolver(() => Product)
export class ProductResolver {
  @Query(() => Product, { nullable: false })
  async returnSingleProduct(@Arg('id') id: string): Promise<Category | null> {
    return await ProductModel.findById(id);
  }

  @Query(() => [Product])
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async returnAllProducts() {
    return await ProductModel.find();
  }

  @Mutation(() => Product)
  async createProduct(@Arg('data') { name, description, color, stock, price, category }: ProductInput): Promise<Product> {
    const product = new ProductModel({
      name,
      description,
      color,
      stock,
      price,
      category,
    });
    await product.save();
    return product;
  }

  @Mutation(() => Boolean)
  async deleteProduct(@Arg('id') id: string): Promise<boolean> {
    await ProductModel.deleteOne({ _id: id });
    return true;
  }

  @Mutation(() => Boolean)
  async deleteAllProducts(): Promise<boolean> {
    await ProductModel.deleteMany({});
    return true;
  }

  @FieldResolver(() => Category)
  async category(@Root() product: Product): Promise<Category> {
    // console.log(product, "product!")
    return (await CategoryModel.findById(product.category))!;
  }
}
