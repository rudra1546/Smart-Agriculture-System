import mysql.connector
from mysql.connector import Error

# Database configuration
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': 'MySql@1546',
    'database': 'crop_yield'
}

def get_db_connection():
    """Create and return a database connection"""
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        if connection.is_connected():
            return connection
    except Error as e:
        print(f"Error connecting to MySQL database: {e}")
        return None

def init_auth_db():
    """Initialize the authentication database and create users table"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            print("Failed to connect to database")
            return False
        
        cursor = connection.cursor()
        
        # Create users table with single-user constraint
        create_table_query = """
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """
        
        cursor.execute(create_table_query)
        connection.commit()
        
        print("[SUCCESS] Auth database initialized successfully")
        
        # Also initialize predictions table
        cursor.close()
        connection.close()
        init_predictions_table()
        
        return True
        
    except Error as e:
        print(f"[ERROR] Error initializing auth database: {e}")
        return False
        
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

def create_user(name, email, password):
    """
    Create a new user in the database
    Returns user_id on success, None on failure
    """
    connection = None
    cursor = None
    
    try:
        
        connection = get_db_connection()
        if not connection:
            raise Exception("Failed to connect to database")
        
        cursor = connection.cursor()
        
        # Insert new user
        insert_query = """
        INSERT INTO users (name, email, password)
        VALUES (%s, %s, %s)
        """
        
        cursor.execute(insert_query, (name, email.lower(), password))
        connection.commit()
        
        user_id = cursor.lastrowid
        print(f"[SUCCESS] User created successfully with ID: {user_id}")
        return user_id
        
    except mysql.connector.IntegrityError as e:
        if 'Duplicate entry' in str(e):
            raise ValueError("Email already exists")
        raise ValueError(str(e))
        
    except Error as e:
        print(f"Error creating user: {e}")
        raise Exception(f"Database error: {str(e)}")
        
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

def get_user_by_email(email):
    """
    Get user by email
    Returns user dict or None if not found
    """
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return None
        
        cursor = connection.cursor(dictionary=True)
        
        query = "SELECT * FROM users WHERE email = %s"
        cursor.execute(query, (email.lower(),))
        
        user = cursor.fetchone()
        return user
        
    except Error as e:
        print(f"Error getting user by email: {e}")
        return None
        
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

def verify_password(plain_password, stored_password):
    """
    Verify password (plain text comparison for demo)
    In production, use proper password hashing
    """
    return plain_password == stored_password

def init_predictions_table():
    """Initialize the predictions table"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            print("Failed to connect to database")
            return False
        
        cursor = connection.cursor()
        
        # Create predictions table
        create_table_query = """
        CREATE TABLE IF NOT EXISTS predictions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_email VARCHAR(255) NOT NULL,
            crop VARCHAR(100) NOT NULL,
            soil_type VARCHAR(100),
            season VARCHAR(50),
            area DECIMAL(10,2),
            N DECIMAL(10,2),
            P DECIMAL(10,2),
            K DECIMAL(10,2),
            ph DECIMAL(4,2),
            state VARCHAR(100),
            predicted_yield DECIMAL(10,2),
            total_yield DECIMAL(10,2),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE,
            INDEX idx_user_email (user_email)
        )
        """
        
        cursor.execute(create_table_query)
        connection.commit()
        
        print("[SUCCESS] Predictions table initialized successfully")
        return True
        
    except Error as e:
        print(f"[ERROR] Error initializing predictions table: {e}")
        return False
        
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

def save_prediction(user_email, prediction_data):
    """
    Save a prediction to the database
    
    Args:
        user_email: User's email address
        prediction_data: Dict containing prediction details
    
    Returns:
        prediction_id on success, None on failure
    """
    connection = None
    cursor = None
    
    try:
        # Verify user exists
        user = get_user_by_email(user_email)
        if not user:
            raise ValueError(f"User with email {user_email} does not exist")
        
        connection = get_db_connection()
        if not connection:
            raise Exception("Failed to connect to database")
        
        cursor = connection.cursor()
        
        # Insert prediction
        insert_query = """
        INSERT INTO predictions (
            user_email, crop, soil_type, season, area,
            N, P, K, ph, state, predicted_yield, total_yield
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        
        values = (
            user_email,
            prediction_data.get('crop'),
            prediction_data.get('soil_type'),
            prediction_data.get('season'),
            prediction_data.get('area'),
            prediction_data.get('N'),
            prediction_data.get('P'),
            prediction_data.get('K'),
            prediction_data.get('ph'),
            prediction_data.get('state'),
            prediction_data.get('predicted_yield'),
            prediction_data.get('total_yield')
        )
        
        cursor.execute(insert_query, values)
        connection.commit()
        
        prediction_id = cursor.lastrowid
        print(f"[SUCCESS] Prediction saved with ID: {prediction_id}")
        return prediction_id
        
    except Error as e:
        print(f"Error saving prediction: {e}")
        raise Exception(f"Database error: {str(e)}")
        
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

def get_user_predictions(user_email, limit=10, offset=0):
    """
    Get predictions for a specific user
    
    Args:
        user_email: User's email address
        limit: Maximum number of predictions to return
        offset: Number of predictions to skip
    
    Returns:
        List of prediction dicts
    """
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return []
        
        cursor = connection.cursor(dictionary=True)
        
        query = """
        SELECT * FROM predictions 
        WHERE user_email = %s 
        ORDER BY created_at DESC 
        LIMIT %s OFFSET %s
        """
        
        cursor.execute(query, (user_email, limit, offset))
        predictions = cursor.fetchall()
        
        return predictions
        
    except Error as e:
        print(f"Error getting user predictions: {e}")
        return []
        
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

def get_prediction_count(user_email):
    """
    Get the total count of predictions for a user
    
    Args:
        user_email: User's email address
    
    Returns:
        Count of predictions
    """
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return 0
        
        cursor = connection.cursor()
        
        query = "SELECT COUNT(*) FROM predictions WHERE user_email = %s"
        cursor.execute(query, (user_email,))
        
        result = cursor.fetchone()
        return result[0] if result else 0
        
    except Error as e:
        print(f"Error getting prediction count: {e}")
        return 0
        
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

