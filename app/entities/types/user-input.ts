import { Length, IsEmail } from 'class-validator';
import { User } from '../User';
import { ObjectId } from 'mongodb';

export class UserInput implements Partial<User> {
  @Length(1, 255)
  username: string;

  @Length(10, 50)
  password: string;

  @IsEmail()
  email: string;

  cart: ObjectId;
}
