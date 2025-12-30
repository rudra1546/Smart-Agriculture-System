import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import * as turf from '@turf/turf';
import L from 'leaflet';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const DrawControl = ({ onAreaCalculated, onDeleted }) => {
    const map = useMap();
    const initialized = useRef(false);

    useEffect(() => {
        if (!map) return;

        // Prevent double initialization in React 18 strict mode
        if (initialized.current) {
            console.log("⏩ Skipping duplicate initialization (React Strict Mode)");
            return;
        }

        console.log("🎨 Initializing Geoman drawing controls...");
        initialized.current = true;

        // Add Geoman controls
        map.pm.addControls({
            position: 'topright',
            drawCircle: false,
            drawCircleMarker: false,
            drawPolyline: false,
            drawRectangle: false,
            drawMarker: false,
            drawPolygon: true,
            editMode: false,
            dragMode: false,
            cutPolygon: false,
            rotateMode: false,
        });

        console.log("✅ Drawing controls added successfully!");

        const handleCreate = (e) => {
            console.log("📐 Polygon created event fired!");
            try {
                const layer = e.layer;

                // Remove any existing polygons first
                map.eachLayer((l) => {
                    if (l instanceof L.Polygon && l !== layer) {
                        map.removeLayer(l);
                    }
                });

                const latlngs = layer.getLatLngs()[0];
                console.log(`📍 Polygon has ${latlngs.length} vertices`);

                const coordinates = latlngs.map(ll => [ll.lng, ll.lat]);
                coordinates.push(coordinates[0]); // Close the polygon

                const polygon = turf.polygon([coordinates]);
                const areaInSqMeters = turf.area(polygon);
                const areaInHectares = areaInSqMeters / 10000;

                console.log(`📏 Area calculated: ${areaInHectares.toFixed(4)} hectares (${areaInSqMeters.toFixed(2)} sq meters)`);

                if (onAreaCalculated) {
                    console.log(`✅ Calling onAreaCalculated with: ${areaInHectares}`);
                    onAreaCalculated(areaInHectares);
                } else {
                    console.error("⚠️ onAreaCalculated callback is not defined!");
                }
            } catch (error) {
                console.error("❌ Error in handleCreate:", error);
            }
        };

        const handleLayerRemove = (e) => {
            console.log("🗑️ Polygon removed!");
            if (onDeleted) {
                console.log("✅ Calling onDeleted");
                onDeleted();
            }
        };

        // Listen to pm:create event
        map.on('pm:create', handleCreate);
        map.on('pm:remove', handleLayerRemove);

        console.log("👂 Event listeners attached for pm:create and pm:remove");

        // Cleanup function - only runs on actual unmount
        return () => {
            if (!initialized.current) return; // Don't cleanup if not initialized

            console.log("🧹 Cleaning up event listeners on component unmount");
            map.off('pm:create', handleCreate);
            map.off('pm:remove', handleLayerRemove);
            initialized.current = false;
        };
    }, [map]); // Only depend on map, not on the callbacks

    return null;
};

const LocationUpdater = ({ center, zoom }) => {
    const map = useMap();

    useEffect(() => {
        if (center && center.length === 2) {
            map.setView(center, zoom);
        }
    }, [center, zoom, map]);

    return null;
};

const MapComponent = ({ onAreaCalculated, onLocationFound }) => {
    const [area, setArea] = useState(0);
    const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // Default: Center of India
    const [zoom, setZoom] = useState(5);
    const [locationStatus, setLocationStatus] = useState('default');
    const [locationError, setLocationError] = useState('');
    const [isUsingDefaultLocation, setIsUsingDefaultLocation] = useState(true);

    const handleAreaCalculated = (calculatedArea) => {
        setArea(calculatedArea);
        if (onAreaCalculated) {
            onAreaCalculated(calculatedArea);
        }
    };

    const handlePolygonDeleted = () => {
        setArea(0);
        if (onAreaCalculated) {
            onAreaCalculated(0);
        }
    };

    const fetchUserLocation = () => {
        if (!navigator.geolocation) {
            setLocationStatus('error');
            setLocationError('Geolocation not supported by your browser');
            setIsUsingDefaultLocation(true);
            return;
        }

        setLocationStatus('detecting');
        setLocationError('');

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude, accuracy } = pos.coords;
                console.log(`📍 GPS Location: ${latitude}, ${longitude} (±${accuracy}m)`);

                setMapCenter([latitude, longitude]);
                setZoom(16);
                setLocationStatus('success');
                setIsUsingDefaultLocation(false);

                if (onLocationFound) {
                    onLocationFound(latitude, longitude);
                }
            },
            (err) => {
                console.error("GPS Error:", err);
                setLocationStatus('error');
                setIsUsingDefaultLocation(true);

                if (err.code === err.PERMISSION_DENIED) {
                    setLocationError('Location permission denied. Using default location.');
                } else if (err.code === err.POSITION_UNAVAILABLE) {
                    setLocationError('Location unavailable. Using default location.');
                } else if (err.code === err.TIMEOUT) {
                    setLocationError('Location request timed out. Using default location.');
                } else {
                    setLocationError('Unable to get location. Using default location.');
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    };

    useEffect(() => {
        fetchUserLocation();
    }, []);

    return (
        <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '25px',
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px'
            }}>
                <h3 style={{ color: '#1e293b', fontSize: '1.3rem', fontWeight: '600', margin: 0 }}>
                    Field Selection
                </h3>
                {locationStatus && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {locationStatus === 'detecting' && (
                            <span style={{ color: '#60a5fa', fontSize: '0.9rem' }}>🔍 Detecting location...</span>
                        )}
                        {locationStatus === 'success' && (
                            <span style={{ color: '#4ade80', fontSize: '0.9rem' }}>✅ Location detected</span>
                        )}
                        <button
                            onClick={fetchUserLocation}
                            disabled={locationStatus === 'detecting'}
                            style={{
                                background: 'none',
                                border: 'none',
                                fontSize: '1.5rem',
                                cursor: locationStatus === 'detecting' ? 'not-allowed' : 'pointer',
                                padding: '5px',
                                opacity: locationStatus === 'detecting' ? 0.5 : 1
                            }}
                            title="Retry location detection"
                        >
                            {locationStatus === 'detecting' ? '⏳' : '📍'}
                        </button>
                    </div>
                )}
            </div>

            {locationError && (
                <div style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#ef4444',
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '15px',
                    fontSize: '0.9rem'
                }}>
                    ⚠️ {locationError}
                </div>
            )}

            {isUsingDefaultLocation && (
                <div style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    color: '#60a5fa',
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '15px',
                    fontSize: '0.9rem'
                }}>
                    ℹ️ Showing default location (India center). Click 📍 to detect your location.
                </div>
            )}

            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '15px' }}>
                Click the polygon icon (⬟) on the right to draw field boundary.
            </p>

            <MapContainer
                center={mapCenter}
                zoom={zoom}
                style={{
                    height: '400px',
                    width: '100%',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    maxZoom={19}
                />
                <DrawControl onAreaCalculated={handleAreaCalculated} onDeleted={handlePolygonDeleted} />
                <LocationUpdater center={mapCenter} zoom={zoom} />
            </MapContainer>

            {area > 0 && (
                <div style={{
                    marginTop: '15px',
                    padding: '15px',
                    background: 'rgba(74, 222, 128, 0.1)',
                    border: '1px solid rgba(74, 222, 128, 0.3)',
                    borderRadius: '8px'
                }}>
                    <div style={{ color: '#4ade80', fontSize: '0.9rem', marginBottom: '5px' }}>
                        Field Area Calculated
                    </div>
                    <div style={{ color: '#059669', fontSize: '1.5rem', fontWeight: '600' }}>
                        {area.toFixed(2)} hectares
                    </div>
                </div>
            )}
        </div>
    );
};

export default MapComponent;
