import mysql.connector
import config.config as config


class DatabaseConnection:
    def __init__(self):
        self.connection = None

    def __enter__(self):
        self.connection = mysql.connector.connect(
            host=config.host,
            user=config.user,
            passwd=config.password,
            database=config.database
        )
        return self.connection

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.connection.commit()
        self.connection.close()
