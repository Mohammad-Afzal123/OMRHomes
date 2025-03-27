
import React, { useEffect, useRef, useState } from 'react';
import { Search, MapPin, Star, Sparkles, ArrowRight, Home, User } from 'lucide-react';

const Hero = () => {
  const parallaxRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState('');
  const [activeChip, setActiveChip] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const searchSuggestions = [
    { text: '2BHK near Tech Parks with pool', icon: Building },
    { text: 'Sea view apartments in OMR', icon: MapPin },
    { text: 'Properties with gym and clubhouse', icon: Dumbbell },
    { text: 'Ready to move 2BHK in Thoraipakkam', icon: Home },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (parallaxRef.current) {
        const scrollValue = window.scrollY;
        // Create parallax effect by translating elements at different speeds
        parallaxRef.current.style.transform = `translateY(${scrollValue * 0.4}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Focus the search input when component mounts
    if (searchInputRef.current) {
      const timeout = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, []);

  const handleChipClick = (chip: string) => {
    setActiveChip(chip === activeChip ? null : chip);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
      if (chip !== activeChip) {
        setSearchValue(chip + ' ');
      }
    }
  };

  const handleSearchFocus = () => {
    setShowSuggestions(true);
  };

  const handleSearchBlur = () => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchValue(suggestion);
    setShowSuggestions(false);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background with parallax effect */}
      <div 
        className="absolute inset-0 z-0 bg-gradient-to-b from-black to-neutral-900"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1517021897933-0e0319cfbc28?q=80&w=2070&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay',
        }}
      >
        <div ref={parallaxRef} className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/90"></div>
      </div>

      {/* Animated floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-electric/10 blur-3xl animate-float"></div>
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 rounded-full bg-coral/10 blur-3xl animate-float delay-700"></div>
        <div className="absolute top-1/2 right-1/4 w-40 h-40 rounded-full bg-electric/20 blur-3xl animate-float delay-300"></div>
      </div>

      {/* Hero content */}
      <div className="relative z-10 h-screen flex flex-col items-center justify-center px-6">
        <div className="max-w-5xl w-full text-center space-y-6">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white/80 mb-4 animate-fade-in">
            <Sparkles className="w-4 h-4 text-electric" />
            <span className="text-sm font-medium">AI-powered real estate search for OMR</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white leading-tight tracking-tight animate-fade-in">
            <span className="block">Discover Your Perfect</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-electric to-electric-light">2BHK in OMR</span>
          </h1>
          
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto animate-fade-in delay-200">
            AI-powered insights to help you find the best value properties from top developers in OMR. Effortlessly compare prices, amenities, and locations.
          </p>
          
          <div className="mt-10 animate-fade-in delay-300">
            <div className="relative w-full max-w-2xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-electric/20 to-coral/20 rounded-xl blur-xl animate-pulse-soft"></div>
              <div className="relative glass flex items-center p-2 rounded-xl overflow-hidden border border-white/20">
                <div className="flex items-center space-x-2 px-3 py-2 bg-white/10 rounded-lg">
                  <MapPin className="w-5 h-5 text-electric" />
                  <span className="text-white/80">OMR, Chennai</span>
                </div>
                
                <div className="relative flex-1">
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search for 2BHK with amenities like pool, gym..."
                    className="flex-1 w-full bg-transparent border-0 focus:ring-0 text-white placeholder:text-white/50 py-3 px-4"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onFocus={handleSearchFocus}
                    onBlur={handleSearchBlur}
                  />
                  
                  {/* Search suggestions dropdown */}
                  {showSuggestions && (
                    <div className="absolute top-full left-0 right-0 mt-2 p-2 glass-dark rounded-lg border border-white/10 z-50">
                      <div className="text-xs text-white/60 px-2 py-1">AI-Powered Suggestions</div>
                      {searchSuggestions.map((suggestion, index) => (
                        <div 
                          key={index}
                          className="flex items-center space-x-2 p-2 hover:bg-white/10 rounded-lg cursor-pointer transition-colors"
                          onClick={() => handleSuggestionClick(suggestion.text)}
                        >
                          <suggestion.icon className="w-4 h-4 text-electric-light" />
                          <span className="text-white">{suggestion.text}</span>
                        </div>
                      ))}
                      
                      <div className="mt-2 pt-2 border-t border-white/10 flex justify-between items-center px-2">
                        <span className="text-xs text-white/60">Powered by AI</span>
                        <Sparkles className="w-3 h-3 text-electric-light" />
                      </div>
                    </div>
                  )}
                </div>
                
                <button className="bg-electric hover:bg-electric-dark text-white p-3 rounded-lg transition-colors duration-200 group">
                  <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {['Near Tech Parks', 'Sea View', 'Luxury Amenities', 'Best Value'].map((tag, i) => (
                <button 
                  key={tag}
                  className={`px-4 py-1.5 rounded-full ${
                    activeChip === tag 
                      ? 'bg-electric text-white' 
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  } text-sm transition-all`}
                  style={{ animationDelay: `${400 + i * 100}ms` }}
                  onClick={() => handleChipClick(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-4 mt-8 animate-fade-in delay-500">
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <div 
                  key={i} 
                  className="w-8 h-8 rounded-full border-2 border-white bg-neutral-300 overflow-hidden"
                  style={{ zIndex: 4 - i }}
                >
                  <img 
                    src={`https://i.pravatar.cc/100?img=${i + 10}`} 
                    alt="User" 
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="text-white text-sm">
              <span className="text-white/80">Trusted by</span> <span className="font-semibold">2,000+</span> <span className="text-white/80">home buyers</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-electric text-electric" />
              <Star className="w-4 h-4 fill-electric text-electric" />
              <Star className="w-4 h-4 fill-electric text-electric" />
              <Star className="w-4 h-4 fill-electric text-electric" />
              <Star className="w-4 h-4 fill-electric text-electric" />
            </div>
          </div>
          
          <div className="mt-8 animate-fade-in delay-600">
            <a 
              href="#properties" 
              className="inline-flex items-center space-x-2 text-white border-b border-white/30 pb-1 hover:border-white transition-colors"
            >
              <span>Explore Featured Properties</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
      
      {/* Additional floating elements */}
      <div className="absolute bottom-24 left-10 md:left-20 w-32 h-32 glass-card rounded-2xl p-4 hidden md:flex flex-col items-center justify-center text-center transform rotate-6 animate-float delay-400 border border-white/20 z-10">
        <Home className="w-8 h-8 text-electric mb-2" />
        <p className="text-white text-xs">500+ Premium Properties</p>
      </div>
      
      <div className="absolute bottom-40 right-10 md:right-20 w-36 h-36 glass-card rounded-2xl p-4 hidden md:flex flex-col items-center justify-center text-center transform -rotate-6 animate-float delay-700 border border-white/20 z-10">
        <User className="w-8 h-8 text-coral mb-2" />
        <p className="text-white text-xs">AI-Powered Recommendations</p>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-8 h-12 rounded-full border-2 border-white/30 flex items-center justify-center">
          <div className="w-1.5 h-3 bg-white/50 rounded-full animate-pulse-soft"></div>
        </div>
      </div>
    </div>
  );
};

const Building = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
    <path d="M9 22v-4h6v4"></path>
    <path d="M8 6h.01"></path>
    <path d="M16 6h.01"></path>
    <path d="M12 6h.01"></path>
    <path d="M12 10h.01"></path>
    <path d="M12 14h.01"></path>
    <path d="M16 10h.01"></path>
    <path d="M16 14h.01"></path>
    <path d="M8 10h.01"></path>
    <path d="M8 14h.01"></path>
  </svg>
);

const Dumbbell = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m6.5 6.5 11 11"></path>
    <path d="m21 21-1-1"></path>
    <path d="m3 3 1 1"></path>
    <path d="m18 22 4-4"></path>
    <path d="m2 6 4-4"></path>
    <path d="m3 10 7-7"></path>
    <path d="m14 21 7-7"></path>
  </svg>
);

export default Hero;
