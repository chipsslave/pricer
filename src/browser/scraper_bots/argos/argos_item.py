from src.db_models.item import Item
from src.db_models.item_image import ItemImage
from src.db_models.item_price import ItemPrice
from src.logger.logger import logger


class ArgosItem(object):
    def __init__(self, title, price, store_product_id, url, item_image, store_id, date, time):
        self.title = title
        self.price = price
        self.store_product_id = store_product_id
        self.url = url
        self.item_image = item_image
        self.store_id = store_id
        self.date = date
        self.time = time

    def __repr__(self):
        return "Title: {}\nPrice: {}\nProduct ID: {}\nURL: {}\nImage URL: {}".format(self.title, self.price, self.store_product_id, self.url, self.item_image)

    def evaluate(self):
        db_item = Item.find_by_store_product_id(self.store_product_id)
        if db_item is None:
            item_id = Item(id=None, store_id=self.store_id, store_product_id=self.store_product_id,
                           title=self.title, url=self.url).insert()
            ItemImage(item_id=item_id, img_src=self.item_image).insert()
            ItemPrice(date=self.date, time=self.time, item_id=item_id, item_price=self.price).insert()
        elif db_item is not None:
            last_price = ItemPrice.find_by_item_id(db_item.id)
            if last_price.price != self.price:
                delta = float(self.price / last_price.price)
                if delta < 1:
                    delta = round((1 - delta) * 100, 1)
                    delta = delta * (-1)
                elif delta > 1:
                    delta = round((delta - 1) * 100, 1)
                    delta = delta
                b = ItemPrice(date=self.date, time=self.time, item_id=db_item.id, item_price=self.price, item_delta=delta)
                b.insert()
                logger(self.__repr__, db_item.__repr__(), last_price.__repr__(), b.__repr__())


