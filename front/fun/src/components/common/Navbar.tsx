import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-theme/90 shadow-lg py-2'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-white flex items-center">
              <img src="/favicon.ico" alt="Logo" className="h-8 w-8 mr-2" />
              Dockyard
            </Link>
          </div>

          {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/History" className="text-white hover:text-gray-200 transition-colors">
                History
              </Link>
              <Link to="/Search" className="text-white hover:text-gray-200 transition-colors">
                Search
              </Link>
              <Link to="/DockyardLife" className="text-white hover:text-gray-200 transition-colors">
                DockyardLife
              </Link>
              <Link to='http://localhost:3000' className='bg-transparent px-6 py-2 rounded-lg text-white hover:text-black hover:bg-white border-2 border-white transition-colors transition'>
                Admin
              </Link>
            </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 py-2 bg-theme/95 rounded-lg shadow-lg">
            <div className="flex flex-col space-y-4 px-4 py-2">
              <Link to="/History" className="text-white hover:text-gray-200 transition-colors py-2">
          History
              </Link>
              <Link to="/Search" className="text-white hover:text-gray-200 transition-colors py-2">
          Search
              </Link>
              <Link to="/DockyardLife" className="text-white hover:text-gray-200 transition-colors py-2">
          DockyardLife
              </Link>
              <Link to='http://localhost:3000' className='bg-transparent px-6 py-2 rounded-lg text-white hover:text-black hover:bg-white border-2 border-white transition-colors transition'>
          Admin
              </Link>
            </div>
          </div>
        )}
      </div>
      {/* Custom theme color for Tailwind */}
      <style>{`
        .bg-theme { background-color: #2563eb; }  /* Blue-600 */
        .from-theme { --tw-gradient-from: #2563eb; }
        .to-theme-dark { --tw-gradient-to: #1e40af; }
        .from-theme-light { --tw-gradient-from: #60a5fa; }
        .to-theme { --tw-gradient-to: #2563eb; }
      `}</style>
    </nav>
  );
};

export default Navbar;
