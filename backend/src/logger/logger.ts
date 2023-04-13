import { LoggingLevel } from "@prisma/client";
import { getLogger, Logger } from "log4js";
import { StorePage } from "../service/page.service";

export interface PricerLogger {
  info(message: string): void;
  debug(message: string): void;
  error(message: string): void;
  getStorePage(): StorePage;
  getLoggingLevel(): LoggingLevel;
}

export abstract class AbstractLogger implements PricerLogger {
  private storePage: StorePage;
  public log4j: Logger;

  constructor(storePage: StorePage) {
    this.storePage = storePage;
    this.log4j = getLogger();
  }

  info(message: string): void {
    this.log4j.info(message);
  }

  debug(message: string): void {
    if (this.getLoggingLevel() === "DEBUG") {
      this.log4j.debug(message);
    }
  }

  error(message: string): void {
    this.log4j.error(message);
  }

  getStorePage(): StorePage {
    return this.storePage;
  }

  getLoggingLevel(): LoggingLevel {
    return this.storePage.pageConfig?.loggingLevel || "DEBUG";
  }
}

export class PrismaLogger extends AbstractLogger {
  info(message: string): void {
    this.log4j.info(message);
  }

  debug(message: string): void {
    if (this.getLoggingLevel() === "DEBUG") {
      this.log4j.debug(message);
    }
  }

  error(message: string): void {
    this.log4j.error(message);
  }
}
