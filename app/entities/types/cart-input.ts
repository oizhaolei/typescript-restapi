import { Cart } from '../Cart';

import { ObjectId } from 'mongodb';

export class CartInput implements Partial<Cart> {
  products: ObjectId[];
}
