const fetch = require("node-fetch");
import { Response } from "node-fetch";

async function fetchContent(url: string, body?: any): Promise<Response> {
  const response: Response = body ? await fetch(url, body) : await fetch(url);
  if (!response.ok) {
    console.log({ response });
    throw new Error("Response is not OK.");
  }
  return response;
}

export class FetchClient {
  private async fetch(url: string, body?: any): Promise<Response> {
    const response: Response = body ? await fetch(url, body) : await fetch(url);
    if (!response.ok) {
      console.log({ response });
      throw new Error("Response is not OK.");
    }
    return response;
  }

  async fetchHtml(url: string, body?: any): Promise<string> {
    const response: Response = await this.fetch(url, body);
    return await response.text();
  }

  async fetchJson(url: string, body?: any): Promise<unknown> {
    const response: Response = await this.fetch(url, body);
    return await response.json();
  }
}

export class FetchHtmlClient {
  async getContent(url: string, body?: any): Promise<string> {
    return body
      ? (await fetchContent(url, body)).text()
      : (await fetchContent(url)).text();
  }
}

export class FetchJsonClient<T> {
  async getContent(url: string, body?: any): Promise<T> {
    return body
      ? ((await fetchContent(url, body)).json() as unknown as T)
      : ((await fetchContent(url)).json() as unknown as T);
  }
}
