import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const shipRef = useRef<HTMLDivElement | null>(null);
  const waveRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Parallax effect on scroll
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
    
    // Animation for initial load
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
    <div className="relative h-screen overflow-hidden bg-gradient-to-b from-blue-50 to-blue-100">
      {/* SVG Wave Animation */}
      <div ref={waveRef} className="absolute bottom-0 w-full">
        <svg className="w-full" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
          <path 
            fill="#0099ff" 
            fillOpacity="0.2" 
            d="M0,192L48,181.3C96,171,192,149,288,154.7C384,160,480,192,576,202.7C672,213,768,203,864,186.7C960,171,1056,149,1152,160C1248,171,1344,213,1392,234.7L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            className="animate-pulse"
            style={{ animationDuration: '10s' }}
          >
          </path>
          <path 
            fill="#0099ff" 
            fillOpacity="0.4" 
            d="M0,256L48,240C96,224,192,192,288,186.7C384,181,480,203,576,208C672,213,768,203,864,213.3C960,224,1056,256,1152,261.3C1248,267,1344,245,1392,234.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            className="animate-pulse"
            style={{ animationDuration: '15s' }}
          >
          </path>
        </svg>
      </div>

      {/* Ship/Dock Animation */}
      <div 
        ref={shipRef} 
        className="absolute bottom-20 right-10 md:right-40 w-32 md:w-64 h-32 md:h-64 opacity-70 animate-bounce"
        style={{ animationDuration: '6s' }}
      >
        <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
          <path fill="#334155" d="M256,32c-123.5,0-224,100.5-224,224c0,41.8,11.5,81,31.6,114.4L0,416l96,96l70.4-70.4C199.4,460.5,226.1,470,256,470c123.5,0,224-100.5,224-224S379.5,32,256,32z M256,416c-88.4,0-160-71.6-160-160S167.6,96,256,96s160,71.6,160,160S344.4,416,256,416z" />
        </svg>
      </div>

      <div className="container mx-auto px-4 h-full flex items-center">
        <div 
          ref={heroRef} 
          className="max-w-3xl opacity-0 -translate-y-10 transition-all duration-1000 ease-out"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-800 mb-6">
            Your Digital <span className="text-blue-600">Dockyard</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            We build and launch powerful web applications that navigate the digital ocean with ease.
            Your vision, our expertise - together we'll set sail.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link 
              to="/services" 
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
            >
              Explore Our Services
            </Link>
            <Link 
              to="/contact" 
              className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;