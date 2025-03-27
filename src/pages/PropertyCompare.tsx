
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Bar, Radar, ResponsiveContainer, BarChart, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, RadarProps, BarProps } from 'recharts';
import { ArrowLeft, Check, X, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  pricePerSqft: number;
  image: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  developer: string;
  valueScore: number;
  amenities?: string[];
  constructionStatus?: string;
  possession?: string;
}

// Sample data for comparison
const properties: Property[] = [
  {
    id: '1',
    title: 'Prestige Lakeside Habitat',
    location: 'Thoraipakkam, OMR',
    price: 9500000,
    pricePerSqft: 7500,
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=2074&auto=format&fit=crop',
    bedrooms: 2,
    bathrooms: 2,
    area: 1275,
    developer: 'Prestige Group',
    valueScore: 87,
    amenities: ['Swimming Pool', 'Gym', 'Clubhouse', 'Children\'s Play Area', 'Landscaped Gardens', '24/7 Security'],
    constructionStatus: 'Completed',
    possession: 'Ready to Move'
  },
  {
    id: '2',
    title: 'Casagrand Luxus',
    location: 'Navalur, OMR',
    price: 8200000,
    pricePerSqft: 6900,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop',
    bedrooms: 2,
    bathrooms: 2,
    area: 1180,
    developer: 'Casagrand',
    valueScore: 78,
    amenities: ['Swimming Pool', 'Gym', 'Clubhouse', 'Children\'s Play Area'],
    constructionStatus: 'Completed',
    possession: 'Ready to Move'
  },
  {
    id: '3',
    title: 'Purva Windermere',
    location: 'Pallikaranai, OMR',
    price: 9800000,
    pricePerSqft: 7200,
    image: 'https://images.unsplash.com/photo-1628744448840-6b48f8417a53?q=80&w=2070&auto=format&fit=crop',
    bedrooms: 2,
    bathrooms: 2,
    area: 1350,
    developer: 'Puravankara',
    valueScore: 82,
    amenities: ['Swimming Pool', 'Gym', 'Clubhouse', 'Children\'s Play Area', 'Landscaped Gardens', '24/7 Security', 'Indoor Games'],
    constructionStatus: 'Completed',
    possession: 'Ready to Move'
  }
];

const PropertyCompare = () => {
  const [selectedProperties, setSelectedProperties] = useState<Property[]>([]);
  const [availableProperties, setAvailableProperties] = useState<Property[]>(properties);
  const navigate = useNavigate();

  const handleAddProperty = (property: Property) => {
    if (selectedProperties.length < 3) {
      setSelectedProperties([...selectedProperties, property]);
      setAvailableProperties(availableProperties.filter(p => p.id !== property.id));
    }
  };

  const handleRemoveProperty = (property: Property) => {
    setSelectedProperties(selectedProperties.filter(p => p.id !== property.id));
    setAvailableProperties([...availableProperties, property]);
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} L`;
    } else {
      return `₹${price.toLocaleString()}`;
    }
  };

  const valueScoreData = selectedProperties.map(property => ({
    subject: 'Value Score',
    [property.title]: property.valueScore,
    fullMark: 100
  }));

  const priceData = [
    {
      name: 'Price',
      ...selectedProperties.reduce((acc, property) => ({
        ...acc,
        [property.title]: property.price
      }), {})
    }
  ];

  const areaData = [
    {
      name: 'Area (sq.ft)',
      ...selectedProperties.reduce((acc, property) => ({
        ...acc,
        [property.title]: property.area
      }), {})
    }
  ];

  const pricePerSqftData = [
    {
      name: 'Price/Sq.ft',
      ...selectedProperties.reduce((acc, property) => ({
        ...acc,
        [property.title]: property.pricePerSqft
      }), {})
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center mb-8 gap-4">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span>Back to Properties</span>
          </button>
          <h1 className="text-3xl font-display font-bold text-neutral-900">Compare Properties</h1>
        </div>

        {selectedProperties.length === 0 ? (
          <div className="text-center py-12 bg-neutral-50 rounded-xl border border-neutral-100">
            <h2 className="text-2xl font-medium text-neutral-700 mb-4">Select properties to compare</h2>
            <p className="text-neutral-500 mb-8">Add up to 3 properties to compare their features side by side</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {availableProperties.slice(0, 3).map((property) => (
                <div 
                  key={property.id} 
                  className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:border-electric"
                  onClick={() => handleAddProperty(property)}
                >
                  <div className="h-40 overflow-hidden">
                    <img 
                      src={property.image} 
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-neutral-900">{property.title}</h3>
                    <p className="text-sm text-neutral-500">{property.location}</p>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-electric font-medium">{formatPrice(property.price)}</span>
                      <button 
                        className="text-sm px-3 py-1 bg-electric/10 text-electric rounded-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddProperty(property);
                        }}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8 bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-neutral-200">
                <div className="p-6 bg-neutral-50">
                  <h3 className="font-medium text-neutral-900 mb-4">Properties</h3>
                  <div className="space-y-4">
                    {selectedProperties.map((property) => (
                      <div key={property.id} className="flex items-center justify-between">
                        <span className="font-medium text-neutral-800">{property.title}</span>
                        <button
                          onClick={() => handleRemoveProperty(property)}
                          className="text-neutral-400 hover:text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {selectedProperties.length < 3 && (
                      <button
                        onClick={() => {
                          if (availableProperties.length > 0) {
                            handleAddProperty(availableProperties[0]);
                          }
                        }}
                        disabled={availableProperties.length === 0}
                        className="w-full py-2 px-4 mt-4 border border-dashed border-neutral-300 rounded-lg text-neutral-500 hover:border-electric hover:text-electric transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        + Add Property
                      </button>
                    )}
                  </div>
                </div>
                
                {selectedProperties.map((property) => (
                  <div key={property.id} className="p-6">
                    <div className="h-32 mb-4 rounded-lg overflow-hidden">
                      <img 
                        src={property.image}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-bold text-neutral-900 mb-1">{property.title}</h3>
                    <p className="text-sm text-neutral-500 mb-2">{property.location}</p>
                    <div className="text-lg font-medium text-electric mb-4">{formatPrice(property.price)}</div>
                    <div className="text-sm text-neutral-600">
                      <div className="grid grid-cols-2 gap-2">
                        <div>Area:</div>
                        <div className="font-medium">{property.area} sq.ft</div>
                        <div>₹/sq.ft:</div>
                        <div className="font-medium">₹{property.pricePerSqft}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
                <h3 className="font-medium text-neutral-900 mb-6">Price Comparison (in ₹)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={priceData} layout="vertical">
                    <Bar dataKey={selectedProperties[0]?.title || ''} fill="#3B82F6" />
                    {selectedProperties.length > 1 && <Bar dataKey={selectedProperties[1]?.title || ''} fill="#10B981" />}
                    {selectedProperties.length > 2 && <Bar dataKey={selectedProperties[2]?.title || ''} fill="#F59E0B" />}
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
                <h3 className="font-medium text-neutral-900 mb-6">Area Comparison (in sq.ft)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={areaData} layout="vertical">
                    <Bar dataKey={selectedProperties[0]?.title || ''} fill="#3B82F6" />
                    {selectedProperties.length > 1 && <Bar dataKey={selectedProperties[1]?.title || ''} fill="#10B981" />}
                    {selectedProperties.length > 2 && <Bar dataKey={selectedProperties[2]?.title || ''} fill="#F59E0B" />}
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
                <h3 className="font-medium text-neutral-900 mb-6">Price per sq.ft Comparison</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={pricePerSqftData} layout="vertical">
                    <Bar dataKey={selectedProperties[0]?.title || ''} fill="#3B82F6" />
                    {selectedProperties.length > 1 && <Bar dataKey={selectedProperties[1]?.title || ''} fill="#10B981" />}
                    {selectedProperties.length > 2 && <Bar dataKey={selectedProperties[2]?.title || ''} fill="#F59E0B" />}
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
                <h3 className="font-medium text-neutral-900 mb-6">Value Score Comparison</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={valueScoreData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar name={selectedProperties[0]?.title || ''} dataKey={selectedProperties[0]?.title || ''} stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                    {selectedProperties.length > 1 && <Radar name={selectedProperties[1]?.title || ''} dataKey={selectedProperties[1]?.title || ''} stroke="#10B981" fill="#10B981" fillOpacity={0.6} />}
                    {selectedProperties.length > 2 && <Radar name={selectedProperties[2]?.title || ''} dataKey={selectedProperties[2]?.title || ''} stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} />}
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mb-8 bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
              <div className="divide-y divide-neutral-200">
                <div className="grid grid-cols-4 divide-x divide-neutral-200">
                  <div className="p-6 bg-neutral-50">
                    <h3 className="font-medium text-neutral-900">Specifications</h3>
                  </div>
                  {selectedProperties.map((property) => (
                    <div key={property.id} className="p-6 text-center">
                      <h3 className="font-medium text-neutral-900">{property.title}</h3>
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-4 divide-x divide-neutral-200">
                  <div className="p-6 bg-neutral-50">
                    <div className="font-medium">Bedrooms</div>
                  </div>
                  {selectedProperties.map((property) => (
                    <div key={property.id} className="p-6 text-center">{property.bedrooms}</div>
                  ))}
                </div>
                
                <div className="grid grid-cols-4 divide-x divide-neutral-200">
                  <div className="p-6 bg-neutral-50">
                    <div className="font-medium">Bathrooms</div>
                  </div>
                  {selectedProperties.map((property) => (
                    <div key={property.id} className="p-6 text-center">{property.bathrooms}</div>
                  ))}
                </div>
                
                <div className="grid grid-cols-4 divide-x divide-neutral-200">
                  <div className="p-6 bg-neutral-50">
                    <div className="font-medium">Area (sq.ft)</div>
                  </div>
                  {selectedProperties.map((property) => (
                    <div key={property.id} className="p-6 text-center">{property.area}</div>
                  ))}
                </div>
                
                <div className="grid grid-cols-4 divide-x divide-neutral-200">
                  <div className="p-6 bg-neutral-50">
                    <div className="font-medium">Price</div>
                  </div>
                  {selectedProperties.map((property) => (
                    <div key={property.id} className="p-6 text-center">{formatPrice(property.price)}</div>
                  ))}
                </div>
                
                <div className="grid grid-cols-4 divide-x divide-neutral-200">
                  <div className="p-6 bg-neutral-50">
                    <div className="font-medium">Price per sq.ft</div>
                  </div>
                  {selectedProperties.map((property) => (
                    <div key={property.id} className="p-6 text-center">₹{property.pricePerSqft}</div>
                  ))}
                </div>
                
                <div className="grid grid-cols-4 divide-x divide-neutral-200">
                  <div className="p-6 bg-neutral-50">
                    <div className="font-medium">Developer</div>
                  </div>
                  {selectedProperties.map((property) => (
                    <div key={property.id} className="p-6 text-center">{property.developer}</div>
                  ))}
                </div>
                
                <div className="grid grid-cols-4 divide-x divide-neutral-200">
                  <div className="p-6 bg-neutral-50">
                    <div className="font-medium">Value Score</div>
                  </div>
                  {selectedProperties.map((property) => (
                    <div key={property.id} className="p-6 text-center">
                      <div className="inline-flex items-center px-2 py-1 rounded-full bg-electric/10 text-electric">
                        <span className="font-medium">{property.valueScore}/100</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-4 divide-x divide-neutral-200">
                  <div className="p-6 bg-neutral-50">
                    <div className="font-medium">Possession</div>
                  </div>
                  {selectedProperties.map((property) => (
                    <div key={property.id} className="p-6 text-center">{property.possession || 'Not available'}</div>
                  ))}
                </div>
                
                <div className="grid grid-cols-4 divide-x divide-neutral-200">
                  <div className="p-6 bg-neutral-50">
                    <div className="font-medium">Construction Status</div>
                  </div>
                  {selectedProperties.map((property) => (
                    <div key={property.id} className="p-6 text-center">{property.constructionStatus || 'Not available'}</div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mb-8 bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
              <div className="p-6 bg-neutral-50 border-b border-neutral-200">
                <h3 className="font-medium text-neutral-900">Amenities</h3>
              </div>
              <div className="divide-y divide-neutral-200">
                {['Swimming Pool', 'Gym', 'Clubhouse', 'Children\'s Play Area', 'Landscaped Gardens', '24/7 Security', 'Power Backup', 'Indoor Games', 'Jogging Track', 'Party Hall'].map((amenity) => (
                  <div key={amenity} className="grid grid-cols-4 divide-x divide-neutral-200">
                    <div className="p-6 bg-neutral-50">
                      <div className="font-medium">{amenity}</div>
                    </div>
                    {selectedProperties.map((property) => (
                      <div key={property.id} className="p-6 flex justify-center">
                        {property.amenities?.includes(amenity) ? (
                          <Check className="w-5 h-5 text-green-500" />
                        ) : (
                          <X className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default PropertyCompare;
