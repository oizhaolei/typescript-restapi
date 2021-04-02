import { Resolver, Mutation, Arg, Query, FieldResolver, Root, Ctx } from 'type-graphql';

import { Order, OrderModel } from '../entities/Order';
import { OrderInput } from './types/order-input';

import { User, UserModel } from '../entities/User';
import { Product, ProductModel } from '../entities/Product';
import { Context } from '../interfaces/context.interface';

@Resolver(() => Order)
export class OrderResolver {
  @Query(() => Order, { nullable: false })
  async returnSingleProduct(@Arg('id') id: string): Promise<Order | null> {
    return await OrderModel.findById(id);
  }

  @Query(() => [Order])
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async returnAllOrders(@Ctx() ctx: Context) {
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
  async deleteOrder(@Arg('id') id: string): Promise<boolean> {
    await OrderModel.deleteOne({ _id: id });
    return true;
  }

  @Mutation(() => Boolean)
  async deleteAllOrders(): Promise<boolean> {
    await OrderModel.deleteMany({});
    return true;
  }

  @FieldResolver(() => User)
  async user(@Root() order: Order): Promise<User> {
    // console.log(order, "order!")
    return (await UserModel.findById(order.user))!;
  }

  @FieldResolver(() => Product)
  async product(@Root() order: Order): Promise<Product> {
    // console.log(order, "order!")
    return (await ProductModel.findById(order.product))!;
  }
}
