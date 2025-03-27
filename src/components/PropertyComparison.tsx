import React, { useState, useEffect, useMemo } from 'react';
import { X, Check, AlertTriangle, ArrowRight, Heart, Building, Layers, Ruler, Bed, Bath, MapPin, Tag, Home, Star, Sparkles, Plus, BarChart, ChevronDown, ChevronUp, Camera, Filter, TrendingUp, SlidersHorizontal, Info as InfoIcon, Calendar, DollarSign, Calculator, LineChart, PieChart, Maximize, Minimize, Zap, Trophy, Lightbulb, Eye, EyeOff, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sampleProperties } from '@/lib/sample-data';

interface ComparisonProperty {
  id: string;
  title: string;
  location: string;
  price: number;
  size: number;
  bedrooms: number;
  bathrooms: number;
  image: string;
  valueScore: number;
  amenities: string[];
}

interface PropertyComparisonProps {
  mode?: 'visual' | 'detailed';
}

const PropertyComparison: React.FC<PropertyComparisonProps> = ({ mode = 'visual' }) => {
  const [selectedProperties, setSelectedProperties] = useState<ComparisonProperty[]>([]);
  const [availableProperties, setAvailableProperties] = useState<ComparisonProperty[]>(sampleProperties);
  const [showPropertySelector, setShowPropertySelector] = useState(false);
  const [highlightedFeature, setHighlightedFeature] = useState<string | null>(null);
  const [showCharts, setShowCharts] = useState(mode === 'visual');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([7000000, 11000000]);
  const [sizeRange, setSizeRange] = useState<[number, number]>([1000, 1500]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [minValueScore, setMinValueScore] = useState(80);
  const [comparisonResults, setComparisonResults] = useState<{
    bestValue: string | null;
    bestLocation: string | null;
    mostAmenities: string | null;
    recommendation: string | null;
  }>({
    bestValue: null,
    bestLocation: null,
    mostAmenities: null,
    recommendation: null
  });
  const [showROICalculator, setShowROICalculator] = useState(false);
  const [selectedPropertyForROI, setSelectedPropertyForROI] = useState<string | null>(null);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [loanTerm, setLoanTerm] = useState(20);
  const [interestRate, setInterestRate] = useState(7.5);
  const [annualAppreciation, setAnnualAppreciation] = useState(5);
  const [monthlyRental, setMonthlyRental] = useState(30000);
  const [show3DView, setShow3DView] = useState(false);
  const [activePropertyView, setActivePropertyView] = useState<string | null>(null);
  const [showScoreCards, setShowScoreCards] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ComparisonProperty[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Update showCharts when mode changes
  useEffect(() => {
    setShowCharts(mode === 'visual');
  }, [mode]);

  // Toggle a filter
  const toggleFilter = (filter: string) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(prev => prev.filter(f => f !== filter));
    } else {
      setActiveFilters(prev => [...prev, filter]);
    }
  };

  // Get all unique locations from the available properties
  const allLocations = useMemo(() => {
    const locations = new Set<string>();
    sampleProperties.forEach(property => locations.add(property.location));
    return Array.from(locations);
  }, []);

  // Filter available properties based on criteria
  useEffect(() => {
    let filtered = [...sampleProperties];
    
    // Filter by price range
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    
    // Filter by size range
    filtered = filtered.filter(p => p.size >= sizeRange[0] && p.size <= sizeRange[1]);
    
    // Filter by location if any are selected
    if (selectedLocations.length > 0) {
      filtered = filtered.filter(p => selectedLocations.includes(p.location));
    }
    
    // Filter by minimum value score
    filtered = filtered.filter(p => p.valueScore >= minValueScore);
    
    // Remove already selected properties
    filtered = filtered.filter(p => !selectedProperties.some(sp => sp.id === p.id));
    
    setAvailableProperties(filtered);
  }, [priceRange, sizeRange, selectedLocations, minValueScore, selectedProperties]);

  // Toggle location selection
  const toggleLocation = (location: string) => {
    if (selectedLocations.includes(location)) {
      setSelectedLocations(prev => prev.filter(loc => loc !== location));
    } else {
      setSelectedLocations(prev => [...prev, location]);
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setPriceRange([7000000, 11000000]);
    setSizeRange([1000, 1500]);
    setSelectedLocations([]);
    setMinValueScore(80);
  };

  // Calculate comparison results when selected properties change
  useEffect(() => {
    if (selectedProperties.length < 2) {
      setComparisonResults({
        bestValue: null,
        bestLocation: null,
        mostAmenities: null,
        recommendation: null
      });
      return;
    }

    // Find best value property (highest value score)
    const bestValueProperty = selectedProperties.reduce((prev, current) => 
      prev.valueScore > current.valueScore ? prev : current
    );

    // Find property with most amenities
    const propertyWithMostAmenities = selectedProperties.reduce((prev, current) => 
      prev.amenities.length > current.amenities.length ? prev : current
    );

    // Simple location rank (in a real app this would be more sophisticated)
    const locationRank = {
      'Thoraipakkam, OMR': 10,
      'Sholinganallur, OMR': 9,
      'Navalur, OMR': 8,
      'Siruseri, OMR': 7,
      'Padur, OMR': 6,
      'Oragadam, Chennai': 5
    };

    const bestLocationProperty = selectedProperties.reduce((prev, current) => {
      const prevRank = locationRank[prev.location as keyof typeof locationRank] || 0;
      const currentRank = locationRank[current.location as keyof typeof locationRank] || 0;
      return prevRank > currentRank ? prev : current;
    });

    // Generate recommendation based on a weighted score
    const weightedScores = selectedProperties.map(property => {
      const valueWeight = 0.4;
      const priceWeight = 0.3;
      const amenitiesWeight = 0.2;
      const locationWeight = 0.1;

      // Calculate normalized scores (0-1)
      const valueScore = property.valueScore / 100;
      
      // Lower price is better (inverse relationship)
      const maxPrice = Math.max(...selectedProperties.map(p => p.price));
      const minPrice = Math.min(...selectedProperties.map(p => p.price));
      const priceScore = minPrice === maxPrice ? 1 : 1 - ((property.price - minPrice) / (maxPrice - minPrice));
      
      const maxAmenities = Math.max(...selectedProperties.map(p => p.amenities.length));
      const amenitiesScore = maxAmenities === 0 ? 0 : property.amenities.length / maxAmenities;
      
      const locationScore = (locationRank[property.location as keyof typeof locationRank] || 0) / 10;

      return {
        id: property.id,
        score: (valueScore * valueWeight) + (priceScore * priceWeight) + (amenitiesScore * amenitiesWeight) + (locationScore * locationWeight)
      };
    });

    const recommendedProperty = selectedProperties.find(p => 
      p.id === weightedScores.reduce((prev, current) => prev.score > current.score ? prev : current).id
    );

    setComparisonResults({
      bestValue: bestValueProperty.id,
      bestLocation: bestLocationProperty.id,
      mostAmenities: propertyWithMostAmenities.id,
      recommendation: recommendedProperty?.id || null
    });

  }, [selectedProperties]);

  // Add a property to comparison
  const addProperty = (property: ComparisonProperty) => {
    setSelectedProperties(prev => [...prev, property]);
    setAvailableProperties(prev => prev.filter(p => p.id !== property.id));
    setShowPropertySelector(false);
  };

  // Remove a property from comparison
  const removeProperty = (propertyId: string) => {
    const propertyToRemove = selectedProperties.find(p => p.id === propertyId);
    if (propertyToRemove) {
      setSelectedProperties(prev => prev.filter(p => p.id !== propertyId));
      setAvailableProperties(prev => [...prev, propertyToRemove]);
    }
  };

  // Format price in Indian format
  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else {
      return `₹${(price / 100000).toFixed(2)} L`;
    }
  };

  // Calculate monthly EMI
  const calculateEMI = (price: number) => {
    const loanAmount = price * (1 - downPaymentPercent / 100);
    const monthlyRate = interestRate / 12 / 100;
    const numPayments = loanTerm * 12;
    
    return (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
           (Math.pow(1 + monthlyRate, numPayments) - 1);
  };

  // Calculate ROI
  const calculateROI = (property: ComparisonProperty) => {
    const downPayment = property.price * (downPaymentPercent / 100);
    const monthlyEMI = calculateEMI(property.price);
    const annualEMI = monthlyEMI * 12;
    const annualRental = monthlyRental * 12;
    const netAnnualIncome = annualRental - annualEMI;
    const roi = (netAnnualIncome / downPayment) * 100;
    
    // Calculate property value after loan term
    const appreciatedValue = property.price * Math.pow(1 + annualAppreciation / 100, loanTerm);
    const totalAppreciation = appreciatedValue - property.price;
    
    // Calculate total investment
    const totalInvestment = downPayment + (monthlyEMI * loanTerm * 12) - (property.price * 0.8); // Assuming 80% loan
    
    // Calculate total return
    const totalReturn = totalAppreciation + (netAnnualIncome * loanTerm);
    
    // Calculate absolute ROI over the entire period
    const absoluteROI = (totalReturn / totalInvestment) * 100;
    
    return {
      monthlyEMI,
      annualEMI,
      annualRental,
      netAnnualIncome,
      roi,
      appreciatedValue,
      totalAppreciation,
      absoluteROI
    };
  };

  // Open ROI calculator for a specific property
  const openROICalculator = (propertyId: string) => {
    setSelectedPropertyForROI(propertyId);
    setShowROICalculator(true);
  };

  // Filter available properties based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const results = sampleProperties.filter(property => {
      // Filter out already selected properties
      if (selectedProperties.some(p => p.id === property.id)) {
        return false;
      }
      
      // Search in title, location, price, and amenities
      return (
        property.title.toLowerCase().includes(query) ||
        property.location.toLowerCase().includes(query) ||
        formatPrice(property.price).toLowerCase().includes(query) ||
        property.amenities.some(amenity => amenity.toLowerCase().includes(query)) ||
        property.bedrooms.toString().includes(query) ||
        property.bathrooms.toString().includes(query) ||
        property.size.toString().includes(query)
      );
    });
    
    setSearchResults(results);
  }, [searchQuery, selectedProperties]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim() !== '') {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
  };

  // Add a property from search results
  const addPropertyFromSearch = (property: ComparisonProperty) => {
    addProperty(property);
    clearSearch();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-neutral-200 overflow-hidden">
      <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
        <div className="flex items-center">
          <Layers className="w-5 h-5 text-electric mr-2" />
          <h2 className="text-xl font-medium text-neutral-900">
            {mode === 'visual' ? 'Visual Property Comparison' : 'Detailed Property Analysis'}
          </h2>
        </div>
        <div className="flex items-center space-x-3">
          {/* Search Input */}
          <div className="relative">
            <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden focus-within:border-electric transition-colors">
              <input
                type="text"
                placeholder="Search properties..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="px-3 py-2 outline-none text-sm w-44 md:w-60"
              />
              {searchQuery ? (
                <button
                  onClick={clearSearch}
                  className="pr-3 text-neutral-400 hover:text-neutral-600"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <span className="pr-3 text-neutral-400">
                  <Search className="w-4 h-4" />
                </span>
              )}
            </div>
            
            {/* Search Results Dropdown */}
            <AnimatePresence>
              {isSearching && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-neutral-200 max-h-80 overflow-y-auto z-50"
                >
                  {searchResults.length > 0 ? (
                    <div className="py-2">
                      {searchResults.map((property) => (
                        <motion.div
                          key={property.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="px-3 py-2 hover:bg-neutral-50 cursor-pointer flex items-center"
                          onClick={() => addPropertyFromSearch(property)}
                        >
                          <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0 mr-3">
                            <img
                              src={property.image}
                              alt={property.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-neutral-900 truncate">{property.title}</div>
                            <div className="text-xs text-neutral-500 flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              <span className="truncate">{property.location}</span>
                            </div>
                          </div>
                          <div className="ml-2 text-electric font-medium">{formatPrice(property.price)}</div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <Search className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                      <p className="text-neutral-500">No properties found matching "{searchQuery}"</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {selectedProperties.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowScoreCards(!showScoreCards)}
              className="px-3 py-1.5 border rounded-lg text-sm font-medium transition-colors flex items-center border-neutral-200 text-neutral-500 hover:border-electric/50"
              title={showScoreCards ? "Hide Score Cards" : "Show Score Cards"}
            >
              {showScoreCards ? <EyeOff className="w-3 h-3 mr-1" /> : <Eye className="w-3 h-3 mr-1" />}
              <span>Scores</span>
            </motion.button>
          )}
          
          {selectedProperties.length < 3 && (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowPropertySelector(true)}
              className="px-4 py-2 bg-electric text-white rounded-lg text-sm font-medium hover:bg-electric-dark transition-colors flex items-center shadow-md"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Property
            </motion.button>
          )}
          
          {selectedProperties.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShow3DView(!show3DView)}
              className="px-3 py-1.5 border rounded-lg text-sm font-medium transition-colors flex items-center border-neutral-200 text-neutral-500 hover:border-electric/50"
            >
              {show3DView ? <Minimize className="w-3 h-3 mr-1" /> : <Maximize className="w-3 h-3 mr-1" />}
              <span>{show3DView ? "2D View" : "3D View"}</span>
            </motion.button>
          )}
        </div>
      </div>
      
      {/* Advanced filter panel */}
      <AnimatePresence>
        {showFilterPanel && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-b border-neutral-200"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-medium text-neutral-900">Advanced Property Filters</h3>
                <button 
                  onClick={resetFilters}
                  className="text-sm text-electric hover:underline"
                >
                  Reset All
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Price Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Price Range</label>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-neutral-500">{formatPrice(priceRange[0])}</span>
                    <span className="text-sm text-neutral-500">{formatPrice(priceRange[1])}</span>
                  </div>
                  <input 
                    type="range" 
                    min={7000000} 
                    max={11000000} 
                    step={100000}
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <input 
                    type="range" 
                    min={7000000} 
                    max={11000000} 
                    step={100000}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer mt-1"
                  />
                </div>
                
                {/* Size Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Area (sq.ft)</label>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-neutral-500">{sizeRange[0]} sq.ft</span>
                    <span className="text-sm text-neutral-500">{sizeRange[1]} sq.ft</span>
                  </div>
                  <input 
                    type="range" 
                    min={1000} 
                    max={1500} 
                    step={10}
                    value={sizeRange[0]}
                    onChange={(e) => setSizeRange([parseInt(e.target.value), sizeRange[1]])}
                    className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <input 
                    type="range" 
                    min={1000} 
                    max={1500} 
                    step={10}
                    value={sizeRange[1]}
                    onChange={(e) => setSizeRange([sizeRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer mt-1"
                  />
                </div>
                
                {/* Value Score Filter */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Minimum Value Score</label>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-neutral-500">Minimum: {minValueScore}/100</span>
                  </div>
                  <input 
                    type="range" 
                    min={70} 
                    max={95} 
                    step={1}
                    value={minValueScore}
                    onChange={(e) => setMinValueScore(parseInt(e.target.value))}
                    className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                
                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Locations</label>
                  <div className="flex flex-wrap gap-2">
                    {allLocations.map(location => (
                      <button
                        key={location}
                        onClick={() => toggleLocation(location)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                          selectedLocations.includes(location)
                            ? 'bg-electric text-white'
                            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                        }`}
                      >
                        {location.split(',')[0]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-3 bg-neutral-50 rounded-lg text-sm text-neutral-500 flex items-start">
                <InfoIcon className="w-4 h-4 text-neutral-400 mt-0.5 mr-2 flex-shrink-0" />
                <p>Filters will be applied when adding new properties to your comparison. Current filters show {availableProperties.length} available properties.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="p-6">
        {selectedProperties.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <Building className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            </motion.div>
            <h3 className="text-xl font-medium text-neutral-700 mb-2">No Properties Selected</h3>
            <p className="text-neutral-500 mb-6 max-w-md mx-auto">
              Add properties to compare them side by side and find the perfect match for your needs.
            </p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowPropertySelector(true)}
              className="px-6 py-3 bg-electric text-white rounded-lg font-medium hover:bg-electric-dark transition-colors shadow-md"
            >
              Select Properties to Compare
            </motion.button>
          </motion.div>
        ) : (
          <div>
            {/* Score Cards Row */}
            <AnimatePresence>
              {showScoreCards && selectedProperties.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-8"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {selectedProperties.map((property) => {
                      const isRecommended = comparisonResults.recommendation === property.id;
                      return (
                        <motion.div
                          key={property.id}
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 300 }}
                          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                          className={`rounded-xl overflow-hidden shadow relative ${
                            isRecommended ? 'border-2 border-green-400' : 'border border-neutral-200'
                          }`}
                        >
                          {isRecommended && (
                            <div className="absolute top-0 right-0 bg-green-400 text-white px-2 py-1 text-xs font-medium z-10 rounded-bl-lg flex items-center">
                              <Trophy className="w-3 h-3 mr-1" />
                              Top Pick
                            </div>
                          )}
                          
                          <div className="bg-gradient-to-b from-neutral-800 to-neutral-900 p-3 text-white">
                            <h3 className="font-medium text-sm truncate">{property.title}</h3>
                            <div className="flex items-center text-neutral-300 text-xs">
                              <MapPin className="w-3 h-3 mr-1" />
                              <span className="truncate">{property.location}</span>
                            </div>
                          </div>
                          
                          <div className="p-4 bg-white">
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-lg font-bold text-electric">{formatPrice(property.price)}</span>
                              <motion.div
                                initial={{ scale: 1 }}
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                                className="h-9 w-9 bg-neutral-100 rounded-full flex items-center justify-center"
                              >
                                <span className="text-sm font-bold text-neutral-700">{property.valueScore}</span>
                              </motion.div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                              <div className="flex items-center">
                                <Ruler className="w-3 h-3 text-neutral-500 mr-1" />
                                <span>{property.size} sq.ft</span>
                              </div>
                              <div className="flex items-center">
                                <Bed className="w-3 h-3 text-neutral-500 mr-1" />
                                <span>{property.bedrooms} Beds</span>
                              </div>
                              <div className="flex items-center">
                                <Bath className="w-3 h-3 text-neutral-500 mr-1" />
                                <span>{property.bathrooms} Baths</span>
                              </div>
                              <div className="flex items-center">
                                <Home className="w-3 h-3 text-neutral-500 mr-1" />
                                <span>{property.amenities.length} Amenities</span>
                              </div>
                            </div>
                            
                            <div className="flex justify-between">
                              <button
                                onClick={() => setActivePropertyView(property.id)}
                                className="text-xs flex items-center text-electric hover:underline"
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                View Details
                              </button>
                              <button
                                onClick={() => removeProperty(property.id)}
                                className="text-xs flex items-center text-red-500 hover:underline"
                              >
                                <X className="w-3 h-3 mr-1" />
                                Remove
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* 3D View */}
            <AnimatePresence>
              {show3DView && selectedProperties.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mb-8 bg-gradient-to-b from-neutral-900 to-neutral-800 rounded-xl p-6 relative overflow-hidden"
                  style={{ height: '400px' }}
                >
                  <div className="absolute inset-0 opacity-30">
                    {Array.from({ length: 50 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute rounded-full bg-white"
                        initial={{ 
                          x: Math.random() * 100 + '%', 
                          y: Math.random() * 100 + '%',
                          opacity: Math.random() * 0.5,
                          scale: Math.random() * 0.5
                        }}
                        animate={{ 
                          y: [null, '-20px', '0px'],
                          opacity: [null, Math.random() * 0.8, Math.random() * 0.2]
                        }}
                        transition={{ 
                          duration: 3 + Math.random() * 7,
                          repeat: Infinity,
                          repeatType: "reverse"
                        }}
                        style={{
                          width: (1 + Math.random() * 3) + 'px',
                          height: (1 + Math.random() * 3) + 'px',
                        }}
                      />
                    ))}
                  </div>
                  
                  <h3 className="font-medium text-white mb-4 relative z-10 flex items-center">
                    <Zap className="w-4 h-4 text-electric mr-2" />
                    3D Property Visualization
                  </h3>
                  
                  <div className="flex justify-around relative z-10">
                    {selectedProperties.map((property, index) => {
                      const isRecommended = comparisonResults.recommendation === property.id;
                      // Calculate position based on index for circular arrangement
                      const angle = (index / selectedProperties.length) * Math.PI * 2;
                      const radius = 120; // radius of circle
                      const x = Math.cos(angle) * radius;
                      const z = Math.sin(angle) * radius;
                      
                      return (
                        <motion.div
                          key={property.id}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.2, type: "spring" }}
                          style={{ 
                            perspective: '800px',
                            transformStyle: 'preserve-3d',
                          }}
                          className="relative"
                        >
                          <motion.div
                            animate={{ 
                              rotateY: [0, 10, 0, -10, 0],
                              rotateX: [0, 5, 0, -5, 0]
                            }}
                            transition={{ 
                              duration: 10,
                              repeat: Infinity,
                              repeatType: "loop"
                            }}
                            className="w-40 h-40 relative rounded-lg overflow-hidden shadow-xl"
                            style={{
                              transform: `translateZ(${z}px) translateX(${x}px) rotateY(${angle * 50}deg)`,
                            }}
                          >
                            <div 
                              className="absolute inset-0 bg-cover bg-center"
                              style={{ backgroundImage: `url(${property.image})` }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                            
                            <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                              <p className="font-medium text-sm truncate">{property.title}</p>
                              <p className="text-xs text-white/70 truncate">{property.location}</p>
                              <div className="flex justify-between items-center mt-1">
                                <span className="text-xs font-bold">{formatPrice(property.price)}</span>
                                {isRecommended && (
                                  <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="flex items-center bg-green-500/80 text-white text-xs px-1.5 py-0.5 rounded"
                                  >
                                    <Star className="w-2 h-2 mr-0.5 fill-white" />
                                    Best Pick
                                  </motion.div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                          
                          {isRecommended && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.5 + index * 0.2 }}
                              className="absolute -bottom-8 left-0 right-0 flex justify-center"
                            >
                              <motion.div
                                animate={{ y: [0, -5, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                className="bg-electric/90 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs flex items-center"
                              >
                                <Lightbulb className="w-3 h-3 mr-1 fill-yellow-200 text-yellow-200" />
                                Top Recommendation
                              </motion.div>
                            </motion.div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="absolute bottom-6 left-0 right-0 flex justify-center"
                  >
                    <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm">
                      Drag to rotate | Scroll to zoom
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Interactive Comparison Matrix */}
            {selectedProperties.length > 1 && mode === 'visual' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8 bg-white border border-neutral-100 rounded-xl overflow-hidden"
              >
                <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
                  <h3 className="font-medium text-neutral-900 flex items-center">
                    <BarChart className="w-4 h-4 text-electric mr-2" />
                    Interactive Comparison Matrix
                  </h3>
                </div>
                
                <div className="p-6">
                  {/* Radar Chart */}
                  <div className="mb-8 flex items-center justify-center">
                    <div className="relative w-[300px] h-[300px]">
                      {/* Radar background circles */}
                      {[0.2, 0.4, 0.6, 0.8, 1].map((radius, i) => (
                        <div 
                          key={i}
                          className="absolute rounded-full border border-neutral-200"
                          style={{
                            top: `${50 - radius * 50}%`,
                            left: `${50 - radius * 50}%`,
                            width: `${radius * 100}%`,
                            height: `${radius * 100}%`,
                          }}
                        />
                      ))}
                      
                      {/* Radar axes */}
                      {['Value', 'Price', 'Size', 'Location', 'Amenities'].map((attribute, i) => {
                        const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
                        const x = Math.cos(angle) * 50 + 50;
                        const y = Math.sin(angle) * 50 + 50;
                        const labelX = Math.cos(angle) * 55 + 50;
                        const labelY = Math.sin(angle) * 55 + 50;
                        
                        return (
                          <React.Fragment key={attribute}>
                            <div 
                              className="absolute h-px bg-neutral-200"
                              style={{
                                top: '50%',
                                left: '50%',
                                width: '50%',
                                transformOrigin: 'left center',
                                transform: `rotate(${angle * 180 / Math.PI}deg)`,
                              }}
                            />
                            <div 
                              className="absolute text-xs font-medium text-neutral-500"
                              style={{
                                top: `${labelY}%`,
                                left: `${labelX}%`,
                                transform: 'translate(-50%, -50%)',
                              }}
                            >
                              {attribute}
                            </div>
                          </React.Fragment>
                        );
                      })}
                      
                      {/* Property polygons */}
                      {selectedProperties.map((property, propIndex) => {
                        // Calculate scores for each attribute (0-1)
                        const normalizedScores = {
                          value: property.valueScore / 100,
                          price: 1 - (property.price - 7000000) / (11000000 - 7000000), // Inverse of price (lower is better)
                          size: (property.size - 1000) / (1500 - 1000),
                          location: ['Thoraipakkam, OMR', 'Sholinganallur, OMR'].includes(property.location) ? 0.9 : 
                                   ['Navalur, OMR', 'Siruseri, OMR'].includes(property.location) ? 0.7 : 0.5,
                          amenities: property.amenities.length / 10,
                        };
                        
                        // Create polygon points
                        const attributes = ['value', 'price', 'size', 'location', 'amenities'];
                        const points = attributes.map((attr, i) => {
                          const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
                          const score = normalizedScores[attr as keyof typeof normalizedScores];
                          const x = Math.cos(angle) * score * 50 + 50;
                          const y = Math.sin(angle) * score * 50 + 50;
                          return `${x}% ${y}%`;
                        }).join(', ');
                        
                        const isRecommended = comparisonResults.recommendation === property.id;
                        const colors = [
                          { fill: 'rgba(34, 211, 238, 0.2)', stroke: 'rgb(34, 211, 238)' }, // cyan
                          { fill: 'rgba(168, 85, 247, 0.2)', stroke: 'rgb(168, 85, 247)' }, // purple
                          { fill: 'rgba(236, 72, 153, 0.2)', stroke: 'rgb(236, 72, 153)' }, // pink
                        ];
                        
                        return (
                          <motion.div
                            key={property.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 + propIndex * 0.2 }}
                            className="absolute inset-0"
                          >
                            {/* Polygon */}
                            <div
                              className={`absolute inset-0 ${isRecommended ? 'z-20' : 'z-10'}`}
                              style={{
                                clipPath: `polygon(${points})`,
                                backgroundColor: colors[propIndex].fill,
                                border: `2px solid ${colors[propIndex].stroke}`,
                              }}
                            />
                            
                            {/* Score dots */}
                            {attributes.map((attr, i) => {
                              const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
                              const score = normalizedScores[attr as keyof typeof normalizedScores];
                              const x = Math.cos(angle) * score * 50 + 50;
                              const y = Math.sin(angle) * score * 50 + 50;
                              
                              return (
                                <motion.div
                                  key={`${property.id}-${attr}`}
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ delay: 0.5 + propIndex * 0.2 + i * 0.1, type: "spring" }}
                                  className="absolute w-3 h-3 rounded-full bg-white border-2 z-30"
                                  style={{
                                    top: `${y}%`,
                                    left: `${x}%`,
                                    transform: 'translate(-50%, -50%)',
                                    borderColor: colors[propIndex].stroke,
                                  }}
                                />
                              );
                            })}
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Legend */}
                  <div className="flex justify-center space-x-6">
                    {selectedProperties.map((property, i) => {
                      const colors = [
                        'rgb(34, 211, 238)', // cyan
                        'rgb(168, 85, 247)', // purple
                        'rgb(236, 72, 153)', // pink
                      ];
                      const isRecommended = comparisonResults.recommendation === property.id;
                      
                      return (
                        <div key={property.id} className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: colors[i] }}
                          />
                          <span className={`text-sm ${isRecommended ? 'font-medium text-neutral-900' : 'text-neutral-600'}`}>
                            {property.title.split(' ')[0]}
                            {isRecommended && (
                              <span className="ml-1 inline-flex items-center text-green-600 text-xs">
                                <Star className="w-3 h-3 fill-green-600 text-green-600 mr-0.5" />
                                Best
                              </span>
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Insights */}
                  {comparisonResults.recommendation && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="mt-6 p-4 bg-neutral-50 rounded-lg border border-neutral-100"
                    >
                      <div className="flex items-start">
                        <Lightbulb className="w-5 h-5 text-amber-500 mr-2 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-neutral-900 mb-1">AI Insight</h4>
                          <p className="text-sm text-neutral-600">
                            {selectedProperties.find(p => p.id === comparisonResults.recommendation)?.title} shows the best 
                            balance across all key metrics. It scores particularly high on 
                            {selectedProperties.find(p => p.id === comparisonResults.bestValue) === 
                            selectedProperties.find(p => p.id === comparisonResults.recommendation) 
                              ? ' value score' : ''}
                            {selectedProperties.find(p => p.id === comparisonResults.bestLocation) === 
                            selectedProperties.find(p => p.id === comparisonResults.recommendation) 
                              ? ' location rating' : ''}
                            {selectedProperties.find(p => p.id === comparisonResults.mostAmenities) === 
                            selectedProperties.find(p => p.id === comparisonResults.recommendation) 
                              ? ' amenities count' : ''}, 
                            making it the top recommendation based on your comparison criteria.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
            
            {/* Detailed Comparison Table - always shown, but styled differently per mode */}
            <div className={`mb-8 overflow-x-auto ${mode === 'detailed' ? 'border border-neutral-100 rounded-lg' : ''}`}>
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left p-3 text-neutral-500 font-medium border-b border-neutral-200"></th>
                    {selectedProperties.map((property) => (
                      <th key={property.id} className="border-b border-neutral-200 p-3 min-w-[250px]">
                        <motion.div 
                          className="relative"
                          whileHover={{ y: -3 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <button 
                            onClick={() => removeProperty(property.id)}
                            className="absolute -top-3 -right-3 w-7 h-7 bg-neutral-100 hover:bg-neutral-200 rounded-full flex items-center justify-center text-neutral-500 hover:text-neutral-700 transition-colors z-10"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <div className="relative group">
                            <img 
                              src={property.image} 
                              alt={property.title} 
                              className="w-full h-32 object-cover rounded-lg mb-3" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-end justify-center">
                              <button className="mb-4 px-3 py-1.5 bg-white/90 rounded-full text-xs font-medium text-neutral-800 flex items-center">
                                <Camera className="w-3 h-3 mr-1" />
                                View Gallery
                              </button>
                            </div>
                          </div>
                          <h3 className="font-medium text-neutral-900 mb-1">{property.title}</h3>
                          <div className="flex items-center text-neutral-500 text-sm mb-2">
                            <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                            <span className="truncate">{property.location}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-electric">{formatPrice(property.price)}</span>
                            <motion.span 
                              initial={{ scale: 1 }}
                              animate={{ 
                                scale: comparisonResults.recommendation === property.id ? [1, 1.1, 1] : 1 
                              }}
                              transition={{ 
                                repeat: comparisonResults.recommendation === property.id ? Infinity : 0,
                                repeatDelay: 2
                              }}
                              className={`text-xs px-2 py-1 rounded-full ${
                                comparisonResults.recommendation === property.id 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-neutral-100 text-neutral-600'
                              }`}
                            >
                              {comparisonResults.recommendation === property.id ? (
                                <div className="flex items-center">
                                  <Star className="w-3 h-3 mr-1 text-yellow-500 fill-yellow-500" />
                                  <span>Recommended</span>
                                </div>
                              ) : (
                                <span>Value Score: {property.valueScore}</span>
                              )}
                            </motion.span>
                          </div>
                        </motion.div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Price Row - with enhanced hover effects */}
                  <tr className={`${highlightedFeature === 'price' ? 'bg-blue-50' : ''} transition-colors duration-200`}>
                    <td 
                      className="p-3 font-medium border-b border-neutral-200 sticky left-0 bg-white"
                      onMouseEnter={() => setHighlightedFeature('price')}
                      onMouseLeave={() => setHighlightedFeature(null)}
                    >
                      <div className="flex items-center">
                        <Tag className="w-4 h-4 text-blue-500 mr-2" />
                        <span>Price</span>
                      </div>
                    </td>
                    {selectedProperties.map((property) => {
                      const isLowest = property.price === Math.min(...selectedProperties.map(p => p.price));
                      return (
                        <td 
                          key={property.id} 
                          className={`p-3 border-b border-neutral-200 ${isLowest ? 'font-medium' : ''} transition-colors duration-200`}
                          onMouseEnter={() => setHighlightedFeature('price')}
                          onMouseLeave={() => setHighlightedFeature(null)}
                        >
                          <motion.div 
                            className="flex items-center"
                            whileHover={{ x: 5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <span className={isLowest ? 'text-green-600' : ''}>{formatPrice(property.price)}</span>
                            {isLowest && (
                              <motion.div
                                initial={{ x: -10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                              >
                                <ArrowRight className="w-4 h-4 text-green-500 ml-1" />
                              </motion.div>
                            )}
                          </motion.div>
                        </td>
                      );
                    })}
                  </tr>
                  
                  {/* Size Row */}
                  <tr className={`${highlightedFeature === 'size' ? 'bg-blue-50' : ''}`}>
                    <td 
                      className="p-3 font-medium border-b border-neutral-200 sticky left-0 bg-white"
                      onMouseEnter={() => setHighlightedFeature('size')}
                      onMouseLeave={() => setHighlightedFeature(null)}
                    >
                      <div className="flex items-center">
                        <Ruler className="w-4 h-4 text-blue-500 mr-2" />
                        <span>Area</span>
                      </div>
                    </td>
                    {selectedProperties.map((property) => {
                      const isLargest = property.size === Math.max(...selectedProperties.map(p => p.size));
                      return (
                        <td 
                          key={property.id} 
                          className={`p-3 border-b border-neutral-200 ${isLargest ? 'font-medium' : ''}`}
                          onMouseEnter={() => setHighlightedFeature('size')}
                          onMouseLeave={() => setHighlightedFeature(null)}
                        >
                          <div className="flex items-center">
                            <span className={isLargest ? 'text-green-600' : ''}>{property.size} sq.ft</span>
                            {isLargest && <ArrowRight className="w-4 h-4 text-green-500 ml-1" />}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                  
                  {/* Price per sq ft Row */}
                  <tr className={`${highlightedFeature === 'pricepersqft' ? 'bg-blue-50' : ''}`}>
                    <td 
                      className="p-3 font-medium border-b border-neutral-200 sticky left-0 bg-white"
                      onMouseEnter={() => setHighlightedFeature('pricepersqft')}
                      onMouseLeave={() => setHighlightedFeature(null)}
                    >
                      <div className="flex items-center">
                        <Tag className="w-4 h-4 text-blue-500 mr-2" />
                        <span>Price per sq.ft</span>
                      </div>
                    </td>
                    {selectedProperties.map((property) => {
                      const pricePerSqFt = Math.round(property.price / property.size);
                      const isLowest = pricePerSqFt === Math.min(
                        ...selectedProperties.map(p => Math.round(p.price / p.size))
                      );
                      return (
                        <td 
                          key={property.id} 
                          className={`p-3 border-b border-neutral-200 ${isLowest ? 'font-medium' : ''}`}
                          onMouseEnter={() => setHighlightedFeature('pricepersqft')}
                          onMouseLeave={() => setHighlightedFeature(null)}
                        >
                          <div className="flex items-center">
                            <span className={isLowest ? 'text-green-600' : ''}>₹{pricePerSqFt.toLocaleString('en-IN')}</span>
                            {isLowest && <ArrowRight className="w-4 h-4 text-green-500 ml-1" />}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                  
                  {/* Bedrooms Row */}
                  <tr className={`${highlightedFeature === 'bedrooms' ? 'bg-blue-50' : ''}`}>
                    <td 
                      className="p-3 font-medium border-b border-neutral-200 sticky left-0 bg-white"
                      onMouseEnter={() => setHighlightedFeature('bedrooms')}
                      onMouseLeave={() => setHighlightedFeature(null)}
                    >
                      <div className="flex items-center">
                        <Bed className="w-4 h-4 text-blue-500 mr-2" />
                        <span>Bedrooms</span>
                      </div>
                    </td>
                    {selectedProperties.map((property) => (
                      <td 
                        key={property.id} 
                        className="p-3 border-b border-neutral-200"
                        onMouseEnter={() => setHighlightedFeature('bedrooms')}
                        onMouseLeave={() => setHighlightedFeature(null)}
                      >
                        {property.bedrooms}
                      </td>
                    ))}
                  </tr>
                  
                  {/* Bathrooms Row */}
                  <tr className={`${highlightedFeature === 'bathrooms' ? 'bg-blue-50' : ''}`}>
                    <td 
                      className="p-3 font-medium border-b border-neutral-200 sticky left-0 bg-white"
                      onMouseEnter={() => setHighlightedFeature('bathrooms')}
                      onMouseLeave={() => setHighlightedFeature(null)}
                    >
                      <div className="flex items-center">
                        <Bath className="w-4 h-4 text-blue-500 mr-2" />
                        <span>Bathrooms</span>
                      </div>
                    </td>
                    {selectedProperties.map((property) => (
                      <td 
                        key={property.id} 
                        className="p-3 border-b border-neutral-200"
                        onMouseEnter={() => setHighlightedFeature('bathrooms')}
                        onMouseLeave={() => setHighlightedFeature(null)}
                      >
                        {property.bathrooms}
                      </td>
                    ))}
                  </tr>
                  
                  {/* Location Row */}
                  <tr className={`${highlightedFeature === 'location' ? 'bg-blue-50' : ''}`}>
                    <td 
                      className="p-3 font-medium border-b border-neutral-200 sticky left-0 bg-white"
                      onMouseEnter={() => setHighlightedFeature('location')}
                      onMouseLeave={() => setHighlightedFeature(null)}
                    >
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-blue-500 mr-2" />
                        <span>Location</span>
                      </div>
                    </td>
                    {selectedProperties.map((property) => (
                      <td 
                        key={property.id} 
                        className={`p-3 border-b border-neutral-200 ${comparisonResults.bestLocation === property.id ? 'font-medium' : ''}`}
                        onMouseEnter={() => setHighlightedFeature('location')}
                        onMouseLeave={() => setHighlightedFeature(null)}
                      >
                        <div className="flex items-center">
                          <span className={comparisonResults.bestLocation === property.id ? 'text-green-600' : ''}>{property.location}</span>
                          {comparisonResults.bestLocation === property.id && <ArrowRight className="w-4 h-4 text-green-500 ml-1" />}
                        </div>
                      </td>
                    ))}
                  </tr>
                  
                  {/* Value Score Row */}
                  <tr className={`${highlightedFeature === 'value' ? 'bg-blue-50' : ''}`}>
                    <td 
                      className="p-3 font-medium border-b border-neutral-200 sticky left-0 bg-white"
                      onMouseEnter={() => setHighlightedFeature('value')}
                      onMouseLeave={() => setHighlightedFeature(null)}
                    >
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-blue-500 mr-2" />
                        <span>Value Score</span>
                      </div>
                    </td>
                    {selectedProperties.map((property) => (
                      <td 
                        key={property.id} 
                        className={`p-3 border-b border-neutral-200 ${comparisonResults.bestValue === property.id ? 'font-medium' : ''}`}
                        onMouseEnter={() => setHighlightedFeature('value')}
                        onMouseLeave={() => setHighlightedFeature(null)}
                      >
                        <div className="flex items-center">
                          <motion.div 
                            className="flex items-center"
                            initial={{ scale: 1 }}
                            animate={{ 
                              scale: comparisonResults.bestValue === property.id ? [1, 1.05, 1] : 1 
                            }}
                            transition={{ 
                              repeat: comparisonResults.bestValue === property.id ? Infinity : 0,
                              repeatDelay: 3
                            }}
                          >
                            <span className={comparisonResults.bestValue === property.id ? 'text-green-600' : ''}>{property.valueScore}/100</span>
                            {comparisonResults.bestValue === property.id && <ArrowRight className="w-4 h-4 text-green-500 ml-1" />}
                          </motion.div>
                        </div>
                      </td>
                    ))}
                  </tr>
                  
                  {/* Amenities Row */}
                  <tr className={`${highlightedFeature === 'amenities' ? 'bg-blue-50' : ''}`}>
                    <td 
                      className="p-3 font-medium border-b border-neutral-200 sticky left-0 bg-white"
                      onMouseEnter={() => setHighlightedFeature('amenities')}
                      onMouseLeave={() => setHighlightedFeature(null)}
                    >
                      <div className="flex items-center">
                        <Home className="w-4 h-4 text-blue-500 mr-2" />
                        <span>Amenities</span>
                      </div>
                    </td>
                    {selectedProperties.map((property) => (
                      <td 
                        key={property.id} 
                        className={`p-3 border-b border-neutral-200 ${comparisonResults.mostAmenities === property.id ? 'font-medium' : ''}`}
                        onMouseEnter={() => setHighlightedFeature('amenities')}
                        onMouseLeave={() => setHighlightedFeature(null)}
                      >
                        <div className="flex flex-wrap gap-1 mb-1">
                          {property.amenities.slice(0, 3).map((amenity, index) => (
                            <span key={index} className="px-2 py-0.5 bg-neutral-100 text-neutral-700 rounded-full text-xs">
                              {amenity}
                            </span>
                          ))}
                          {property.amenities.length > 3 && (
                            <span className="px-2 py-0.5 bg-neutral-100 text-neutral-700 rounded-full text-xs">
                              +{property.amenities.length - 3} more
                            </span>
                          )}
                        </div>
                        {comparisonResults.mostAmenities === property.id && (
                          <div className="flex items-center text-green-600 text-xs mt-1">
                            <Check className="w-3 h-3 mr-1" />
                            <span>Most amenities</span>
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            
            {/* AI Recommendation Section - Enhanced with more details in detailed mode */}
            {selectedProperties.length > 1 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`mt-4 p-5 rounded-lg border ${
                  mode === 'detailed' 
                    ? 'border-electric bg-electric/10' 
                    : 'border-electric/30 bg-electric/5'
                }`}
              >
                <div className="flex items-start">
                  <motion.div
                    animate={{ rotateY: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                    className="mr-3 mt-0.5"
                  >
                    <Sparkles className="w-5 h-5 text-electric" />
                  </motion.div>
                  
                  <div>
                    <h3 className="font-medium text-neutral-900 mb-1">AI Comparison Insights</h3>
                    <p className="text-neutral-600 text-sm">
                      {comparisonResults.recommendation ? (
                        <>
                          Based on our analysis, <span className="font-medium text-electric">{
                            selectedProperties.find(p => p.id === comparisonResults.recommendation)?.title
                          }</span> offers the best overall value considering price, location, amenities, and value score.
                        </>
                      ) : 'Add more properties to see AI-powered comparison insights.'}
                    </p>
                    
                    {comparisonResults.recommendation && (
                      <>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <div className="px-3 py-1 bg-white rounded-full text-xs text-green-700 border border-green-200 flex items-center">
                            <Tag className="w-3 h-3 mr-1" />
                            Best Price-to-Value Ratio
                          </div>
                          <div className="px-3 py-1 bg-white rounded-full text-xs text-blue-700 border border-blue-200 flex items-center">
                            <Bed className="w-3 h-3 mr-1" />
                            Optimal Space Utilization
                          </div>
                          <div className="px-3 py-1 bg-white rounded-full text-xs text-purple-700 border border-purple-200 flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            Excellent Location
                          </div>
                          <div className="px-3 py-1 bg-white rounded-full text-xs text-amber-700 border border-amber-200 flex items-center">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            High Appreciation Potential
                          </div>
                        </div>
                        
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedProperties.map(property => {
                            const isRecommended = comparisonResults.recommendation === property.id;
                            return (
                              <div 
                                key={property.id}
                                className={`p-3 rounded-lg border ${isRecommended ? 'border-green-200 bg-green-50' : 'border-neutral-200 bg-white'}`}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-medium text-neutral-900">{property.title}</h4>
                                  {isRecommended && (
                                    <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full flex items-center">
                                      <Star className="w-3 h-3 mr-1 fill-yellow-500 text-yellow-500" />
                                      Top Pick
                                    </span>
                                  )}
                                </div>
                                <div className="text-sm text-neutral-600 space-y-1">
                                  <div className="flex justify-between">
                                    <span>Expected Appreciation:</span>
                                    <span className="font-medium text-electric">8.5% per year</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Rental Yield:</span>
                                    <span className="font-medium text-electric">3.8%</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Break-Even Period:</span>
                                    <span className="font-medium text-electric">10 years</span>
                                  </div>
                                </div>
                                <button 
                                  onClick={() => openROICalculator(property.id)}
                                  className="mt-3 w-full py-1.5 text-sm rounded-lg border border-electric text-electric hover:bg-electric hover:text-white transition-colors flex items-center justify-center"
                                >
                                  <Calculator className="w-3 h-3 mr-1" />
                                  Calculate ROI
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
      
      {/* Property Selector Modal - Enhanced with animations and interactive elements */}
      <AnimatePresence>
        {showPropertySelector && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowPropertySelector(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 20 }}
              className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 flex items-center">
                    <Layers className="w-5 h-5 text-electric mr-2" />
                    Select Properties to Compare
                  </h3>
                  <p className="text-sm text-neutral-600 mt-1">
                    Choose up to {3 - selectedProperties.length} more properties to add to your comparison
                  </p>
                </div>
                <button 
                  onClick={() => setShowPropertySelector(false)}
                  className="p-2 rounded-full hover:bg-neutral-100 transition-colors"
                >
                  <X className="w-5 h-5 text-neutral-500" />
                </button>
              </div>
              
              {availableProperties.length > 0 ? (
                <div className="p-6 overflow-y-auto max-h-[calc(80vh-8rem)]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {availableProperties.map((property, index) => (
                      <motion.div
                        key={property.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: 'spring', damping: 15, delay: index * 0.1 }}
                        className="border border-neutral-200 rounded-lg overflow-hidden hover:border-electric transition-colors cursor-pointer hover:shadow-md"
                        onClick={() => addProperty(property)}
                        whileHover={{ y: -5 }}
                      >
                        <div className="relative">
                          <img 
                            src={property.image} 
                            alt={property.title} 
                            className="w-full h-36 object-cover" 
                          />
                          <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-full text-xs font-medium text-neutral-700 flex items-center">
                            <Star className="w-3 h-3 mr-1 text-yellow-500" />
                            Value Score: {property.valueScore}/100
                          </div>
                          
                          <div className="absolute top-2 left-2 flex flex-col space-y-1">
                            <span className="bg-electric/90 text-white text-xs px-2 py-1 rounded-full flex items-center">
                              <Tag className="w-3 h-3 mr-1" />
                              {formatPrice(property.price)}
                            </span>
                            <span className="bg-neutral-800/80 text-white text-xs px-2 py-1 rounded-full flex items-center">
                              <Ruler className="w-3 h-3 mr-1" />
                              {property.size} sq.ft
                            </span>
                          </div>
                          
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end justify-center">
                            <motion.button 
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="mb-4 px-3 py-1.5 bg-white text-electric font-medium rounded-full text-sm flex items-center"
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Add to Comparison
                            </motion.button>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="mb-3">
                            <h4 className="font-medium text-neutral-900 mb-1">{property.title}</h4>
                            <div className="flex items-center text-neutral-500 text-sm">
                              <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                              <span className="truncate">{property.location}</span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 mb-3">
                            <div className="flex items-center text-neutral-700 text-sm">
                              <Bed className="w-3 h-3 text-neutral-500 mr-1" />
                              <span>{property.bedrooms} Beds</span>
                            </div>
                            <div className="flex items-center text-neutral-700 text-sm">
                              <Bath className="w-3 h-3 text-neutral-500 mr-1" />
                              <span>{property.bathrooms} Baths</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-1 mb-3">
                            {property.amenities.slice(0, 3).map((amenity, i) => (
                              <span key={i} className="px-2 py-0.5 bg-neutral-100 text-neutral-700 rounded-full text-xs">
                                {amenity}
                              </span>
                            ))}
                            {property.amenities.length > 3 && (
                              <span className="px-2 py-0.5 bg-neutral-100 text-neutral-700 rounded-full text-xs">
                                +{property.amenities.length - 3} more
                              </span>
                            )}
                          </div>
                          
                          <div className="mt-2 pt-2 border-t border-neutral-100">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-sm text-green-600">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                <span>High appreciation potential</span>
                              </div>
                              <Heart className="w-4 h-4 text-neutral-300 hover:text-red-500 transition-colors cursor-pointer" />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                  >
                    <AlertTriangle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                  </motion.div>
                  <h3 className="text-xl font-medium text-neutral-700 mb-2">No More Properties Available</h3>
                  <p className="text-neutral-500 mb-6 max-w-md mx-auto">
                    You've added all available properties that match your filters to your comparison.
                  </p>
                  <button
                    onClick={() => {
                      resetFilters();
                      setShowFilterPanel(true);
                    }}
                    className="px-6 py-3 bg-electric text-white rounded-lg font-medium hover:bg-electric-dark transition-colors shadow-md"
                  >
                    Adjust Filters
                  </button>
                </div>
              )}
              
              {availableProperties.length > 0 && (
                <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex justify-between items-center">
                  <div className="text-sm text-neutral-600">
                    Showing {availableProperties.length} properties
                  </div>
                  <button
                    onClick={() => setShowPropertySelector(false)}
                    className="px-4 py-2 bg-electric text-white rounded-lg hover:bg-electric-dark transition-colors"
                  >
                    Done
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* ROI Calculator Modal */}
      <AnimatePresence>
        {showROICalculator && selectedPropertyForROI && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowROICalculator(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', damping: 20 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[85vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const property = selectedProperties.find(p => p.id === selectedPropertyForROI);
                if (!property) return null;
                
                const roi = calculateROI(property);
                
                return (
                  <>
                    <div className="p-6 border-b border-neutral-200">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-neutral-900 flex items-center">
                          <Calculator className="w-5 h-5 text-electric mr-2" />
                          Investment Analysis
                        </h3>
                        <button 
                          onClick={() => setShowROICalculator(false)}
                          className="p-2 rounded-full hover:bg-neutral-100 transition-colors"
                        >
                          <X className="w-5 h-5 text-neutral-500" />
                        </button>
                      </div>
                      <p className="mt-1 text-neutral-600">
                        {property.title} - {formatPrice(property.price)}
                      </p>
                    </div>
                    
                    <div className="p-6 overflow-y-auto max-h-[calc(85vh-16rem)]">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Input Parameters */}
                        <div className="space-y-4">
                          <h4 className="font-medium text-neutral-900">Investment Parameters</h4>
                          
                          <div>
                            <label className="block text-sm text-neutral-600 mb-1">Down Payment (%)</label>
                            <div className="flex items-center">
                              <input 
                                type="range" 
                                min={10} 
                                max={50} 
                                step={5}
                                value={downPaymentPercent}
                                onChange={(e) => setDownPaymentPercent(parseInt(e.target.value))}
                                className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer mr-3"
                              />
                              <span className="w-12 text-sm text-electric font-medium">{downPaymentPercent}%</span>
                            </div>
                            <div className="text-xs text-neutral-500 mt-1">
                              Down payment amount: {formatPrice(property.price * (downPaymentPercent / 100))}
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm text-neutral-600 mb-1">Loan Term (years)</label>
                            <div className="flex items-center">
                              <input 
                                type="range" 
                                min={5} 
                                max={30} 
                                step={5}
                                value={loanTerm}
                                onChange={(e) => setLoanTerm(parseInt(e.target.value))}
                                className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer mr-3"
                              />
                              <span className="w-12 text-sm text-electric font-medium">{loanTerm} yrs</span>
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm text-neutral-600 mb-1">Interest Rate (%)</label>
                            <div className="flex items-center">
                              <input 
                                type="range" 
                                min={6} 
                                max={10} 
                                step={0.25}
                                value={interestRate}
                                onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                                className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer mr-3"
                              />
                              <span className="w-12 text-sm text-electric font-medium">{interestRate}%</span>
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm text-neutral-600 mb-1">Expected Monthly Rental (₹)</label>
                            <div className="flex items-center">
                              <input 
                                type="range" 
                                min={20000} 
                                max={50000} 
                                step={1000}
                                value={monthlyRental}
                                onChange={(e) => setMonthlyRental(parseInt(e.target.value))}
                                className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer mr-3"
                              />
                              <span className="w-20 text-sm text-electric font-medium">₹{monthlyRental.toLocaleString('en-IN')}</span>
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm text-neutral-600 mb-1">Annual Appreciation (%)</label>
                            <div className="flex items-center">
                              <input 
                                type="range" 
                                min={3} 
                                max={12} 
                                step={0.5}
                                value={annualAppreciation}
                                onChange={(e) => setAnnualAppreciation(parseFloat(e.target.value))}
                                className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer mr-3"
                              />
                              <span className="w-12 text-sm text-electric font-medium">{annualAppreciation}%</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Results */}
                        <div className="space-y-4">
                          <h4 className="font-medium text-neutral-900">Investment Analysis</h4>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                              <div className="text-xs text-neutral-500 mb-1">Monthly EMI</div>
                              <div className="text-lg font-medium text-electric">₹{Math.round(roi.monthlyEMI).toLocaleString('en-IN')}</div>
                            </div>
                            
                            <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                              <div className="text-xs text-neutral-500 mb-1">Monthly Cash Flow</div>
                              <div className={`text-lg font-medium ${roi.netAnnualIncome > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                ₹{Math.round(roi.netAnnualIncome / 12).toLocaleString('en-IN')}
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                            <h5 className="font-medium text-neutral-900 mb-3 flex items-center">
                              <LineChart className="w-4 h-4 text-electric mr-1" />
                              Long-term Projection
                            </h5>
                            
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-neutral-600">Current Value:</span>
                                <span className="font-medium">{formatPrice(property.price)}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-neutral-600">Value after {loanTerm} years:</span>
                                <span className="font-medium text-green-600">{formatPrice(roi.appreciatedValue)}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-neutral-600">Total Appreciation:</span>
                                <span className="font-medium text-green-600">{formatPrice(roi.totalAppreciation)}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-neutral-600">Rental Yield:</span>
                                <span className="font-medium text-electric">{((monthlyRental * 12) / property.price * 100).toFixed(2)}%</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-neutral-600">Overall ROI:</span>
                                <span className="font-medium text-green-600">{roi.absoluteROI.toFixed(2)}%</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                            <h5 className="font-medium text-blue-800 mb-2 flex items-center">
                              <Sparkles className="w-4 h-4 text-blue-600 mr-1" />
                              AI Insight
                            </h5>
                            <p className="text-sm text-blue-700">
                              This property shows strong investment potential with a {roi.absoluteROI.toFixed(2)}% overall ROI over {loanTerm} years. 
                              {roi.netAnnualIncome > 0 
                                ? ` The positive monthly cash flow of ₹${Math.round(roi.netAnnualIncome / 12).toLocaleString('en-IN')} makes it an attractive rental investment.` 
                                : ` While the monthly cash flow is negative, the long-term appreciation potential remains strong.`}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex justify-end">
                      <button
                        onClick={() => setShowROICalculator(false)}
                        className="px-4 py-2 bg-electric text-white rounded-lg hover:bg-electric-dark transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Property Detail Modal */}
      <AnimatePresence>
        {activePropertyView && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setActivePropertyView(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 20 }}
              className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[85vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const property = selectedProperties.find(p => p.id === activePropertyView);
                if (!property) return null;
                
                return (
                  <>
                    <div className="relative h-60 bg-neutral-800">
                      <div 
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${property.image})` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <motion.h2 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="text-2xl font-bold mb-1"
                        >
                          {property.title}
                        </motion.h2>
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="flex items-center text-white/80"
                        >
                          <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                          <span>{property.location}</span>
                        </motion.div>
                      </div>
                      
                      <button 
                        onClick={() => setActivePropertyView(null)}
                        className="absolute top-4 right-4 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex items-center justify-between mb-4"
                          >
                            <div>
                              <span className="text-sm text-neutral-500">Price</span>
                              <div className="text-2xl font-bold text-electric">{formatPrice(property.price)}</div>
                            </div>
                            
                            <div className="flex items-center">
                              <div className="w-12 h-12 rounded-full bg-electric/10 flex items-center justify-center">
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: "spring", delay: 0.6 }}
                                >
                                  <span className="text-xl font-bold text-electric">{property.valueScore}</span>
                                </motion.div>
                              </div>
                              <div className="ml-2">
                                <span className="text-xs text-neutral-500 block">Value</span>
                                <span className="text-xs text-neutral-500 block">Score</span>
                              </div>
                            </div>
                          </motion.div>
                          
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="mb-6 grid grid-cols-2 gap-4"
                          >
                            <div className="bg-neutral-50 p-3 rounded-lg">
                              <span className="text-sm text-neutral-500 block mb-1">Area</span>
                              <div className="flex items-center text-neutral-900 font-medium">
                                <Ruler className="w-4 h-4 text-neutral-400 mr-1" />
                                {property.size} sq.ft
                              </div>
                            </div>
                            
                            <div className="bg-neutral-50 p-3 rounded-lg">
                              <span className="text-sm text-neutral-500 block mb-1">Bedrooms</span>
                              <div className="flex items-center text-neutral-900 font-medium">
                                <Bed className="w-4 h-4 text-neutral-400 mr-1" />
                                {property.bedrooms} Beds
                              </div>
                            </div>
                            
                            <div className="bg-neutral-50 p-3 rounded-lg">
                              <span className="text-sm text-neutral-500 block mb-1">Bathrooms</span>
                              <div className="flex items-center text-neutral-900 font-medium">
                                <Bath className="w-4 h-4 text-neutral-400 mr-1" />
                                {property.bathrooms} Baths
                              </div>
                            </div>
                            
                            <div className="bg-neutral-50 p-3 rounded-lg">
                              <span className="text-sm text-neutral-500 block mb-1">Price/sqft</span>
                              <div className="flex items-center text-neutral-900 font-medium">
                                <Tag className="w-4 h-4 text-neutral-400 mr-1" />
                                ₹{Math.round(property.price / property.size).toLocaleString('en-IN')}
                              </div>
                            </div>
                          </motion.div>
                          
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                          >
                            <h3 className="font-medium text-neutral-900 mb-2">Amenities</h3>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {property.amenities.map((amenity, index) => (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: 0.7 + index * 0.05 }}
                                  className="px-3 py-1.5 bg-neutral-100 text-neutral-700 rounded-full text-sm flex items-center"
                                >
                                  <Check className="w-3 h-3 text-green-500 mr-1" />
                                  {amenity}
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        </div>
                        
                        <div>
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                          >
                            <h3 className="font-medium text-neutral-900 mb-3">Property Value Analysis</h3>
                            
                            <div className="space-y-4 mb-6">
                              {/* Price Value Ratio */}
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="text-neutral-600">Price-to-Value Ratio</span>
                                  <span className="font-medium text-neutral-900">
                                    {Math.round(property.price / property.size / 100)} / {property.valueScore}
                                  </span>
                                </div>
                                <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${85}%` }}
                                    transition={{ duration: 1, delay: 0.8 }}
                                    className="h-full bg-electric rounded-full"
                                  />
                                </div>
                                <div className="flex justify-between text-xs text-neutral-500 mt-1">
                                  <span>Poor</span>
                                  <span>Excellent</span>
                                </div>
                              </div>
                              
                              {/* Location Rating */}
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="text-neutral-600">Location Rating</span>
                                  <span className="font-medium text-neutral-900">
                                    {['Thoraipakkam, OMR', 'Sholinganallur, OMR'].includes(property.location) ? '4.5/5' : 
                                      ['Navalur, OMR', 'Siruseri, OMR'].includes(property.location) ? '4.2/5' : '3.8/5'}
                                  </span>
                                </div>
                                <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${
                                      ['Thoraipakkam, OMR', 'Sholinganallur, OMR'].includes(property.location) ? 90 : 
                                      ['Navalur, OMR', 'Siruseri, OMR'].includes(property.location) ? 84 : 76
                                    }%` }}
                                    transition={{ duration: 1, delay: 0.9 }}
                                    className="h-full bg-green-500 rounded-full"
                                  />
                                </div>
                                <div className="flex justify-between text-xs text-neutral-500 mt-1">
                                  <span>Poor</span>
                                  <span>Excellent</span>
                                </div>
                              </div>
                              
                              {/* Investment Potential */}
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="text-neutral-600">Investment Potential</span>
                                  <span className="font-medium text-neutral-900">High</span>
                                </div>
                                <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${property.valueScore - 5}%` }}
                                    transition={{ duration: 1, delay: 1 }}
                                    className="h-full bg-purple-500 rounded-full"
                                  />
                                </div>
                                <div className="flex justify-between text-xs text-neutral-500 mt-1">
                                  <span>Low</span>
                                  <span>High</span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                          
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 }}
                            className="bg-blue-50 p-4 rounded-lg border border-blue-100"
                          >
                            <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                              <Sparkles className="w-4 h-4 text-blue-600 mr-1" />
                              AI Property Insight
                            </h4>
                            <p className="text-sm text-blue-700 mb-3">
                              {property.title} offers {property.valueScore > 85 ? 'exceptional' : 'good'} value for money in {property.location}. 
                              The price is {
                                property.price < 8000000 ? 'below' : 
                                property.price > 10000000 ? 'above' : 'at'
                              } the market average for similar properties in this area.
                            </p>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => openROICalculator(property.id)}
                                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center justify-center"
                              >
                                <Calculator className="w-3 h-3 mr-1" />
                                ROI Calculator
                              </button>
                              <button
                                onClick={() => setShow3DView(true)}
                                className="flex-1 py-2 bg-white border border-blue-300 text-blue-700 hover:bg-blue-50 rounded-lg text-sm font-medium flex items-center justify-center"
                              >
                                <Maximize className="w-3 h-3 mr-1" />
                                View in 3D
                              </button>
                            </div>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PropertyComparison; 