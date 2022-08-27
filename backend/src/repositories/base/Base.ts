// import all interfaces
import { IRead } from "../interfaces/IRead";
import { IWrite } from "../interfaces/IWrite";

export abstract class BaseRepository<I, T>
  implements IWrite<I, T>, IRead<I, T>
{
  async create(item: T): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  async update(id: I, item: T): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  async delete(id: I): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  async find(item: T): Promise<T[] | null> {
    throw new Error("Method not implemented.");
  }
  async findOne(id: I): Promise<T | null> {
    throw new Error("Method not implemented.");
  }
}
