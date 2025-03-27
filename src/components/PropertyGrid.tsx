
import React, { useEffect, useRef } from 'react';
import PropertyCard from './PropertyCard';

// Sample property data
const properties = [
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
    featured: true
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
    valueScore: 78
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
    valueScore: 82
  },
  {
    id: '4',
    title: 'Brigade Xanadu',
    location: 'Siruseri, OMR',
    price: 7800000,
    pricePerSqft: 6500,
    image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=2070&auto=format&fit=crop',
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    developer: 'Brigade Group',
    valueScore: 76
  },
  {
    id: '5',
    title: 'Alliance Orchid Springs',
    location: 'Padur, OMR',
    price: 7200000,
    pricePerSqft: 6200,
    image: 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=2070&auto=format&fit=crop',
    bedrooms: 2,
    bathrooms: 2,
    area: 1150,
    developer: 'Alliance Group',
    valueScore: 74
  }
];

interface PropertyGridProps {
  onPropertySelect?: (propertyId: string) => void;
}

const PropertyGrid = ({ onPropertySelect }: PropertyGridProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const cards = document.querySelectorAll('.property-card');
    cards.forEach((card) => {
      observer.observe(card);
    });

    return () => {
      cards.forEach((card) => {
        observer.unobserve(card);
      });
    };
  }, []);

  const handlePropertyClick = (propertyId: string) => {
    if (onPropertySelect) {
      onPropertySelect(propertyId);
    }
  };

  return (
    <section id="properties" ref={sectionRef} className="py-24 px-6 bg-neutral-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 opacity-0 animate-fade-in">
          <div className="inline-flex items-center space-x-2 bg-electric/10 px-4 py-2 rounded-full text-electric mb-4">
            <span className="text-sm font-medium">AI-Curated Selections</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">
            Premium 2BHK Properties in OMR
          </h2>
          <p className="text-neutral-500 max-w-2xl mx-auto">
            Handpicked premium properties with the best value-for-money, analyzed by our AI for location advantage, amenities, and investment potential.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property, index) => (
            <div 
              key={property.id} 
              className={`property-card opacity-0 cursor-pointer`}
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => handlePropertyClick(property.id)}
            >
              <PropertyCard {...property} />
            </div>
          ))}
        </div>

        <div className="mt-16 text-center opacity-0 animate-fade-in" style={{ animationDelay: '600ms' }}>
          <button className="py-3 px-8 rounded-full bg-electric hover:bg-electric-dark text-white font-medium transition-colors">
            View All Properties
          </button>
        </div>
      </div>
    </section>
  );
};

export default PropertyGrid;
