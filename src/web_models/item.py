from common.database.database_connection import DatabaseConnection
from src.db_models.item import Item
from src.db_models.item_image import ItemImage
from src.db_models.item_price import ItemPrice
from src.db_models.store import Store


class WebItem(object):
    db_table = 'items'

    def __init__(self, id=0, store_id=None, store_product_id=None, title=None, url=None, price=None, delta=None, img=None):
        self.item_id = id
        self.store_id = store_id
        self.store_product_id = store_product_id
        self.title = title
        self.url = url
        self.price = price
        self.delta = delta
        self.img = img


    def __repr__(self):
        return "Item id: {} \nStore id: {} \nStore product id: {} \nItem title: {} \nItem url: {}".format(self.id, self.store_id, self.store_product_id, self.title, self.url)

    @property
    def tuple_keys(self):
        return ', '.join(tuple(self.__dict__.keys()))

    @property
    def q_marks(self):
        return ', '.join(['%s'] * len(self.__dict__.keys()))

    @property
    def store(self):
        return Store.find_by_store_id(self.store_id)

    @staticmethod
    def find_by_delta():
        items_with_delta_not_zero = ItemPrice.find_by_delta_not_zero()
        items = []
        for item in items_with_delta_not_zero:
            item_details = Item.find_by_item_id(item.item_id)
            item_images = ItemImage.find_by_item_id(item.item_id)
            i = WebItem(id=item.item_id, price=item.price, delta=item.delta, store_id=item_details.store_id,
                        store_product_id=item_details.store_product_id,
                        title=item_details.title,
                        url=item_details.url,
                        img=item_images.image_src)

            items.append(i)
        return items

        with DatabaseConnection() as connection:
            cursor = connection.cursor(buffered=True)
            sql = 'SELECT * FROM {} WHERE store_product_id=%s'.format(Item.db_table)
            cursor.execute(sql, (store_product_id,))
            item = cursor.fetchone()
            return cls(*item) if item is not None else None
    #
    # @classmethod
    # def find_all(cls):
    #     items = db.select_all(Item.db_table)
    #     return [cls(*elem) for elem in items] if items is not None else None
    #
    # @staticmethod
    # def delete_by_id(item_id):
    #     db.delete(Item.db_table, 'id', item_id)
    #
    # def delete(self):
    #     db.delete(Item.db_table, 'id', self.id)


if __name__ == '__main__':
    # item = Item(store_id='store_id_111', title='new_item_PHONE', store_product_id='store_product_id_444', url='url_555')
    # print(item.tuple_keys)
    # print(item.q_marks)

    item = WebItem.find_by_delta()
    for i in item:
        print(i.__dict__)
