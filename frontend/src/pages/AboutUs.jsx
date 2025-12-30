import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
    return (
        <div className="about-container">
            <div className="about-content">
                <header className="about-header">
                    <h1 className="about-title">About Smart Agriculture System</h1>
                </header>

                <div className="about-card">
                    <h2>Our Mission</h2>
                    <p>
                        We're on a mission to revolutionize farming through the power of artificial intelligence
                        and data science. Our Smart Agriculture System helps farmers make informed decisions,
                        optimize crop yields, and detect plant diseases early.
                    </p>
                </div>

                <div className="about-card">
                    <h2>What We Offer</h2>
                    <ul className="feature-list">
                        <li>🌾 <strong>AI-Powered Yield Prediction</strong> - Predict crop yields with high accuracy using machine learning</li>
                        <li>🔬 <strong>Crop Health Analysis</strong> - Detect diseases early with computer vision technology</li>
                        <li>📍 <strong>GPS Field Mapping</strong> - Precise field measurements using interactive maps</li>
                        <li>🌱 <strong>Soil Analysis</strong> - Get detailed nutrient information for optimal growth</li>
                        <li>☁️ <strong>Weather Integration</strong> - Real-time weather data for better planning</li>
                    </ul>
                </div>

                <div className="about-card">
                    <h2>Technology Stack</h2>
                    <ul className="feature-list">
                        <li>⚛️ <strong>React</strong> - Modern frontend framework for interactive UI</li>
                        <li>🐍 <strong>Flask</strong> - Lightweight Python backend framework</li>
                        <li>🤖 <strong>TensorFlow</strong> - Machine learning for crop predictions</li>
                        <li>🗄️ <strong>MySQL</strong> - Reliable database for data storage</li>
                        <li>🗺️ <strong>Leaflet</strong> - Interactive maps for field mapping</li>
                    </ul>
                </div>

                <div className="about-card">
                    <h2>Our Vision</h2>
                    <p>
                        We envision a future where every farmer, regardless of their location or resources,
                        has access to cutting-edge technology that helps them grow healthier crops, reduce
                        waste, and increase productivity sustainably.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
