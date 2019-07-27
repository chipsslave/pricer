import datetime
from common.database.database_connection import query_one, query_all, query_many, mutation


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

    @classmethod
    def select_oldest(cls):
        sql = "SELECT * FROM {} ORDER BY lc_date ASC, lc_time ASC".format(StoreURL.db_table)
        store_url = query_one(sql)
        return cls(*store_url) if store_url is not None else None

    def update_lc_date_time(self, date, time):
        sql = 'UPDATE {} SET lc_date=%s, lc_time=%s WHERE id=%s'.format(StoreURL.db_table)
        mutation(sql, (date, time, self.id,))

    @staticmethod
    def delete_by_id(store_id):
        sql = "DELETE FROM {} WHERE id=%s".format(StoreURL.db_table)
        return mutation(sql, (store_id,))

    def delete(self):
        sql = "DELETE FROM {} WHERE id=%s".format(StoreURL.db_table)
        return mutation(sql, (self.id,))


if __name__ == '__main__':
    a = StoreURL.delete_by_id(342)
    print(a)
