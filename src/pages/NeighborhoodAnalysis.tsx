import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Neighborhoods from '@/components/Neighborhoods';
import { Link } from 'react-router-dom';
import { Building, ChevronRight, MapPin, TrendingUp, Home, School, Hospital, Coffee, ShoppingBag, Star } from 'lucide-react';
import PropertyMap from '@/components/PropertyMap';
import { toggleAIAssistant } from '@/lib/ai-helper';

interface Neighborhood {
  id: string;
  name: string;
  location: string;
  description: string;
  priceRange: string;
  valueScore: number;
  growthPotential: number;
  connectivity: number;
  amenities: number;
  image: string;
  properties: number;
}

const neighborhoods: Neighborhood[] = [
  {
    id: 'thoraipakkam',
    name: 'Thoraipakkam',
    location: 'North OMR',
    description: 'A vibrant IT hub with excellent connectivity to major tech parks. Popular among young professionals.',
    priceRange: '₹7,500 - ₹9,000 per sq.ft',
    valueScore: 87,
    growthPotential: 92,
    connectivity: 90,
    amenities: 85,
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=2074&auto=format&fit=crop',
    properties: 56
  },
  {
    id: 'navalur',
    name: 'Navalur',
    location: 'Mid OMR',
    description: 'A rapidly developing area with excellent infrastructure and proximity to IT corridors.',
    priceRange: '₹6,800 - ₹8,500 per sq.ft',
    valueScore: 82,
    growthPotential: 95,
    connectivity: 80,
    amenities: 78,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop',
    properties: 78
  },
  {
    id: 'siruseri',
    name: 'Siruseri',
    location: 'South OMR',
    description: 'Home to SIPCOT IT Park with growing residential developments and good investment potential.',
    priceRange: '₹6,200 - ₹7,800 per sq.ft',
    valueScore: 76,
    growthPotential: 88,
    connectivity: 75,
    amenities: 70,
    image: 'https://images.unsplash.com/photo-1628744448840-6b48f8417a53?q=80&w=2070&auto=format&fit=crop',
    properties: 42
  },
  {
    id: 'kelambakkam',
    name: 'Kelambakkam',
    location: 'South OMR',
    description: 'An emerging residential hub with affordable housing options and good infrastructure.',
    priceRange: '₹5,800 - ₹7,200 per sq.ft',
    valueScore: 74,
    growthPotential: 90,
    connectivity: 70,
    amenities: 65,
    image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=2070&auto=format&fit=crop',
    properties: 38
  }
];

interface AmenityInfo {
  icon: React.ReactNode;
  name: string;
  count: number;
}

interface PropertyTrend {
  year: number;
  price: number;
}

const NeighborhoodAnalysis = () => {
  const [selectedLocation, setSelectedLocation] = useState('Pallikaranai');
  
  // Handle property selection from map
  const handlePropertySelect = (propertyId: string) => {
    console.log(`Selected property: ${propertyId}`);
    // Implement property selection logic
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main>
        <section className="py-16 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-electric/10 px-4 py-2 rounded-full text-electric mb-4">
                <span className="text-sm font-medium">Area Insights</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-display font-bold text-neutral-900 mb-4">
                Neighborhood Analysis
              </h1>
              <p className="text-neutral-500 max-w-2xl mx-auto">
                Explore detailed analytics about different neighborhoods in Chennai. Compare livability scores, connectivity, amenities, and growth potential.
              </p>
        </div>
        
            <div className="mb-12">
              <div className="p-4 bg-neutral-50 rounded-lg overflow-x-auto">
                <div className="flex flex-nowrap space-x-4 min-w-max">
                  {neighborhoods.map(neighborhood => (
                    <button
                        key={neighborhood.id}
                      className={`px-6 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                        selectedLocation === neighborhood.name 
                          ? 'bg-electric text-white' 
                          : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
                      }`}
                      onClick={() => setSelectedLocation(neighborhood.name)}
                    >
                      {neighborhood.name}
                    </button>
                    ))}
                  </div>
                </div>
              </div>
              
            {/* Display neighborhood data */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-6">
                {/* Value Score Card */}
                <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-neutral-900 mb-4">{selectedLocation} Analysis</h3>
                  
                  <div className="space-y-6">
                      <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-neutral-600">Value Score</span>
                        <span className="font-medium text-electric">{neighborhoods.find(n => n.name === selectedLocation)?.valueScore}/100</span>
                      </div>
                      <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                        <div className="h-full bg-electric rounded-full" style={{ width: `${neighborhoods.find(n => n.name === selectedLocation)?.valueScore}%` }}></div>
                      </div>
                        </div>
                    
                    <div className="pt-4 border-t border-neutral-100">
                      <h4 className="text-neutral-800 font-medium mb-4">Connectivity</h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-neutral-50 rounded-lg p-4 text-center">
                          <div className="text-xl font-semibold text-neutral-900">{neighborhoods.find(n => n.name === selectedLocation)?.connectivity}</div>
                          <div className="text-xs text-neutral-500">Avg. Commute (min)</div>
                        </div>
                        <div className="bg-neutral-50 rounded-lg p-4 text-center">
                          <div className="text-xl font-semibold text-neutral-900">{neighborhoods.find(n => n.name === selectedLocation)?.amenities}</div>
                          <div className="text-xs text-neutral-500">Amenities</div>
                        </div>
                        <div className="bg-neutral-50 rounded-lg p-4 text-center">
                          <div className="text-xl font-semibold text-neutral-900">{neighborhoods.find(n => n.name === selectedLocation)?.growthPotential}/100</div>
                          <div className="text-xs text-neutral-500">Growth Potential</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-neutral-100">
                      <h4 className="text-neutral-800 font-medium mb-4">Livability Factors</h4>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-neutral-600">Schools</span>
                            <span className="text-sm font-medium text-neutral-900">{neighborhoods.find(n => n.name === selectedLocation)?.amenities}/10</span>
                          </div>
                          <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${neighborhoods.find(n => n.name === selectedLocation)?.amenities * 10}%` }}></div>
                          </div>
                            </div>
                            <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-neutral-600">Healthcare</span>
                            <span className="text-sm font-medium text-neutral-900">{neighborhoods.find(n => n.name === selectedLocation)?.amenities}/10</span>
                            </div>
                          <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 rounded-full" style={{ width: `${neighborhoods.find(n => n.name === selectedLocation)?.amenities * 10}%` }}></div>
                          </div>
                              </div>
                              <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-neutral-600">Entertainment</span>
                            <span className="text-sm font-medium text-neutral-900">{neighborhoods.find(n => n.name === selectedLocation)?.amenities}/10</span>
                          </div>
                          <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500 rounded-full" style={{ width: `${neighborhoods.find(n => n.name === selectedLocation)?.amenities * 10}%` }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-neutral-600">Safety</span>
                            <span className="text-sm font-medium text-neutral-900">{neighborhoods.find(n => n.name === selectedLocation)?.amenities}/10</span>
                          </div>
                          <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                            <div className="h-full bg-orange-500 rounded-full" style={{ width: `${neighborhoods.find(n => n.name === selectedLocation)?.amenities * 10}%` }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-neutral-100">
                      <h4 className="text-neutral-800 font-medium mb-2">Investment Potential</h4>
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center text-green-600 mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                          </svg>
                          <span className="font-medium">Growth Prediction</span>
                        </div>
                        <p className="text-sm text-neutral-700">
                          Properties in {selectedLocation} are projected to appreciate by <span className="text-green-600 font-medium">+8%</span> over the next 5 years.
                        </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
              <div className="lg:col-span-2">
                {/* Interactive Map */}
                <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm h-[600px]">
                  <PropertyMap onPropertySelect={handlePropertySelect} />
                </div>
                
                {/* Available Properties */}
                <div className="mt-6 bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-neutral-900 mb-4">
                    Available Properties in {selectedLocation}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    {neighborhoods.filter(n => n.name === selectedLocation).map((neighborhood) => (
                      <div key={neighborhood.id} className="border border-neutral-200 rounded-lg overflow-hidden">
                        <div className="p-4">
                          <h4 className="font-medium text-electric hover:text-electric-dark transition-colors">
                            {neighborhood.name}
                          </h4>
                          <div className="text-xs text-neutral-500 mt-1">{neighborhood.properties} properties</div>
                      </div>
                    </div>
                  ))}
                  </div>
                </div>
                
                {/* AI Chat Helper */}
                <div className="mt-6 bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-neutral-900 mb-2">Need Help?</h3>
                      <p className="text-neutral-600">Our AI assistant can answer your questions about this neighborhood in real-time.</p>
                    </div>
                    <button 
                      onClick={() => {
                        // Create global event to open AI assistant
                        const event = new CustomEvent('openAIAssistant', {
                          detail: { initialMessage: `Tell me more about ${selectedLocation}` }
                        });
                        window.dispatchEvent(event);
                      }}
                      className="inline-flex items-center px-6 py-3 bg-electric text-white rounded-lg hover:bg-electric-dark transition-colors"
                    >
                      <span className="mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 8V4H8"></path>
                          <rect width="16" height="12" x="4" y="8" rx="2"></rect>
                          <path d="M2 14h2"></path>
                          <path d="M20 14h2"></path>
                          <path d="M15 13v2"></path>
                          <path d="M9 13v2"></path>
                        </svg>
                      </span>
                      Start AI Chat
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default NeighborhoodAnalysis;
