from common.database.database_connection import query_one, query_all, query_many, mutation


class Item(object):
    db_table = 'items'

    def __init__(self, id=None, store_id=None, store_product_id=None, title=None, url=None):
        self.id = 0 if id is None else id
        self.store_id = store_id
        self.store_product_id = store_product_id
        self.title = title
        self.url = url

    def __repr__(self):
        return "Item id: {} \nStore id: {} \nStore product id: {} \nItem title: {} \nItem url: {}".format(self.id, self.store_id, self.store_product_id, self.title, self.url)

    @property
    def tuple_keys(self):
        return ', '.join(tuple(self.__dict__.keys()))

    @property
    def q_marks(self):
        return ', '.join(['%s'] * len(self.__dict__.keys()))

    def insert(self):
        sql = 'INSERT INTO {} ({}) VALUES ({})'.format(Item.db_table, self.tuple_keys, self.q_marks)
        last_row_id = mutation(sql, (self.id, self.store_id, self.store_product_id, self.title, self.url)).lastrowid
        return last_row_id

    @classmethod
    def find_by_store_product_id(cls, store_product_id, url):
        sql = 'SELECT * FROM {} WHERE store_product_id=%s AND url=%s'.format(Item.db_table)
        item = query_one(sql, (store_product_id, url))
        return cls(*item) if item is not None else None

    @classmethod
    def find_by_item_id(cls, item_id):
        sql = 'SELECT * FROM {} WHERE id=%s'.format(Item.db_table)
        item = query_one(sql, (item_id,))
        return cls(*item) if item is not None else None


if __name__ == '__main__':
    item = Item.find_by_store_product_id(43105, "https://www.thefragranceshop.co.uk/products/lancome-la-vie-est-belle-43105.aspx")
    print(item)
    a = Item.find_by_item_id(41701)
    print(a)