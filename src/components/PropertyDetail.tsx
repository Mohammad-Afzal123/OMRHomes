
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Heart, Share, MapPin, Home, Bed, Bath, Ruler, Star, Coffee, School, Bus, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';

interface PropertyDetailProps {
  property: {
    id: string;
    title: string;
    location: string;
    price: number;
    pricePerSqft: number;
    images: string[];
    bedrooms: number;
    bathrooms: number;
    area: number;
    developer: string;
    valueScore: number;
    description: string;
    amenities: string[];
    floorPlan: string;
    possession: string;
    constructionStatus: string;
  };
  onClose: () => void;
}

const nearbyPlaces = [
  { type: 'coffee', name: 'Starbucks', distance: '0.5 km' },
  { type: 'coffee', name: 'Cafe Coffee Day', distance: '1.2 km' },
  { type: 'school', name: 'Delhi Public School', distance: '2.1 km' },
  { type: 'school', name: 'Chettinad Vidyashram', distance: '3.5 km' },
  { type: 'bus', name: 'Thoraipakkam Bus Stop', distance: '0.3 km' },
  { type: 'bus', name: 'IT Park Bus Terminal', distance: '1.7 km' },
];

const PropertyDetail = ({ property, onClose }: PropertyDetailProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} L`;
    } else {
      return `₹${price.toLocaleString()}`;
    }
  };

  const getIconForPlace = (type: string) => {
    switch (type) {
      case 'coffee': return Coffee;
      case 'school': return School;
      case 'bus': return Bus;
      default: return MapPin;
    }
  };

  return (
    <div className={`fixed inset-0 z-50 overflow-y-auto ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
      <div className="min-h-screen px-4 text-center">
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"></div>
        
        <div className="inline-block w-full max-w-6xl my-8 text-left align-middle transition-all transform bg-white rounded-2xl shadow-xl">
          <div className="sticky top-0 z-10 flex justify-between items-center p-6 border-b border-neutral-200 bg-white rounded-t-2xl">
            <button 
              onClick={onClose}
              className="flex items-center text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span>Back to Listings</span>
            </button>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setIsFavorite(!isFavorite)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isFavorite ? 'bg-red-50 text-red-500' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500' : ''}`} />
              </button>
              
              <button className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 hover:bg-neutral-200 transition-all">
                <Share className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left column - Images & Basic Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Image carousel */}
                <Carousel className="w-full rounded-xl overflow-hidden">
                  <CarouselContent>
                    {property.images.map((image, index) => (
                      <CarouselItem key={index} className="h-[400px]">
                        <div className="h-full w-full">
                          <img 
                            src={image} 
                            alt={`${property.title} - Image ${index + 1}`} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-4" />
                  <CarouselNext className="right-4" />
                </Carousel>
                
                {/* Property title & basic info */}
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h1 className="text-2xl font-bold text-neutral-900">{property.title}</h1>
                    <div className="flex items-center bg-electric/10 text-electric py-1 px-3 rounded-full">
                      <Star className="w-4 h-4 fill-electric mr-1" />
                      <span className="font-semibold">{property.valueScore}/100</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-neutral-500 mb-4">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{property.location}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-6 mb-6">
                    <div className="flex items-center">
                      <Bed className="w-5 h-5 text-neutral-400 mr-2" />
                      <span className="text-neutral-700">{property.bedrooms} Bedrooms</span>
                    </div>
                    <div className="flex items-center">
                      <Bath className="w-5 h-5 text-neutral-400 mr-2" />
                      <span className="text-neutral-700">{property.bathrooms} Bathrooms</span>
                    </div>
                    <div className="flex items-center">
                      <Ruler className="w-5 h-5 text-neutral-400 mr-2" />
                      <span className="text-neutral-700">{property.area} sq.ft</span>
                    </div>
                    <div className="flex items-center">
                      <Home className="w-5 h-5 text-neutral-400 mr-2" />
                      <span className="text-neutral-700">{property.developer}</span>
                    </div>
                  </div>
                  
                  {/* Tabs */}
                  <div className="border-b border-neutral-200 mb-6">
                    <div className="flex space-x-6">
                      {['overview', 'amenities', 'location', 'ai insights'].map((tab) => (
                        <button
                          key={tab}
                          className={`py-3 border-b-2 font-medium transition-colors ${
                            activeTab === tab
                              ? 'border-electric text-electric'
                              : 'border-transparent text-neutral-500 hover:text-neutral-900'
                          }`}
                          onClick={() => setActiveTab(tab)}
                        >
                          {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Tab content */}
                  <div>
                    {activeTab === 'overview' && (
                      <div className="space-y-6">
                        <p className="text-neutral-600">{property.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral-50 p-4 rounded-lg border border-neutral-100">
                          <div>
                            <span className="text-sm text-neutral-500">Possession</span>
                            <p className="font-medium text-neutral-900">{property.possession}</p>
                          </div>
                          <div>
                            <span className="text-sm text-neutral-500">Construction Status</span>
                            <p className="font-medium text-neutral-900">{property.constructionStatus}</p>
                          </div>
                          <div>
                            <span className="text-sm text-neutral-500">Price per sq.ft</span>
                            <p className="font-medium text-neutral-900">₹{property.pricePerSqft}</p>
                          </div>
                          <div>
                            <span className="text-sm text-neutral-500">Property Type</span>
                            <p className="font-medium text-neutral-900">Apartment</p>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="font-semibold text-lg text-neutral-900 mb-3">Floor Plan</h3>
                          <div className="border border-neutral-200 rounded-lg overflow-hidden">
                            <img 
                              src={property.floorPlan} 
                              alt="Floor Plan" 
                              className="w-full h-auto"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {activeTab === 'amenities' && (
                      <div>
                        <h3 className="font-semibold text-lg text-neutral-900 mb-4">Project Amenities</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {property.amenities.map((amenity, index) => (
                            <div key={index} className="flex items-center p-3 bg-neutral-50 rounded-lg border border-neutral-100">
                              <CheckCircle className="w-5 h-5 text-electric mr-2" />
                              <span className="text-neutral-700">{amenity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {activeTab === 'location' && (
                      <div className="space-y-6">
                        <div className="rounded-lg overflow-hidden h-64 border border-neutral-200">
                          <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d124406.49744933384!2d80.18107420016122!3d12.950237135428612!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a525b79de7f381b%3A0xffbb2dd48afe3f1b!2sOld%20Mahabalipuram%20Road%2C%20Chennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1635332914601!5m2!1sen!2sin" 
                            width="100%" 
                            height="100%" 
                            style={{ border: 0 }} 
                            allowFullScreen 
                            loading="lazy"
                            title="Property Map"
                          ></iframe>
                        </div>
                        
                        <div>
                          <h3 className="font-semibold text-lg text-neutral-900 mb-3">Nearby Places</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {nearbyPlaces.map((place, index) => {
                              const Icon = getIconForPlace(place.type);
                              return (
                                <div key={index} className="flex items-center p-3 bg-neutral-50 rounded-lg border border-neutral-100">
                                  <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center mr-3">
                                    <Icon className="w-4 h-4 text-neutral-600" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-neutral-800">{place.name}</p>
                                    <p className="text-sm text-neutral-500">{place.distance}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {activeTab === 'ai insights' && (
                      <div className="space-y-6">
                        <div className="bg-electric/5 border border-electric/20 rounded-lg p-6 relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                            <Sparkles className="w-full h-full text-electric" />
                          </div>
                          <div className="flex items-start mb-4">
                            <div className="w-10 h-10 rounded-full bg-electric/20 flex items-center justify-center mr-4">
                              <Sparkles className="w-5 h-5 text-electric" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg text-neutral-900">AI-Generated Value Analysis</h3>
                              <p className="text-neutral-600 text-sm">Updated 2 days ago</p>
                            </div>
                          </div>
                          
                          <div className="mb-6">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-neutral-700">Value Score</span>
                              <span className="font-medium text-electric">{property.valueScore}/100</span>
                            </div>
                            <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-electric rounded-full"
                                style={{ width: `${property.valueScore}%` }}
                              ></div>
                            </div>
                            <p className="text-sm text-neutral-500 mt-1">
                              This property is ranked in the <span className="font-medium text-electric">top 15%</span> for value in this area.
                            </p>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="bg-white p-4 rounded-lg border border-neutral-100">
                              <h4 className="font-medium text-neutral-900 mb-2">Price Analysis</h4>
                              <p className="text-neutral-600 text-sm">
                                At ₹{property.pricePerSqft}/sqft, this property is priced 
                                <span className="text-green-600 font-medium"> 8% below </span> 
                                the average for similar properties in {property.location}.
                              </p>
                            </div>
                            
                            <div className="bg-white p-4 rounded-lg border border-neutral-100">
                              <h4 className="font-medium text-neutral-900 mb-2">Appreciation Potential</h4>
                              <p className="text-neutral-600 text-sm">
                                Based on infrastructure developments and market trends, we predict a 
                                <span className="text-electric font-medium"> 12-15% appreciation </span> 
                                over the next 3 years.
                              </p>
                            </div>
                            
                            <div className="bg-white p-4 rounded-lg border border-neutral-100">
                              <h4 className="font-medium text-neutral-900 mb-2">Future Connectivity</h4>
                              <p className="text-neutral-600 text-sm">
                                The upcoming metro line (expected completion: 2026) will 
                                <span className="text-electric font-medium"> reduce commute time </span>
                                to the city center by approximately 30 minutes.
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-start p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                          <AlertCircle className="w-5 h-5 text-yellow-500 mr-3 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-neutral-900 mb-1">AI Disclaimer</h4>
                            <p className="text-sm text-neutral-600">
                              These insights are generated by our AI based on current market data and projections. 
                              Actual future performance may vary. Always consult with a real estate professional 
                              before making investment decisions.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Right column - Price & Contact */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <div className="bg-white rounded-xl shadow-lg border border-neutral-100 p-6 mb-6">
                    <div className="mb-4">
                      <span className="text-neutral-500 text-sm">Price</span>
                      <div className="text-2xl font-bold text-neutral-900">{formatPrice(property.price)}</div>
                      <div className="text-neutral-500 text-sm">₹{property.pricePerSqft} per sq.ft</div>
                    </div>
                    
                    <form className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">Your Name</label>
                        <input
                          id="name"
                          type="text"
                          className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:border-electric focus:ring-1 focus:ring-electric transition-colors"
                          placeholder="John Doe"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1">Phone Number</label>
                        <input
                          id="phone"
                          type="tel"
                          className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:border-electric focus:ring-1 focus:ring-electric transition-colors"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">Email Address</label>
                        <input
                          id="email"
                          type="email"
                          className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:border-electric focus:ring-1 focus:ring-electric transition-colors"
                          placeholder="john@example.com"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-1">Message</label>
                        <textarea
                          id="message"
                          rows={3}
                          className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:border-electric focus:ring-1 focus:ring-electric transition-colors"
                          placeholder="I'm interested in this property and would like to know more details."
                          defaultValue="I'm interested in this property and would like to know more details."
                        ></textarea>
                      </div>
                      
                      <button
                        type="submit"
                        className="w-full py-3 px-6 bg-electric hover:bg-electric-dark text-white font-medium rounded-lg transition-colors flex items-center justify-center"
                      >
                        Contact Agent
                      </button>
                    </form>
                    
                    <div className="mt-4 text-center">
                      <span className="text-xs text-neutral-500">
                        By submitting, you agree to our <a href="#" className="text-electric hover:underline">Terms of Service</a> 
                        {' '}and{' '}
                        <a href="#" className="text-electric hover:underline">Privacy Policy</a>
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100">
                    <h3 className="font-medium text-neutral-900 mb-3">Need Help?</h3>
                    <p className="text-sm text-neutral-600 mb-4">
                      Our AI assistant can answer your questions about this property in real-time.
                    </p>
                    <button className="w-full py-2.5 px-4 border border-electric text-electric font-medium rounded-lg hover:bg-electric/5 transition-colors flex items-center justify-center">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Start AI Chat
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
