import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import Predict from './pages/Predict';
import CropHealth from './pages/CropHealth';
import Trailer from './pages/Trailer';
import Features from './pages/Features';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import { DemoBackgroundPaths } from './pages/DemoBackground';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/features" element={<Features />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/predict" element={<Predict />} />
            <Route path="/crop-health" element={<CropHealth />} />
            <Route path="/trailer" element={<Trailer />} />
            <Route path="/demo" element={<DemoBackgroundPaths />} />

            {/* Auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

