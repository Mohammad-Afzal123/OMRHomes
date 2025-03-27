import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PropertyComparison from '@/components/PropertyComparison';
import { Layers, ArrowRight, Sparkles, BarChart3, TrendingUp, ArrowDown, Award, ChevronRight, Filter, SlidersHorizontal, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { toggleAIAssistant } from '@/lib/ai-helper';

const Compare: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'visual' | 'detailed'>('visual');
  const [showHelp, setShowHelp] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [viewTransitioning, setViewTransitioning] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle tab switching with animation
  const switchTab = (tab: 'visual' | 'detailed') => {
    if (tab === activeTab) return;
    setViewTransitioning(true);
    setTimeout(() => {
      setActiveTab(tab);
      setViewTransitioning(false);
    }, 300);
  };

  // Mock data for trends chart
  const trends = [
    { area: 'Thoraipakkam', trend: '+8%', direction: 'up' },
    { area: 'Navalur', trend: '+12%', direction: 'up' },
    { area: 'Siruseri', trend: '+5%', direction: 'up' },
    { area: 'Sholinganallur', trend: '+9%', direction: 'up' },
    { area: 'Padur', trend: '+7%', direction: 'up' },
    { area: 'Perumbakkam', trend: '+4%', direction: 'up' },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      
      {/* Hero Section with Animated Background */}
      <section className="pt-28 pb-16 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-br from-electric/10 via-purple-100/20 to-blue-50 z-0 overflow-hidden">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ duration: 2 }}
            className="absolute inset-0"
          >
            {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-electric"
                initial={{ 
                  x: Math.random() * window.innerWidth, 
                  y: Math.random() * 600,
                  opacity: 0.1 + Math.random() * 0.2,
                  scale: 0.2 + Math.random() * 0.8
                }}
                animate={{ 
                  y: [null, -10, 0, -5, 0],
                  scale: [null, 1.05, 1, 1.02, 1]
                }}
                transition={{ 
                  duration: 4 + Math.random() * 6,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                style={{
                  width: (10 + Math.random() * 40) + 'px',
                  height: (10 + Math.random() * 40) + 'px',
                }}
              />
            ))}
          </motion.div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full text-electric mb-4 shadow-sm"
            >
              <Layers className="w-4 h-4" />
              <span className="text-sm font-medium">AI-Powered Comparison</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-6xl font-display font-bold text-neutral-900 mb-6"
            >
              <span className="text-electric">Compare</span> Properties
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-neutral-600 max-w-2xl mx-auto mb-8 text-lg"
            >
              Make informed decisions with our advanced comparison tool. Analyze properties side by side and find your perfect match with AI-powered insights.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <button
                onClick={() => toggleAIAssistant("I need help comparing properties in OMR")}
                className="px-6 py-3 bg-electric text-white rounded-lg hover:bg-electric-dark transition-colors flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                <span>Get AI Assistance</span>
              </button>
              
              <button
                onClick={() => document.getElementById('comparison-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-6 py-3 border-2 border-electric text-electric rounded-lg hover:bg-electric/5 transition-colors flex items-center justify-center"
              >
                <span>Start Comparing</span>
                <ArrowDown className="ml-2 w-4 h-4 animate-bounce" />
              </button>
            </motion.div>
          </div>
          
          {/* Animated stats cards */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8"
          >
            <motion.div 
              whileHover={{ y: -5, boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.1)' }}
              className="bg-white rounded-xl shadow-md p-6 flex items-start"
            >
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                <Award className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-1 text-neutral-900">97%</h3>
                <p className="text-neutral-600 text-sm">Buyers found our comparison tool helpful in decision making</p>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5, boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.1)' }}
              className="bg-white rounded-xl shadow-md p-6 flex items-start"
            >
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-1 text-neutral-900">15+</h3>
                <p className="text-neutral-600 text-sm">Data points analyzed per property for accurate comparisons</p>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5, boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.1)' }}
              className="bg-white rounded-xl shadow-md p-6 flex items-start"
            >
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-1 text-neutral-900">425+</h3>
                <p className="text-neutral-600 text-sm">Properties available for comparison across OMR</p>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Current market trends */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white rounded-xl shadow-md p-6 max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-neutral-900">Current Market Trends</h3>
              <Link to="/ai-insights" className="text-electric text-sm font-medium flex items-center">
                View detailed insights <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {trends.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center justify-between border border-neutral-100 rounded-lg p-3"
                >
                  <span className="text-neutral-700">{item.area}</span>
                  <div className={`flex items-center ${item.direction === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {item.direction === 'up' ? 
                      <TrendingUp className="w-4 h-4 mr-1" /> : 
                      <TrendingUp className="w-4 h-4 mr-1 transform rotate-180" />
                    }
                    <span className="font-medium">{item.trend}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Sticky view mode selector - improved design */}
      <AnimatePresence>
        {isScrolled && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="sticky top-20 z-20 flex justify-center w-full"
          >
            <div className="bg-white rounded-full shadow-md border border-neutral-200 p-1 flex">
              <button
                onClick={() => switchTab('visual')}
                className={`px-5 py-2 rounded-full flex items-center space-x-2 text-sm transition-colors ${
                  activeTab === 'visual' 
                    ? 'bg-electric text-white' 
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                <span>Visual Comparison</span>
              </button>
              <button
                onClick={() => switchTab('detailed')}
                className={`px-5 py-2 rounded-full flex items-center space-x-2 text-sm transition-colors ${
                  activeTab === 'detailed' 
                    ? 'bg-electric text-white' 
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                <span>Detailed Analysis</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main comparison section - with view switching */}
      <section id="comparison-section" className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-neutral-900">Interactive Property Comparison</h2>
            
            <div className="flex items-center gap-3">
              <div className="flex bg-white rounded-lg shadow-sm border border-neutral-200 p-1">
                <button
                  onClick={() => switchTab('visual')}
                  className={`px-4 py-1.5 rounded-md flex items-center space-x-2 text-sm transition-colors ${
                    activeTab === 'visual' 
                      ? 'bg-electric text-white' 
                      : 'text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  <span>Visual</span>
                </button>
                <button
                  onClick={() => switchTab('detailed')}
                  className={`px-4 py-1.5 rounded-md flex items-center space-x-2 text-sm transition-colors ${
                    activeTab === 'detailed' 
                      ? 'bg-electric text-white' 
                      : 'text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  <span>Detailed</span>
                </button>
              </div>
              
              <button
                onClick={() => setShowHelp(true)}
                className="w-9 h-9 rounded-full bg-white shadow-sm border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-electric hover:text-white transition-colors"
              >
                <span className="text-lg font-medium">?</span>
              </button>
            </div>
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className={viewTransitioning ? 'pointer-events-none' : ''}
            >
              {activeTab === 'visual' ? (
                <PropertyComparison mode="visual" />
              ) : (
                <PropertyComparison mode="detailed" />
              )}
            </motion.div>
          </AnimatePresence>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-12 bg-white p-8 rounded-xl shadow-lg border border-neutral-200"
          >
            <div className="flex items-start">
              <div className="w-12 h-12 rounded-full bg-electric/10 flex items-center justify-center mr-4 flex-shrink-0">
                <Sparkles className="w-6 h-6 text-electric" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-neutral-900 mb-2">How Our AI Comparison Works</h2>
                <p className="text-neutral-600 mb-4">
                  Our advanced algorithm analyzes multiple factors to provide an intelligent property recommendation:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="border border-neutral-200 rounded-lg p-4 hover:border-electric transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                      <span className="text-blue-600 text-sm font-bold">1</span>
                    </div>
                    <h3 className="font-medium text-lg text-neutral-800 mb-1">Value Score Analysis</h3>
                    <p className="text-neutral-600 text-sm">Properties are scored based on price, location, amenities, and market analysis to determine overall value proposition.</p>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="border border-neutral-200 rounded-lg p-4 hover:border-electric transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-3">
                      <span className="text-green-600 text-sm font-bold">2</span>
                    </div>
                    <h3 className="font-medium text-lg text-neutral-800 mb-1">Price-to-Area Ratio</h3>
                    <p className="text-neutral-600 text-sm">We calculate the cost per square foot and compare it against neighborhood benchmarks to identify the best value properties.</p>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="border border-neutral-200 rounded-lg p-4 hover:border-electric transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mb-3">
                      <span className="text-purple-600 text-sm font-bold">3</span>
                    </div>
                    <h3 className="font-medium text-lg text-neutral-800 mb-1">Location Rating</h3>
                    <p className="text-neutral-600 text-sm">Properties in prime locations with better connectivity, access to facilities, and future development potential get higher scores.</p>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="border border-neutral-200 rounded-lg p-4 hover:border-electric transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mb-3">
                      <span className="text-amber-600 text-sm font-bold">4</span>
                    </div>
                    <h3 className="font-medium text-lg text-neutral-800 mb-1">Amenities Evaluation</h3>
                    <p className="text-neutral-600 text-sm">The number and quality of amenities are factored into the final recommendation based on their impact on lifestyle and property value.</p>
                  </motion.div>
                </div>
                
                <div className="mt-6 p-4 bg-electric/5 rounded-lg border border-electric/20">
                  <div className="flex items-center">
                    <Sparkles className="w-5 h-5 text-electric mr-2" />
                    <h4 className="font-medium text-neutral-900">AI Recommendation Confidence</h4>
                  </div>
                  <p className="mt-2 text-neutral-600 text-sm">
                    Our AI provides a confidence score with each recommendation based on data quality and market volatility. The more properties you compare, the more accurate our recommendations become.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
          
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">Not finding what you're looking for?</h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/"
                className="px-6 py-3 bg-electric text-white rounded-lg hover:bg-electric-dark transition-colors flex items-center shadow-md hover:shadow-lg"
              >
                <span>Explore More Properties</span>
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              <Link 
                to="/ai-insights"
                className="px-6 py-3 border border-electric text-electric rounded-lg hover:bg-electric/5 transition-colors"
              >
                View Market Insights
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Help modal */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowHelp(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', damping: 20 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-neutral-200">
                <h3 className="text-xl font-bold text-neutral-900">How to Use the Comparison Tool</h3>
              </div>
              
              <div className="p-6 overflow-y-auto">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-electric flex items-center justify-center text-white text-sm mr-3 mt-0.5">1</div>
                    <div>
                      <h4 className="font-medium text-neutral-800 mb-1">Add Properties</h4>
                      <p className="text-neutral-600 text-sm">Click the "Add Property" button to select properties you want to compare (up to 3).</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-electric flex items-center justify-center text-white text-sm mr-3 mt-0.5">2</div>
                    <div>
                      <h4 className="font-medium text-neutral-800 mb-1">Review Comparisons</h4>
                      <p className="text-neutral-600 text-sm">Hover over different rows to highlight specific features for easier comparison.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-electric flex items-center justify-center text-white text-sm mr-3 mt-0.5">3</div>
                    <div>
                      <h4 className="font-medium text-neutral-800 mb-1">Check AI Insights</h4>
                      <p className="text-neutral-600 text-sm">Look for the AI recommendation badge and insights at the bottom of the comparison.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-electric flex items-center justify-center text-white text-sm mr-3 mt-0.5">4</div>
                    <div>
                      <h4 className="font-medium text-neutral-800 mb-1">Switch Views</h4>
                      <p className="text-neutral-600 text-sm">Toggle between Visual and Detailed views for different comparison perspectives.</p>
                    </div>
                  </li>
                </ul>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-700 flex items-center mb-2">
                    <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 text-xs mr-2">i</span>
                    Pro Tip
                  </h4>
                  <p className="text-blue-700 text-sm">
                    Get personalized assistance by clicking the "Get AI Assistance" button. Our AI can help you narrow down options based on your specific requirements.
                  </p>
                </div>
              </div>
              
              <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex justify-end">
                <button
                  onClick={() => setShowHelp(false)}
                  className="px-4 py-2 bg-electric text-white rounded-lg hover:bg-electric-dark transition-colors"
                >
                  Got It
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <Footer />
    </div>
  );
};

export default Compare; 