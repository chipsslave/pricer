from common.database.database_connection import query_one, query_all, query_many, mutation


class ItemImage(object):
    db_table = 'item_images'

    def __init__(self, id=0, item_id=None, img_src=None):
        self.id = id
        self.item_id = item_id
        self.image_src = img_src

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
        sql = 'INSERT INTO {} ({}) VALUES ({})'.format(ItemImage.db_table, self.tuple_keys, self.q_marks)
        last_row_id = mutation(sql, (self.id, self.item_id, self.image_src,)).lastrowid
        return last_row_id

    @classmethod
    def find_by_item_id(cls, item_id):
        sql = 'SELECT * FROM {} WHERE item_id=%s'.format(ItemImage.db_table)
        item = query_one(sql, (item_id,))
        return cls(*item) if item is not None else None

    @classmethod
    def find_all(cls):
        sql = 'SELECT * FROM {}'.format(ItemImage.db_table)
        items = query_all(sql)
        return [cls(*elem) for elem in items] if items is not None else None

    @staticmethod
    def delete_by_id(item_image_id):
        sql = "DELETE FROM {} WHERE id=%s".format(ItemImage.db_table)
        return mutation(sql, (item_image_id,))

    def delete(self):
        sql = "DELETE FROM {} WHERE id=%s".format(ItemImage.db_table)
        return mutation(sql, (self.id,))


if __name__ == '__main__':
    x = ItemImage.find_by_item_id(1522)
    print(x.image_src)