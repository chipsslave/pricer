import { RequestInit } from "node-fetch";
import { DeepError } from "../error";

export interface Client<T, D> {
  getContent(url: string, body?: RequestInit): Promise<T | DeepError<D>>;
}
