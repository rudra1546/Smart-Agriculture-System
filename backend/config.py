import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    """Application configuration from environment variables"""
    
    # MySQL Database Configuration
    MYSQL_HOST = os.getenv('MYSQL_HOST', 'localhost')
    MYSQL_PORT = int(os.getenv('MYSQL_PORT', 3306))
    MYSQL_USER = os.getenv('MYSQL_USER', 'root')
    MYSQL_PASSWORD = os.getenv('MYSQL_PASSWORD', '')
    MYSQL_DATABASE = os.getenv('MYSQL_DATABASE', 'smart_agriculture')
    
    # JWT Configuration
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'default-secret-key-change-in-production')
    JWT_ACCESS_TOKEN_EXPIRES = 86400  # 24 hours in seconds
