import React, { useState } from 'react';
import api from '../utils/api';

const HealthAnalysis = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
            setResult(null);
        }
    };

    const handleAnalyze = async () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
            setLoading(true);
            const res = await api.post('/analyze_health', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setResult(res.data);
        } catch (error) {
            console.error(error);
            if (error.response?.status === 401) {
                alert("Session expired. Please login again.");
            } else {
                alert("Analysis failed.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '30px',
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
        }}>
            <h3 style={{ color: '#1e293b', fontSize: '1.3rem', fontWeight: '600', marginTop: 0 }}>
                Crop Health Analysis (Image-based)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                <div style={{
                    width: '100%',
                    height: '200px',
                    border: '2px dashed #cbd5e1',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    background: '#f8fafc'
                }}>
                    {preview ? (
                        <img src={preview} alt="Crop" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <span style={{ color: '#64748b' }}>Upload or Capture Image</span>
                    )}
                </div>

                <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileChange}
                    style={{ width: '100%', color: '#334155' }}
                />

                <button
                    onClick={handleAnalyze}
                    disabled={!selectedFile || loading}
                    style={{
                        width: '100%',
                        padding: '14px',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: selectedFile && !loading ? 'pointer' : 'not-allowed',
                        opacity: !selectedFile || loading ? 0.5 : 1
                    }}
                >
                    {loading ? "Analyzing..." : "Analyze Health"}
                </button>

                {result && (
                    <div style={{
                        marginTop: '20px',
                        width: '100%',
                        padding: '20px',
                        background: result.status === 'Healthy' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        borderRadius: '8px',
                        border: `1px solid ${result.status === 'Healthy' ? 'rgba(74, 222, 128, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                    }}>
                        <h4 style={{
                            margin: '0 0 10px 0',
                            color: result.status === 'Healthy' ? '#4ade80' : '#ef4444',
                            fontSize: '1.2rem'
                        }}>
                            Status: {result.status}
                        </h4>
                        {result.disease && <p style={{ color: '#475569' }}><strong>Detected Disease:</strong> {result.disease}</p>}
                        <p style={{ color: '#475569' }}><strong>Confidence:</strong> {(result.confidence * 100).toFixed(1)}%</p>

                        {result.recommendations.length > 0 && (
                            <div style={{ marginTop: '10px' }}>
                                <strong style={{ color: '#1e293b' }}>Recommendations:</strong>
                                <ul style={{ paddingLeft: '20px', marginTop: '5px', color: '#64748b' }}>
                                    {result.recommendations.map((rec, idx) => (
                                        <li key={idx}>{rec}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HealthAnalysis;
