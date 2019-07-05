from common.database.database_connection import DatabaseConnection


class Store(object):
    db_table = 'stores'

    def __init__(self, id=None, store=None, url=None, logo=None):
        self.id = 0 if id is None else id
        self.store = store
        self.url = url
        self.logo = logo

    @property
    def tuple_keys(self):
        return ', '.join(tuple(self.__dict__.keys()))

    @property
    def q_marks(self):
        return ', '.join(['%s'] * len(self.__dict__.keys()))

    @property
    def tuple_values(self):
        return tuple(self.__dict__.values())

    def insert(self):
        with DatabaseConnection() as connection:
            cursor = connection.cursor()
            sql = 'INSERT INTO {} ({}) VALUES ({})'.format(Store.db_table, self.tuple_keys, self.q_marks)
            cursor.execute(sql, (self.id, self.store_id, self.store_product_id, self.title, self.url,))
            last_row_id = cursor.lastrowid
            return last_row_id

    @classmethod
    def find_by_store_id(cls, store_id):
        with DatabaseConnection() as connection:
            cursor = connection.cursor(buffered=True)
            sql = 'SELECT * FROM {} WHERE id=%s'.format(Store.db_table)
            cursor.execute(sql, (store_id,))
            store = cursor.fetchone()
            return cls(*store) if store is not None else None

    @classmethod
    def find_all(cls):
        items = db.select_all(Store.db_table)
        return [cls(*elem) for elem in items] if items is not None else None

    @staticmethod
    def delete_by_id(store_id):
        db.delete(Store.db_table, 'id', store_id)

    def delete(self):
        db.delete(Store.db_table, 'id', self.id)


if __name__ == '__main__':
    a = Store.find_by_store_id(1)
    print(a.__dict__)
