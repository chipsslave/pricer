import { BaseEntity } from "./BaseEntity";

export type Page = BaseEntity & {
  url: string;
};
