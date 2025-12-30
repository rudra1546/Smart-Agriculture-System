from flask import Blueprint, request, jsonify
import sys
import os

# Add parent directory to path to import auth_db
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from auth_db import get_user_predictions, get_prediction_count

predictions_bp = Blueprint('predictions', __name__, url_prefix='/api/predictions')

@predictions_bp.route('/history', methods=['GET'])
def get_prediction_history():
    """
    Get prediction history for a user
    
    Query params:
        email: User's email address (required)
        limit: Number of predictions to return (default: 10)
        offset: Number of predictions to skip (default: 0)
    
    Returns:
        List of predictions with details
    """
    try:
        email = request.args.get('email')
        limit = int(request.args.get('limit', 10))
        offset = int(request.args.get('offset', 0))
        
        if not email:
            return jsonify({"error": "Email parameter is required"}), 400
        
        # Get predictions
        predictions = get_user_predictions(email, limit, offset)
        
        # Convert Decimal to float for JSON serialization
        for pred in predictions:
            for key, value in pred.items():
                if hasattr(value, 'is_integer'):  # Check if Decimal
                    pred[key] = float(value) if value is not None else None
        
        return jsonify({
            "email": email,
            "predictions": predictions,
            "count": len(predictions)
        }), 200
        
    except ValueError as e:
        return jsonify({"error": f"Invalid parameter: {str(e)}"}), 400
    except Exception as e:
        print(f"Error getting prediction history: {e}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@predictions_bp.route('/count', methods=['GET'])
def get_user_prediction_count():
    """
    Get total prediction count for a user
    
    Query params:
        email: User's email address (required)
    
    Returns:
        Total count of predictions
    """
    try:
        email = request.args.get('email')
        
        if not email:
            return jsonify({"error": "Email parameter is required"}), 400
        
        # Get count
        count = get_prediction_count(email)
        
        return jsonify({
            "email": email,
            "count": count
        }), 200
        
    except Exception as e:
        print(f"Error getting prediction count: {e}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500
