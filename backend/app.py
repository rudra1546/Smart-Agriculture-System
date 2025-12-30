from flask import Flask, jsonify, request
from flask_cors import CORS
from utils.mock_data import get_mock_weather, get_soil_nutrients
from models.yield_model import predict_yield_val
from config import Config
from db import init_db
from routes.auth import auth_bp
from routes.predictions import predictions_bp
from auth_db import save_prediction
from nutrient_comparison import compare_nutrients
import os

import geopandas as gpd
from shapely.geometry import Point

# Load Gujarat districts GeoJSON once
districts_gdf = gpd.read_file("india_district.geojson")

def get_district_from_gps(lat, lon):
    """
    Get district and state name from GPS coordinates using GeoJSON
    
    GeoJSON columns:
    - NAME_0: Country (India)
    - NAME_1: State name
    - NAME_2: District name
    """
    point = Point(lon, lat)  # IMPORTANT: (lon, lat)

    for _, row in districts_gdf.iterrows():
        if row.geometry.contains(point):
            return {
                'district': row["NAME_2"],  # District name column in GeoJSON
                'state': row["NAME_1"]       # State name column in GeoJSON
            }

    return {'district': 'Unknown', 'state': 'Unknown'}


# Initialize Flask App
app = Flask(__name__)
CORS(app)

# Initialize Database
try:
    init_db()
except Exception as e:
    print(f"Warning: Database initialization failed: {e}")

# Register Blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(predictions_bp)


# --- Routes ---

@app.route('/api/weather', methods=['GET'])
def weather_route():
    lat = request.args.get('lat', type=float)
    lon = request.args.get('lon', type=float)
    if lat is None or lon is None:
        return jsonify({"error": "Missing lat/lon"}), 400
    
    data = get_mock_weather(lat, lon)
    return jsonify(data)

@app.route('/api/soil_nutrients', methods=['GET'])
def soil_route():
    """
    Mode 1: Predefined (Dataset-based)
    """
    crop = request.args.get('crop')
    region = request.args.get('region', 'Default') # Optional region
    soil_type = request.args.get('soil_type') # Soil type parameter
    
    if not crop:
        return jsonify({"error": "Missing crop type"}), 400
        
    data = get_soil_nutrients(crop, region, soil_type)
    return jsonify(data)

@app.route('/api/predict_yield', methods=['POST'])
def predict_yield_route():
    try:
        data = request.json
        # Expected: { N, P, K, pH, rainfall, temperature, humidity, area, crop, season, user_email }
        
        # Extract features for model
        # Model expects: [N, P, K, temp, humidity, ph, rainfall, area]
        
        # Check if manual or auto values are provided. 
        # For simplicity, we assume the frontend sends the final values to be used.
        
        features = [
            float(data.get('N', 0)),
            float(data.get('P', 0)),
            float(data.get('K', 0)),
            float(data.get('temperature', 25)),
            float(data.get('humidity', 50)),
            float(data.get('ph', 6.5)),
            float(data.get('rainfall', 100)),
            float(data.get('area', 1))
        ]
        
        predicted_yield = predict_yield_val(features)
        
        # Calculate total yield
        total_yield = predicted_yield # predict_yield_val already scales? No, model trained on Area. 
        # Wait, my dummy model included 'area' as a feature, so the output is Total Yield for that area.
        
        # Save prediction to database if user_email is provided
        user_email = data.get('user_email')
        if user_email:
            try:
                prediction_data = {
                    'crop': data.get('crop'),
                    'soil_type': data.get('soil_type'),
                    'season': data.get('season'),
                    'area': features[7],
                    'N': features[0],
                    'P': features[1],
                    'K': features[2],
                    'ph': features[5],
                    'state': data.get('state'),
                    'predicted_yield': total_yield / features[7] if features[7] > 0 else 0,
                    'total_yield': total_yield
                }
                save_prediction(user_email, prediction_data)
            except Exception as save_error:
                print(f"Warning: Failed to save prediction: {save_error}")
                # Continue even if save fails
        
        return jsonify({
            "predicted_yield_per_ha": total_yield / features[7] if features[7] > 0 else 0,
            "total_yield": total_yield
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/analyze_health', methods=['POST'])
def analyze_health_route():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400
    
    file = request.files['image']
    # Placeholder for actual analysis
    # In a real app, save file, run model.predict(image)
    
    # Mock Response
    import random
    status = random.choice(["Healthy", "Infected", "Infected"])
    
    result = {
        "status": status,
        "disease": "Leaf Blight" if status == "Infected" else None,
        "confidence": round(random.uniform(0.85, 0.99), 2),
        "recommendations": []
    }
    
    if status == "Infected":
        result["recommendations"] = [
            "Apply Neem Oil spray every 5 days.",
            "Use Trichoderma viride for soil treatment."
        ]
    else:
        result["recommendations"] = [
             "Continue standard organic maintenance."
        ]
        
    return jsonify(result)

@app.route('/api/location', methods=['POST'])
def gps_location_route():
    """
    Receives GPS coordinates and returns the detected state name
    """
    data = request.json
    lat = data.get("lat")
    lon = data.get("lon")

    if lat is None or lon is None:
        return jsonify({"error": "Missing GPS coordinates"}), 400

    # Get district and state from GPS coordinates
    location_data = get_district_from_gps(lat, lon)
    district = location_data['district']
    state = location_data['state']
    
    print(f"📍 GPS: ({lat}, {lon}) → District: {district} → State: {state}")

    return jsonify({
        "lat": lat,
        "lon": lon,
        "district": district,
        "state": state
    })

@app.route('/api/nutrient-comparison', methods=['POST'])
def nutrient_comparison_route():
    """
    Compare crop nutrient requirements with state soil availability
    
    Request body:
    {
        "state": "Gujarat",
        "crop": "Wheat"
    }
    
    Response:
    {
        "state": "Gujarat",
        "crop": "Wheat",
        "nutrient_comparison": [
            {
                "nutrient": "Nitrogen",
                "crop_required": 120,
                "state_available": 90,
                "percentage": 75,
                "status": "Low"
            },
            ...
        ]
    }
    """
    try:
        data = request.json
        
        if not data:
            return jsonify({"error": "Request body is required"}), 400
        
        state = data.get("state")
        crop = data.get("crop")
        
        if not state or not crop:
            return jsonify({"error": "Both 'state' and 'crop' are required"}), 400
        
        # Call comparison function
        result = compare_nutrients(state, crop)
        
        # Check if there was an error
        if 'error' in result:
            return jsonify(result), 404
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
