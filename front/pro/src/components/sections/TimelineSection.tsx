import { useEffect, useState } from 'react';
import HistoricalShip from './HistoricalShip.tsx';

interface TimelineSection {
  id: string;
  imageId: string;
  dateId: string;
  parallaxId: string;
  year: number;
  position: number;
  title: string;
  description: string;
  bgColor: string;
}

const TimelineSection = () => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [ticking, setTicking] = useState(false);

  const sections: TimelineSection[] = [
    { 
      id: 'section-1802', 
      imageId: 'image-1802', 
      dateId: 'date-1802', 
      parallaxId: 'parallax-1802', 
      year: 1802, 
      position: 0,
      title: 'The First Dock',
      description: 'The first official dockyard was established, marking the beginning of maritime innovation.',
      bgColor: 'bg-blue-100'
    },
    { 
      id: 'section-1850', 
      imageId: 'image-1850', 
      dateId: 'date-1850', 
      parallaxId: 'parallax-1850', 
      year: 1852, 
      position: 50,
      title: 'The Industrial Revolution',
      description: 'With the industrial revolution in full swing, dockyards became centers of technological advancement.',
      bgColor: 'bg-blue-200'
    },
    { 
      id: 'section-1900', 
      imageId: 'image-1900', 
      dateId: 'date-1900', 
      parallaxId: 'parallax-1900', 
      year: 1902, 
      position: 100,
      title: 'The Modern Era',
      description: 'The dawn of the 20th century brought new materials and techniques to shipbuilding and dock operations.',
      bgColor: 'bg-blue-300'
    }
  ];

  // Update section based on index
  const updateSection = (index: number) => {
    if (index < 0) index = 0;
    if (index >= sections.length) index = sections.length - 1;
    
    setCurrentSectionIndex(index);
  };

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const section = sections[currentSectionIndex];
          const parallaxElement = document.getElementById(section.parallaxId);
          
          if (parallaxElement) {
            const xPos = (e.clientX / window.innerWidth) - 0.5;
            const yPos = (e.clientY / window.innerHeight) - 0.5;
            
            parallaxElement.style.transform = `scale(1.05) translate(${xPos * -10}px, ${yPos * -10}px)`;
          }
          
          setTicking(false);
        });
        
        setTicking(true);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [currentSectionIndex, sections, ticking]);

  // Wheel event
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const delta = e.deltaY;
          
          if (delta > 0) {
            // Scrolling down - move forward in time
            updateSection(currentSectionIndex + 1);
          } else if (delta < 0) {
            // Scrolling up - move backward in time
            updateSection(currentSectionIndex - 1);
          }
          
          setTicking(false);
        });
        
        setTicking(true);
      }
      
      // Prevent default scrolling in the timeline section
      e.preventDefault();
    };

    const timelineElement = document.getElementById('historical-timeline');
    if (timelineElement) {
      timelineElement.addEventListener('wheel', handleWheel, { passive: false });
    }
    
    return () => {
      if (timelineElement) {
        timelineElement.removeEventListener('wheel', handleWheel);
      }
    };
  }, [currentSectionIndex]);

  // Touch support for mobile
  useEffect(() => {
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const touchY = e.touches[0].clientY;
          const delta = touchStartY - touchY;
          
          if (delta > 50) {
            // Swiping up - move forward in time
            updateSection(currentSectionIndex + 1);
            touchStartY = touchY;
          } else if (delta < -50) {
            // Swiping down - move backward in time
            updateSection(currentSectionIndex - 1);
            touchStartY = touchY;
          }
          
          setTicking(false);
        });
        
        setTicking(true);
      }
      
      // Prevent default scrolling
      e.preventDefault();
    };

    const timelineElement = document.getElementById('historical-timeline');
    if (timelineElement) {
      timelineElement.addEventListener('touchstart', handleTouchStart, { passive: false });
      timelineElement.addEventListener('touchmove', handleTouchMove, { passive: false });
    }
    
    return () => {
      if (timelineElement) {
        timelineElement.removeEventListener('touchstart', handleTouchStart);
        timelineElement.removeEventListener('touchmove', handleTouchMove);
      }
    };
  }, [currentSectionIndex, ticking]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        updateSection(currentSectionIndex + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        updateSection(currentSectionIndex - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentSectionIndex]);

  // Check for image loading
  useEffect(() => {
    const checkImagesLoaded = () => {
      document.querySelectorAll('.parallax-bg').forEach(bg => {
        // Check if background image has loaded
        const backgroundStyle = window.getComputedStyle(bg as Element).backgroundImage;
        const url = backgroundStyle.replace(/url\(['"](.+)['"]\)/, '$1');
        const img = new Image();
        img.src = url;
        
        if (!img.complete) {
          (bg as HTMLElement).style.display = 'none';
          const parentDiv = (bg as HTMLElement).parentElement;
          if (parentDiv) {
            const svgElement = parentDiv.querySelector('.historical-svg');
            if (svgElement) {
              (svgElement as HTMLElement).style.display = 'block';
            }
          }
        }
      });
    };

    // Check after 3 seconds
    const timer = setTimeout(checkImagesLoaded, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-20 bg-gray-100 relative" id="historical-timeline">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Our Historical Journey
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore the evolution of our dockyard through key moments in history.
          </p>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Timeline sidebar */}
          <div className="w-full md:w-1/4 mb-8 md:mb-0 relative">
            <div className="bg-blue-100 rounded-lg h-full p-6 relative">
              <div className="border-l-2 border-blue-500 h-4/5 absolute left-1/2 top-16 transform -translate-x-1/2"></div>
              
              {/* Timeline cursor */}
              <div 
                id="timeline-cursor" 
                className="w-6 h-6 bg-blue-600 rounded-full absolute left-1/2 transform -translate-x-1/2 shadow-lg transition-all duration-500"
                style={{ top: `${sections[currentSectionIndex].position}%` }}
              ></div>
              
              {/* Timeline dates */}
              {sections.map((section, index) => (
                <div 
                  key={section.year}
                  id={section.dateId}
                  className={`timeline-date cursor-pointer mb-8 relative z-10 ${
                    index === currentSectionIndex ? 'active-date' : ''
                  }`}
                  style={{ marginTop: index === 0 ? '0' : '20%' }}
                  onClick={() => updateSection(index)}
                >
                  <div className={`
                    flex items-center transition-all duration-300
                    ${index === currentSectionIndex ? 'text-blue-600 font-bold' : 'text-gray-500'}
                  `}>
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center mr-2
                      ${index === currentSectionIndex ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}
                    `}>
                      {String(index + 1)}
                    </div>
                    <span className="text-lg">{section.year}</span>
                  </div>
                  <div className="mt-2 ml-10">
                    <h3 className={`text-lg ${index === currentSectionIndex ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}>
                      {section.title}
                    </h3>
                  </div>
                </div>
              ))}
              
              {/* Scroll indicator */}
              <div className="scroll-indicator absolute bottom-4 left-1/2 transform -translate-x-1/2 text-blue-500 text-xs flex flex-col items-center transition-opacity duration-500">
                <span>Scroll to explore</span>
                <svg className="w-5 h-5 animate-bounce mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>
          
          {/* Content area */}
          <div className="w-full md:w-3/4 relative h-[500px] overflow-hidden rounded-lg shadow-xl">
            {sections.map((section, index) => (
              <div 
                key={section.id}
                id={section.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  index === currentSectionIndex ? 'active-section opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                {/* Parallax background */}
                <div 
                  id={section.parallaxId}
                  className={`parallax-bg absolute inset-0 transition-transform duration-500 ease-out ${section.bgColor}`}
                >
                  <HistoricalShip year={section.year} />
                </div>
                
                {/* SVG fallback if image fails */}
                <div 
                  id={`svg-${section.id}`}
                  className="historical-svg absolute inset-0 bg-blue-200 hidden flex items-center justify-center"
                >
                  <svg className="w-1/2 h-1/2 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 18.5V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H19C20.1 3 21 3.9 21 5V5.5M21 14.5V18.5M21 10.5V14.5M21 5V9.5M10.91 8.5L8.5 11M8.5 8.5L10.91 11"></path>
                  </svg>
                </div>
                
                {/* Content overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-transparent flex items-center">
                  <div 
                    id={section.imageId}
                    className="text-white p-10 max-w-md transition-opacity duration-700"
                    style={{ opacity: index === currentSectionIndex ? '1' : '0' }}
                  >
                    <h3 className="text-3xl md:text-4xl font-bold mb-4">{section.title}</h3>
                    <h4 className="text-2xl text-blue-200 mb-6">{section.year}</h4>
                    <p className="text-lg text-blue-50">{section.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;