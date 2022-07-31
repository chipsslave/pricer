export type DeepError<D> = {
  message: string | DefaultErrorMessages | ClientErrorMessages;
  resolution?: string | undefined;
  data?: D;
};

export const enum DefaultErrorMessages {
  TO_BUILT = "TO BUILT",
}

export const enum ClientErrorMessages {
  RESPONSE_NOT_OK = "Received response is not OK",
}

export const enum PuppeteerErrorMessages {
  BROWSER_NULL = "Browser appears to be NULL",
  NO_PAGES_FOUND = "Browser is launched but no pages found.",
  FIRST_PAGE_CLOSED = "First page appears to be closed.",
}

export const isError = (
  toBeDetermined: any | DeepError<any>
): toBeDetermined is DeepError<any> => {
  return !!(toBeDetermined as DeepError<any>)?.message;
};
