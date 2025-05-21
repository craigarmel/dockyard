import React from 'react';
import HomeSection from '../components/sections/HomeSection';
import Navbar from '../components/common/Navbar';

const HomePage: React.FC = () => {
    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navbar />
            <HomeSection />
        </div>
    );
};

export default HomePage;