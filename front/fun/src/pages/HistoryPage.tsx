import React from 'react';
import HistorySection from '../components/sections/HistorySection';
import Navbar from '../components/common/Navbar';

const HistoryPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navbar />
            <HistorySection />
        </div>
    );
};

export default HistoryPage;