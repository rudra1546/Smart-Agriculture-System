import React from 'react';
import HealthAnalysis from '../components/HealthAnalysis';
import './CropHealth.css';

function CropHealth() {
    return (
        <div className="crophealth-container">
            <div className="crophealth-content">
                <header className="crophealth-header">
                    <h1 className="crophealth-title">
                        <span className="title-icon">🌿</span>
                        Crop Health Analysis
                    </h1>
                    <p className="crophealth-subtitle">AI-Powered Disease Detection & Recommendations</p>
                </header>

                <div className="info-card">
                    <h2>About Crop Health Analysis</h2>
                    <p>
                        Upload an image of your crop to detect potential diseases and get instant recommendations.
                        Our AI-powered system analyzes crop images to identify health issues and provides
                        organic treatment suggestions.
                    </p>
                    <div className="features-grid-small">
                        <div className="feature-pill">
                            <strong>📸 Image Upload</strong>
                            <p>Upload photos from gallery or camera</p>
                        </div>
                        <div className="feature-pill">
                            <strong>🔍 AI Detection</strong>
                            <p>Instant disease identification</p>
                        </div>
                        <div className="feature-pill">
                            <strong>💡 Recommendations</strong>
                            <p>Organic treatment suggestions</p>
                        </div>
                    </div>
                </div>

                {/* Health Analysis Component */}
                <div className="analysis-wrapper">
                    <HealthAnalysis />
                </div>

                <div className="info-card">
                    <h2>Tips for Best Results</h2>
                    <ul className="tips-list">
                        <li>📷 Take clear, well-lit photos of affected leaves or plant parts</li>
                        <li>🔎 Ensure the affected area is clearly visible in the image</li>
                        <li>📏 Capture close-up shots for better disease detection</li>
                        <li>☀️ Avoid shadows and blurry images</li>
                        <li>🌿 Focus on areas showing symptoms like spots, discoloration, or damage</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default CropHealth;
