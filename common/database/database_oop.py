from common.database.database_connection import DatabaseConnection


def create_book_table() -> None:
    with DatabaseConnection('data.db') as connection:
        cursor = connection.cursor()

        # SQLite automatically makes `integer primary key` row auto-incrementing (see link in further reading)
        cursor.execute('CREATE TABLE books (id integer primary key, name text, author text, read integer default 0)')


def find_item_id_by_product_id(store_product_id):
    with DatabaseConnection() as connection:
        cursor = connection.cursor()

        cursor.execute('SELECT id FROM items WHERE store_product_id=%s', (store_product_id,))
        books = cursor.fetchone()
    return books


def insert_book(name: str, author: str) -> None:
    with DatabaseConnection('data.db') as connection:
        cursor = connection.cursor()

        cursor.execute('INSERT INTO books (name, author) VALUES (?, ?)', (name, author))


def mark_book_as_read(name: str) -> None:
    with DatabaseConnection('data.db') as connection:
        cursor = connection.cursor()

        cursor.execute('UPDATE books SET read=1 WHERE name=?', (name,))


def delete_book(name: str) -> None:
    with DatabaseConnection('data.db') as connection:
        cursor = connection.cursor()

        cursor.execute('DELETE FROM books WHERE name=?', (name,))


while True:
    a = find_item_id_by_product_id(2974206)
    print(a)
