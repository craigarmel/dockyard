import { useEffect } from 'react';
import Navbar from '../components/common/Navbar.tsx';
import HeroSection from '../components/sections/HeroSection.tsx';
import Footer from '../components/common/Footer.tsx';

const HomePage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = 'Dockyard - Digital Solutions';

    // Add favicon.ico
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/x-icon';
    link.href = '/favicon.ico';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <HeroSection />
      <Footer />
    </div>
  );
};

export default HomePage;