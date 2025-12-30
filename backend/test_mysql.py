"""
Simple MySQL connection test
"""
import mysql.connector
from mysql.connector import Error

# Database configuration
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': 'MySql@1546',
}

def test_connection():
    """Test MySQL connection"""
    print("Testing MySQL connection...")
    print("Host:", DB_CONFIG['host'])
    print("User:", DB_CONFIG['user'])
    print("-" * 50)
    
    try:
        # Test basic connection
        connection = mysql.connector.connect(**DB_CONFIG)
        
        if connection.is_connected():
            print("SUCCESS: Connected to MySQL Server")
            
            cursor = connection.cursor()
            
            # Check if crop_yield database exists
            cursor.execute("SHOW DATABASES LIKE 'crop_yield';")
            db_exists = cursor.fetchone()
            
            if db_exists:
                print("SUCCESS: Database 'crop_yield' exists")
            else:
                print("WARNING: Database 'crop_yield' does NOT exist")
                print("Creating database 'crop_yield'...")
                cursor.execute("CREATE DATABASE crop_yield;")
                print("SUCCESS: Database created")
            
            cursor.close()
            connection.close()
            print("\nConnection test PASSED!")
            return True
            
    except Error as e:
        print("\nERROR connecting to MySQL:", str(e))
        print("\nTroubleshooting:")
        print("1. Is MySQL server running?")
        print("   - Check Services for 'MySQL' service")
        print("2. Are credentials correct?")
        print("   - User:", DB_CONFIG['user'])
        print("   - Password: [check if correct]")
        print("3. Try: mysql -u root -p")
        return False

if __name__ == "__main__":
    test_connection()
