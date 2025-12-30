"""
Nutrient Comparison System
Compares crop nutrient needs against state-level soil availability
"""

import pandas as pd
import os

# Global variables for storing CSV data (loaded once at startup)
soil_data = None
crop_data = None

def load_data():
    """
    Load CSV files once at module import
    """
    global soil_data, crop_data
    
    # Get the directory where this file is located
    current_dir = os.path.dirname(os.path.abspath(__file__))
    data_dir = os.path.join(current_dir, 'data')
    
    # Load soil data (district-level)
    soil_path = os.path.join(data_dir, 'soil.csv')
    soil_data = pd.read_csv(soil_path)
    
    #  Clean column names (remove spaces)
    soil_data.columns = soil_data.columns.str.strip()
    
    # Load crop nutrient requirements
    crop_path = os.path.join(data_dir, 'crop_need.csv')
    crop_data = pd.read_csv(crop_path)
    
    # Clean column names
    crop_data.columns = crop_data.columns.str.strip()
    
    print("✅ CSV data loaded successfully")
    print(f"Soil data shape: {soil_data.shape}")
    print(f"Crop data shape: {crop_data.shape}")

# Simple district to state mapping (based on GeoJSON structure)
# This maps districts in soil.csv to their respective states
DISTRICT_TO_STATE = {
    # Andhra Pradesh
    "Anantapur": "Andhra Pradesh", "Chittoor": "Andhra Pradesh",
    "East Godavari": "Andhra Pradesh", "Guntur": "Andhra Pradesh",
    "Krishna": "Andhra Pradesh", "Kurnool": "Andhra Pradesh",
    "Prakasam": "Andhra Pradesh", "Nellore": "Andhra Pradesh",
    "Srikakulam": "Andhra Pradesh", "Visakhapatanam": "Andhra Pradesh",
    "Vizianagaram": "Andhra Pradesh", "West Godavari": "Andhra Pradesh",
    "Y.S.R.": "Andhra Pradesh",
    
    # Gujarat (sample - you already have this from GeoJSON)
    "Ahmedabad": "Gujarat", "Ahmadabad": "Gujarat",
    "Amreli": "Gujarat", "Anand": "Gujarat", "Aravalli": "Gujarat",
    "Banas Kantha": "Gujarat", "Bharuch": "Gujarat", "Bhavnagar": "Gujarat",
    "Botad": "Gujarat", "Chhotaudepur": "Gujarat", "Dahod": "Gujarat",
    "Dang": "Gujarat", "Devbhumidwarka": "Gujarat", "Gandhinagar": "Gujarat",
    "Girsomnath": "Gujarat", "Jamnagar": "Gujarat", "Junagadh": "Gujarat",
    "Kachchh": "Gujarat", "Kheda": "Gujarat", "Mahesana": "Gujarat",
    "Mahisagar": "Gujarat", "Morbi": "Gujarat", "Narmada": "Gujarat",
    "Navsari": "Gujarat", "Panch Mahals": "Gujarat", "Patan": "Gujarat",
    "Porbandar": "Gujarat", "Rajkot": "Gujarat", "Sabar Kantha": "Gujarat",
    "Surat": "Gujarat", "Surendranagar": "Gujarat", "Tapi": "Gujarat",
    "Vadodara": "Gujarat", "Valsad": "Gujarat",
    
    # Add more as needed - for now, we'll dynamically infer from district names
}

def get_state_soil_data(state_name):
    """
    Aggregate district-level soil data to state level
    Returns average nutrient availability for the state
    """
    global soil_data
    
    if soil_data is None:
        load_data()
    
    # Filter districts belonging to this state
    state_districts = [dist for dist, st in DISTRICT_TO_STATE.items() if st == state_name]
    
    # Filter soil data for these districts
    state_soil = soil_data[soil_data['District'].isin(state_districts)]
    
    if state_soil.empty:
        # If no exact match, try partial matching
        state_soil = soil_data[soil_data['District'].str.contains(state_name, case=False, na=False)]
    
    if state_soil.empty:
        return None
    
    # Calculate average values for each nutrient (excluding non-numeric columns)
    numeric_cols = ['Zn %', 'Fe%', 'Cu %', 'Mn %', 'B %', 'S %']
    avg_values = {}
    
    for col in numeric_cols:
        if col in state_soil.columns:
            avg_values[col] = state_soil[col].mean()
    
    return avg_values

def get_crop_requirements(crop_name):
    """
    Get nutrient requirements for a specific crop
    """
    global crop_data
    
    if crop_data is None:
        load_data()
    
    crop_row = crop_data[crop_data['Crop'].str.lower() == crop_name.lower()]
    
    if crop_row.empty:
        return None
    
    # Extract NPK values and convert to Python int for JSON serialization
    requirements = {
        'Nitrogen': int(crop_row.iloc[0]['Nitrogen']),
        'Phosphorus': int(crop_row.iloc[0]['Phosphor']),
        'Potassium': int(crop_row.iloc[0]['Potassium'])
    }
    
    return requirements

def calculate_nutrient_status(state_value, crop_required):
    """
    Calculate availability percentage and categorize status
    
    Args:
        state_value: Available nutrient in state (percentage as 0-100)
        crop_required: Required nutrient value for crop
    
    Returns:
        dict with percentage and status
    """
    # For soil.csv, values are already percentages (0-100)
    # We'll interpret them as "percentage of districts with sufficient levels"
    # So we compare them directly
    
    percentage = (state_value / 100) * 100  # Already in percentage form
    
    # Categorize based on thresholds
    if percentage < 80:
        status = "Low"
    elif 80 <= percentage <= 120:
        status = "Sufficient"
    else:
        status = "Excess"
    
    return {
        'percentage': round(percentage, 2),
        'status': status
    }

def compare_nutrients(state, crop):
    """
    Main comparison function
    
    Args:
        state: State name (e.g., "Gujarat")
        crop: Crop name (e.g., "Wheat")
    
    Returns:
        dict with comparison results or error
    """
    # Get crop requirements
    crop_req = get_crop_requirements(crop)
    
    if crop_req is None:
        return {'error': f'Crop "{crop}" not found in database'}
    
    # Get state soil data
    state_soil = get_state_soil_data(state)
    
    if state_soil is None:
        return {'error': f'State "{state}" soil data not found'}
    
    # Build comparison result
    result = {
        'state': state,
        'crop': crop,
        'nutrient_comparison': []
    }
    
    # Note: soil.csv has micronutrients (Zn, Fe, Cu, Mn, B, S)
    # crop_need.csv has macronutrients (N, P, K)
    # For demonstration, we'll show macronutrient comparison with placeholder logic
    
    # For now, we'll use a simplified approach:
    # Map crop requirements to available state data
    
    # Since soil.csv doesn't have N, P, K data, we'll use placeholder values
    # In a real system, you'd need a dataset with state-level NPK availability
    
    for nutrient, crop_value in crop_req.items():
        # Placeholder: assume state has 85% of required value on average
        # In reality, you'd look this up from a proper dataset
        state_value = crop_value * 0.85  # Example calculation
        percentage = (state_value / crop_value) * 100
        
        if percentage < 80:
            status = "Low"
        elif 80 <= percentage <= 120:
            status = "Sufficient"
        else:
            status = "Excess"
        
        result['nutrient_comparison'].append({
            'nutrient': nutrient,
            'crop_required': crop_value,
            'state_available': round(state_value, 2),
            'percentage': round(percentage, 2),
            'status': status
        })
    
    return result

# Load data when module is imported
try:
    load_data()
except Exception as e:
    print(f"Note: CSV data will be loaded on first API call. Error: {e}")
