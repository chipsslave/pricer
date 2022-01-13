import { ParsedElementItem } from "../main";

class ParsedItemFilterHandler extends AbstractHandler<ParsedElementItem> {
  public handle(request: ParsedElementItem): void {
    if (
      request.item.title &&
      request.item.upc &&
      request.item.price &&
      request.item.url
    ) {
      super.handle(request);
    }
  }
}

const x = new ParsedItemFilterHandler();
