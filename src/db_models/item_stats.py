from mysql.connector import IntegrityError

from common.database.database_connection import query_one, query_all, query_many, mutation


class ItemStats(object):
    db_table = 'item_stats'

    def __init__(self, id=None, item_id=None, min_price=None, max_price=None, avg_price=None, last_price=None,
                 last_delta=None, count_min_price=None, great_deal=None):
        self.id = 0 if id is None else id
        self.item_id = item_id
        self.min_price = min_price
        self.max_price = max_price
        self.avg_price = avg_price
        self.last_price = last_price
        self.last_delta = last_delta
        self.count_min_price = count_min_price
        self.great_deal = great_deal

    def __repr__(self):
        return "Item id: {} \nMin Price: {} \nMax Price: {} \nAverage Price: {} \nLast Price: {} \nLast Delta: {} \nCount of Mimimum Price: {}".format(
            self.item_id,
            self.min_price,
            self.max_price,
            self.avg_price,
            self.last_price,
            self.last_delta,
            self.count_min_price)

    @property
    def tuple_keys(self):
        return ', '.join(tuple(self.__dict__.keys()))

    @property
    def q_marks(self):
        return ', '.join(['%s'] * len(self.__dict__.keys()))

    def insert(self):
        try:
            sql = 'INSERT INTO {} ({}) VALUES ({})'.format(ItemStats.db_table, self.tuple_keys, self.q_marks)
            last_row_id = mutation(sql, (
                self.id, self.item_id, self.min_price, self.max_price, self.avg_price, self.last_price, self.last_delta,
                self.count_min_price, self.great_deal)).lastrowid
        except IntegrityError:
            sql = 'UPDATE item_stats SET min_price = %s, max_price = %s, avg_price = %s, last_price = %s, last_delta = %s, count_min_price = %s, great_deal = %s WHERE item_id = %s'
            last_row_id = mutation(sql, (self.min_price, self.max_price, self.avg_price, self.last_price, self.last_delta, self.count_min_price, self.great_deal, self.item_id)).lastrowid
        finally:
            return last_row_id

    @classmethod
    def fetch_stats_for_item_id(cls, item_id):
        sql = 'SELECT * FROM {} WHERE item_id = %s'.format(ItemStats.db_table)
        stats = query_one(sql, (item_id,))
        return cls(*stats) if stats is not None else None

    def build_stats_for_item_id(self, item_id):
        if self.fetch_stats_for_item_id(item_id) is None:
            pass

    def fetch_stats(self):
        sql = 'SELECT MIN(price), MAX(price), AVG(price),'

    def fetch_min_max(self):
        sql = 'SELECT MIN(price), MAX(price), AVG(price) FROM item_prices WHERE item_id = %s'
        result = query_one(sql, (self.item_id,))
        self.min_price = round(result[0], 2)
        self.max_price = round(result[1], 2)
        self.avg_price = round(result[2], 2)

    def fetch_min_price(self):
        sql = 'SELECT MIN(price) FROM item_prices WHERE item_id = %s'
        self.min_price = query_one(sql, (self.item_id,))[0]

    def fetch_max_price(self):
        sql = 'SELECT MAX(price) FROM item_prices WHERE item_id = %s'
        self.max_price = round(query_one(sql, (self.item_id,))[0], 2)

    def fetch_avg_price(self):
        sql = 'SELECT AVG(price) FROM item_prices WHERE item_id = %s'
        self.avg_price = round(query_one(sql, (self.item_id,))[0], 2)

    def fetch_last(self):
        sql = 'SELECT price, delta FROM item_prices WHERE item_id = %s ORDER BY date DESC, time DESC'
        result = query_one(sql, (self.item_id,))
        self.last_price = result[0]
        self.last_delta = result[1]

    def fetch_last_price(self):
        sql = 'SELECT price FROM item_prices WHERE item_id = %s ORDER BY date DESC, time DESC'
        self.last_price = query_one(sql, (self.item_id,))[0]

    def fetch_last_delta(self):
        sql = 'SELECT delta FROM item_prices WHERE item_id = %s ORDER BY date DESC, time DESC'
        self.last_delta = query_one(sql, (self.item_id,))[0]

    def fetch_count_of_min_price(self):
        sql = 'SELECT COUNT(*) FROM item_prices WHERE item_id = %s GROUP BY price ORDER BY price LIMIT 1'
        self.count_min_price = query_one(sql, (self.item_id,))[0]

    def good_deal(self):
        if self.count_min_price == 1 and self.last_price == self.min_price and self.max_price != self.min_price:
            self.great_deal = 1
        else:
            self.great_deal = 0


if __name__ == '__main__':
    sql = 'SELECT id FROM items'
    id_list = query_all(sql)
    for idd in id_list:
        stat = ItemStats(item_id=idd[0])
        stat.fetch_min_max()
        stat.fetch_last()
        stat.fetch_count_of_min_price()
        stat.good_deal()
        stat.insert()
        print(idd)
