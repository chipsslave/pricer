from common.database.database_mysql import Database

db = Database()


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
    def tuple_values(self):
        return tuple(self.__dict__.values())

    def insert(self):
        db.insert(ItemCategory.db_table, self.tuple_keys, self.tuple_values)

    @classmethod
    def find_by_id(cls, item_category_id):
        item = db.select_one(ItemCategory.db_table, 'id', item_category_id)
        return cls(*item) if item is not None else None

    @classmethod
    def find_all(cls):
        items = db.select_all(ItemCategory.db_table)
        return [cls(*elem) for elem in items] if items is not None else None

    @staticmethod
    def delete_by_id(item_category_id):
        db.delete(ItemCategory.db_table, 'id', item_category_id)

    def delete(self):
        db.delete(ItemCategory.db_table, 'id', self.id)


if __name__ == '__main__':
    pass
