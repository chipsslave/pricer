const fetch = require("node-fetch");
import { RequestInit, Response } from "node-fetch";
import { ClientErrorMessages, DeepError } from "../error";
import { Client } from "./client";

async function fetchContent(
  url: string,
  body?: RequestInit
): Promise<Response> {
  return body ? await fetch(url, body) : await fetch(url);
}

export class FetchHtmlClient implements Client<string, Response> {
  async getContent(
    url: string,
    body?: RequestInit
  ): Promise<string | DeepError<Response>> {
    let response: Response;
    if (body) {
      response = await fetchContent(url, body);
    } else {
      response = await fetchContent(url);
    }
    if (response.ok) {
      return response.text();
    }

    if (body) {
      return {
        message: ClientErrorMessages.RESPONSE_NOT_OK,
        resolution: "Check if URL and body is OK",
        data: response,
      };
    } else {
      return {
        message: ClientErrorMessages.RESPONSE_NOT_OK,
        resolution: "Check if URL is OK",
        data: response,
      };
    }
  }
}

export class FetchJsonClient implements Client<unknown, Response> {
  async getContent(
    url: string,
    body?: RequestInit
  ): Promise<unknown | DeepError<Response>> {
    let response: Response;
    if (body) {
      response = await fetchContent(url, body);
    } else {
      response = await fetchContent(url);
    }
    if (response.ok) {
      return response.json();
    }

    if (body) {
      return {
        message: ClientErrorMessages.RESPONSE_NOT_OK,
        resolution: "Check if URL and body is OK",
        data: response,
      };
    } else {
      return {
        message: ClientErrorMessages.RESPONSE_NOT_OK,
        resolution: "Check if URL is OK",
        data: response,
      };
    }
  }
}
