import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, MapPin, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VirtualTourProps {
  onClose: () => void;
}

const VirtualTour: React.FC<VirtualTourProps> = ({ onClose }) => {
  const [currentRoom, setCurrentRoom] = useState(0);
  const [loading, setLoading] = useState(false);

  const rooms = [
    {
      name: 'Living Room',
      image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=2070&auto=format&fit=crop',
      description: 'Spacious living room with large windows and natural light',
    },
    {
      name: 'Kitchen',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop',
      description: 'Modern kitchen with premium appliances and ample storage',
    },
    {
      name: 'Master Bedroom',
      image: 'https://images.unsplash.com/photo-1589834390005-5d4fb9bf3d32?q=80&w=2067&auto=format&fit=crop',
      description: 'Comfortable master bedroom with attached bathroom',
    },
    {
      name: 'Second Bedroom',
      image: 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?q=80&w=2070&auto=format&fit=crop',
      description: 'Well-proportioned second bedroom with built-in wardrobe',
    },
    {
      name: 'Bathroom',
      image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=2069&auto=format&fit=crop',
      description: 'Modern bathroom with premium fixtures and fittings',
    },
    {
      name: 'Balcony',
      image: 'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?q=80&w=2070&auto=format&fit=crop',
      description: 'Spacious balcony with stunning lake views',
    },
  ];

  const handleNext = () => {
    setLoading(true);
    setTimeout(() => {
      setCurrentRoom((prev) => (prev === rooms.length - 1 ? 0 : prev + 1));
      setLoading(false);
    }, 500);
  };

  const handlePrev = () => {
    setLoading(true);
    setTimeout(() => {
      setCurrentRoom((prev) => (prev === 0 ? rooms.length - 1 : prev - 1));
      setLoading(false);
    }, 500);
  };

  const selectRoom = (index: number) => {
    if (index === currentRoom) return;
    setLoading(true);
    setTimeout(() => {
      setCurrentRoom(index);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 overflow-y-auto">
      <div className="min-h-screen flex flex-col">
        <div className="flex items-center justify-between p-4 bg-black bg-opacity-50">
          <div className="flex items-center">
            <Camera className="w-5 h-5 text-white mr-2" />
            <h2 className="text-xl font-medium text-white">Virtual Tour</h2>
            <span className="ml-2 text-sm text-white/60">Prestige Lakeside Habitat</span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
        
        <div className="flex-1 relative overflow-hidden">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
              <div className="w-12 h-12 border-4 border-electric border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentRoom}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full"
            >
              <div 
                className="w-full h-[calc(100vh-10rem)] bg-cover bg-center relative" 
                style={{ backgroundImage: `url(${rooms[currentRoom].image})` }}
              >
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <h3 className="text-xl font-medium text-white">{rooms[currentRoom].name}</h3>
                  <p className="text-white/70">{rooms[currentRoom].description}</p>
                </div>
                
                <button 
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                
                <button 
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
                
                <div className="absolute bottom-28 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 bg-black/50 rounded-full px-4 py-2">
                  <MapPin className="w-4 h-4 text-white" />
                  <span className="text-sm text-white">Prestige Lakeside Habitat, Thoraipakkam</span>
                </div>
                
                {/* Interactive hotspots */}
                <div className="absolute top-1/3 left-1/4 w-8 h-8 rounded-full bg-electric/50 border-2 border-white animate-pulse cursor-pointer" title="Light switch"></div>
                <div className="absolute top-2/3 right-1/3 w-8 h-8 rounded-full bg-electric/50 border-2 border-white animate-pulse cursor-pointer" title="Door to balcony"></div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        
        <div className="bg-black p-4">
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {rooms.map((room, index) => (
              <div 
                key={index} 
                onClick={() => selectRoom(index)}
                className={`flex-shrink-0 cursor-pointer group relative ${currentRoom === index ? 'ring-2 ring-electric' : ''}`}
              >
                <img 
                  src={room.image} 
                  alt={room.name} 
                  className="w-24 h-16 object-cover rounded-md"
                />
                <div className={`absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors rounded-md ${currentRoom === index ? 'bg-black/0' : ''}`}></div>
                <span className="absolute bottom-1 left-1 text-xs text-white font-medium">{room.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualTour;
