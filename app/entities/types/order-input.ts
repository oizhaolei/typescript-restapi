import { Order } from '../Order';
import { ObjectId } from 'mongodb';

export class OrderInput implements Partial<Order> {
  user: ObjectId;

  payed: boolean;

  date: Date;

  products: ObjectId[];
}
