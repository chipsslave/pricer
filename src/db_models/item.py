from common.database.database_connection import DatabaseConnection


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
        with DatabaseConnection() as connection:
            cursor = connection.cursor()
            sql = 'INSERT INTO {} ({}) VALUES ({})'.format(Item.db_table, self.tuple_keys, self.q_marks)
            cursor.execute(sql, (self.id, self.store_id, self.store_product_id, self.title, self.url,))
            last_row_id = cursor.lastrowid
            return last_row_id

    @classmethod
    def find_by_store_product_id(cls, store_product_id, url):
        with DatabaseConnection() as connection:
            cursor = connection.cursor(buffered=True)
            sql = 'SELECT * FROM {} WHERE store_product_id=%s AND url=%s'.format(Item.db_table)
            cursor.execute(sql, (store_product_id, url,))
            item = cursor.fetchone()
            return cls(*item) if item is not None else None

    @classmethod
    def find_by_item_id(cls, item_id):
        with DatabaseConnection() as connection:
            cursor = connection.cursor(buffered=True)
            sql = 'SELECT * FROM {} WHERE id=%s'.format(Item.db_table)
            cursor.execute(sql, (item_id,))
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

    item = Item.find_by_store_product_id(9139886)
    print(item)
