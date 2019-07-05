from common.database.database_connection import DatabaseConnection
import common.database.db as db


class ItemPrice(object):
    db_table = 'item_prices'

    connection = db.get_connection()

    def __init__(self, id=0, date=None, time=None, item_id=None, item_price=None, item_delta=0):
        self.id = id
        self.date = date
        self.time = time
        self.item_id = item_id
        self.price = item_price
        self.delta = item_delta

    def __repr__(self):
        return "ID: {}\nDate: {}\nTime: {}\nItem ID: {}\nPrice: {}\nDelta: {}".format(self.id, self.date, self.time, self.item_id, self.price, self.delta)

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
            sql = 'INSERT INTO {} ({}) VALUES ({})'.format(ItemPrice.db_table, self.tuple_keys, self.q_marks)
            cursor.execute(sql, (self.id, self.date, self.time, self.item_id, self.price, self.delta,))

    @classmethod
    def find_by_item_id(cls, item_id):
        with DatabaseConnection() as connection:
            cursor = connection.cursor(buffered=True)
            sql = 'SELECT * FROM {} WHERE item_id=%s ORDER BY id DESC'.format(ItemPrice.db_table)
            cursor.execute(sql, (item_id,))
            item_price = cursor.fetchone()
            return cls(*item_price) if item_price is not None else None

    @classmethod
    def find_by_delta_not_zero(cls):
        with DatabaseConnection() as connection:
            cursor = connection.cursor(buffered=True)
            sql = 'SELECT * FROM {} WHERE delta <> 0 ORDER BY id DESC'.format(ItemPrice.db_table)
            cursor.execute(sql)
            item_prices = cursor.fetchall()
        return [cls(*elem) for elem in item_prices] if item_prices is not None else None

    @staticmethod
    def delete_by_id(item_price_id):
        db.delete(ItemPrice.db_table, 'id', item_price_id)

    def delete(self):
        db.delete(ItemPrice.db_table, 'id', self.id)


if __name__ == '__main__':
    a = ItemPrice.find_by_item_id(1435)
    print(a)
