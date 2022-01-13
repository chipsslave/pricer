interface Handler<T> {
  setNext(handler: Handler<T>): Handler<T>;

  handle(request: T): void;
}

abstract class AbstractHandler<T> implements Handler<T> {
  private nextHandler: Handler<T>;

  public setNext(handler: Handler<T>): Handler<T> {
    this.nextHandler = handler;
    // Returning a handler from here will let us link handlers in a
    // convenient way like this:
    // monkey.setNext(squirrel).setNext(dog);
    return handler;
  }

  public handle(request: T): void {
    if (this.nextHandler) {
      this.nextHandler.handle(request);
    }
  }
}
