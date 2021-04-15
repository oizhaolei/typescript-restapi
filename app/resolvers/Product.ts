import { Resolver, Mutation, Arg, Query, FieldResolver, Root } from 'type-graphql';
import { Product, ProductModel } from '../entities/Product';
import { ProductInput } from './types/product-input';
import HttpException from '../HttpException';

import { Category, CategoryModel } from '../entities/Category';
import { logger } from '../utils/logger';

@Resolver(() => Product)
export class ProductResolver {
  @Query(() => Product, { nullable: false })
  async returnSingleProduct(@Arg('id') id: string): Promise<Category | null> {
    return await ProductModel.findById(id);
  }

  @Query(() => [Product])
  async returnAllProducts(): Promise<Product[]> {
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
    logger.info('product:', product.toObject());
    return product;
  }

  @Mutation(() => Boolean)
  async deleteProduct(@Arg('id') id: string): Promise<boolean> {
    const res = await ProductModel.deleteOne({ _id: id });
    if (res.deletedCount !== 1) throw new HttpException(400, `category  ${id} is not exist.`);
    return true;
  }

  @Mutation(() => Boolean)
  async deleteAllProducts(): Promise<boolean> {
    await ProductModel.deleteMany({});
    return true;
  }

  @FieldResolver(() => Category)
  async category(@Root() product: Product): Promise<Category> {
    return (await CategoryModel.findById(product._doc.category))!;
  }
}
