import { Length } from 'class-validator';
import { Product } from '../Product';
import { ObjectId } from 'mongodb';

export class ProductInput implements Partial<Product> {
  name: string;

  @Length(1, 255)
  description: string;

  color: string;

  stock: number;

  price: number;

  category: ObjectId;
}
