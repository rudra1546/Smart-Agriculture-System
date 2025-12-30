import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

const InputForm = ({ area, location, onYieldResult, onHealthResult }) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        crop: 'Wheat',
        season: 'Rabi',
        soil_type: 'Clayey',
        inputMode: 'Mode 1', // Mode 1: Auto, Mode 2: Manual
        N: '', P: '', K: '', ph: '6.5',
        state: '', // User's state
    });

    const [loading, setLoading] = useState(false);
    const [locationLoading, setLocationLoading] = useState(false);
    const [locationError, setLocationError] = useState('');
    const [stateSource, setStateSource] = useState(''); // 'gps' or 'manual'

    // Indian states list for manual selection
    const indianStates = [
        'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
        'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
        'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
        'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
        'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle location icon click - request GPS permission
    const handleLocationClick = () => {
        setLocationLoading(true);
        setLocationError('');

        if (!navigator.geolocation) {
            setLocationError('Geolocation is not supported by your browser');
            setLocationLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                fetchStateFromLocation(lat, lon);
            },
            (error) => {
                setLocationLoading(false);
                if (error.code === error.PERMISSION_DENIED) {
                    setLocationError('Location permission denied. Please select state manually.');
                } else if (error.code === error.POSITION_UNAVAILABLE) {
                    setLocationError('Location unavailable. Please select state manually.');
                } else {
                    setLocationError('Unable to retrieve location. Please select state manually.');
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    };

    // Send coordinates to backend and get state
    const fetchStateFromLocation = async (lat, lon) => {
        try {
            const res = await api.post('/location', { lat, lon });

            if (res.data.state && res.data.state !== 'Unknown') {
                setFormData(prev => ({ ...prev, state: res.data.state }));
                setStateSource('gps');
                setLocationError('');
            } else {
                setLocationError('Could not detect state from your location. Please select manually.');
            }
        } catch (error) {
            console.error('Error fetching state:', error);
            setLocationError('Failed to detect state. Please select manually.');
        } finally {
            setLocationLoading(false);
        }
    };

    // Handle manual state selection
    const handleStateChange = (e) => {
        setFormData({ ...formData, state: e.target.value });
        setStateSource('manual');
        setLocationError('');
    };

    // Automatically fetch nutrients when crop or soil type changes in Mode 1
    useEffect(() => {
        if (formData.inputMode === 'Mode 1' && formData.crop && formData.soil_type) {
            fetchNutrients();
        }
    }, [formData.crop, formData.soil_type, formData.inputMode]);

    const fetchNutrients = async () => {
        try {
            setLoading(true);
            const res = await api.get('/soil_nutrients', {
                params: {
                    crop: formData.crop,
                    region: 'Default',
                    soil_type: formData.soil_type
                }
            });
            setFormData(prev => ({
                ...prev,
                N: res.data.N,
                P: res.data.P,
                K: res.data.K,
                ph: res.data.pH
            }));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleYieldPredict = async () => {
        if (!area || area <= 0) {
            alert("Please calculate field area first!");
            return;
        }

        // Auto-fetch weather (mock) on backend requires lat/lon, but here we pass lat/lon 
        // to backend? OR backend fetches it.
        // Let's pass what we have.

        try {
            setLoading(true);

            // Get Weather first (Frontend orchestration or Backend? Let's do backend but we need to pass params)
            // Wait, backend predict_yield doesn't fetch weather? 
            // My backend implementation assumes specific inputs.
            // Let's fetch weather here to display it, then pass to predict.

            const weatherRes = await api.get('/weather', {
                params: { lat: location.lat, lon: location.lon }
            });

            const payload = {
                ...formData,
                area: area,
                rainfall: weatherRes.data.rainfall,
                temperature: weatherRes.data.temperature,
                humidity: weatherRes.data.humidity,
                user_email: user?.email  // Include user email if logged in
            };

            const yieldRes = await api.post('/predict_yield', payload);
            if (onYieldResult) onYieldResult({
                yield: yieldRes.data.total_yield,
                per_ha: yieldRes.data.predicted_yield_per_ha,
                weather: weatherRes.data
            });

        } catch (error) {
            console.error(error);
            if (error.response?.status === 401) {
                alert("Session expired. Please login again.");
            } else {
                alert("Prediction Failed");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, color: '#1e293b', fontWeight: '600' }}>Crop & Soil Details</h3>
                <button
                    onClick={handleLocationClick}
                    disabled={locationLoading}
                    style={{
                        background: 'none',
                        border: '2px solid var(--primary)',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        cursor: locationLoading ? 'not-allowed' : 'pointer',
                        fontSize: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s ease',
                        opacity: locationLoading ? 0.6 : 1
                    }}
                    title="Detect my location"
                    onMouseOver={(e) => {
                        if (!locationLoading) {
                            e.currentTarget.style.backgroundColor = 'var(--primary)';
                            e.currentTarget.style.transform = 'scale(1.1)';
                        }
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.transform = 'scale(1)';
                    }}
                >
                    {locationLoading ? '⏳' : '📍'}
                </button>
            </div>

            {/* Location Status Messages */}
            {locationLoading && (
                <div style={{
                    padding: '10px',
                    backgroundColor: '#e3f2fd',
                    borderRadius: '5px',
                    marginBottom: '15px',
                    fontSize: '14px',
                    color: '#1976d2'
                }}>
                    🔍 Detecting your location...
                </div>
            )}

            {locationError && (
                <div style={{
                    padding: '10px',
                    backgroundColor: '#ffebee',
                    borderRadius: '5px',
                    marginBottom: '15px',
                    fontSize: '14px',
                    color: '#c62828'
                }}>
                    ⚠️ {locationError}
                </div>
            )}

            {/* Detected State Display */}
            {formData.state && stateSource === 'gps' && (
                <div style={{
                    padding: '12px',
                    backgroundColor: '#e8f5e9',
                    borderRadius: '5px',
                    marginBottom: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <span style={{ fontSize: '18px' }}>📍</span>
                    <div>
                        <div style={{ fontSize: '12px', color: '#059669', marginBottom: '2px' }}>
                            Detected State
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#047857' }}>
                            {formData.state}
                        </div>
                    </div>
                </div>
            )}

            {/* Crop Type */}
            <div className="input-group" style={{ marginBottom: '20px' }}>
                <label style={{ color: '#334155', marginBottom: '8px', display: 'block', fontWeight: '500' }}>Crop Type</label>
                <select name="crop" value={formData.crop} onChange={handleChange} style={{
                    width: '100%',
                    padding: '12px',
                    background: '#ffffff',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    color: '#111827',
                    fontSize: '1rem'
                }}>
                    <option value="Wheat">Wheat</option>
                    <option value="Rice">Rice</option>
                    <option value="Maize">Maize</option>
                    <option value="Sugarcane">Sugarcane</option>
                    <option value="Cotton">Cotton</option>
                    <option value="Potato">Potato</option>
                    <option value="Tomato">Tomato</option>
                    <option value="Chickpea">Chickpea</option>
                    <option value="Groundnut">Groundnut</option>
                    <option value="Mustard">Mustard</option>
                    <option value="Onion">Onion</option>
                    <option value="Pearl Millet">Pearl Millet</option>
                    <option value="Pigeon Pea">Pigeon Pea</option>
                    <option value="Sorghum">Sorghum</option>
                    <option value="Soybean">Soybean</option>
                </select>
            </div>

            <div className="input-group">
                <label>Soil Type</label>
                <select name="soil_type" value={formData.soil_type} onChange={handleChange}>
                    <option value="Clayey">Clayey</option>
                    <option value="Sandy">Sandy</option>
                    <option value="Loamy">Loamy</option>
                    <option value="Black">Black</option>
                    <option value="Red">Red</option>
                    <option value="Alluvial">Alluvial</option>
                </select>
            </div>

            <div className="input-group">
                <label>Season</label>
                <select name="season" value={formData.season} onChange={handleChange}>
                    <option value="Kharif">Kharif</option>
                    <option value="Rabi">Rabi</option>
                    <option value="Zaid">Zaid</option>
                </select>
            </div>

            {/* Manual State Selection */}
            <div className="input-group">
                <label style={{ color: '#334155', fontWeight: '500' }}>State {stateSource === 'manual' && <span style={{ fontSize: '12px', color: '#64748b' }}>(Manually Selected)</span>}</label>
                <select
                    name="state"
                    value={formData.state}
                    onChange={handleStateChange}
                    style={{
                        backgroundColor: stateSource === 'gps' ? '#f5f5f5' : 'white'
                    }}
                >
                    <option value="">Select State</option>
                    {indianStates.map(state => (
                        <option key={state} value={state}>{state}</option>
                    ))}
                </select>
            </div>

            <div className="input-group">
                <label>Nutrient Input Mode</label>
                <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}>
                    <label>
                        <input
                            type="radio"
                            name="inputMode"
                            value="Mode 1"
                            checked={formData.inputMode === 'Mode 1'}
                            onChange={handleChange}
                        />
                        Mode 1: Predefined (Auto)
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="inputMode"
                            value="Mode 2"
                            checked={formData.inputMode === 'Mode 2'}
                            onChange={handleChange}
                        />
                        Mode 2: Manual (IoT)
                    </label>
                </div>
            </div>

            {formData.inputMode === 'Mode 1' && (
                <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#e8f5e9', borderRadius: '5px' }}>
                    <p style={{ margin: 0, fontSize: '14px', color: '#2e7d32' }}>
                        ℹ️ Nutrients and pH automatically fetched based on crop and soil type
                    </p>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="input-group">
                    <label>Nitrogen (N)</label>
                    <input type="number" name="N" value={formData.N} onChange={handleChange} disabled={formData.inputMode === 'Mode 1'} />
                </div>
                <div className="input-group">
                    <label>Phosphorus (P)</label>
                    <input type="number" name="P" value={formData.P} onChange={handleChange} disabled={formData.inputMode === 'Mode 1'} />
                </div>
                <div className="input-group">
                    <label>Potassium (K)</label>
                    <input type="number" name="K" value={formData.K} onChange={handleChange} disabled={formData.inputMode === 'Mode 1'} />
                </div>
                <div className="input-group">
                    <label>pH Level</label>
                    <input type="number" step="0.1" name="ph" value={formData.ph} onChange={handleChange} />
                </div>
            </div>

            <div style={{ marginTop: '20px' }}>
                <p style={{ color: '#334155' }}><strong>Field Area:</strong> {area ? `${area} Hectares` : "Not selected"}</p>
                <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleYieldPredict} disabled={loading}>
                    {loading ? "Processing..." : "Predict Crop Yield"}
                </button>
            </div>
        </div>
    );
};

export default InputForm;
