import datetime
from common.database.database_connection import DatabaseConnection


class StoreURL(object):
    db_table = 'store_urls'

    def __init__(self, id=0, store_id=None, url=None, lc_date=0, lc_time=0):
        self.id = id
        self.store_id = store_id
        self.url = url
        self.lc_date = lc_date
        self.lc_time = lc_time

    def __repr__(self):
        return "{}\nLast checked date: {} \nLast checked time: {}".format(self.url, self.lc_date, self.lc_time)

    @property
    def tuple_keys(self):
        return ', '.join(tuple(self.__dict__.keys()))

    @property
    def tuple_values(self):
        return tuple(self.__dict__.values())

    def utc_time(self):
        if self.lc_date is not None and self.lc_time is not None:
            hour, minute = int(str(self.lc_time)[:-6]), int(str(self.lc_time)[3:-3])
            return datetime.datetime.combine(self.lc_date, datetime.time(hour, minute))
        return None

    # def insert(self):
    #     db.insert(StoreURL.db_table, self.tuple_keys, self.tuple_values)

    # @classmethod
    # def find_by_id(cls, store_id):
    #     item = db.select_one(StoreURL.db_table, 'id', store_id)
    #     return cls(*item) if item is not None else None
    #
    # @classmethod
    # def find_all(cls):
    #     items = db.select_all(StoreURL.db_table)
    #     return [cls(*elem) for elem in items] if items is not None else None

    @classmethod
    def select_oldest(cls):
        with DatabaseConnection() as connection:
            cursor = connection.cursor(buffered=True)
            sql = "SELECT * FROM {} ORDER BY lc_date ASC, lc_time ASC".format(StoreURL.db_table)
            cursor.execute(sql)
            store_url = cursor.fetchone()
            return cls(*store_url) if store_url is not None else None

    def update_lc_date_time(self, date, time):
        with DatabaseConnection() as connection:
            cursor = connection.cursor(buffered=True)
            sql = 'UPDATE {} SET lc_date=%s, lc_time=%s WHERE id=%s'.format(StoreURL.db_table)
            cursor.execute(sql, (date, time, self.id,))

    @staticmethod
    def delete_by_id(store_id):
        db.delete(StoreURL.db_table, 'id', store_id)

    def delete(self):
        db.delete(StoreURL.db_table, 'id', self.id)


if __name__ == '__main__':
    a = StoreURL.select_oldest()
    print(a)
