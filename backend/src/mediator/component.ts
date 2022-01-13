import { ISpider } from "./mediator";

export abstract class BaseSpiderComponent {
  protected spider: ISpider;

  public setSpider(spider: ISpider): void {
    this.spider = spider;
  }
}
