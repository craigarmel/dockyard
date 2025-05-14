import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const CTASection = () => {
  const sectionRef = useRef(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (contentRef.current) {
            contentRef.current.classList.add('opacity-100', 'scale-100');
            contentRef.current.classList.remove('opacity-0', 'scale-95');
          }
        }
      },
      { threshold: 0.1 }
    );

    if (contentRef.current) {
      observer.observe(contentRef.current);
    }

    return () => {
      if (contentRef.current) {
        observer.unobserve(contentRef.current);
      }
    };
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="py-20 bg-gradient-to-br from-blue-600 to-blue-800 relative overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white opacity-10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-white opacity-10 rounded-full animate-pulse" style={{ animationDuration: '3s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white opacity-10 rounded-full animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute top-1/4 right-1/3 w-20 h-20 bg-white opacity-10 rounded-full animate-pulse" style={{ animationDuration: '5s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div 
          ref={contentRef}
          className="max-w-4xl mx-auto text-center opacity-0 scale-95 transition-all duration-700 ease-out"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to Set Sail with Your Next Project?
          </h2>
          <p className="text-xl md:text-2xl text-blue-100 mb-10">
            Let's build something amazing together. Contact us today for a free consultation 
            and discover how our Dockyard can launch your digital success.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link 
              to="/contact" 
              className="bg-white text-blue-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg inline-block"
            >
              Get in Touch
            </Link>
            <Link 
              to="/portfolio" 
              className="text-white border-2 border-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:bg-opacity-10 transition-all inline-block"
            >
              View Our Work
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;