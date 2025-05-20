import { useEffect, useRef } from 'react';

interface ServiceCardProps {
  icon: string;
  title: string;
  description: string;
  delay: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, description, delay }) => {
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            if (cardRef.current) {
              cardRef.current.classList.add('opacity-100');
              cardRef.current.classList.remove('opacity-0');
              cardRef.current.classList.add('translate-y-0');
              cardRef.current.classList.remove('translate-y-10');
            }
          }, delay);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [delay]);

  return (
    <div
      ref={cardRef}
      className="bg-gradient-to-b from-[#05070f] to-[#0a2347] border border-blue-900 rounded-xl shadow-lg p-6 opacity-0 translate-y-10 transition-all duration-700"
    >
      <div className="w-16 h-16 bg-blue-950 rounded-lg flex items-center justify-center mb-6">
      <div className="text-blue-400 text-3xl">{icon}</div>
      </div>
      <h3 className="text-xl font-bold mb-3 text-[#fff]">{title}</h3>
      <p className="text-[#b3c6e0]">{description}</p>
    </div>
  );
};

const ServicesSection = () => {
  const headingRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (headingRef.current) {
            headingRef.current.classList.add('opacity-100');
            headingRef.current.classList.remove('opacity-0');
          }
        }
      },
      { threshold: 0.1 }
    );

    if (headingRef.current) {
      observer.observe(headingRef.current);
    }

    return () => {
      if (headingRef.current) {
        observer.unobserve(headingRef.current);
      }
    };
  }, []);

  const services = [
    {
      icon: "🔎",
      title: "Marine Search Bar",
      description: "Quickly find your documents with an intuitive search bar, inspired by maritime navigation.",
      delay: 100
    },
    {
      icon: "📄",
      title: "Document Presentation",
      description: "Elegant and organized display of your documents, with a dark marine theme for an immersive experience.",
      delay: 200
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-[#05070f] to-[#10182b]">
      <div className="container mx-auto px-4">
        <div 
          ref={headingRef}
          className="text-center mb-16 opacity-0 transition-opacity duration-1000"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#fff] mb-4">Our Services</h2>
          <p className="text-xl text-[#b3c6e0] max-w-2xl mx-auto">
            Navigate your documents in style with our dark marine interface.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              delay={service.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
