from common.database.database_mysql import Database

db = Database()


class Category(object):
    db_table = 'categories'

    def __init__(self, category=None, id=None):
        self.id = 0 if id is None else id
        self.category = category

    @property
    def tuple_keys(self):
        return ', '.join(tuple(self.__dict__.keys()))

    @property
    def tuple_values(self):
        return tuple(self.__dict__.values())

    def insert(self):
        db.insert(Category.db_table, self.tuple_keys, self.tuple_values)

    @classmethod
    def find_by_id(cls, category_id):
        item = db.select_one(Category.db_table, 'id', category_id)
        return cls(*item) if item is not None else None

    @classmethod
    def find_all(cls):
        items = db.select_all(Category.db_table)
        return [cls(*elem) for elem in items] if items is not None else None

    @staticmethod
    def delete_by_id(category_id):
        db.delete(Category.db_table, 'id', category_id)

    def delete(self):
        db.delete(Category.db_table, 'id', self.id)


if __name__ == '__main__':
    pass
