import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const shipRef = useRef<HTMLDivElement | null>(null);
  const waveRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollValue = window.scrollY;
      if (shipRef.current) {
        shipRef.current.style.transform = `translateY(${scrollValue * 0.15}px)`;
      }
      if (waveRef.current) {
        waveRef.current.style.transform = `translateY(${scrollValue * 0.05}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);

    const animateOnLoad = () => {
      if (heroRef.current) {
        heroRef.current.classList.add('opacity-100');
        heroRef.current.classList.remove('opacity-0');
        heroRef.current.classList.add('translate-y-0');
        heroRef.current.classList.remove('-translate-y-10');
      }
    };

    setTimeout(animateOnLoad, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      id='HeroSection'
      className="relative w-full min-h-[80vh] flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, rgba(0,0,0,0) 60%, rgba(0,0,0,0.85) 100%), url('/Background.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="container mx-auto px-4 h-full flex items-center relative z-30">
        <div
          ref={heroRef}
          className="max-w-4xl opacity-100 -translate-y-10 transition-all duration-1000 ease-out rounded-xl p-10 bg-transparent shadow-2xl"
        >
          <div className="flex items-center mb-8">
        <img
          src="/logo.png"
          alt="Dockyard Logo"
          className="w-16 h-16 md:w-20 md:h-20 mr-4 rounded-full shadow-lg bg-white/80 p-2"
        />
        <h1
          className="text-5xl md:text-8xl lg:text-7xl font-bold"
          style={{
            color: '#f3f4f6',
            textShadow: '0 2px 8px #b0b0b0, 0 0px 16px #ffffff44',
          }}
        >
          <span className="text-gray-100">Dockyard</span>
        </h1>
          </div>
          <p className="text-xl md:text-2xl mb-10 text-gray-100">
        A historic hub of British naval innovation and maritime heritage.
          </p>
          <div className="flex gap-4">
        <Link
          to={import.meta.env.FUN_WEBSITE_URL || 'http://localhost:4000'}
          className="bg-gradient-to-r from-white via-gray-100 to-gray-300 text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold hover:from-gray-300 hover:to-white transition-colors shadow-lg"
        >
          Explore
        </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;