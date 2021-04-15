import { InputType, Field } from 'type-graphql';

@InputType()
export class PaginationInput {
  @Field()
  skip: number;

  @Field()
  limit: number;
}

export class Pagination<T> {
  constructor(count: number, data: T[]) {
    this.count = count;
    this.data = data;
  }
  count: number;

  data: T[];
}
