import mysql.connector
import config.config as config

_connection = None


def get_connection():
    global _connection
    if not _connection:
        _connection = mysql.connector.connect(
            host=config.host,
            user=config.user,
            passwd=config.password,
            database=config.database
    )
    return _connection
