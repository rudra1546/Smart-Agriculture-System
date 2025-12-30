import pymysql
from pymysql.cursors import DictCursor
from config import Config

def get_db_connection():
    """Create and return a database connection"""
    try:
        connection = pymysql.connect(
            host=Config.MYSQL_HOST,
            port=Config.MYSQL_PORT,
            user=Config.MYSQL_USER,
            password=Config.MYSQL_PASSWORD,
            database=Config.MYSQL_DATABASE,
            cursorclass=DictCursor,
            autocommit=False
        )
        return connection
    except pymysql.err.OperationalError as e:
        print(f"Error connecting to MySQL: {e}")
        raise

def init_db():
    """Initialize database and create tables if they don't exist"""
    try:
        # First, connect without specifying database to create it if needed
        connection = pymysql.connect(
            host=Config.MYSQL_HOST,
            port=Config.MYSQL_PORT,
            user=Config.MYSQL_USER,
            password=Config.MYSQL_PASSWORD,
            cursorclass=DictCursor
        )
        
        with connection.cursor() as cursor:
            # Create database if it doesn't exist
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS {Config.MYSQL_DATABASE}")
            cursor.execute(f"USE {Config.MYSQL_DATABASE}")
            
            # Create users table
            create_table_query = """
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_email (email)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            """
            cursor.execute(create_table_query)
            
        connection.commit()
        connection.close()
        print("Database initialized successfully")
        
    except Exception as e:
        print(f"Error initializing database: {e}")
        raise

def execute_query(query, params=None, fetch_one=False, fetch_all=False):
    """
    Execute a database query with parameters
    
    Args:
        query: SQL query string
        params: Query parameters (tuple or dict)
        fetch_one: Return single result
        fetch_all: Return all results
    
    Returns:
        Query results or affected row count
    """
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute(query, params or ())
            
            if fetch_one:
                result = cursor.fetchone()
            elif fetch_all:
                result = cursor.fetchall()
            else:
                result = cursor.rowcount
            
            connection.commit()
            return result
    except Exception as e:
        connection.rollback()
        raise e
    finally:
        connection.close()
