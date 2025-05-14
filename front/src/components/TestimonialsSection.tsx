import React, { useState, useEffect, useRef } from 'react';

interface TestimonialProps {
  content: string;
  author: string;
  position: string;
  company: string;
  active: boolean;
}

const Testimonial: React.FC<TestimonialProps> = ({ content, author, position, company, active }) => {
  return (
    <div 
      className={`absolute top-0 left-0 w-full transition-all duration-700 ease-in-out ${
        active ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
      }`}
    >
      <div className="bg-white rounded-xl shadow-lg p-8 md:p-10">
        <div className="text-blue-600 mb-6">
          <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.192 15.757c0-.88-.23-1.618-.69-2.217-.326-.412-.768-.683-1.327-.812-.55-.128-1.07-.137-1.54-.028-.16-.95.1-1.95.41-3 .96-3.22 3.59-5.39 3.66-5.46.02-.02.04-.03.03-.05-.03-.07-.9-.26-1.78-.37C7.43 3.27 6.41 3.74 5.72 4.3c-.7.58-2.34 2.88-3.02 6.16-.43 2.08-.46 3.81-.13 5.19.33 1.46 1.05 2.47 2.15 3.01.56.28 1.21.42 1.88.42.26 0 .52-.03.77-.08 2.54-.5 3.82-2.58 3.82-5.24zm10.9-9.76c.02-.03.03-.04.02-.05-.02-.08-.9-.26-1.78-.37-2.57-.48-3.59 0-4.28.55-.7.58-2.34 2.88-3.02 6.16-.43 2.08-.46 3.81-.13 5.19.33 1.46 1.05 2.47 2.15 3.01.56.27 1.22.42 1.88.42.26 0 .52-.03.77-.08 2.55-.5 3.82-2.58 3.82-5.25 0-.88-.23-1.61-.69-2.21-.34-.42-.78-.68-1.33-.81-.55-.13-1.07-.14-1.54-.03-.15-.95.1-1.95.41-3 .96-3.22 3.59-5.39 3.66-5.46.08-.1.12-.17.07-.24z"></path>
          </svg>
        </div>
        <p className="text-lg md:text-xl text-gray-600 mb-8">{content}</p>
        <div className="flex items-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-lg">
            {author.charAt(0)}
          </div>
          <div className="ml-4">
            <p className="font-bold text-gray-800">{author}</p>
            <p className="text-gray-500 text-sm">{position}, {company}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef(null);
  const testimonialContainerRef = useRef<HTMLDivElement>(null);

  const testimonials = [
    {
      content: "Working with Dockyard was a game-changer for our business. They delivered a beautiful, functional website that perfectly captures our brand and has significantly increased our online presence.",
      author: "Sarah Johnson",
      position: "CEO",
      company: "StyleTech"
    },
    {
      content: "The team at Dockyard exceeded our expectations in every way. Their attention to detail and innovative approach to problem-solving made our app development process smooth and successful.",
      author: "Michael Chen",
      position: "CTO",
      company: "InnovateTech"
    },
    {
      content: "We've worked with several development agencies before, but none have matched the level of professionalism and technical expertise that Dockyard brings to the table. Highly recommended!",
      author: "Jessica Lee",
      position: "Marketing Director",
      company: "GrowthBox"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (testimonialContainerRef.current) {
            testimonialContainerRef.current.classList.add('opacity-100');
            testimonialContainerRef.current.classList.remove('opacity-0');
            testimonialContainerRef.current.classList.add('translate-y-0');
            testimonialContainerRef.current.classList.remove('translate-y-20');
          }
        }
      },
      { threshold: 0.1 }
    );

    if (testimonialContainerRef.current) {
      observer.observe(testimonialContainerRef.current);
    }

    return () => {
      clearInterval(interval);
      if (testimonialContainerRef.current) {
        observer.unobserve(testimonialContainerRef.current);
      }
    };
  }, [testimonials.length]);

  return (
    <section ref={sectionRef} className="py-20 bg-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it - hear from some of our satisfied clients.
          </p>
        </div>

        <div 
          ref={testimonialContainerRef}
          className="max-w-3xl mx-auto opacity-0 translate-y-20 transition-all duration-1000"
        >
          <div className="relative h-80">
            {testimonials.map((testimonial, index) => (
              <Testimonial
                key={index}
                content={testimonial.content}
                author={testimonial.author}
                position={testimonial.position}
                company={testimonial.company}
                active={index === activeIndex}
              />
            ))}
          </div>

          <div className="flex justify-center mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 mx-2 rounded-full transition-all duration-300 ${
                  index === activeIndex ? 'bg-blue-600 w-6' : 'bg-blue-300'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;