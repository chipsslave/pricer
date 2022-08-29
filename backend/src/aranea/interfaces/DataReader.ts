export interface DataReader<I, T> {
  findAll(): Promise<T[]>;
  findOne(id: I): Promise<T | null>;
}
