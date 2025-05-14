import { useEffect, useRef } from 'react';

const FeaturesSection = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const imageRef = useRef<HTMLElement | null>(null);
  const textRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (entry.target === imageRef.current) {
              entry.target.classList.add('opacity-100', 'translate-x-0');
              entry.target.classList.remove('opacity-0', '-translate-x-20');
            }
            if (entry.target === textRef.current) {
              entry.target.classList.add('opacity-100', 'translate-x-0');
              entry.target.classList.remove('opacity-0', 'translate-x-20');
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }
    if (textRef.current) {
      observer.observe(textRef.current);
    }

    return () => {
      if (imageRef.current) {
        observer.unobserve(imageRef.current);
      }
      if (textRef.current) {
        observer.unobserve(textRef.current);
      }
    };
  }, []);

  const features = [
    {
      title: "Fast Development",
      description: "We use modern tools and methodologies to deliver your projects quickly without compromising quality."
    },
    {
      title: "Responsive Design",
      description: "All our solutions work perfectly on any device, from desktops to mobile phones."
    },
    {
      title: "Scalable Solutions",
      description: "Our architecture ensures your applications can grow alongside your business."
    },
    {
      title: "Ongoing Support",
      description: "We don't just build and leave - we provide continuous support and improvements."
    }
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div 
            className="opacity-0 -translate-x-20 transition-all duration-1000 ease-out"
          >
            <div className="relative">
              {/* Main illustration or image */}
              <div className="rounded-lg shadow-2xl overflow-hidden">
                <div className="bg-blue-600 aspect-video rounded-lg flex items-center justify-center">
                  <svg className="w-1/2 h-1/2 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 16V8a5 5 0 0 0-5-5H8a5 5 0 0 0-5 5v8a5 5 0 0 0 5 5h8a5 5 0 0 0 5-5ZM3.029 13.848c-.199-.496-.288-1.014-.029-1.672.298-.764 1.086-1.105 2.238-1.105.51 0 1.125.062 1.813.186V9a.75.75 0 0 1 1.5 0v.5h5.598a.75.75 0 0 1 0 1.5H8.55v1.543C10.389 13.29 12.5 14 14.5 14c1.139 0 2.571-.304 3.5-1.017V11a.75.75 0 0 1 1.5 0v2.75c0 .659-.354 1.268-.958 1.745-.918.728-2.302 1.505-4.042 1.505-2.419 0-4.679-.899-6.905-2.152ZM5.953 6.602a.5.5 0 1 1 .094-.993 18.46 18.46 0 0 0 3.406 0 .5.5 0 1 1 .094.993 19.471 19.471 0 0 1-3.594 0Z" />
                  </svg>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -bottom-5 -right-5 w-24 h-24 bg-blue-100 rounded-lg animate-pulse z-0"></div>
              <div className="absolute -top-5 -left-5 w-16 h-16 bg-blue-200 rounded-full animate-bounce" style={{ animationDuration: '3s' }}></div>
            </div>
          </div>

          <div 
            className="opacity-0 translate-x-20 transition-all duration-1000 ease-out"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Why Choose Our <span className="text-blue-600">Dockyard</span>?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              We combine technical expertise with creative solutions to build digital products that stand out in today's competitive market. Our team of experienced developers and designers work together to deliver exceptional results.
            </p>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold text-gray-800">{feature.title}</h3>
                    <p className="text-gray-600 mt-1">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;