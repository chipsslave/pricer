export interface IRead<I, T> {
  find(item: T): Promise<T[] | null>;
  findOne(id: I): Promise<T | null>;
}
