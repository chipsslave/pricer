export interface Client<T> {
  getContent(url: string, body?: RequestInit): Promise<T>;
}
