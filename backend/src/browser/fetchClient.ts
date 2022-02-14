const fetch = require("node-fetch");
import { Response } from "node-fetch";

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
