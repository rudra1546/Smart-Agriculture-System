import React, { useState } from 'react';
import MapComponent from '../components/MapComponent';
import InputForm from '../components/InputForm';
import './Predict.css';

function Predict() {
    const [area, setArea] = useState(0);
    const [location, setLocation] = useState({ lat: null, lon: null });
    const [yieldResult, setYieldResult] = useState(null);

    return (
        <div className="predict-container">
            <div className="predict-content">
                <header className="predict-header">
                    <h1 className="predict-title">
                        <span className="title-icon">🌱</span>
                        Crop Yield Prediction
                    </h1>
                    <p className="predict-subtitle">AI-Powered Analysis & Recommendations</p>
                </header>

                {/* Main Grid: Map & Inputs */}
                <div className="predict-grid">
                    {/* Left Column: Map */}
                    <div className="predict-left">
                        <MapComponent
                            onAreaCalculated={setArea}
                            onLocationFound={(lat, lon) => setLocation({ lat, lon })}
                        />

                        {yieldResult && (
                            <div className="results-card">
                                <h3 className="results-title">🎉 Prediction Results</h3>
                                <div className="result-row">
                                    <span>Yield / Hectare:</span>
                                    <strong>{yieldResult.per_ha.toFixed(2)} tons</strong>
                                </div>
                                <div className="result-row total">
                                    <span>Total Yield:</span>
                                    <strong>{yieldResult.yield.toFixed(2)} tons</strong>
                                </div>
                                <hr className="result-divider" />
                                <p className="result-info">
                                    Based on {area.toFixed(2)} ha field, {yieldResult.weather.rainfall}mm rainfall.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Input Form */}
                    <div className="predict-right">
                        <InputForm
                            area={area}
                            location={location}
                            onYieldResult={setYieldResult}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Predict;
