import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is authenticated on mount
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = () => {
        try {
            const userData = localStorage.getItem('user');

            if (userData) {
                setUser(JSON.parse(userData));
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const signup = async (name, email, password) => {
        try {
            // Call backend signup API
            const response = await api.post('/auth/signup', { name, email, password });

            const { user: userData } = response.data;

            // Store user data in localStorage
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);

            return { success: true };
        } catch (error) {
            const message = error.response?.data?.error || 'Signup failed';
            return { success: false, error: message };
        }
    };

    const login = async (email, password) => {
        try {
            // Call backend login API
            const response = await api.post('/auth/login', { email, password });

            const { user: userData } = response.data;

            // Store user data in localStorage
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);

            return { success: true };
        } catch (error) {
            const message = error.response?.data?.error || 'Login failed';
            return { success: false, error: message };
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    const value = {
        user,
        isAuthenticated: !!user,
        loading,
        signup,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

