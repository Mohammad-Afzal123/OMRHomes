
import React, { useEffect, useRef } from 'react';
import { Star, Quote } from 'lucide-react';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Software Engineer at TCS",
    content: "The AI-powered search was incredibly helpful. Found my dream 2BHK in Thoraipakkam within a week of searching!",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=32",
  },
  {
    id: 2,
    name: "Vikram Mehta",
    role: "Product Manager at Zoho",
    content: "The neighborhood insights and price prediction tools helped me make an informed decision. Saved at least 10% on my purchase.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=67",
  },
  {
    id: 3,
    name: "Aisha Khan",
    role: "UX Designer at Infosys",
    content: "Virtual tours saved me so much time. I was able to shortlist properties without physically visiting each one.",
    rating: 4,
    avatar: "https://i.pravatar.cc/150?img=47",
  },
  {
    id: 4,
    name: "Rahul Reddy",
    role: "Data Scientist at Amazon",
    content: "The value score feature is brilliant - it helped me identify which properties were actually worth the price in OMR.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=68",
  },
];

const Testimonials = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const cards = document.querySelectorAll('.testimonial-card');
    cards.forEach((card) => {
      observer.observe(card);
    });

    return () => {
      cards.forEach((card) => {
        observer.unobserve(card);
      });
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 px-6 relative overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, #0c4a6e, #0c4a6e)',
      }}
    >
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
                <path d="M 8 0 L 0 0 0 8" fill="none" stroke="white" strokeWidth="0.5"></path>
              </pattern>
            </defs>
            <rect x="0" y="0" width="100" height="100" fill="url(#grid)"></rect>
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 opacity-0 animate-fade-in">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white/90 mb-4">
            <span className="text-sm font-medium">Client Success Stories</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            What Our Happy Customers Say
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Real stories from real clients who found their perfect 2BHK apartments in OMR using our AI-powered platform.
          </p>
        </div>

        <Carousel className="w-full max-w-5xl mx-auto">
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/2">
                <div 
                  className="testimonial-card opacity-0 h-full"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 h-full flex flex-col hover:transform hover:scale-105 transition-all duration-300 group">
                    <div className="mb-4">
                      <Quote className="text-electric-light w-8 h-8 opacity-40" />
                    </div>
                    
                    <p className="text-white/90 mb-6 flex-grow">{testimonial.content}</p>
                    
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < testimonial.rating ? 'text-electric-light fill-electric-light' : 'text-white/30'}`} 
                        />
                      ))}
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-electric-light mr-4 group-hover:border-white transition-colors duration-300">
                        <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{testimonial.name}</h4>
                        <p className="text-white/60 text-sm">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-8">
            <CarouselPrevious className="relative static -left-0 bg-white/10 text-white hover:bg-white/20 border-white/20" />
            <CarouselNext className="relative static -right-0 bg-white/10 text-white hover:bg-white/20 border-white/20 ml-4" />
          </div>
        </Carousel>

        <div className="text-center mt-16">
          <button className="py-3 px-8 rounded-full bg-white text-electric-dark font-medium hover:bg-white/90 transition-colors animate-pulse-soft">
            Read More Success Stories
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
