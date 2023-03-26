const fetch = require("node-fetch");
import { Response } from "node-fetch";
import { Client } from "./client";
import { RequestInit } from "node-fetch";

async function fetchContent(
  url: string,
  body?: RequestInit
): Promise<Response> {
  const response: Response = body ? await fetch(url, body) : await fetch(url);
  if (!response.ok) {
    console.log({ response });
    throw new Error("Response is not OK.");
  }
  return response;
}

export class FetchHtmlClient implements Client<string> {
  async getContent(url: string, body?: RequestInit): Promise<string> {
    return body
      ? (await fetchContent(url, body)).text()
      : (await fetchContent(url)).text();
  }
}

export class FetchJsonClient implements Client<unknown> {
  async getContent(url: string, body?: RequestInit): Promise<unknown> {
    return body
      ? (await fetchContent(url, body)).json()
      : (await fetchContent(url)).json();
  }
}
