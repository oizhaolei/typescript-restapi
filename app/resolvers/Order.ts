import { Resolver, Mutation, Arg, Query, FieldResolver, Root, Ctx } from 'type-graphql';

import { Order, OrderModel } from '../entities/Order';
import { OrderInput } from './types/order-input';

import { User, UserModel } from '../entities/User';
import { Product, ProductModel } from '../entities/Product';

@Resolver(_of => Order)
export class OrderResolver {
  @Query(_returns => Order, { nullable: false })
  async returnSingleProduct(@Arg('id') id: string) {
    return await OrderModel.findById({ _id: id });
  }

  @Query(() => [Order])
  async returnAllOrders(@Ctx() ctx: any) {
    console.log('ctx.user', ctx.user);
    return await OrderModel.find();
  }

  @Mutation(() => Order)
  async createOrder(@Arg('data') { user, date, payed, product }: OrderInput): Promise<Order> {
    const order = new OrderModel({
      user,
      date,
      payed,
      product,
    });
    await order.save();
    return order;
  }

  @Mutation(() => Boolean)
  async deleteOrder(@Arg('id') id: string) {
    await OrderModel.deleteOne({ id });
    return true;
  }

  @Mutation(() => Boolean)
  async deleteAllOrders() {
    await OrderModel.deleteMany({});
    return true;
  }

  @FieldResolver(_type => User)
  async user(@Root() order: Order): Promise<User> {
    // console.log(order, "order!")
    return (await UserModel.findById(order._doc.user))!;
  }

  @FieldResolver(_type => Product)
  async product(@Root() order: Order): Promise<Product> {
    // console.log(order, "order!")
    return (await ProductModel.findById(order._doc.product))!;
  }
}
