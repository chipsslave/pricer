from common.database.database_connection import query_one, query_all, query_many, mutation


class ItemCategory(object):
    db_table = 'item_categories'

    def __init__(self, category_id=None, item_id=None, id=None):
        self.id = 0 if id is None else id
        self.category_id = category_id
        self.item_id = item_id

    @property
    def tuple_keys(self):
        return ', '.join(tuple(self.__dict__.keys()))

    @property
    def q_marks(self):
        return ', '.join(['%s'] * len(self.__dict__.keys()))

    def insert(self):
        sql = 'INSERT INTO {} ({}) VALUES ({})'.format(ItemCategory.db_table, self.tuple_keys, self.q_marks)
        last_row_id = mutation(sql, (self.id, self.category_id, self.item_id,)).lastrowid
        return last_row_id


if __name__ == '__main__':
    pass
