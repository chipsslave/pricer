from common.database.database_connection import query_one, query_all, query_many, mutation


class Category(object):
    db_table = 'categories'

    def __init__(self, category=None, id=None):
        self.id = 0 if id is None else id
        self.category = category

    @property
    def tuple_keys(self):
        return ', '.join(tuple(self.__dict__.keys()))

    @property
    def q_marks(self):
        return ', '.join(['%s'] * len(self.__dict__.keys()))

    def insert(self):
        sql = 'INSERT INTO {} ({}) VALUES ({})'.format(Category.db_table, self.tuple_keys, self.q_marks)
        last_row_id = mutation(sql, (self.id, self.category,)).lastrowid
        return last_row_id


if __name__ == '__main__':
    pass
