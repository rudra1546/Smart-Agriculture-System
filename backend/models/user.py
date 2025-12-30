import bcrypt
from db import execute_query

class User:
    """User model for authentication"""
    
    @staticmethod
    def create_user(name, email, password):
        """
        Create a new user with hashed password
        
        Args:
            name: User's full name
            email: User's email (must be unique)
            password: Plain text password (will be hashed)
        
        Returns:
            User ID of created user
        
        Raises:
            Exception if email already exists
        """
        # Hash the password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        
        # Insert user into database
        query = """
        INSERT INTO users (name, email, password)
        VALUES (%s, %s, %s)
        """
        try:
            execute_query(query, (name, email, hashed_password.decode('utf-8')))
            
            # Get the created user
            user = User.get_user_by_email(email)
            return user['id']
        except Exception as e:
            if 'Duplicate entry' in str(e):
                raise ValueError("Email already exists")
            raise e
    
    @staticmethod
    def get_user_by_email(email):
        """
        Get user by email address
        
        Args:
            email: User's email
        
        Returns:
            User dict or None
        """
        query = "SELECT id, name, email, password, created_at FROM users WHERE email = %s"
        user = execute_query(query, (email,), fetch_one=True)
        return user
    
    @staticmethod
    def get_user_by_id(user_id):
        """
        Get user by ID
        
        Args:
            user_id: User's ID
        
        Returns:
            User dict or None
        """
        query = "SELECT id, name, email, created_at FROM users WHERE id = %s"
        user = execute_query(query, (user_id,), fetch_one=True)
        return user
    
    @staticmethod
    def verify_password(plain_password, hashed_password):
        """
        Verify if plain password matches hashed password
        
        Args:
            plain_password: Plain text password
            hashed_password: Bcrypt hashed password
        
        Returns:
            True if password matches, False otherwise
        """
        return bcrypt.checkpw(
            plain_password.encode('utf-8'),
            hashed_password.encode('utf-8')
        )
