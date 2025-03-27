
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Brain, MapPin, Search, BarChart3, Compass, Zap } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Insights',
    description: 'Our advanced algorithms analyze thousands of properties to find the best value deals from reputed developers.'
  },
  {
    icon: MapPin,
    title: 'Location Intelligence',
    description: 'Get detailed insights about neighborhoods, proximity to workplaces, schools, and essential services.'
  },
  {
    icon: Search,
    title: 'Smart Search & Filters',
    description: 'Use natural language to find your dream home. "Show me 2BHK flats near tech parks with a swimming pool."'
  },
  {
    icon: BarChart3,
    title: 'Price Trend Analysis',
    description: 'Track historical price trends and future projections to make informed investment decisions.'
  },
  {
    icon: Compass,
    title: 'Virtual Property Tours',
    description: 'Explore properties from the comfort of your home with immersive 3D tours and walkthrough videos.'
  },
  {
    icon: Zap,
    title: 'Real-Time Notifications',
    description: 'Get instant alerts when properties matching your criteria are listed or when prices change.'
  }
];

const Features = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-scale-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    featureRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      featureRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 px-6 relative overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, #f8fafc, #f1f5f9)',
      }}
    >
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-electric/5 blur-3xl"></div>
          <div className="absolute top-1/2 -left-20 w-60 h-60 rounded-full bg-coral/5 blur-3xl"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 opacity-0 animate-fade-in">
          <div className="inline-flex items-center space-x-2 bg-neutral-200/80 backdrop-blur-sm px-4 py-2 rounded-full text-neutral-700 mb-4">
            <span className="text-sm font-medium">Platform Features</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">
            Discover Our AI-Powered Capabilities
          </h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Leveraging cutting-edge artificial intelligence to transform how you search, compare and choose your perfect home in OMR.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              ref={(el) => (featureRefs.current[index] = el)}
              className={cn(
                "bg-white border border-neutral-200/50 rounded-xl p-6 opacity-0",
                "transform transition-all duration-500 ease-out",
                "hover:shadow-lg hover:border-electric/20 hover:-translate-y-1",
                "flex flex-col"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mb-4 p-3 rounded-lg bg-electric/10 w-fit">
                <feature.icon className="w-6 h-6 text-electric" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">{feature.title}</h3>
              <p className="text-neutral-600 flex-grow">{feature.description}</p>
              
              <div className="h-px w-full bg-neutral-100 my-4"></div>
              
              <div className="flex justify-between items-center pt-2">
                <span className="text-xs text-neutral-500">Learn more</span>
                <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-600">
                    <path d="M5 12h14"></path>
                    <path d="M12 5l7 7-7 7"></path>
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
