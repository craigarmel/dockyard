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
      className="bg-white rounded-xl shadow-lg p-6 opacity-0 translate-y-10 transition-all duration-700"
    >
      <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
        <div className="text-blue-600 text-3xl">{icon}</div>
      </div>
      <h3 className="text-xl font-bold mb-3 text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
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
      icon: "🚢",
      title: "Web Development",
      description: "We build responsive, fast, and scalable web applications using modern technologies.",
      delay: 100
    },
    {
      icon: "⚓",
      title: "Mobile Apps",
      description: "Native and cross-platform mobile applications that work seamlessly on all devices.",
      delay: 200
    },
    {
      icon: "🌊",
      title: "UI/UX Design",
      description: "User-centered design that focuses on creating intuitive and beautiful interfaces.",
      delay: 300
    },
    {
      icon: "🧭",
      title: "Cloud Solutions",
      description: "Scalable cloud infrastructure and DevOps solutions for your growing business.",
      delay: 400
    },
    {
      icon: "🔍",
      title: "SEO & Marketing",
      description: "Digital marketing strategies to increase your online visibility and attract customers.",
      delay: 500
    },
    {
      icon: "🛟",
      title: "Maintenance & Support",
      description: "Ongoing support and maintenance to keep your digital products running smoothly.",
      delay: 600
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div 
          ref={headingRef}
          className="text-center mb-16 opacity-0 transition-opacity duration-1000"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Services</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We offer a comprehensive range of digital services to help your business navigate the digital waters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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