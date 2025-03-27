import React, { useEffect, useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import PropertyGrid from '@/components/PropertyGrid';
import Features from '@/components/Features';
import AISection from '@/components/AISection';
import Testimonials from '@/components/Testimonials';
import Neighborhoods from '@/components/Neighborhoods';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import PropertyDetail from '@/components/PropertyDetail';
import PropertyMap from '@/components/PropertyMap';
import MortgageCalculator from '@/components/MortgageCalculator';
import VirtualTour from '@/components/VirtualTour';
import ScheduleViewing from '@/components/ScheduleViewing';
import { Link } from 'react-router-dom';
import { MapPin, ChevronRight, ArrowRight, Building, Calculator, Camera, Calendar, Sparkles, ArrowDownCircle } from 'lucide-react';
import { chatWithAI } from '@/lib/ai-service';
import { motion } from 'framer-motion';

const samplePropertyDetail = {
  id: '1',
  title: 'Prestige Lakeside Habitat',
  location: 'Thoraipakkam, OMR',
  price: 9500000,
  pricePerSqft: 7500,
  images: [
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=2074&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1628744448840-6b48f8417a53?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop'
  ],
  bedrooms: 2,
  bathrooms: 2,
  area: 1275,
  developer: 'Prestige Group',
  valueScore: 87,
  description: 'Prestige Lakeside Habitat is a premium residential project that offers spacious 2BHK apartments. Located in the heart of OMR, this property provides excellent connectivity to major IT parks, schools, hospitals, and shopping centers. The project is built with high-quality materials and offers a range of premium amenities for a luxurious lifestyle.',
  amenities: [
    'Swimming Pool',
    'Gym',
    'Clubhouse',
    'Children\'s Play Area',
    'Landscaped Gardens',
    '24/7 Security',
    'Power Backup',
    'Jogging Track',
    'Indoor Games',
    'Party Hall',
    'Rainwater Harvesting',
    'Car Parking'
  ],
  floorPlan: 'https://images.unsplash.com/photo-1628744576348-a2640834adf7?q=80&w=2080&auto=format&fit=crop',
  possession: 'Ready to Move',
  constructionStatus: 'Completed'
};

// Add AI Deal Finder component
const AIDealFinder = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [budget, setBudget] = useState('80L');
  const [location, setLocation] = useState('OMR');
  const [bedrooms, setBedrooms] = useState('2');

  const findDeals = async () => {
    setLoading(true);
    try {
      // In a real app, this would call an API endpoint that uses the AI service
      // For now, we'll use our local AI service with a simulated delay
      setTimeout(() => {
        const query = `Find me ${bedrooms} BHK properties in ${location} with a budget of ${budget}`;
        chatWithAI([], query).then((response) => {
          // Parse the AI response to extract property data
          // This is a simplified version - in a real app, the API would return structured data
          setResults([
            {
              id: 'ai-deal-1',
              title: 'Prestige Lakeside Habitat',
              location: 'Thoraipakkam, OMR',
              price: 9500000,
              size: 1275,
              valueScore: 87,
              image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=2074&auto=format&fit=crop'
            },
            {
              id: 'ai-deal-2',
              title: 'Casagrand Luxus',
              location: 'Navalur, OMR',
              price: 8200000,
              size: 1180,
              valueScore: 82,
              image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=2070&auto=format&fit=crop'
            },
            {
              id: 'ai-deal-3',
              title: 'DLF Garden City',
              location: 'Siruseri, OMR',
              price: 10500000,
              size: 1350,
              valueScore: 91,
              image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop'
            }
          ]);
          setLoading(false);
        });
      }, 2000);
    } catch (error) {
      console.error('Error finding deals:', error);
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 rounded-full bg-electric/10 flex items-center justify-center mr-3">
          <Sparkles className="w-5 h-5 text-electric" />
        </div>
        <h3 className="text-xl font-semibold text-neutral-900">AI Deal Finder</h3>
      </div>
      
      <p className="text-neutral-600 mb-6">
        Our AI scans thousands of properties to find the best deals for you. Tell us what you're looking for:
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Budget</label>
          <select 
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full p-2 border border-neutral-300 rounded-md"
          >
            <option value="60L">Under ₹60L</option>
            <option value="80L">₹60L - ₹80L</option>
            <option value="1Cr">₹80L - ₹1Cr</option>
            <option value="1.5Cr">₹1Cr - ₹1.5Cr</option>
            <option value="2Cr">Above ₹1.5Cr</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Location</label>
          <select 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-2 border border-neutral-300 rounded-md"
          >
            <option value="OMR">OMR</option>
            <option value="Thoraipakkam">Thoraipakkam</option>
            <option value="Navalur">Navalur</option>
            <option value="Siruseri">Siruseri</option>
            <option value="Sholinganallur">Sholinganallur</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Bedrooms</label>
          <select 
            value={bedrooms}
            onChange={(e) => setBedrooms(e.target.value)}
            className="w-full p-2 border border-neutral-300 rounded-md"
          >
            <option value="1">1 BHK</option>
            <option value="2">2 BHK</option>
            <option value="3">3 BHK</option>
            <option value="4">4+ BHK</option>
          </select>
        </div>
      </div>
      
      <button
        onClick={findDeals}
        disabled={loading}
        className="w-full py-3 bg-electric hover:bg-electric-dark text-white font-medium rounded-lg transition-colors flex items-center justify-center"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Finding the best deals...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 mr-2" />
            Find AI-Powered Deals
          </>
        )}
      </button>
      
      {results.length > 0 && (
        <div className="mt-8">
          <h4 className="text-lg font-medium text-neutral-900 mb-4">AI-Recommended Properties</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {results.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white rounded-lg border border-neutral-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <img 
                  src={property.image} 
                  alt={property.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h5 className="font-medium text-neutral-900">{property.title}</h5>
                  <p className="text-sm text-neutral-500">{property.location}</p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-electric font-medium">
                      {property.price >= 10000000
                        ? `₹${(property.price / 10000000).toFixed(2)} Cr`
                        : `₹${(property.price / 100000).toFixed(2)} L`}
                    </span>
                    <div className="bg-electric/10 text-electric text-xs font-medium px-2 py-1 rounded-full">
                      Value Score: {property.valueScore}/100
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Add 3D Property Viewer component
const Property3DViewer = () => {
  return (
    <div className="relative aspect-w-16 aspect-h-9 bg-neutral-900 rounded-xl overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
            <Camera className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-medium mb-2">3D Virtual Tour</h3>
          <p className="text-white/60 max-w-md mx-auto mb-4">
            Experience properties in immersive 3D. Walk through rooms and explore every detail.
          </p>
          <button className="px-6 py-3 bg-electric text-white rounded-full hover:bg-electric-dark transition-colors">
            Launch 3D Experience
          </button>
        </div>
      </div>
    </div>
  );
};

const Index = () => {
  const [showPropertyDetail, setShowPropertyDetail] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(samplePropertyDetail);
  const [activeTab, setActiveTab] = useState('overview');
  const [showVirtualTour, setShowVirtualTour] = useState(false);
  const [showScheduleViewing, setShowScheduleViewing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const smoothScroll = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      
      if (link && link.hash && link.hash.startsWith('#') && link.pathname === window.location.pathname) {
        e.preventDefault();
        const targetElement = document.querySelector(link.hash);
        
        if (targetElement) {
          window.scrollTo({
            top: targetElement.getBoundingClientRect().top + window.scrollY,
            behavior: 'smooth'
          });
        }
      }
    };

    document.addEventListener('click', smoothScroll);
    
    if (showPropertyDetail || showVirtualTour || showScheduleViewing) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.removeEventListener('click', smoothScroll);
      document.body.style.overflow = 'auto';
    };
  }, [showPropertyDetail, showVirtualTour, showScheduleViewing]);

  const handlePropertySelect = (propertyId: string) => {
    setSelectedProperty(samplePropertyDetail);
    setShowPropertyDetail(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        
        {/* AI Deal Finder Section */}
        <section className="py-24 px-6 bg-gradient-to-b from-white to-electric/5">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-electric/10 px-4 py-2 rounded-full text-electric mb-4">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">AI-Powered</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">
                Find Your Perfect Home with AI
              </h2>
              <p className="text-neutral-500 max-w-2xl mx-auto">
                Our AI scans thousands of properties, analyzes market trends, and finds the best deals specifically for you.
              </p>
              
              <div className="mt-6 flex justify-center">
                <button 
                  onClick={() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' })}
                  className="flex items-center text-electric hover:text-electric-dark transition-colors"
                >
                  <span className="mr-2">Explore AI Features</span>
                  <ArrowDownCircle className="w-5 h-5 animate-bounce" />
                </button>
              </div>
            </div>
            
            <div ref={scrollRef}>
              <AIDealFinder />
            </div>
          </div>
        </section>
        
        <PropertyGrid onPropertySelect={handlePropertySelect} />
        
        <section className="py-12 px-6 bg-electric/5">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Link 
                to="/compare" 
                className="flex flex-col items-center p-6 bg-white rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-all hover:border-electric/50 group"
              >
                <div className="w-14 h-14 rounded-full bg-electric/10 flex items-center justify-center mb-4 group-hover:bg-electric/20 transition-colors">
                  <Building className="w-6 h-6 text-electric" />
                </div>
                <h3 className="text-lg font-medium text-neutral-900 mb-2">Compare Properties</h3>
                <p className="text-sm text-neutral-500 text-center mb-4">
                  Compare multiple properties side by side
                </p>
                <div className="flex items-center text-electric mt-auto group-hover:translate-x-1 transition-transform">
                  <span className="text-sm font-medium">Compare Now</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </Link>
              
              <div 
                onClick={() => setShowVirtualTour(true)}
                className="flex flex-col items-center p-6 bg-white rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-all hover:border-electric/50 group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-full bg-electric/10 flex items-center justify-center mb-4 group-hover:bg-electric/20 transition-colors">
                  <Camera className="w-6 h-6 text-electric" />
                </div>
                <h3 className="text-lg font-medium text-neutral-900 mb-2">Virtual Tour</h3>
                <p className="text-sm text-neutral-500 text-center mb-4">
                  Experience properties with 360° views
                </p>
                <div className="flex items-center text-electric mt-auto group-hover:translate-x-1 transition-transform">
                  <span className="text-sm font-medium">Start Tour</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
              
              <div 
                onClick={() => setShowScheduleViewing(true)}
                className="flex flex-col items-center p-6 bg-white rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-all hover:border-electric/50 group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-full bg-electric/10 flex items-center justify-center mb-4 group-hover:bg-electric/20 transition-colors">
                  <Calendar className="w-6 h-6 text-electric" />
                </div>
                <h3 className="text-lg font-medium text-neutral-900 mb-2">Schedule Viewing</h3>
                <p className="text-sm text-neutral-500 text-center mb-4">
                  Book a property visit with our agents
                </p>
                <div className="flex items-center text-electric mt-auto group-hover:translate-x-1 transition-transform">
                  <span className="text-sm font-medium">Book Now</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
              
              <Link 
                to="/ai-insights" 
                className="flex flex-col items-center p-6 bg-white rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-all hover:border-electric/50 group"
              >
                <div className="w-14 h-14 rounded-full bg-electric/10 flex items-center justify-center mb-4 group-hover:bg-electric/20 transition-colors">
                  <Calculator className="w-6 h-6 text-electric" />
                </div>
                <h3 className="text-lg font-medium text-neutral-900 mb-2">AI Insights</h3>
                <p className="text-sm text-neutral-500 text-center mb-4">
                  Explore market data and predictions
                </p>
                <div className="flex items-center text-electric mt-auto group-hover:translate-x-1 transition-transform">
                  <span className="text-sm font-medium">View Insights</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </Link>
            </div>
          </div>
        </section>
        
        {/* 3D Property Viewer Section */}
        <section className="py-24 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-electric/10 px-4 py-2 rounded-full text-electric mb-4">
                <span className="text-sm font-medium">Immersive Experience</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">
                Explore Properties in 3D
              </h2>
              <p className="text-neutral-500 max-w-2xl mx-auto">
                Walk through properties virtually and experience every detail before visiting in person.
              </p>
            </div>
            
            <Property3DViewer />
          </div>
        </section>
        
        <Features />
        <PropertyMap onPropertySelect={handlePropertySelect} />
        <AISection />
        
        <section className="py-24 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-electric/10 px-4 py-2 rounded-full text-electric mb-4">
                <span className="text-sm font-medium">Financial Tools</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">
                Plan Your Property Investment
              </h2>
              <p className="text-neutral-500 max-w-2xl mx-auto">
                Use our advanced mortgage calculator to plan your finances and understand the long-term investment potential.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <MortgageCalculator />
              </div>
              
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-6">
                  <h3 className="font-medium text-neutral-900 mb-4">Investment Tips</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-electric/10 flex items-center justify-center text-electric mr-3 mt-0.5">
                        <span className="text-xs font-bold">1</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-neutral-800 mb-1">Optimize Your Down Payment</h4>
                        <p className="text-sm text-neutral-600">
                          A 20% down payment often helps you avoid private mortgage insurance and secure better rates.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-electric/10 flex items-center justify-center text-electric mr-3 mt-0.5">
                        <span className="text-xs font-bold">2</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-neutral-800 mb-1">Consider Total Costs</h4>
                        <p className="text-sm text-neutral-600">
                          Factor in property taxes, maintenance, and HOA fees when calculating your budget.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-electric/10 flex items-center justify-center text-electric mr-3 mt-0.5">
                        <span className="text-xs font-bold">3</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-neutral-800 mb-1">Loan Term Strategy</h4>
                        <p className="text-sm text-neutral-600">
                          Shorter loan terms mean higher payments but less interest paid over the life of the loan.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-electric to-blue-600 rounded-xl shadow-lg p-6 text-white">
                  <h3 className="font-medium mb-4">Need Expert Advice?</h3>
                  <p className="text-white/80 mb-6 text-sm">
                    Our financial experts can help you understand the best mortgage options for your situation.
                  </p>
                  <button 
                    onClick={() => {
                      // Open AI Assistant with a specific question
                      const event = new CustomEvent('openAIAssistant', {
                        detail: { initialMessage: "I need help understanding mortgage options for a 2 BHK property in OMR with a budget of 80L" }
                      });
                      window.dispatchEvent(event);
                    }}
                    className="py-2 px-4 bg-white text-electric font-medium rounded-lg hover:bg-white/90 transition-colors w-full"
                  >
                    Chat with AI Advisor
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <Neighborhoods />
        <Testimonials />
        <Contact />
      </main>
      
      {showPropertyDetail && (
        <PropertyDetail 
          property={selectedProperty} 
          onClose={() => setShowPropertyDetail(false)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      )}
      
      {showVirtualTour && (
        <VirtualTour onClose={() => setShowVirtualTour(false)} />
      )}
      
      {showScheduleViewing && (
        <ScheduleViewing onClose={() => setShowScheduleViewing(false)} />
      )}
      
      <Footer />
    </div>
  );
};

export default Index;
