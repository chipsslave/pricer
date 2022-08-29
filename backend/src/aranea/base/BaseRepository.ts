import { DataReader } from "../interfaces/DataReader";
import { DataWriter } from "../interfaces/DataWriter";

export abstract class BaseRepository<I, T>
  implements DataReader<I, T>, DataWriter<I, T>
{
  findAll(): Promise<T[]> {
    throw new Error("Method not implemented.");
  }
  findOne(id: I): Promise<T | null> {
    throw new Error("Method not implemented.");
  }
  create(item: T): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  update(id: I, item: T): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  delete(id: I): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
