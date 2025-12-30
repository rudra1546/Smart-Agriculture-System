import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    // Get auth state from context
    const { user, isAuthenticated, logout } = useAuth();

    const isActive = (path) => location.pathname === path;

    const handleLogin = () => {
        navigate('/login');
    };

    const handleProfile = () => {
        setDropdownOpen(false);
        navigate('/profile');
    };

    const handleLogout = () => {
        setDropdownOpen(false);
        logout();
        navigate('/home');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    🌱 Smart Agriculture
                </Link>

                {/* Desktop Navigation */}
                <div className="nav-center">
                    <Link
                        to="/home"
                        className={`nav-link ${isActive('/home') || isActive('/') ? 'active' : ''}`}
                    >
                        Discover
                    </Link>
                    <Link
                        to="/predict"
                        className={`nav-link ${isActive('/predict') ? 'active' : ''}`}
                    >
                        Predict
                    </Link>
                    <Link
                        to="/crop-health"
                        className={`nav-link ${isActive('/crop-health') ? 'active' : ''}`}
                    >
                        Crop Health
                    </Link>
                    <Link
                        to="/about"
                        className={`nav-link ${isActive('/about') ? 'active' : ''}`}
                    >
                        About Us
                    </Link>
                    <Link
                        to="/contact"
                        className={`nav-link ${isActive('/contact') ? 'active' : ''}`}
                    >
                        Contact
                    </Link>
                </div>

                {/* Right Side - User/Login */}
                <div className="nav-right">
                    {isAuthenticated ? (
                        <div className="user-menu">
                            <button
                                className="user-profile"
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                            >
                                <span className="user-avatar">{user?.name?.charAt(0).toUpperCase() || '👤'}</span>
                                <span className="user-name">{user?.name || 'User'}</span>
                                <span className="dropdown-arrow">{dropdownOpen ? '▲' : '▼'}</span>
                            </button>
                            {dropdownOpen && (
                                <div className="user-dropdown">
                                    <button onClick={handleProfile} className="dropdown-item">
                                        <span className="dropdown-icon">👤</span>
                                        Profile
                                    </button>
                                    <button onClick={handleLogout} className="dropdown-item logout">
                                        <span className="dropdown-icon">🚪</span>
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button className="btn-login" onClick={handleLogin}>
                            Login
                        </button>
                    )}
                </div>

                {/* Mobile menu button */}
                <button
                    className="mobile-menu-btn"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    ☰
                </button>

                {/* Mobile Nav Menu */}
                <div className={`nav-menu-mobile ${mobileMenuOpen ? 'active' : ''}`}>
                    <Link
                        to="/home"
                        className={`nav-link ${isActive('/home') ? 'active' : ''}`}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Discover
                    </Link>
                    <Link
                        to="/predict"
                        className={`nav-link ${isActive('/predict') ? 'active' : ''}`}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Predict
                    </Link>
                    <Link
                        to="/crop-health"
                        className={`nav-link ${isActive('/crop-health') ? 'active' : ''}`}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Crop Health
                    </Link>
                    <Link
                        to="/about"
                        className={`nav-link ${isActive('/about') ? 'active' : ''}`}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        About Us
                    </Link>
                    <Link
                        to="/contact"
                        className={`nav-link ${isActive('/contact') ? 'active' : ''}`}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Contact
                    </Link>
                    {isAuthenticated && (
                        <Link
                            to="/profile"
                            className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Profile
                        </Link>
                    )}
                    {!isAuthenticated && (
                        <button className="btn-login mobile" onClick={handleLogin}>
                            Login
                        </button>
                    )}
                    {isAuthenticated && (
                        <button className="btn-login mobile" onClick={handleLogout}>
                            Logout
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
