import random

def get_mock_weather(lat, lon):
    """
    Returns mock weather data based on location.
    In a real app, this would call OpenWeatherMap.
    """
    return {
        "rainfall": round(random.uniform(50.0, 300.0), 2),  # mm
        "temperature": round(random.uniform(20.0, 35.0), 2), # Celsius
        "humidity": round(random.uniform(40.0, 90.0), 2)     # %
    }

def get_soil_nutrients(crop, region, soil_type=None):
    """
    Returns preset N, P, K, pH values based on crop and soil type.
    This acts as 'Mode 1: Predefined'.
    """
    # Comprehensive soil database with pH values for different soil types
    # pH values vary based on soil type and optimal ranges for each crop
    soil_ph_db = {
        "Wheat": {
            "Clayey": {"N": 120, "P": 60, "K": 40, "pH": 6.5},
            "Sandy": {"N": 130, "P": 65, "K": 45, "pH": 6.8},
            "Loamy": {"N": 115, "P": 55, "K": 38, "pH": 6.5},
            "Black": {"N": 125, "P": 62, "K": 42, "pH": 7.0},
            "Red": {"N": 135, "P": 68, "K": 48, "pH": 6.2},
            "Alluvial": {"N": 120, "P": 60, "K": 40, "pH": 6.8}
        },
        "Rice": {
            "Clayey": {"N": 100, "P": 50, "K": 50, "pH": 5.5},
            "Sandy": {"N": 110, "P": 55, "K": 55, "pH": 6.0},
            "Loamy": {"N": 95, "P": 48, "K": 48, "pH": 6.0},
            "Black": {"N": 105, "P": 52, "K": 52, "pH": 6.5},
            "Red": {"N": 115, "P": 58, "K": 58, "pH": 5.8},
            "Alluvial": {"N": 100, "P": 50, "K": 50, "pH": 6.2}
        },
        "Maize": {
            "Clayey": {"N": 140, "P": 60, "K": 60, "pH": 6.5},
            "Sandy": {"N": 150, "P": 65, "K": 65, "pH": 6.8},
            "Loamy": {"N": 135, "P": 58, "K": 58, "pH": 6.5},
            "Black": {"N": 145, "P": 62, "K": 62, "pH": 7.0},
            "Red": {"N": 155, "P": 68, "K": 68, "pH": 6.2},
            "Alluvial": {"N": 140, "P": 60, "K": 60, "pH": 6.8}
        },
        "Sugarcane": {
            "Clayey": {"N": 200, "P": 80, "K": 80, "pH": 6.5},
            "Sandy": {"N": 220, "P": 85, "K": 85, "pH": 7.0},
            "Loamy": {"N": 190, "P": 75, "K": 75, "pH": 6.8},
            "Black": {"N": 210, "P": 82, "K": 82, "pH": 7.5},
            "Red": {"N": 230, "P": 88, "K": 88, "pH": 6.5},
            "Alluvial": {"N": 200, "P": 80, "K": 80, "pH": 7.2}
        },
        "Cotton": {
            "Clayey": {"N": 120, "P": 60, "K": 60, "pH": 6.5},
            "Sandy": {"N": 130, "P": 65, "K": 65, "pH": 7.0},
            "Loamy": {"N": 115, "P": 58, "K": 58, "pH": 6.8},
            "Black": {"N": 125, "P": 62, "K": 62, "pH": 7.5},
            "Red": {"N": 135, "P": 68, "K": 68, "pH": 6.5},
            "Alluvial": {"N": 120, "P": 60, "K": 60, "pH": 7.0}
        }
    }
    
    # Default fallback
    default = {"N": 100, "P": 50, "K": 50, "pH": 6.5}
    
    # Get crop data
    crop_data = soil_ph_db.get(crop)
    if not crop_data:
        return default
    
    # If soil_type is provided, get specific values
    if soil_type and soil_type in crop_data:
        return crop_data[soil_type]
    
    # If no soil type or invalid soil type, return first available (Clayey as default)
    return crop_data.get("Clayey", default)
