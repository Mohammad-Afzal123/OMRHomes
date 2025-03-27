
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Heart, MapPin, Maximize, Home, ChevronRight, Bed, Bath, Ruler, Star } from 'lucide-react';

interface PropertyCardProps {
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
  featured?: boolean;
}

const PropertyCard = ({
  id,
  title,
  location,
  price,
  pricePerSqft,
  image,
  bedrooms,
  bathrooms,
  area,
  developer,
  valueScore,
  featured = false,
}: PropertyCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} L`;
    } else {
      return `₹${price.toLocaleString()}`;
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl transition-all duration-500",
        "bg-white shadow-md hover:shadow-xl",
        "transform hover:-translate-y-1 hover:scale-[1.01]",
        featured ? "md:col-span-2" : ""
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card header with image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-neutral-200 animate-pulse"></div>
        )}
        
        {featured && (
          <div className="absolute top-4 left-4 z-10 bg-electric text-white text-xs font-semibold py-1 px-3 rounded-full">
            Featured
          </div>
        )}
        
        <div 
          className={`absolute inset-0 bg-cover bg-center z-0 transition-transform duration-500 group-hover:scale-110 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ backgroundImage: `url(${image})` }}
        >
          <img 
            src={image} 
            alt={title} 
            className="hidden" 
            onLoad={handleImageLoad}
          />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        
        <div className="absolute top-4 right-4 z-10">
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsFavorite(!isFavorite);
            }}
            className={cn(
              "w-9 h-9 rounded-full flex items-center justify-center transition-all backdrop-blur-sm",
              isFavorite 
                ? "bg-red-500 text-white" 
                : "bg-black/20 text-white hover:bg-black/40"
            )}
          >
            <Heart className={cn("w-4 h-4", isFavorite ? "fill-white" : "")} />
          </button>
        </div>
        
        <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <MapPin className="w-4 h-4 text-white/80" />
            <span className="text-white text-sm font-medium">{location}</span>
          </div>
          
          <div 
            className={cn(
              "bg-black/30 text-white text-xs font-semibold py-1 px-2 rounded-full flex items-center space-x-1 backdrop-blur-sm",
              "transform transition-all duration-300",
              isHovered ? "opacity-0 translate-y-4" : "opacity-100"
            )}
          >
            <Maximize className="w-3 h-3" />
            <span>View</span>
          </div>
        </div>
      </div>
      
      {/* Card content */}
      <div className="p-5">
        {/* Developer logo and name */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center">
              <Home className="w-3 h-3 text-neutral-700" />
            </div>
            <span className="text-xs text-neutral-500">{developer}</span>
          </div>
          
          <div className="flex items-center space-x-1 bg-neutral-100 py-1 px-2 rounded-full">
            <Star className="w-3 h-3 text-electric fill-electric" />
            <span className="text-xs font-semibold">{valueScore}/100</span>
          </div>
        </div>
        
        {/* Property title */}
        <h3 className="text-lg font-semibold text-neutral-900 mb-2 line-clamp-1">{title}</h3>
        
        {/* Property specs */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center space-x-1">
            <Bed className="w-4 h-4 text-neutral-400" />
            <span className="text-sm text-neutral-600">{bedrooms} Beds</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Bath className="w-4 h-4 text-neutral-400" />
            <span className="text-sm text-neutral-600">{bathrooms} Baths</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Ruler className="w-4 h-4 text-neutral-400" />
            <span className="text-sm text-neutral-600">{area} sq.ft</span>
          </div>
        </div>
        
        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-neutral-900">{formatPrice(price)}</span>
            <div className="text-xs text-neutral-500">₹{pricePerSqft}/sq.ft</div>
          </div>
          
          <button className="group/btn flex items-center space-x-1 py-2 px-4 rounded-lg bg-electric/10 hover:bg-electric text-electric hover:text-white transition-colors duration-200">
            <span className="text-sm font-medium">Details</span>
            <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
          </button>
        </div>
      </div>
      
      {/* Hover overlay with AI insights */}
      <div 
        className={cn(
          "absolute inset-0 bg-gradient-to-t from-electric/90 to-electric-dark/90 p-6 flex flex-col justify-end",
          "transition-all duration-500 backdrop-blur-sm",
          isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="mb-auto mt-10 text-center">
          <div className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-medium py-1 px-3 rounded-full mb-2">
            AI Insight
          </div>
          <h4 className="text-white text-lg font-semibold mb-2">Smart Value Analysis</h4>
          <div className="relative h-2 bg-white/20 rounded-full overflow-hidden mb-1">
            <div 
              className="absolute top-0 left-0 h-full bg-white rounded-full"
              style={{ width: `${valueScore}%` }}
            ></div>
          </div>
          <p className="text-xs text-white/80">
            Value score {valueScore}/100 - {valueScore > 80 ? 'Excellent' : valueScore > 60 ? 'Good' : 'Average'} value
          </p>
        </div>
        
        <div className="space-y-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <h5 className="text-white text-sm font-medium mb-1">Location Analysis</h5>
            <p className="text-white/80 text-xs">
              {location} offers excellent connectivity to IT parks with 15min drive to major tech companies.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <h5 className="text-white text-sm font-medium mb-1">Investment Potential</h5>
            <p className="text-white/80 text-xs">
              Expected appreciation of 8-12% annually based on infrastructure developments.
            </p>
          </div>
        </div>
        
        <button className="mt-4 w-full py-3 rounded-lg bg-white text-electric font-medium text-sm hover:bg-white/90 transition-colors">
          View Full Details
        </button>
      </div>
    </div>
  );
};

export default PropertyCard;
