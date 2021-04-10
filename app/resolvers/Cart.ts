import { Resolver, Mutation, Arg, Query, FieldResolver, Root } from 'type-graphql';
import { Cart, CartModel } from '../entities/Cart';
import { CartInput } from './types/cart-input';

import { Product, ProductModel } from '../entities/Product';

@Resolver(() => Cart)
export class CartResolver {
  @Query(() => Cart, { nullable: false })
  async returnSingleCart(@Arg('id') id: string): Promise<Cart | null> {
    return await CartModel.findById(id);
  }

  @Query(() => [Cart])
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async returnAllCarts() {
    return await CartModel.find();
  }

  @Mutation(() => Cart)
  async createCart(@Arg('data') { products }: CartInput): Promise<Cart> {
    const cart = new CartModel({
      products,
    });
    await cart.save();
    return cart;
  }

  @Mutation(() => Boolean)
  async deleteCart(@Arg('id') id: string): Promise<boolean> {
    await CartModel.deleteOne({ _id: id });
    return true;
  }

  @Mutation(() => Boolean)
  async deleteAllCarts(): Promise<boolean> {
    await CartModel.deleteMany({});
    return true;
  }

  @FieldResolver(() => [Product])
  async products(@Root() cart: Cart): Promise<Product[] | null> {
    return await ProductModel.find({
      _id: {
        $in: cart._doc.products,
      },
    });
  }
}
