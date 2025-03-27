import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Cpu, BrainCircuit, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';

const AISection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState(0);
  const tabIndicatorRef = useRef<HTMLDivElement>(null);

  const tabs = [
    {
      icon: Cpu,
      title: 'Smart Comparison',
      content: 'Our AI compares thousands of properties in real-time, analyzing price trends, amenities, and location advantages to help you find the best value.'
    },
    {
      icon: BrainCircuit,
      title: 'Price Predictions',
      content: 'Using machine learning algorithms, we predict future property values based on historical data, infrastructure developments, and market trends.'
    },
    {
      icon: Lightbulb,
      title: 'Personalized Recommendations',
      content: 'The more you interact with our platform, the better our AI understands your preferences to provide tailored property suggestions.'
    }
  ];

  useEffect(() => {
    if (tabIndicatorRef.current) {
      const activeTabElement = document.getElementById(`ai-tab-${activeTab}`);
      if (activeTabElement) {
        const { offsetLeft, offsetWidth } = activeTabElement;
        tabIndicatorRef.current.style.left = `${offsetLeft}px`;
        tabIndicatorRef.current.style.width = `${offsetWidth}px`;
      }
    }
  }, [activeTab]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % tabs.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [tabs.length]);

  return (
    <section
      ref={sectionRef}
      className="py-24 px-6 relative overflow-hidden bg-electric-dark text-white"
    >
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 opacity-20">
          <svg width="700" height="700" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="circuitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#818CF8" />
              </linearGradient>
            </defs>
            <path
              fill="none"
              stroke="url(#circuitGradient)"
              strokeWidth="0.2"
              d="M10,30 L90,30 M30,10 L30,90 M20,20 L80,80 M80,20 L20,80 M50,10 L50,90 M10,50 L90,50 M10,70 L90,70 M70,10 L70,90"
            />
            <circle cx="30" cy="30" r="2" fill="#38BDF8" />
            <circle cx="50" cy="50" r="2" fill="#38BDF8" />
            <circle cx="70" cy="30" r="2" fill="#38BDF8" />
            <circle cx="30" cy="70" r="2" fill="#38BDF8" />
            <circle cx="70" cy="70" r="2" fill="#38BDF8" />
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-full">
          <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full bg-electric/20 blur-3xl"></div>
          <div className="absolute top-1/3 right-1/4 w-40 h-40 rounded-full bg-electric-light/20 blur-2xl"></div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white/90 mb-4 animate-fade-in">
            <Sparkles className="w-4 h-4 text-electric-light" />
            <span className="text-sm font-medium">Powered by Gemini 1.5 Pro</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4 animate-fade-in delay-100">
            Experience the Power of AI in Real Estate
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto animate-fade-in delay-200">
            Our advanced AI analyzes market trends, property values, and neighborhood insights to provide you with the most accurate and valuable information.
          </p>
          <div className="mt-8">
            <Link 
              to="/ai-insights" 
              className="px-6 py-3 bg-electric text-white font-medium rounded-full hover:bg-electric-light transition-colors inline-flex items-center"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Try Our AI Assistant
            </Link>
          </div>
        </div>

        <div className="flex justify-center mb-12 relative animate-fade-in delay-300">
          <div className="bg-white/10 backdrop-blur-sm rounded-full p-2 flex relative">
            {tabs.map((tab, index) => (
              <button
                key={index}
                id={`ai-tab-${index}`}
                className={`relative z-10 py-2 px-6 rounded-full flex items-center space-x-2 transition-colors duration-200 ${
                  activeTab === index ? 'text-electric-dark' : 'text-white/80 hover:text-white'
                }`}
                onClick={() => setActiveTab(index)}
              >
                <tab.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{tab.title}</span>
              </button>
            ))}
            <div
              ref={tabIndicatorRef}
              className="absolute top-2 bottom-2 bg-white rounded-full transition-all duration-300 ease-in-out"
            ></div>
          </div>
        </div>

        <div className="relative h-[400px] max-w-4xl mx-auto bg-gradient-to-b from-electric/10 to-electric-dark/20 backdrop-blur-md rounded-2xl border border-white/10 p-6 overflow-hidden animate-fade-in delay-400">
          {/* Tab content */}
          <div className="relative h-full flex flex-col md:flex-row items-center justify-between gap-10">
            {tabs.map((tab, index) => (
              <div
                key={index}
                className={`absolute inset-0 p-8 flex flex-col md:flex-row items-center justify-between gap-10 transition-all duration-500 ease-in-out ${
                  activeTab === index
                    ? 'opacity-100 translate-x-0'
                    : index < activeTab
                    ? 'opacity-0 -translate-x-full'
                    : 'opacity-0 translate-x-full'
                }`}
              >
                <div className="md:w-1/2">
                  <h3 className="text-2xl font-semibold text-white mb-4">{tab.title}</h3>
                  <p className="text-white/80 mb-6">{tab.content}</p>
                  <Link 
                    to="/ai-insights"
                    className="py-2 px-6 rounded-full bg-white text-electric-dark font-medium hover:bg-white/90 transition-colors"
                  >
                    Try Now
                  </Link>
                </div>
                
                <div className="md:w-1/2 h-[250px] perspective">
                  <div className="w-full h-full preserve-3d relative animate-float">
                    <div className="absolute inset-0 glass rounded-lg overflow-hidden border border-white/20 shadow-lg">
                      {index === 0 && (
                        <div className="p-6">
                          <h4 className="text-sm font-semibold text-white/90 mb-3">Property Comparison</h4>
                          <div className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                              <div key={i} className="relative">
                                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                                  <div 
                                    className="absolute top-0 left-0 h-full bg-electric-light rounded-full"
                                    style={{ width: `${85 - i * 15}%` }}
                                  ></div>
                                </div>
                                <div className="flex justify-between text-xs text-white/70 mt-1">
                                  <span>Property {i+1}</span>
                                  <span>{85 - i * 15}%</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {index === 1 && (
                        <div className="p-6">
                          <h4 className="text-sm font-semibold text-white/90 mb-3">Value Prediction</h4>
                          <div className="w-full h-[180px] relative">
                            <svg width="100%" height="100%" viewBox="0 0 400 200">
                              <defs>
                                <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                  <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.4" />
                                  <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
                                </linearGradient>
                              </defs>
                              <path
                                d="M0,150 Q50,120 100,140 T200,110 T300,90 T400,50"
                                fill="none"
                                stroke="#38BDF8"
                                strokeWidth="3"
                              />
                              <path
                                d="M0,150 Q50,120 100,140 T200,110 T300,90 T400,50 V200 H0 Z"
                                fill="url(#chartGradient)"
                              />
                              {/* Future projection dashed line */}
                              <path
                                d="M400,50 Q450,30 500,20"
                                fill="none"
                                stroke="#38BDF8"
                                strokeWidth="3"
                                strokeDasharray="5,5"
                              />
                              <circle cx="400" cy="50" r="5" fill="#FFFFFF" />
                            </svg>
                            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-white/70">
                              <span>2022</span>
                              <span>2023</span>
                              <span>2024</span>
                              <span>2025 (Projected)</span>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {index === 2 && (
                        <div className="p-6">
                          <h4 className="text-sm font-semibold text-white/90 mb-3">Your Preferences</h4>
                          <div className="space-y-3">
                            {['Near IT Parks', 'Good Schools', 'Metro Connectivity', 'Quality Builders'].map((pref, i) => (
                              <div key={i} className="flex items-center space-x-3 bg-white/10 p-2 rounded-lg">
                                <div className="w-4 h-4 rounded-full bg-electric-light flex items-center justify-center">
                                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="text-electric-dark">
                                    <path d="M20 6L9 17l-5-5"></path>
                                  </svg>
                                </div>
                                <span className="text-sm text-white/90">{pref}</span>
                                <div className="ml-auto flex">
                                  {[...Array(5)].map((_, j) => (
                                    <svg 
                                      key={j} 
                                      width="12" 
                                      height="12" 
                                      viewBox="0 0 24 24" 
                                      fill={j < 4 - i * 0.7 ? "currentColor" : "none"} 
                                      stroke="currentColor" 
                                      strokeWidth="2" 
                                      className="text-electric-light"
                                    >
                                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                    </svg>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Dots indicator */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {tabs.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  activeTab === index ? 'bg-white' : 'bg-white/30'
                }`}
                onClick={() => setActiveTab(index)}
              ></button>
            ))}
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <div className="inline-flex items-center justify-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white/90 mb-6">
            <Sparkles className="w-4 h-4 text-electric-light" />
            <span className="text-sm font-medium">Powered by Advanced Machine Learning</span>
          </div>
          <p className="text-white/70 max-w-2xl mx-auto">
            Our AI-powered real estate assistant is built on Google's Gemini 1.5 Pro model, providing you with cutting-edge insights and analysis for your property search.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AISection;
