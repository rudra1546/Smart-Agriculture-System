import React from 'react';
import './Pages.css';

const Trailer = () => {
    return (
        <div className="page-container" style={{ background: '#000', minHeight: '100vh', color: '#fff' }}>
            <div className="page-content">
                <header style={{ marginBottom: '40px', textAlign: 'center' }}>
                    <h1 className="page-title" style={{ color: '#fff' }}>🎬 Platform Trailer</h1>
                    <p className="text-muted" style={{ color: '#b3b3b3' }}>
                        See how Smart Agriculture transforms farming
                    </p>
                </header>

                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                    {/* Video Placeholder */}
                    <div style={{
                        background: '#1a1a1a',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        aspectRatio: '16/9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '30px',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                width: '100px',
                                height: '100px',
                                background: 'rgba(229,9,20,0.8)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 20px',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                <span style={{ fontSize: '2.5rem', marginLeft: '8px' }}>▶</span>
                            </div>
                            <p style={{ color: '#b3b3b3', fontSize: '1.1rem' }}>
                                Video coming soon
                            </p>
                            <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '10px' }}>
                                Duration: 2:45
                            </p>
                        </div>
                    </div>

                    {/* Trailer Info */}
                    <div style={{
                        background: 'rgba(255,255,255,0.05)',
                        padding: '30px',
                        borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <h2 style={{ marginTop: 0, fontWeight: 300 }}>What You'll Discover</h2>
                        <ul style={{ lineHeight: '2', color: '#b3b3b3' }}>
                            <li>🌱 AI-powered crop yield predictions with 95%+ accuracy</li>
                            <li>🗺️ Interactive GPS field mapping and area calculation</li>
                            <li>🔬 Comprehensive soil nutrient analysis (N, P, K, pH)</li>
                            <li>🌿 Image-based crop disease detection</li>
                            <li>📍 Location-based agricultural insights</li>
                            <li>☁️ Real-time weather data integration</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Trailer;
