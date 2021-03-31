import { Resolver, Mutation, Arg, Query, FieldResolver, Root } from 'type-graphql';
import { Cart, CartModel } from '../entities/Cart';
import { CartInput } from './types/cart-input';

import { Product, ProductModel } from '../entities/Product';

@Resolver(_of => Cart)
export class CartResolver {
  @Query(_returns => Cart, { nullable: false })
  async returnSingleCart(@Arg('id') id: string) {
    return await CartModel.findById({ _id: id });
  }

  @Query(() => [Cart])
  async returnAllCarts() {
    return await CartModel.find();
  }

  @Mutation(() => Cart)
  async createCart(@Arg('data') { product }: CartInput): Promise<Cart> {
    const cart = new CartModel({
      product,
    });
    await cart.save();
    return cart;
  }

  @Mutation(() => Boolean)
  async deleteCart(@Arg('id') id: string) {
    await CartModel.deleteOne({ id });
    return true;
  }

  @Mutation(() => Boolean)
  async deleteAllCarts() {
    await CartModel.deleteMany({});
    return true;
  }

  @FieldResolver(_type => Product)
  async product(@Root() cart: Cart): Promise<Product> {
    // console.log(cart, "cart!")
    return (await ProductModel.findById(cart._doc.product))!;
  }
}
