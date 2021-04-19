import { Length } from 'class-validator';
import { Category } from '../Category';

export class CategoryInput implements Partial<Category> {
  name: string;

  @Length(1, 255)
  description: string;
}
