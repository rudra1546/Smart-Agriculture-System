from flask import Blueprint, request, jsonify
import sys
import os

# Add parent directory to path to import auth_db
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from auth_db import create_user, get_user_by_email, verify_password, init_auth_db
import re

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

def is_valid_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

@auth_bp.route('/signup', methods=['POST'])
def signup():
    """
    User registration endpoint
    - Only allows ONE user in the database
    - Returns error if user already exists
    
    Expected JSON body:
    {
        "name": "Full Name",
        "email": "user@example.com",
        "password": "securepassword"
    }
    """
    try:
        data = request.get_json()
        
        # Validate required fields
        name = data.get('name', '').strip()
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        
        # Validation
        if not name:
            return jsonify({"error": "Name is required"}), 400
        
        if not email:
            return jsonify({"error": "Email is required"}), 400
        
        if not is_valid_email(email):
            return jsonify({"error": "Invalid email format"}), 400
        
        if not password:
            return jsonify({"error": "Password is required"}), 400
        
        if len(password) < 6:
            return jsonify({"error": "Password must be at least 6 characters"}), 400
        
        # Create user
        try:
            user_id = create_user(name, email, password)
            
            # Fetch the complete user data including created_at
            user = get_user_by_email(email)
            
            return jsonify({
                "message": "User created successfully",
                "user": {
                    "id": user['id'],
                    "name": user['name'],
                    "email": user['email'],
                    "created_at": user['created_at'].isoformat() if user.get('created_at') else None
                }
            }), 201
            
        except ValueError as e:
            # Duplicate email
            return jsonify({"error": str(e)}), 409  # Conflict
        
    except Exception as e:
        print(f"Signup error: {e}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """
    User login endpoint
    - Validates credentials against database
    - No JWT tokens
    
    Expected JSON body:
    {
        "email": "user@example.com",
        "password": "securepassword"
    }
    """
    try:
        data = request.get_json()
        
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        
        # Validation
        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400
        
        # Get user by email
        user = get_user_by_email(email)
        
        if not user:
            return jsonify({"error": "Invalid email or password"}), 401
        
        # Verify password
        if not verify_password(password, user['password']):
            return jsonify({"error": "Invalid email or password"}), 401
        
        # Return success with user data (no token)
        return jsonify({
            "message": "Login successful",
            "user": {
                "id": user['id'],
                "name": user['name'],
                "email": user['email'],
                "created_at": user['created_at'].isoformat() if user.get('created_at') else None
            }
        }), 200
        
    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500

# Initialize database on module load
try:
    init_auth_db()
except Exception as e:
    print(f"Failed to initialize auth database: {e}")
