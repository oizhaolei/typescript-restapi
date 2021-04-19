export class PaginationInput {
  skip: number;

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
