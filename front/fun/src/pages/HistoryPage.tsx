import React from 'react';
import HistorySection from '../components/sections/HistorySection';

const HistoryPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-white flex flex-col">
            <HistorySection />
        </div>
    );
};

export default HistoryPage;