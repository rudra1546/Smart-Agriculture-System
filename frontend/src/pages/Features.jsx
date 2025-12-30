import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Features() {
    return (
        <div className="home-container">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-overlay"></div>
                <div className="hero-image">
                    <div className="image-glow"></div>
                </div>
                <div className="hero-content">
                    <div className="hero-text">
                        <h1 className="hero-title">Smart Agriculture</h1>
                        <span className="hero-subtitle-line"></span>
                        <h2 className="hero-subtitle">Precision Farming Solutions</h2>
                        <p className="hero-description">
                            Harness the power of AI and machine learning to optimize your crop yields,
                            analyze soil health, and make data-driven decisions for sustainable farming.
                        </p>
                        <div className="hero-actions">
                            <Link to="/predict" className="btn-start-class">
                                <span className="play-icon">▶</span>
                                Start Prediction
                            </Link>
                            <Link to="/trailer" className="btn-trailer">
                                Learn More
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Introduction Section */}
            <section className="intro-section">
                <div className="intro-card">
                    <div className="intro-video-placeholder">
                        <div className="play-button-large">▶</div>
                        <div className="video-duration">2:30</div>
                    </div>
                    <div className="intro-text">
                        <h3>Welcome to the Future of Farming</h3>
                        <p>
                            Our AI-powered platform combines cutting-edge technology with agricultural expertise
                            to help farmers maximize productivity while minimizing environmental impact.
                        </p>
                        <p>
                            From crop yield prediction to health analysis, we provide the tools you need to
                            make informed decisions and stay ahead in modern agriculture.
                        </p>
                    </div>
                </div>
            </section>

            {/* Features Section - Original 6 cards in 3x2 grid */}
            <section className="features-section">
                <h2 className="section-title">Our Features</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">📊</div>
                        <h3>Yield Prediction</h3>
                        <p>
                            Predict crop yields accurately using advanced machine learning algorithms
                            based on soil nutrients, weather data, and field area.
                        </p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🌿</div>
                        <h3>Health Analysis</h3>
                        <p>
                            Upload crop images to detect diseases early and receive organic treatment
                            recommendations powered by computer vision.
                        </p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🗺️</div>
                        <h3>GPS Field Mapping</h3>
                        <p>
                            Draw and measure your agricultural fields directly on an interactive map
                            with precise area calculations.
                        </p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🌱</div>
                        <h3>Soil Insights</h3>
                        <p>
                            Get detailed soil nutrient information (N, P, K, pH) based on crop type
                            and location for optimal growth.
                        </p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">⛅</div>
                        <h3>Weather Data</h3>
                        <p>
                            Real-time weather information including temperature, humidity, and rainfall
                            for better decision making.
                        </p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🔒</div>
                        <h3>Secure & Private</h3>
                        <p>
                            Your data is protected with industry-standard encryption and JWT-based
                            authentication for peace of mind.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Features;
