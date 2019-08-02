from src.db_models.item import Item
from src.db_models.item_image import ItemImage
from src.db_models.item_price import ItemPrice
from src.db_models.item_promo import ItemPromo
from src.db_models.item_stats import ItemStats
from src.logger.logger import logger


class ShopItem(object):
    def __init__(self, title, price, store_product_id, url, item_image, store_id, date, time, promo=None,
                 promo_url=None):
        self.title = title
        self.price = price
        self.store_product_id = store_product_id
        self.url = url
        self.item_image = item_image
        self.store_id = store_id
        self.date = date
        self.time = time
        self.promo = promo
        self.promo_url = promo_url

    def __repr__(self):
        return "Title: {}\nPrice: {}\nProduct ID: {}\nURL: {}\nImage URL: {}".format(self.title, self.price,
                                                                                     self.store_product_id, self.url,
                                                                                     self.item_image)

    @property
    def check_if_exists(self):
        return Item.find_by_store_product_id(self.store_product_id, self.url)

    @property
    def item_last_price(self):
        if self.check_if_exists is not None:
            return ItemPrice.find_by_item_id(self.check_if_exists.id)
        return None

    @property
    def item_last_promo(self):
        if self.check_if_exists is not None:
            return ItemPromo.find_by_item_id(self.check_if_exists.id)
        return None

    @property
    def item_last_image(self):
        if self.check_if_exists is not None:
            return ItemImage.find_by_item_id(self.check_if_exists.id)
        return None

    def insert_new_item(self):
        item_id = Item(id=None, store_id=self.store_id, store_product_id=self.store_product_id,
                       title=self.title, url=self.url).insert()
        ItemImage(item_id=item_id, img_src=self.item_image).insert()
        ItemPrice(date=self.date, time=self.time, item_id=item_id, item_price=self.price).insert()

    def insert_new_item_price(self):
        delta = self.calculate_delta()
        ItemPrice(date=self.date, time=self.time, item_id=self.check_if_exists.id, item_price=self.price,
                  item_delta=delta).insert()

    def insert_new_item_image(self):
        ItemImage(item_id=self.check_if_exists.id, img_src=self.item_image).insert()

    def insert_new_item_promo(self):
        ItemPromo(item_id=self.check_if_exists.id, promo=self.promo, promo_url=self.promo_url).insert()

    def calculate_delta(self):
        delta = float(self.price / self.item_last_price.price)
        if delta < 1:
            delta = round((1 - delta) * 100, 1)
            delta = delta * (-1)
        elif delta > 1:
            delta = round((delta - 1) * 100, 1)
            delta = delta
        return delta

    def evaluate(self):
        if self.check_if_exists is None:
            self.insert_new_item()
            self.evaluate_stats()
        elif self.check_if_exists is not None:
            if self.item_last_price.price != self.price:
                self.insert_new_item_price()
                self.evaluate_stats()

                # logger(str(self), self.check_if_exists.__repr__(), self.item_last_price.__repr__())

            self.evaluate_picture()
            self.evaluate_promo()

    def evaluate_promo(self):
        if self.promo is None and self.item_last_promo is not None:
            ItemPromo.delete_by_item_id(self.check_if_exists.id)
            return

        if self.promo is not None and self.item_last_promo is None:
            self.insert_new_item_promo()
            return

        if self.promo is not None and self.item_last_promo is not None:
            if self.promo != self.item_last_promo.promo:
                ItemPromo.delete_by_item_id(self.check_if_exists.id)
                self.insert_new_item_promo()
                return
            return

    def evaluate_picture(self):
        if self.item_image is not None and self.item_last_image is None:
            self.insert_new_item_image()
            return

        if self.item_image is not None and self.item_last_image is not None:
            if self.item_image != self.item_last_image.image_src:
                ItemImage.delete_by_item_id(self.check_if_exists.id)
                self.insert_new_item_image()
                return
            return

    def evaluate_stats(self):
        stat = ItemStats(item_id=self.check_if_exists.id)
        stat.fetch_min_max()
        stat.fetch_last()
        stat.fetch_count_of_min_price()
        stat.good_deal()
        stat.insert()
