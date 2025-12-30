import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BackgroundPaths } from '../components/ui/background-paths';
import './Home.css';

function Home() {
    const navigate = useNavigate();

    const handleDiscoverClick = () => {
        navigate('/features');
    };

    return (
        <div onClick={(e) => {
            // Check if the button was clicked
            if (e.target.closest('button')) {
                handleDiscoverClick();
            }
        }}>
            <BackgroundPaths title="Smart Agriculture System" />
        </div>
    );
}

export default Home;
