import mysql.connector
import config.config as config

connection = mysql.connector.connect(pool_size=5, **config.dbConfig)


def mutation(operation, params=None):
    cursor = connection.cursor(buffered=True)
    cursor.execute(operation=operation, params=params)
    connection.commit()
    return cursor


def query_one(operation, params=None):
    cursor = connection.cursor(buffered=True)
    cursor.execute(operation=operation, params=params)
    return cursor.fetchone()


def query_all(operation, params=None):
    cursor = connection.cursor(buffered=True)
    cursor.execute(operation=operation, params=params)
    return cursor.fetchall()


def query_many(operation, params=None, size=1):
    cursor = connection.cursor(buffered=True)
    cursor.execute(operation=operation, params=params)
    return cursor.fetchmany(size=size)


if __name__ == "__main__":
    print(connection.get_server_info())

    # cur = connection.cursor()
    #
    # query = "SELECT store FROM stores"
    #
    # cur.execute(query)
    #
    # for store in cur:
    #     print(store)
