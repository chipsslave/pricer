import { LoggingLevel } from "@prisma/client";
import { getLogger, Logger } from "log4js";
import { StorePage } from "../service/page.service";

export interface PricerLogger {
  log(message: string): void;
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

  log(message: string): void {
    throw new Error("Method not implemented.");
  }

  getStorePage(): StorePage {
    return this.storePage;
  }

  getLoggingLevel(): LoggingLevel {
    return this.storePage.pageConfig?.loggingLevel || "DEBUG";
  }
}

export class PrismaLogger extends AbstractLogger {
  log(message: string): void {
    if (this.getLoggingLevel() === "INFO") {
      this.log4j.info(message);
    }
    if (this.getLoggingLevel() === "DEBUG") {
      this.log4j.debug(message);
    }
  }
}
