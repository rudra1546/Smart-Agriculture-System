import pandas as pd
import numpy as np
import os
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
import pickle

MODEL_PATH = "backend/models/yield_model.pkl"

def train_dummy_model():
    """
    Trains a simple dummy model if one doesn't exist.
    """
    # Dummy dataset
    data = {
        'N': np.random.randint(50, 200, 1000),
        'P': np.random.randint(20, 100, 1000),
        'K': np.random.randint(20, 100, 1000),
        'temperature': np.random.uniform(20, 35, 1000),
        'humidity': np.random.uniform(50, 90, 1000),
        'ph': np.random.uniform(5.5, 8.0, 1000),
        'rainfall': np.random.uniform(50, 300, 1000),
        'area': np.random.uniform(1, 10, 1000) # Hectares
    }
    df = pd.DataFrame(data)
    # Simple formula for "real" yield to learn: Yield = N*0.5 + P*0.3 + K*0.2 + Rain*0.1 + Area*5
    df['yield'] = (df['N']*0.5 + df['P']*0.3 + df['K']*0.2 + 
                   df['rainfall']*0.1 + df['temperature']*0.5 + 
                   df['area']*5 + np.random.normal(0, 5, 1000))

    X = df.drop('yield', axis=1)
    y = df['yield']

    model = RandomForestRegressor(n_estimators=50, random_state=42)
    model.fit(X, y)

    # Ensure directory exists
    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    with open(MODEL_PATH, 'wb') as f:
        pickle.dump(model, f)
    print("Dummy yield model trained and saved.")

def load_yield_model():
    if not os.path.exists(MODEL_PATH):
        train_dummy_model()
    
    with open(MODEL_PATH, 'rb') as f:
        model = pickle.load(f)
    return model

def predict_yield_val(features):
    """
    features: [N, P, K, temp, humidity, ph, rainfall, area]
    """
    model = load_yield_model()
    # features needs to be 2D array
    prediction = model.predict([features])
    return prediction[0]
