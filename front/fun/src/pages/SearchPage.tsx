import React from 'react';
import SearchSection from '../components/sections/SearchSection';
import Navbar from '../components/common/Navbar';

const SearchPage: React.FC = () => {
    return (
        <div>
            <Navbar />
            <SearchSection />
        </div>
    );
};

export default SearchPage;