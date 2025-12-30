import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import './Profile.css';

const Profile = () => {
    const { user } = useAuth();
    const [predictionCount, setPredictionCount] = useState(0);
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.email) {
            fetchPredictionData();
        }
    }, [user]);

    const fetchPredictionData = async () => {
        try {
            setLoading(true);

            // Fetch prediction count
            const countRes = await api.get('/predictions/count', {
                params: { email: user.email }
            });
            setPredictionCount(countRes.data.count);

            // Fetch prediction history (last 10)
            const historyRes = await api.get('/predictions/history', {
                params: { email: user.email, limit: 10 }
            });
            setPredictions(historyRes.data.predictions);

        } catch (error) {
            console.error('Error fetching prediction data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className="profile-container">
            <div className="profile-card-main">
                <div className="profile-header-section">
                    <div className="profile-avatar-large">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="profile-header-info">
                        <h1>{user?.name}</h1>
                        <p className="profile-email">{user?.email}</p>
                    </div>
                </div>

                <div className="profile-details">
                    <h2>Account Information</h2>

                    <div className="info-grid">
                        <div className="info-item">
                            <label>Full Name</label>
                            <div className="info-value">{user?.name}</div>
                        </div>

                        <div className="info-item">
                            <label>Email Address</label>
                            <div className="info-value">{user?.email}</div>
                        </div>

                        <div className="info-item">
                            <label>Account Created</label>
                            <div className="info-value">{formatDate(user?.created_at)}</div>
                        </div>

                        <div className="info-item">
                            <label>User ID</label>
                            <div className="info-value">#{user?.id}</div>
                        </div>

                        <div className="info-item">
                            <label>Total Predictions</label>
                            <div className="info-value" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>
                                {loading ? '...' : predictionCount}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Prediction History Section */}
                <div className="profile-details" style={{ marginTop: '30px' }}>
                    <h2>Prediction History</h2>

                    {loading ? (
                        <p style={{ textAlign: 'center', color: '#64748b' }}>Loading...</p>
                    ) : predictions.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#64748b' }}>No predictions yet. Start by making your first crop yield prediction!</p>
                    ) : (
                        <div className="prediction-history">
                            {predictions.map((pred, index) => (
                                <div key={pred.id} className="prediction-card">
                                    <div className="prediction-header">
                                        <h3>🌾 {pred.crop}</h3>
                                        <span className="prediction-date">{formatDate(pred.created_at)}</span>
                                    </div>
                                    <div className="prediction-details-grid">
                                        <div className="prediction-detail">
                                            <label>Area</label>
                                            <div>{pred.area ? `${parseFloat(pred.area).toFixed(2)} ha` : 'N/A'}</div>
                                        </div>
                                        <div className="prediction-detail">
                                            <label>Total Yield</label>
                                            <div>{pred.total_yield ? `${parseFloat(pred.total_yield).toFixed(2)} kg` : 'N/A'}</div>
                                        </div>
                                        <div className="prediction-detail">
                                            <label>Soil Type</label>
                                            <div>{pred.soil_type || 'N/A'}</div>
                                        </div>
                                        <div className="prediction-detail">
                                            <label>Season</label>
                                            <div>{pred.season || 'N/A'}</div>
                                        </div>
                                        {pred.state && (
                                            <div className="prediction-detail">
                                                <label>State</label>
                                                <div>{pred.state}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;

