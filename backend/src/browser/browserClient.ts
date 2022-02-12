import fetch, { Response } from "node-fetch";

export interface BrowserClient {
  launch(): void;
  fetchHtml(url: string, body?: string): Promise<string>;
  click(): void;
  hover(): void;
  close(): void;
}

export class FetchClient implements BrowserClient {
  launch(): void {
    console.log("No need to call launch on FetchClient");
  }

  async fetchHtml(url: string, body?: string): Promise<string> {
    const response: Response = fetch(url, body);

    return await response.text();
  }

  //   async fetchHtml(url: string): Promise<string> {
  //     await fetch(url);
  //     return "";
  //   }
  //   async fetchHtml(url: string, body: string): Promise<string> {
  //     await fetch(url, body);
  //     return "";
  //   }
  //   async fetchHtml(url: string, body?: string): Promise<string> {
  //     await fetch(url, body);
  //     return "";
  //   }
  click(): void {
    throw new Error("Can not do this.");
  }
  hover(): void {
    throw new Error("Can not do this.");
  }
  close(): void {
    console.log("No need to call close on FetchClient");
  }
}
