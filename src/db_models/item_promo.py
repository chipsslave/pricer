from common.database.database_connection import DatabaseConnection


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
        with DatabaseConnection() as connection:
            cursor = connection.cursor()
            sql = 'INSERT INTO {} ({}) VALUES ({})'.format(ItemPromo.db_table, self.tuple_keys, self.q_marks)
            cursor.execute(sql, (self.id, self.item_id, self.promo, self.promo_url,))

    @classmethod
    def find_by_item_id(cls, item_id):
        with DatabaseConnection() as connection:
            cursor = connection.cursor(buffered=True)
            sql = 'SELECT * FROM {} WHERE item_id=%s'.format(ItemPromo.db_table)
            cursor.execute(sql, (item_id,))
            item = cursor.fetchone()
        return cls(*item) if item is not None else None

    @classmethod
    def find_all(cls):
        items = db.select_all(ItemImage.db_table)
        return [cls(*elem) for elem in items] if items is not None else None

    @staticmethod
    def delete_by_item_id(item_id):
        with DatabaseConnection() as connection:
            cursor = connection.cursor()
            sql = 'DELETE FROM {} WHERE item_id=%s'.format(ItemPromo.db_table)
            cursor.execute(sql, (item_id,))

    def delete(self):
        with DatabaseConnection() as connection:
            cursor = connection.cursor()
            sql = 'DELETE FROM {} WHERE item_id=%s'.format(ItemPromo.db_table)
            cursor.execute(sql, (self.item_id,))


if __name__ == '__main__':
    pass
