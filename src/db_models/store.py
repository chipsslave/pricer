from common.database.database_connection import query_one, query_all, query_many, mutation


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
        sql = 'INSERT INTO {} ({}) VALUES ({})'.format(Store.db_table, self.tuple_keys, self.q_marks)
        last_row_id = mutation(sql, (self.id, self.store, self.url, self.logo,)).lastrowid
        return last_row_id

    @classmethod
    def find_by_store_id(cls, store_id):
        sql = 'SELECT * FROM {} WHERE id=%s'.format(Store.db_table)
        store = query_one(sql, (store_id,))
        return cls(*store) if store is not None else None

    @classmethod
    def find_all(cls):
        sql = 'SELECT * FROM {}'.format(Store.db_table)
        items = query_all(sql)
        return [cls(*elem) for elem in items] if items is not None else None

    @staticmethod
    def delete_by_id(store_id):
        sql = "DELETE FROM {} WHERE id=%s".format(Store.db_table)
        return mutation(sql, (store_id,))

    def delete(self):
        sql = "DELETE FROM {} WHERE id=%s".format(Store.db_table)
        return mutation(sql, (self.id,))


if __name__ == '__main__':
    a = Store.find_by_store_id(1)
    print(a.__dict__)
