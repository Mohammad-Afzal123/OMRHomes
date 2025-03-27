import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Bar, BarChart, Line, LineChart, Pie, PieChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis, CartesianGrid, Legend, Cell, Radar, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Sparkles, MapPin, Home, 
  Building, AlertTriangle, ArrowRight, ArrowLeft, Download,
  MessageSquare, BarChart3
} from 'lucide-react';
import AIAssistant from '@/components/AIAssistant';
import { generatePropertyAnalysis } from '@/lib/ai-service';

const OMRAreas = [
  { name: 'Thoraipakkam', pricePerSqft: 7800, growth: 8.5 },
  { name: 'Navalur', pricePerSqft: 6900, growth: 12.3 },
  { name: 'Siruseri', pricePerSqft: 6500, growth: 14.2 },
  { name: 'Padur', pricePerSqft: 6200, growth: 11.8 },
  { name: 'Sholinganallur', pricePerSqft: 7500, growth: 9.1 },
  { name: 'Perumbakkam', pricePerSqft: 7200, growth: 7.5 },
  { name: 'Semmancheri', pricePerSqft: 6800, growth: 10.3 },
];

const priceHistoryData = [
  { year: '2019', price: 5500 },
  { year: '2020', price: 5800 },
  { year: '2021', price: 6300 },
  { year: '2022', price: 6900 },
  { year: '2023', price: 7400 },
  { year: '2024', price: 7800 },
];

const futurePriceData = [
  { year: '2024', actual: 7800, predicted: 7800 },
  { year: '2025', predicted: 8500 },
  { year: '2026', predicted: 9200 },
  { year: '2027', predicted: 9800 },
  { year: '2028', predicted: 10500 },
];

const developerScores = [
  { name: 'Prestige', quality: 90, reputation: 92, valueForMoney: 84, delivery: 88 },
  { name: 'Casagrand', quality: 85, reputation: 86, valueForMoney: 88, delivery: 82 },
  { name: 'Puravankara', quality: 87, reputation: 85, valueForMoney: 80, delivery: 84 },
  { name: 'Brigade', quality: 86, reputation: 89, valueForMoney: 78, delivery: 85 },
  { name: 'Alliance', quality: 82, reputation: 80, valueForMoney: 86, delivery: 80 },
];

const amenityValueData = [
  { name: 'Swimming Pool', value: 18 },
  { name: 'Gym', value: 15 },
  { name: 'Clubhouse', value: 12 },
  { name: 'Play Area', value: 10 },
  { name: 'Gardens', value: 8 },
  { name: 'Security', value: 14 },
  { name: 'Power Backup', value: 9 },
  { name: 'Indoor Games', value: 7 },
  { name: 'Party Hall', value: 5 },
  { name: 'Other', value: 2 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

const AIInsights = () => {
  const [selectedArea, setSelectedArea] = useState('All Areas');
  const [timeframe, setTimeframe] = useState('3 Years');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'assistant'>('dashboard');
  const [propertyAnalysis, setPropertyAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeProperty = async () => {
    setIsAnalyzing(true);
    try {
      const sampleProperty = {
        type: "Apartment",
        bedrooms: 3,
        bathrooms: 2,
        area: "1500 sq ft",
        location: "Thoraipakkam, OMR",
        price: "₹1.25 Cr",
        amenities: ["Swimming Pool", "Gym", "Club House", "Children's Play Area", "24/7 Security"],
        age: "New Construction",
        developer: "Prestige Group",
        proximityToIT: "2 km to Siruseri IT Park",
        schools: "Within 3 km radius",
        hospitals: "Apollo Hospitals at 4 km"
      };

      const analysis = await generatePropertyAnalysis(JSON.stringify(sampleProperty, null, 2));
      setPropertyAnalysis(analysis);
    } catch (error) {
      console.error("Error analyzing property:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center space-x-2 bg-electric/10 px-4 py-2 rounded-full text-electric mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">AI-Powered Insights</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-neutral-900 mb-4">
            Real Estate Intelligence Hub
          </h1>
          <p className="text-neutral-500 max-w-2xl mx-auto">
            Leverage advanced AI analytics to make informed property investment decisions. Our data-driven insights powered by Gemini 1.5 Pro help you identify value opportunities.
          </p>
        </div>
        
        <div className="mb-8 flex justify-center">
          <div className="bg-white rounded-full shadow-sm border border-neutral-200 p-1 flex">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-6 py-2 rounded-full flex items-center space-x-2 ${
                activeTab === 'dashboard' 
                  ? 'bg-electric text-white' 
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analytics Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab('assistant')}
              className={`px-6 py-2 rounded-full flex items-center space-x-2 ${
                activeTab === 'assistant' 
                  ? 'bg-electric text-white' 
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>AI Assistant</span>
            </button>
          </div>
        </div>

        {activeTab === 'dashboard' ? (
          <>
            <div className="mb-8 bg-white rounded-xl shadow-lg border border-neutral-200 overflow-hidden">
              <div className="p-6 border-b border-neutral-200 flex justify-between items-center">
                <h2 className="text-xl font-bold text-neutral-900">Market Overview</h2>
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-neutral-600">Area:</span>
                    <select 
                      className="border border-neutral-300 rounded-md py-1 px-3 text-sm"
                      value={selectedArea}
                      onChange={(e) => setSelectedArea(e.target.value)}
                    >
                      <option>All Areas</option>
                      {OMRAreas.map(area => (
                        <option key={area.name}>{area.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-neutral-600">Timeframe:</span>
                    <select 
                      className="border border-neutral-300 rounded-md py-1 px-3 text-sm"
                      value={timeframe}
                      onChange={(e) => setTimeframe(e.target.value)}
                    >
                      <option>1 Year</option>
                      <option>3 Years</option>
                      <option>5 Years</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-neutral-200">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-neutral-600">Average Price (₹/sq.ft)</h3>
                    <div className="flex items-center text-green-500">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium">+9.8%</span>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-neutral-900 mb-4">₹7,200</div>
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={priceHistoryData}>
                        <Line type="monotone" dataKey="price" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} />
                        <XAxis dataKey="year" />
                        <Tooltip 
                          formatter={(value) => [`₹${value}`, 'Price per sq.ft']}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-neutral-600">Growth by Area</h3>
                    <div className="text-xs text-neutral-500">Year-over-Year</div>
                  </div>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={OMRAreas} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" domain={[0, 15]} />
                        <YAxis type="category" dataKey="name" width={100} />
                        <Tooltip formatter={(value) => [`${value}%`, 'Growth Rate']} />
                        <Bar dataKey="growth" fill="#10B981">
                          {OMRAreas.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.growth > 10 ? '#10B981' : '#3B82F6'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-neutral-600">Price Projections</h3>
                    <div className="text-xs text-neutral-500">5-Year Forecast</div>
                  </div>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={futurePriceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis domain={[7000, 11000]} />
                        <Tooltip 
                          formatter={(value) => [`₹${value}`, 'Price per sq.ft']}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="actual" 
                          stroke="#3B82F6" 
                          strokeWidth={2} 
                          dot={{ r: 4 }} 
                          name="Actual Price"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="predicted" 
                          stroke="#F59E0B" 
                          strokeWidth={2} 
                          strokeDasharray="5 5" 
                          dot={{ r: 4 }} 
                          name="Predicted Price"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8 bg-white rounded-xl shadow-lg border border-neutral-200 overflow-hidden">
              <div className="p-6 border-b border-neutral-200 flex justify-between items-center">
                <h2 className="text-xl font-bold text-neutral-900">AI Property Analysis</h2>
                <button 
                  className="px-4 py-2 bg-electric text-white rounded-lg flex items-center space-x-2 hover:bg-electric-dark transition-colors"
                  onClick={analyzeProperty}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <span className="loader w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Analyze Sample Property</span>
                    </>
                  )}
                </button>
              </div>
              <div className="p-6">
                {!propertyAnalysis ? (
                  <div className="text-center py-8">
                    <p className="text-neutral-500">
                      Click the "Analyze Sample Property" button to see AI-powered analysis of a sample property in Thoraipakkam, OMR.
                    </p>
                  </div>
                ) : (
                  <div className="bg-neutral-50 p-6 rounded-lg whitespace-pre-wrap">
                    {propertyAnalysis}
                  </div>
                )}
              </div>
            </div>

            <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-lg border border-neutral-200 overflow-hidden">
                <div className="p-6 border-b border-neutral-200">
                  <h2 className="text-xl font-bold text-neutral-900">Developer Comparison</h2>
                  <p className="text-sm text-neutral-500">AI-based scoring of major developers in OMR</p>
                </div>
                <div className="p-6">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={developerScores}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="name" />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                        <Radar name="Quality" dataKey="quality" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                        <Radar name="Reputation" dataKey="reputation" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                        <Radar name="Value For Money" dataKey="valueForMoney" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
                        <Radar name="Delivery" dataKey="delivery" stroke="#ff8042" fill="#ff8042" fillOpacity={0.6} />
                        <Legend />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg border border-neutral-200 overflow-hidden">
                <div className="p-6 border-b border-neutral-200">
                  <h2 className="text-xl font-bold text-neutral-900">Amenity Value Analysis</h2>
                  <p className="text-sm text-neutral-500">Impact of amenities on property value</p>
                </div>
                <div className="p-6 grid grid-cols-2 gap-6">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={amenityValueData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {amenityValueData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, 'Value Impact']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="flex flex-col justify-center">
                    <h3 className="text-lg font-semibold text-neutral-900 mb-4">Key Findings</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start space-x-2">
                        <div className="w-4 h-4 rounded-full bg-[#0088FE] mt-1"></div>
                        <span className="text-sm">Swimming pools add the most value (18%)</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-4 h-4 rounded-full bg-[#00C49F] mt-1"></div>
                        <span className="text-sm">Gym facilities increase value by 15%</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-4 h-4 rounded-full bg-[#FFBB28] mt-1"></div>
                        <span className="text-sm">Security systems account for 14% of amenity value</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-4 h-4 rounded-full bg-[#FF8042] mt-1"></div>
                        <span className="text-sm">Play areas are important for family demographics</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <AIAssistant initialMessage="Hi! I'm your real estate AI assistant powered by Gemini 1.5 Pro. I can help you with property analysis, market trends, investment advice, and more. How can I assist you today?" />
            </div>
            <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-200">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Ask me about:</h3>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <Home className="w-5 h-5 text-electric mt-0.5" />
                  <div>
                    <p className="font-medium text-neutral-800">Property Analysis</p>
                    <p className="text-sm text-neutral-600">Detailed insights on properties in any location</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-electric mt-0.5" />
                  <div>
                    <p className="font-medium text-neutral-800">Neighborhood Insights</p>
                    <p className="text-sm text-neutral-600">Information about areas, amenities, and future development</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <TrendingUp className="w-5 h-5 text-electric mt-0.5" />
                  <div>
                    <p className="font-medium text-neutral-800">Investment Advice</p>
                    <p className="text-sm text-neutral-600">Recommendations based on your budget and goals</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <Building className="w-5 h-5 text-electric mt-0.5" />
                  <div>
                    <p className="font-medium text-neutral-800">Developer Reputation</p>
                    <p className="text-sm text-neutral-600">Insights on builders and their project track record</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-electric mt-0.5" />
                  <div>
                    <p className="font-medium text-neutral-800">Risk Assessment</p>
                    <p className="text-sm text-neutral-600">Potential issues to watch out for in properties</p>
                  </div>
                </li>
              </ul>
              
              <div className="mt-8 p-4 bg-electric/10 rounded-lg border border-electric/20">
                <h4 className="text-sm font-semibold text-electric mb-2">Try asking:</h4>
                <div className="space-y-2">
                  <button 
                    className="w-full text-left p-2 text-sm text-neutral-700 bg-white rounded border border-neutral-200 hover:border-electric transition-colors"
                    onClick={() => document.querySelector('textarea')?.focus()}
                  >
                    "What are the emerging areas with good ROI potential in OMR?"
                  </button>
                  <button 
                    className="w-full text-left p-2 text-sm text-neutral-700 bg-white rounded border border-neutral-200 hover:border-electric transition-colors"
                    onClick={() => document.querySelector('textarea')?.focus()}
                  >
                    "Compare investment potential in Thoraipakkam vs Siruseri"
                  </button>
                  <button 
                    className="w-full text-left p-2 text-sm text-neutral-700 bg-white rounded border border-neutral-200 hover:border-electric transition-colors"
                    onClick={() => document.querySelector('textarea')?.focus()}
                  >
                    "What are the red flags I should look for when buying from a new developer?"
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AIInsights;
