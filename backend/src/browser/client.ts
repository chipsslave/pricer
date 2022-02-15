import { RequestInit } from "node-fetch";

export interface Client<T> {
  getContent(url: string, body?: RequestInit): Promise<T>;
}
