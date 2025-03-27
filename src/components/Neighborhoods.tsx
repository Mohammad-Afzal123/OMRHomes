import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Building, Home, Clock, Leaf, ShoppingBag, TrendingUp, ChevronRight } from 'lucide-react';

const neighborhoods = [
  {
    name: 'Thoraipakkam',
    description: 'A bustling IT hub with excellent connectivity and a wide range of amenities.',
    icon: Building,
    valueScore: 87,
    commuteTime: '20 min',
    greenery: 'Moderate',
    shopping: 'High',
    growth: '+15%'
  },
  {
    name: 'Navalur',
    description: 'Known for its serene environment and proximity to major IT companies.',
    icon: Home,
    valueScore: 78,
    commuteTime: '25 min',
    greenery: 'High',
    shopping: 'Medium',
    growth: '+12%'
  },
  {
    name: 'Sholinganallur',
    description: 'A well-developed residential area with good schools and healthcare facilities.',
    icon: MapPin,
    valueScore: 82,
    commuteTime: '15 min',
    greenery: 'Moderate',
    shopping: 'High',
    growth: '+18%'
  },
  {
    name: 'Siruseri',
    description: 'Home to SIPCOT IT Park, offering a mix of residential and commercial spaces.',
    icon: Clock,
    valueScore: 76,
    commuteTime: '30 min',
    greenery: 'Low',
    shopping: 'Medium',
    growth: '+10%'
  },
  {
    name: 'Pallikaranai',
    description: 'A rapidly developing area with a focus on sustainable living and green spaces.',
    icon: Leaf,
    valueScore: 74,
    commuteTime: '35 min',
    greenery: 'High',
    shopping: 'Low',
    growth: '+8%'
  },
  {
    name: 'Perumbakkam',
    description: 'An emerging residential area with affordable housing options and essential amenities.',
    icon: ShoppingBag,
    valueScore: 79,
    commuteTime: '40 min',
    greenery: 'Moderate',
    shopping: 'Medium',
    growth: '+14%'
  }
];

const Neighborhoods = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeNeighborhood, setActiveNeighborhood] = useState(neighborhoods[0]);
  const [isMapVisible, setIsMapVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            observer.unobserve(entry.target);
            
            // Add staggered animation to neighborhood cards
            const cards = document.querySelectorAll('.neighborhood-card');
            cards.forEach((card, index) => {
              setTimeout(() => {
                card.classList.add('animate-fade-in');
                card.classList.remove('opacity-0');
              }, index * 100 + 200);
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Show detailed analysis for a neighborhood
  const handleNeighborhoodClick = (neighborhood: typeof neighborhoods[0]) => {
    setActiveNeighborhood(neighborhood);
    setIsMapVisible(true);
  };

  return (
    <section id="neighborhoods" ref={sectionRef} className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 opacity-0">
          <div className="inline-flex items-center space-x-2 bg-electric/10 px-4 py-2 rounded-full text-electric mb-4">
            <span className="text-sm font-medium">Explore OMR</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">
            Discover Neighborhoods
          </h2>
          <p className="text-neutral-500 max-w-2xl mx-auto">
            Explore the best neighborhoods in Old Mahabalipuram Road (OMR), Chennai. Find the perfect location based on commute time, greenery, shopping, and value score.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {neighborhoods.map((neighborhood, index) => (
            <div 
              key={neighborhood.name} 
              className="neighborhood-card bg-neutral-50 rounded-xl p-6 border border-neutral-100 opacity-0 hover:shadow-md transition-all hover:border-electric/50 cursor-pointer"
              style={{ animationDelay: `${index * 100 + 200}ms` }}
              onClick={() => handleNeighborhoodClick(neighborhood)}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-electric/10 text-electric flex items-center justify-center mr-4">
                  <neighborhood.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-neutral-900">{neighborhood.name}</h3>
                </div>
              </div>
              <p className="text-neutral-600 mb-4">{neighborhood.description}</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-neutral-500">Value Score: </span>
                  <span className="font-medium text-neutral-800">{neighborhood.valueScore}</span>
                </div>
                <div>
                  <span className="text-neutral-500">Commute: </span>
                  <span className="font-medium text-neutral-800">{neighborhood.commuteTime}</span>
                </div>
                <div>
                  <span className="text-neutral-500">Greenery: </span>
                  <span className="font-medium text-neutral-800">{neighborhood.greenery}</span>
                </div>
                <div>
                  <span className="text-neutral-500">Shopping: </span>
                  <span className="font-medium text-neutral-800">{neighborhood.shopping}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-neutral-200 flex items-center justify-between">
                <div className="flex items-center text-emerald-500">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span className="text-xs font-medium">Growth {neighborhood.growth}</span>
                </div>
                <button className="text-electric flex items-center text-sm font-medium hover:translate-x-1 transition-transform">
                  <span>View Details</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {isMapVisible && (
          <div className="mt-12 pt-12 border-t border-neutral-200 animate-fade-in">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/3 bg-neutral-50 p-6 rounded-xl border border-neutral-100">
                <h3 className="text-xl font-medium text-neutral-900 mb-4">{activeNeighborhood.name} Analysis</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-neutral-500 mb-2">Value Score</h4>
                    <div className="relative h-3 bg-neutral-200 rounded-full overflow-hidden">
                      <div 
                        className="absolute top-0 left-0 h-full bg-electric rounded-full transition-all duration-500"
                        style={{ width: `${activeNeighborhood.valueScore}%` }}
                      ></div>
                    </div>
                    <div className="mt-1 flex justify-between text-xs">
                      <span>0</span>
                      <span className="font-medium">{activeNeighborhood.valueScore}/100</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-neutral-500 mb-2">Connectivity</h4>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-3 bg-white rounded-lg border border-neutral-200">
                        <div className="text-lg font-medium text-neutral-900">{activeNeighborhood.commuteTime}</div>
                        <div className="text-xs text-neutral-500">Avg. Commute</div>
                      </div>
                      <div className="p-3 bg-white rounded-lg border border-neutral-200">
                        <div className="text-lg font-medium text-neutral-900">4</div>
                        <div className="text-xs text-neutral-500">Bus Routes</div>
                      </div>
                      <div className="p-3 bg-white rounded-lg border border-neutral-200">
                        <div className="text-lg font-medium text-neutral-900">15</div>
                        <div className="text-xs text-neutral-500">Min to Highway</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-neutral-500 mb-2">Livability Factors</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs">Schools</span>
                          <span className="text-xs font-medium">8/10</span>
                        </div>
                        <div className="relative h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                          <div className="absolute top-0 left-0 h-full bg-blue-500 rounded-full" style={{ width: '80%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs">Healthcare</span>
                          <span className="text-xs font-medium">7/10</span>
                        </div>
                        <div className="relative h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                          <div className="absolute top-0 left-0 h-full bg-green-500 rounded-full" style={{ width: '70%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs">Entertainment</span>
                          <span className="text-xs font-medium">9/10</span>
                        </div>
                        <div className="relative h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                          <div className="absolute top-0 left-0 h-full bg-purple-500 rounded-full" style={{ width: '90%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs">Safety</span>
                          <span className="text-xs font-medium">8.5/10</span>
                        </div>
                        <div className="relative h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                          <div className="absolute top-0 left-0 h-full bg-amber-500 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-neutral-500 mb-2">Investment Potential</h4>
                    <div className="p-4 bg-gradient-to-r from-electric/10 to-blue-500/10 rounded-lg">
                      <div className="flex items-center mb-2">
                        <TrendingUp className="w-4 h-4 text-emerald-500 mr-2" />
                        <span className="text-sm font-medium">Growth Prediction</span>
                      </div>
                      <p className="text-xs text-neutral-600">
                        Properties in {activeNeighborhood.name} are projected to appreciate by 
                        <span className="font-medium text-emerald-500"> {activeNeighborhood.growth}</span> over the next 5 years.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-2/3 bg-neutral-50 p-4 rounded-xl border border-neutral-100 relative min-h-[400px]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-neutral-500">
                    Interactive map placeholder - The neighborhood map will be displayed here.
                  </p>
                </div>
                
                <div className="absolute bottom-4 left-4 right-4 bg-white p-4 rounded-lg shadow-md border border-neutral-200">
                  <h4 className="text-sm font-medium text-neutral-900 mb-2">Available Properties in {activeNeighborhood.name}</h4>
                  <div className="flex overflow-x-auto space-x-4 pb-2">
                    <div className="flex-shrink-0 w-64 bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                      <div className="text-electric font-medium mb-1">Prestige Lakeside Habitat</div>
                      <div className="text-sm text-neutral-600 mb-2">2 BHK - 1275 sq ft</div>
                      <div className="text-sm font-medium">₹95.00 L</div>
                    </div>
                    <div className="flex-shrink-0 w-64 bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                      <div className="text-electric font-medium mb-1">Casagrand Luxus</div>
                      <div className="text-sm text-neutral-600 mb-2">2 BHK - 1180 sq ft</div>
                      <div className="text-sm font-medium">₹82.00 L</div>
                    </div>
                    <div className="flex-shrink-0 w-64 bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                      <div className="text-electric font-medium mb-1">DLF Garden City</div>
                      <div className="text-sm text-neutral-600 mb-2">2 BHK - 1350 sq ft</div>
                      <div className="text-sm font-medium">₹1.05 Cr</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Neighborhoods;
