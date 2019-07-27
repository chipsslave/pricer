from common.database.database_connection import query_one, query_all, query_many, mutation


class ItemPromo(object):
    db_table = 'item_promos'

    def __init__(self, id=0, item_id=None, promo=None, promo_url=None):
        self.id = id
        self.item_id = item_id
        self.promo = promo
        self.promo_url = promo_url

    @property
    def tuple_keys(self):
        return ', '.join(tuple(self.__dict__.keys()))

    @property
    def tuple_values(self):
        return tuple(self.__dict__.values())

    @property
    def q_marks(self):
        return ', '.join(['%s'] * len(self.__dict__.keys()))

    def insert(self):
        sql = 'INSERT INTO {} ({}) VALUES ({})'.format(ItemPromo.db_table, self.tuple_keys, self.q_marks)
        last_row_id = mutation(sql, (self.id, self.item_id, self.promo, self.promo_url,)).lastrowid
        return last_row_id

    @classmethod
    def find_by_item_id(cls, item_id):
        sql = 'SELECT * FROM {} WHERE item_id=%s'.format(ItemPromo.db_table)
        item = query_one(sql, (item_id,))
        return cls(*item) if item is not None else None

    @classmethod
    def find_all(cls):
        sql = 'SELECT * FROM {}'.format(ItemPromo.db_table)
        items = query_all(sql)
        return [cls(*elem) for elem in items] if items is not None else None

    @staticmethod
    def delete_by_item_id(item_id):
        sql = "DELETE FROM {} WHERE item_id=%s".format(ItemPromo.db_table)
        return mutation(sql, (item_id,))

    def delete(self):
        sql = "DELETE FROM {} WHERE id=%s".format(ItemPromo.db_table)
        return mutation(sql, (self.id,))


if __name__ == '__main__':
    pass
