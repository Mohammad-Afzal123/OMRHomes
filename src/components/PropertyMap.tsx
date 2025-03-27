import React, { useEffect, useRef, useState, ErrorInfo, Component } from 'react';
import { MapPin, Info, Layers, BarChart3, ArrowDown, Activity, Home, Zap, Wind, Loader2, Building, ShoppingCart, Shield, Search, RotateCw, RotateCcw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
// Explicitly declare MarkerClusterGroup to fix the "Cannot read properties of undefined" error
declare module 'leaflet' {
  export function markerClusterGroup(options?: any): any;
  
  export function heatLayer(
    latlngs: Array<[number, number, number?]>, 
    options?: {
      minOpacity?: number;
      maxZoom?: number;
      max?: number;
      radius?: number;
      blur?: number;
      gradient?: {[key: string]: string} | {[key: number]: string};
    }
  ): L.Layer;
}

// Fix for TypeScript imports
const MarkerClusterGroup = (L as any).markerClusterGroup;

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { faker } from '@faker-js/faker';
// @ts-ignore - Missing type definitions
import 'leaflet-rotatedmarker';
import 'leaflet.heat';
import { motion } from 'framer-motion';
import { sampleProperties, sampleNeighborhoods } from '@/lib/sample-data';

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  coordinates: [number, number];
  valueScore: number;
}

interface PropertyMapProps {
  onPropertySelect?: (propertyId: string) => void;
}

// Generate price trend data
const generatePriceTrendData = () => {
  return Array.from({ length: 12 }, (_, i) => {
    const month = new Date(2023, i, 1).toLocaleString('default', { month: 'short' });
    return {
      month,
      "Thoraipakkam": 85000 + faker.number.int({ min: -5000, max: 8000 }),
      "Navalur": 75000 + faker.number.int({ min: -4000, max: 7000 }),
      "Siruseri": 65000 + faker.number.int({ min: -3000, max: 6000 }),
    };
  });
};

// Generate amenities distribution data
const generateAmenitiesData = () => {
  return [
    { name: 'Hospitals', count: faker.number.int({ min: 5, max: 15 }), color: '#ef4444' },
    { name: 'Schools', count: faker.number.int({ min: 8, max: 20 }), color: '#3b82f6' },
    { name: 'Parks', count: faker.number.int({ min: 4, max: 12 }), color: '#22c55e' },
    { name: 'Malls', count: faker.number.int({ min: 2, max: 8 }), color: '#a855f7' },
    { name: 'Restaurants', count: faker.number.int({ min: 15, max: 30 }), color: '#f59e0b' },
  ];
};

// Generate crime statistics data
const generateCrimeData = () => {
  return [
    { name: 'Theft', count: faker.number.int({ min: 10, max: 50 }) },
    { name: 'Assault', count: faker.number.int({ min: 5, max: 30 }) },
    { name: 'Fraud', count: faker.number.int({ min: 15, max: 40 }) },
    { name: 'Vandalism', count: faker.number.int({ min: 20, max: 60 }) },
  ];
};

// POI Data
const poiData = {
  hospitals: [
    { name: "Apollo Hospital", coordinates: [12.9410, 80.2370] as [number, number], rating: 4.5 },
    { name: "Global Hospital", coordinates: [12.8670, 80.2250] as [number, number], rating: 4.2 },
    { name: "MIOT Hospital", coordinates: [12.9180, 80.2140] as [number, number], rating: 4.0 }
  ],
  malls: [
    { name: "Phoenix Marketcity", coordinates: [12.9901, 80.2177] as [number, number], rating: 4.7 },
    { name: "VR Chennai", coordinates: [12.9862, 80.2185] as [number, number], rating: 4.6 },
    { name: "Grand Square Mall", coordinates: [12.9150, 80.2280] as [number, number], rating: 4.1 }
  ],
  policeStations: [
    { name: "Thoraipakkam PS", coordinates: [12.9435, 80.2380] as [number, number], rating: 3.8 },
    { name: "Siruseri PS", coordinates: [12.8290, 80.2350] as [number, number], rating: 3.5 }
  ],
  schools: [
    { name: "DAV Public School", coordinates: [12.9250, 80.2305] as [number, number], rating: 4.3 },
    { name: "Chettinad Vidyashram", coordinates: [12.8825, 80.2245] as [number, number], rating: 4.4 }
  ]
};

// Areas with data insights
const areaInsights = [
  { 
    name: "COVID-19 Impact Zone", 
    coordinates: [12.9300, 80.2330] as [number, number], 
    radius: 500, 
    details: "Previous hotspot, 95% vaccination rate" 
  },
  { 
    name: "High Crime Area", 
    coordinates: [12.8650, 80.2280] as [number, number], 
    radius: 300, 
    details: "10 reported incidents in past month" 
  },
  { 
    name: "Green Zone", 
    coordinates: [12.8740, 80.2290] as [number, number], 
    radius: 400, 
    details: "High tree cover, 12% oxygen levels" 
  }
];

const mapProperties: Property[] = [
  {
    id: '1',
    title: 'Prestige Lakeside Habitat',
    location: 'Thoraipakkam, OMR',
    price: 9500000,
    coordinates: [12.9421, 80.2384], // Leaflet uses [lat, lng] order
    valueScore: 87
  },
  {
    id: '2',
    title: 'Casagrand Luxus',
    location: 'Navalur, OMR',
    price: 8200000,
    coordinates: [12.8588, 80.2294],
    valueScore: 78
  },
  {
    id: '3',
    title: 'Purva Windermere',
    location: 'Pallikaranai, OMR',
    price: 9800000,
    coordinates: [12.9290, 80.2174],
    valueScore: 82
  },
  {
    id: '4',
    title: 'Brigade Xanadu',
    location: 'Siruseri, OMR',
    price: 7800000,
    coordinates: [12.8294, 80.2370],
    valueScore: 76
  },
  {
    id: '5',
    title: 'Alliance Orchid Springs',
    location: 'Padur, OMR',
    price: 7200000,
    coordinates: [12.8824, 80.2236],
    valueScore: 74
  }
];

// Add an error boundary component
class MapErrorBoundary extends Component<{ children: React.ReactNode, onError: () => void }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode, onError: () => void }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Map Error:", error, errorInfo);
    this.props.onError();
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-100 rounded-xl">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-neutral-800 mb-2">Error loading map</h3>
          <p className="text-neutral-600 text-center max-w-md mb-4">
            There was an issue loading the interactive map. Please try refreshing the page.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-electric text-white rounded-lg hover:bg-electric-dark transition-colors"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Simple fallback component when the full map can't load
const SimplifiedMapFallback: React.FC<{ properties: Property[] }> = ({ properties }) => {
  return (
    <div className="w-full h-full bg-neutral-50 p-6 overflow-auto">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-neutral-900 mb-2">Property Locations (Simplified View)</h3>
        <p className="text-neutral-600 text-sm mb-4">
          The interactive map couldn't be loaded. Here's a simplified list of properties:
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-electric text-white rounded-lg hover:bg-electric-dark transition-colors mb-4"
        >
          Try Again
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {properties.map(property => (
          <div key={property.id} className="bg-white rounded-lg shadow p-4 border border-neutral-200">
            <h4 className="font-medium text-neutral-900 mb-1">{property.title}</h4>
            <p className="text-sm text-neutral-500 mb-2">{property.location}</p>
            <div className="flex justify-between items-center mb-2">
              <span className="text-electric font-medium">
                {property.price >= 10000000
                  ? `₹${(property.price / 10000000).toFixed(2)} Cr`
                  : `₹${(property.price / 100000).toFixed(2)} L`}
              </span>
              <div className="flex items-center bg-electric/10 text-electric py-1 px-2 rounded-full text-xs">
                <span className="font-medium">{property.valueScore}/100</span>
              </div>
            </div>
            <div className="text-xs mt-2">
              <div className="font-medium text-neutral-700">Coordinates:</div>
              <div className="text-neutral-500">
                {property.coordinates[0].toFixed(4)}, {property.coordinates[1].toFixed(4)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PropertyMap: React.FC<PropertyMapProps> = ({ onPropertySelect }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [hoveredProperty, setHoveredProperty] = useState<Property | null>(null);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const [viewMode, setViewMode] = useState<'standard' | 'satellite'>('satellite');
  const [showHospitals, setShowHospitals] = useState(true);
  const [showMalls, setShowMalls] = useState(true);
  const [showPolice, setShowPolice] = useState(true);
  const [showInsights, setShowInsights] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState("Thoraipakkam");
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [priceTrendData] = useState(generatePriceTrendData());
  const [amenitiesData] = useState(generateAmenitiesData());
  const [crimeData] = useState(generateCrimeData());
  const [animationPlaying, setAnimationPlaying] = useState(false);
  const animationRef = useRef<number | null>(null);
  
  // Add 3D terrain toggle
  const [show3D, setShow3D] = useState(false);
  
  // Weather data simulation
  const [showWeather, setShowWeather] = useState(false);
  const [weatherData] = useState({
    temperature: faker.number.int({ min: 28, max: 34 }),
    humidity: faker.number.int({ min: 65, max: 85 }),
    windSpeed: faker.number.int({ min: 5, max: 20 }),
    airQuality: faker.number.int({ min: 40, max: 150 }),
  });

  // Initialize the weather group as a state variable to persist across renders
  const [weatherGroup, setWeatherGroup] = useState<L.LayerGroup | null>(null);

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} L`;
    } else {
      return `₹${price.toLocaleString()}`;
    }
  };

  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    if (!mapRef.current || mapLoaded) return;

    const loadLeaflet = async () => {
      try {
        // Ensure Leaflet is available
        if (!L || !L.map) {
          throw new Error("Leaflet library not properly loaded");
        }

        // Fix leaflet icon issues (common in React apps)
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        });

        // Initialize the map
        const map = L.map(mapRef.current, {
          maxZoom: 20,
          preferCanvas: true,
          zoomAnimation: true,
          fadeAnimation: true,
          markerZoomAnimation: true,
        }).setView([12.8932, 80.2309], 13); // Center on OMR, Chennai
        
        // Define tile layers - standard and satellite
        const standardLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        });
        
        // Using Esri WorldImagery for satellite view
        const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
          maxZoom: 20
        });
        
        // For 3D-like terrain effect (Stamen TopoMap)
        const terrainLayer = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.png', {
          attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          subdomains: 'abcd',
          maxZoom: 18,
        });
        
        // Add the initial layer
        if (viewMode === 'satellite') {
          satelliteLayer.addTo(map);
        } else {
          standardLayer.addTo(map);
        }
        
        // Create layer controls
        const baseLayers = {
          "Standard": standardLayer,
          "Satellite": satelliteLayer,
          "3D Terrain": terrainLayer
        };
        
        L.control.layers(baseLayers).addTo(map);
        
        // Add scale control
        L.control.scale().addTo(map);
        
        setMapInstance(map);
          setMapLoaded(true);

        // Create marker clusters for better performance with many markers
        const markerCluster = MarkerClusterGroup({
          showCoverageOnHover: false,
          spiderfyOnMaxZoom: true,
          disableClusteringAtZoom: 15,
          maxClusterRadius: 50
        });

        // Custom icons for different POIs
        const propertyIcon = L.divIcon({
          html: `<div class="w-8 h-8 bg-electric text-white rounded-full flex items-center justify-center shadow-lg transform transition-transform hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                </div>`,
          className: 'property-marker',
          iconSize: [32, 32],
          iconAnchor: [16, 32]
        });
        
        const hospitalIcon = L.divIcon({
          html: `<div class="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3v2m4-2v2m4-2v2M2 7h20v2H2zm17 3v8m-7-8v8m-7-8v8m0 0h14"></path></svg>
                </div>`,
          className: 'hospital-marker',
          iconSize: [32, 32],
          iconAnchor: [16, 32]
        });
        
        const mallIcon = L.divIcon({
          html: `<div class="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2h12l4 10H2L6 2z"/><path d="M3 10v10h18V10"/><path d="M9 14v2m6-2v2"/></svg>
                </div>`,
          className: 'mall-marker',
          iconSize: [32, 32],
          iconAnchor: [16, 32]
        });
        
        const policeIcon = L.divIcon({
          html: `<div class="w-8 h-8 bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="6" r="3"/><path d="M10 9h4m-5 8h6m-3-3v6"/><circle cx="12" cy="12" r="10"/></svg>
                </div>`,
          className: 'police-marker',
          iconSize: [32, 32],
          iconAnchor: [16, 32]
        });
        
        // Add property markers
          mapProperties.forEach((property) => {
          const marker = L.marker(property.coordinates, { 
            icon: propertyIcon,
            // @ts-ignore - rotationAngle is from leaflet-rotatedmarker
            rotationAngle: 0, 
            rotationOrigin: 'center'
          });
          
          // Add popup
          marker.bindPopup(`
            <div class="p-4">
              <h3 class="font-medium text-neutral-900 text-lg mb-1">${property.title}</h3>
              <p class="text-sm text-neutral-500 mb-3">${property.location}</p>
              <div class="flex justify-between items-center mb-2">
                <span class="text-electric font-medium text-lg">${formatPrice(property.price)}</span>
                <div className="flex items-center bg-electric/10 text-electric py-1 px-2 rounded-full text-xs">
                  <span className="font-medium">${property.valueScore}/100</span>
                </div>
              </div>
              <div class="text-xs bg-neutral-100 p-2 rounded text-neutral-700">
                <div className="mb-1"><strong>Available:</strong> Yes</div>
                <div className="mb-1"><strong>Bedrooms:</strong> ${faker.number.int({ min: 2, max: 4 })}</div>
                <div><strong>Area:</strong> ${faker.number.int({ min: 1000, max: 2500 })} sq.ft.</div>
              </div>
              <button onclick="window.showPropertyDetails('${property.id}')" class="mt-3 w-full bg-electric hover:bg-blue-600 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors">
                View Details
              </button>
            </div>
          `, { maxWidth: 300 });

          // Add event listeners
          marker.on('click', () => {
              if (onPropertySelect) {
                onPropertySelect(property.id);
              }
            });

          marker.on('mouseover', () => {
              setHoveredProperty(property);
            // @ts-ignore - Missing type for rotation animation
            marker.setRotationAngle(10);
          });

          marker.on('mouseout', () => {
            setHoveredProperty(null);
            // @ts-ignore - Missing type for rotation animation
            marker.setRotationAngle(0);
          });
          
          // Add marker to cluster instead of directly to map
          markerCluster.addLayer(marker);
        });
        
        // Add the marker cluster to the map
        map.addLayer(markerCluster);

        // Create layer groups for toggleable POIs
        const hospitalGroup = L.layerGroup();
        const mallGroup = L.layerGroup();
        const policeGroup = L.layerGroup();
        const insightGroup = L.layerGroup();
        const weatherGroup = L.layerGroup();
        
        // Add hospitals to the map
        poiData.hospitals.forEach(hospital => {
          const marker = L.marker(hospital.coordinates, { icon: hospitalIcon })
            .bindPopup(`
              <div class="p-2">
                <h3 class="font-medium text-neutral-900">${hospital.name}</h3>
                <div class="flex items-center mt-1">
                  <span className="text-amber-500">★</span>
                  <span className="text-sm ml-1">${hospital.rating}</span>
                </div>
                <p class="text-xs text-neutral-600 mt-1">Medical Facility</p>
              </div>
            `);
          hospitalGroup.addLayer(marker);
        });
        
        // Add malls to the map
        poiData.malls.forEach(mall => {
          const marker = L.marker(mall.coordinates, { icon: mallIcon })
            .bindPopup(`
              <div class="p-2">
                <h3 class="font-medium text-neutral-900">${mall.name}</h3>
                <div class="flex items-center mt-1">
                  <span className="text-amber-500">★</span>
                  <span className="text-sm ml-1">${mall.rating}</span>
                </div>
                <p class="text-xs text-neutral-600 mt-1">Shopping Mall</p>
              </div>
            `);
          mallGroup.addLayer(marker);
        });
        
        // Add police stations to the map
        poiData.policeStations.forEach(station => {
          const marker = L.marker(station.coordinates, { icon: policeIcon })
            .bindPopup(`
              <div class="p-2">
                <h3 class="font-medium text-neutral-900">${station.name}</h3>
                <div class="flex items-center mt-1">
                  <span className="text-amber-500">★</span>
                  <span className="text-sm ml-1">${station.rating}</span>
                </div>
                <p class="text-xs text-neutral-600 mt-1">Police Station</p>
              </div>
            `);
          policeGroup.addLayer(marker);
        });
        
        // Add insight areas (like COVID zones, crime areas, green zones)
        areaInsights.forEach(area => {
          let fillColor;
          switch(area.name) {
            case "COVID-19 Impact Zone":
              fillColor = 'rgba(252, 165, 165, 0.5)'; // Light red
              break;
            case "High Crime Area":
              fillColor = 'rgba(251, 146, 60, 0.5)'; // Light orange
              break;
            case "Green Zone":
              fillColor = 'rgba(134, 239, 172, 0.5)'; // Light green
              break;
            default:
              fillColor = 'rgba(147, 197, 253, 0.5)'; // Light blue
          }
          
          const circle = L.circle(area.coordinates, {
            radius: area.radius,
            fillColor: fillColor,
            fillOpacity: 0.5,
            color: 'white',
            weight: 1
          }).bindPopup(`
            <div class="p-2">
              <h3 class="font-medium text-neutral-900">${area.name}</h3>
              <p class="text-sm text-neutral-600 mt-1">${area.details}</p>
            </div>
          `);
          
          insightGroup.addLayer(circle);
        });
        
        // Add heatmap layer for value scores
        const heatData = mapProperties.map(property => {
          return [
            property.coordinates[0], 
            property.coordinates[1], 
            property.valueScore / 100
          ];
        });

        try {
          // Check if the heat plugin exists on L
          if (L.heatLayer) {
            // Create heat layer without dynamic import since we've imported it at the top
            // @ts-ignore - Leaflet.heat typing issue
            const heatLayer = L.heatLayer(heatData, {
              radius: 25,
              blur: 15,
              maxZoom: 15,
              gradient: {0.4: 'blue', 0.6: 'green', 0.8: 'yellow', 1.0: 'red'}
            });
            
            // Add toggle options for overlay layers
            const overlays = {
              "Hospitals": hospitalGroup,
              "Shopping Malls": mallGroup,
              "Police Stations": policeGroup,
              "Area Insights": insightGroup,
              "Property Heat Map": heatLayer
            };
            
            L.control.layers(baseLayers, overlays, { collapsed: false }).addTo(map);
            
            // Add all layers initially
            if (showHospitals) hospitalGroup.addTo(map);
            if (showMalls) mallGroup.addTo(map);
            if (showPolice) policeGroup.addTo(map);
            if (showInsights) insightGroup.addTo(map);
            heatLayer.addTo(map);
          } else {
            console.warn('Leaflet.heat plugin not available');
            // Add overlays without the heat layer
            const overlays = {
              "Hospitals": hospitalGroup,
              "Shopping Malls": mallGroup,
              "Police Stations": policeGroup,
              "Area Insights": insightGroup
            };
            
            L.control.layers(baseLayers, overlays, { collapsed: false }).addTo(map);
            
            // Add all layers initially
            if (showHospitals) hospitalGroup.addTo(map);
            if (showMalls) mallGroup.addTo(map);
            if (showPolice) policeGroup.addTo(map);
            if (showInsights) insightGroup.addTo(map);
          }
        } catch (error) {
          console.error('Error loading heat map:', error);
          // Don't show the error toast here as it would prevent the map from loading
          // Just log the error and continue loading the map without the heat layer
        }

        // Create a new weather layer group
        const newWeatherGroup = L.layerGroup();
        setWeatherGroup(newWeatherGroup);
        
        // Add weather information if needed
        if (showWeather) {
          addWeatherData(newWeatherGroup);
          map.addLayer(newWeatherGroup);
        }

        // Add terrain elevation data (simulated)
        if (show3D) {
          // Add visual elevations (just for visual effect - not real 3D)
          const elevationPoints = [
            { coordinates: [12.9100, 80.2200] as [number, number], elevation: 45 },
            { coordinates: [12.8600, 80.2350] as [number, number], elevation: 35 },
            { coordinates: [12.9300, 80.2400] as [number, number], elevation: 50 },
            { coordinates: [12.8800, 80.2150] as [number, number], elevation: 40 },
          ];
          
          const elevationGroup = L.layerGroup();
          
          elevationPoints.forEach(point => {
            // Create an elevation marker
            const size = point.elevation * 2; // Scale based on elevation
            
            const elevationIcon = L.divIcon({
              html: `<div class="bg-gray-800 bg-opacity-20 rounded-full border border-gray-400" style="width: ${size}px; height: ${size}px; transform: translateY(-${size/2}px);"></div>`,
              className: 'elevation-marker',
              iconSize: [size, size],
              iconAnchor: [size/2, size/2]
            });
            
            const marker = L.marker(point.coordinates, { 
              icon: elevationIcon,
              interactive: false
            });
            
            // Display elevation info
            const textIcon = L.divIcon({
              html: `<div class="px-2 py-1 bg-white bg-opacity-70 rounded text-xs font-medium shadow">
                      ${point.elevation}m
                    </div>`,
              className: 'elevation-text',
              iconSize: [40, 20],
              iconAnchor: [20, 10]
            });
            
            const textMarker = L.marker(point.coordinates, {
              icon: textIcon
            }).bindPopup(`<div>Elevation: ${point.elevation} meters</div>`);
            
            elevationGroup.addLayer(marker);
            elevationGroup.addLayer(textMarker);
          });
          
          map.addLayer(elevationGroup);
        }

      } catch (error) {
        console.error('Error loading Leaflet map:', error);
        setMapError(true);
        setMapLoaded(true);
        
        toast({
          title: "Error loading map",
          description: "There was an issue loading the interactive map. Please try refreshing the page.",
          variant: "destructive"
        });
      }
    };

    loadLeaflet();

    // Cleanup function to remove the map when component unmounts
    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, [onPropertySelect, mapLoaded, viewMode, showHospitals, showMalls, showPolice, showInsights, showWeather, show3D]);

  // Add a separate function to add weather data to a layer group
  const addWeatherData = (layerGroup: L.LayerGroup) => {
    // Clear existing layers
    layerGroup.clearLayers();
    
    // Add temperature markers at different locations
    const weatherLocations = [
      { name: "Thoraipakkam", coordinates: [12.9421, 80.2384] as [number, number], temp: weatherData.temperature },
      { name: "Navalur", coordinates: [12.8588, 80.2294] as [number, number], temp: weatherData.temperature - 1 },
      { name: "Siruseri", coordinates: [12.8294, 80.2370] as [number, number], temp: weatherData.temperature + 1 },
    ];

    weatherLocations.forEach(loc => {
      const tempIcon = L.divIcon({
        html: `<div class="w-12 h-12 flex items-center justify-center font-bold bg-white bg-opacity-80 rounded-full border-2 border-amber-500 shadow-lg">
                <span class="text-amber-600">${loc.temp}°C</span>
              </div>`,
        className: 'weather-marker',
        iconSize: [48, 48],
        iconAnchor: [24, 24]
      });
      
      const marker = L.marker(loc.coordinates, { icon: tempIcon })
        .bindPopup(`
          <div class="p-2">
            <h3 class="font-medium text-neutral-900 mb-1">${loc.name} Weather</h3>
            <div class="text-sm space-y-1">
              <div><strong>Temperature:</strong> ${loc.temp}°C</div>
              <div><strong>Humidity:</strong> ${weatherData.humidity}%</div>
              <div><strong>Wind:</strong> ${weatherData.windSpeed} km/h</div>
              <div><strong>Air Quality:</strong> ${weatherData.airQuality} AQI</div>
            </div>
          </div>
        `);
      
      layerGroup.addLayer(marker);
    });
    
    // Add wind direction arrows
    const windArrows = [
      [12.9200, 80.2200],
      [12.8800, 80.2300],
      [12.9300, 80.2350],
      [12.8500, 80.2400],
    ];
    
    windArrows.forEach(coords => {
      const arrowIcon = L.divIcon({
        html: `<div class="wind-arrow">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.5)" stroke-width="2" class="transform rotate-${faker.number.int({ min: 0, max: 360 })}">
                  <path d="M12 19V5M5 12l7-7 7 7"/>
                </svg>
              </div>`,
        className: 'wind-marker',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });
      
      const marker = L.marker([coords[0], coords[1]] as [number, number], { 
        icon: arrowIcon, 
        // @ts-ignore - rotationAngle comes from leaflet-rotatedmarker
        rotationAngle: faker.number.int({ min: 0, max: 360 }), 
        rotationOrigin: 'center'
      });
      
      layerGroup.addLayer(marker);
    });
  };

  // Create a separate useEffect to handle weather toggle
  useEffect(() => {
    if (!mapInstance || !weatherGroup) return;
    
    if (showWeather) {
      addWeatherData(weatherGroup);
      mapInstance.addLayer(weatherGroup);
    } else {
      mapInstance.removeLayer(weatherGroup);
    }
  }, [mapInstance, weatherGroup, showWeather]);

  // Function to animate markers rotation (simulating movement)
  const animateMarkers = () => {
    if (!mapInstance) return;
    
    // Get all markers in the map
    const markers = document.querySelectorAll('.property-marker, .wind-marker');
    
    // Animate them
    markers.forEach(marker => {
      const rotationVal = parseInt(marker.getAttribute('data-rotation') || '0');
      const newRotation = (rotationVal + 2) % 360;
      
      marker.setAttribute('data-rotation', String(newRotation));
      
      // Apply CSS transform
      const icon = marker.querySelector('div');
      if (icon) {
        icon.style.transform = `rotate(${newRotation}deg)`;
      }
    });
    
    // Continue animation
    animationRef.current = requestAnimationFrame(animateMarkers);
  };

  // Toggle animation
  const toggleAnimation = () => {
    if (animationPlaying) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    } else {
      animateMarkers();
    }
    setAnimationPlaying(!animationPlaying);
  };

  // Function to toggle terrain view
  const toggle3DTerrain = () => {
    setShow3D(!show3D);
    
    if (mapInstance) {
      // Animation effect when switching
      mapInstance.flyTo(
        [12.8932, 80.2309], 
        show3D ? 12 : 14, 
        { animate: true, duration: 1.5 }
      );
    }
  };

  // Create a proper weather toggle function
  const toggleWeather = () => {
    setShowWeather(!showWeather);
    
    // Only run if map is loaded
    if (mapInstance) {
      const map = mapInstance;
      
      // Find existing weather layer group if any
      let weatherGroup: L.LayerGroup | null = null;
      
      // Remove existing weather layers if any
      map.eachLayer((layer) => {
        if ((layer as any)._weatherLayer) {
          weatherGroup = layer as L.LayerGroup;
          map.removeLayer(layer);
        }
      });
      
      // If toggling on, add new weather layer
      if (!showWeather) { // Note: We check !showWeather because setShowWeather hasn't taken effect yet
        const newWeatherGroup = L.layerGroup();
        // Mark this as a weather layer for later identification
        (newWeatherGroup as any)._weatherLayer = true;
        
        // Add temperature markers
        const weatherLocations = [
          { name: "Thoraipakkam", coordinates: [12.9421, 80.2384] as [number, number], temp: weatherData.temperature },
          { name: "Navalur", coordinates: [12.8588, 80.2294] as [number, number], temp: weatherData.temperature - 1 },
          { name: "Siruseri", coordinates: [12.8294, 80.2370] as [number, number], temp: weatherData.temperature + 1 },
        ];

        weatherLocations.forEach(loc => {
          const tempIcon = L.divIcon({
            html: `<div class="w-12 h-12 flex items-center justify-center font-bold bg-white bg-opacity-80 rounded-full border-2 border-amber-500 shadow-lg">
                    <span class="text-amber-600">${loc.temp}°C</span>
                  </div>`,
            className: 'weather-marker',
            iconSize: [48, 48],
            iconAnchor: [24, 24]
          });
          
          const marker = L.marker(loc.coordinates, { icon: tempIcon })
            .bindPopup(`
              <div class="p-2">
                <h3 class="font-medium text-neutral-900 mb-1">${loc.name} Weather</h3>
                <div class="text-sm space-y-1">
                  <div><strong>Temperature:</strong> ${loc.temp}°C</div>
                  <div><strong>Humidity:</strong> ${weatherData.humidity}%</div>
                  <div><strong>Wind:</strong> ${weatherData.windSpeed} km/h</div>
                  <div><strong>Air Quality:</strong> ${weatherData.airQuality} AQI</div>
                </div>
              </div>
            `);
          
          newWeatherGroup.addLayer(marker);
        });
        
        // Add the new weather group to the map
        map.addLayer(newWeatherGroup);
      }
    }
  };

  // Function exposed to window for popup buttons
  useEffect(() => {
    // @ts-ignore
    window.showPropertyDetails = (id: string) => {
      if (onPropertySelect) {
        onPropertySelect(id);
      }
      
      // Highlight the property on the map
      const property = mapProperties.find(p => p.id === id);
      if (property && mapInstance) {
        mapInstance.flyTo(property.coordinates, 16, { animate: true, duration: 1.5 });
      }
    };
    
    return () => {
      // @ts-ignore
      delete window.showPropertyDetails;
    };
  }, [mapInstance, onPropertySelect]);

  return (
    <section id="map" className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center space-x-2 bg-electric/10 px-4 py-2 rounded-full text-electric mb-4">
            <span className="text-sm font-medium">Explore Locations</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">
            Interactive Property Map
          </h2>
          <p className="text-neutral-500 max-w-2xl mx-auto">
            Explore property locations with our detailed satellite map. View nearby facilities, safety data, and area insights.
          </p>
          
          {/* Map control buttons */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            <button 
              onClick={toggle3DTerrain} 
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${show3D ? 'bg-electric text-white' : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'}`}
            >
              <Layers size={16} />
              {show3D ? '3D View Active' : '3D Terrain View'}
            </button>
            
            <button 
              onClick={toggleWeather} 
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${showWeather ? 'bg-electric text-white' : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'}`}
            >
              <Wind size={16} />
              {showWeather ? 'Weather Active' : 'Show Weather'}
            </button>
            
            <button 
              onClick={toggleAnimation} 
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${animationPlaying ? 'bg-electric text-white' : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'}`}
            >
              <Zap size={16} />
              {animationPlaying ? 'Animation On' : 'Animate Map'}
            </button>
            
            <button 
              onClick={() => setShowAnalytics(!showAnalytics)} 
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${showAnalytics ? 'bg-electric text-white' : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'}`}
            >
              <BarChart3 size={16} />
              {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
            </button>
          </div>
        </div>

        <div className="relative h-[500px] rounded-xl overflow-hidden border border-neutral-200 shadow-lg">
          {!mapLoaded && (
            <div className="absolute inset-0 bg-neutral-100 flex items-center justify-center z-10">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-electric border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-neutral-600">Loading interactive map...</p>
              </div>
            </div>
          )}
          
          <MapErrorBoundary onError={() => setMapError(true)}>
            {!mapError ? (
              <div ref={mapRef} className="w-full h-full" />
            ) : (
              <SimplifiedMapFallback properties={mapProperties} />
            )}
          </MapErrorBoundary>
          
          {/* Weather info bar */}
          {showWeather && (
            <div className="absolute top-4 left-4 right-4 bg-white bg-opacity-90 rounded-lg shadow-lg p-3 z-10 backdrop-blur-sm border border-neutral-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center">
                    <span className="text-amber-600 text-xl font-bold">{weatherData.temperature}°C</span>
                    <span className="text-xs text-neutral-600">Temp</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-blue-600 text-xl font-bold">{weatherData.humidity}%</span>
                    <span className="text-xs text-neutral-600">Humidity</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-teal-600 text-xl font-bold">{weatherData.windSpeed}km/h</span>
                    <span className="text-xs text-neutral-600">Wind</span>
                </div>
                  <div className="flex flex-col items-center">
                    <span className={`text-xl font-bold ${weatherData.airQuality > 100 ? 'text-red-600' : 'text-green-600'}`}>{weatherData.airQuality}</span>
                    <span className="text-xs text-neutral-600">AQI</span>
                  </div>
                </div>
                <div className="text-xs text-neutral-600">
                  Live Chennai Weather
                </div>
              </div>
            </div>
          )}

          {hoveredProperty && (
            <div className="absolute left-4 bottom-4 bg-white rounded-lg shadow-lg border border-neutral-200 p-4 max-w-xs z-10">
              <h3 className="font-medium text-neutral-900 mb-1">{hoveredProperty.title}</h3>
              <p className="text-sm text-neutral-500 mb-2">{hoveredProperty.location}</p>
              <div className="flex justify-between items-center">
                <span className="text-electric font-medium">{formatPrice(hoveredProperty.price)}</span>
                <div className="flex items-center bg-electric/10 text-electric py-1 px-2 rounded-full text-xs">
                  <span className="font-medium">{hoveredProperty.valueScore}/100</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-medium text-neutral-900 mb-3 flex items-center">
              <MapPin size={18} className="text-electric mr-2" />
              Map Legend
            </h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-electric rounded-full mr-2 flex items-center justify-center text-white">
                  <Home size={12} />
                </div>
                <span className="text-neutral-700">Properties</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-red-500 rounded-full mr-2 flex items-center justify-center text-white">
                  <span className="text-xs">H</span>
                </div>
                <span className="text-neutral-700">Hospitals</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-purple-500 rounded-full mr-2 flex items-center justify-center text-white">
                  <span className="text-xs">M</span>
                </div>
                <span className="text-neutral-700">Shopping Malls</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-blue-700 rounded-full mr-2 flex items-center justify-center text-white">
                  <span className="text-xs">P</span>
                </div>
                <span className="text-neutral-700">Police Stations</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-red-200 rounded-full mr-2"></div>
                <span className="text-neutral-700">COVID Impact Zones</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-orange-200 rounded-full mr-2"></div>
                <span className="text-neutral-700">High Crime Areas</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-green-200 rounded-full mr-2"></div>
                <span className="text-neutral-700">Green Zones</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-amber-500 bg-opacity-20 border border-amber-500 rounded-full mr-2 flex items-center justify-center">
                  <span className="text-xs text-amber-600">°C</span>
                </div>
                <span className="text-neutral-700">Weather Data</span>
              </div>
            </div>
          </div>
          
          <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-medium text-neutral-900 mb-3 flex items-center">
              <Activity size={18} className="text-electric mr-2" />
              Area Insights
            </h3>
            <p className="text-sm text-neutral-600 mb-4">
              OMR (Old Mahabalipuram Road) is a rapidly growing IT corridor in Chennai with varying safety profiles and amenities.
            </p>
            <ul className="text-sm space-y-1.5 text-neutral-600">
              <li className="flex items-start">
                <span className="inline-block h-5 pt-0.5 mr-2 text-green-600">•</span>
                Green zones indicate high vegetation and clean air
              </li>
              <li className="flex items-start">
                <span className="inline-block h-5 pt-0.5 mr-2 text-orange-600">•</span>
                Orange zones show areas with higher crime rates
              </li>
              <li className="flex items-start">
                <span className="inline-block h-5 pt-0.5 mr-2 text-red-600">•</span>
                Red zones were previous COVID-19 hotspots
              </li>
              <li className="flex items-start">
                <span className="inline-block h-5 pt-0.5 mr-2 text-blue-600">•</span>
                Click on markers for detailed property information
              </li>
            </ul>
          </div>
          
          <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-medium text-neutral-900 mb-3 flex items-center">
              <Info size={18} className="text-electric mr-2" />
              Interactive Features
            </h3>
            <ul className="text-sm text-neutral-600 space-y-1.5">
              <li className="flex items-start">
                <span className="inline-block h-5 pt-0.5 mr-2 text-electric">1.</span>
                Use controls in top-right to toggle map layers
              </li>
              <li className="flex items-start">
                <span className="inline-block h-5 pt-0.5 mr-2 text-electric">2.</span> 
                Switch between satellite and 3D terrain views
              </li>
              <li className="flex items-start">
                <span className="inline-block h-5 pt-0.5 mr-2 text-electric">3.</span>
                Click on markers to view detailed information
              </li>
              <li className="flex items-start">
                <span className="inline-block h-5 pt-0.5 mr-2 text-electric">4.</span>
                Toggle weather data for temperature and AQI
              </li>
              <li className="flex items-start">
                <span className="inline-block h-5 pt-0.5 mr-2 text-electric">5.</span>
                View area insights with color-coded zones
              </li>
              <li className="flex items-start">
                <span className="inline-block h-5 pt-0.5 mr-2 text-electric">6.</span>
                Explore analytics for price trends and safety
              </li>
            </ul>
          </div>
        </div>

        {/* Analytics Section */}
        {showAnalytics && (
          <div className="mt-8 p-6 bg-white border border-neutral-200 rounded-xl shadow-lg animation-slide-up">
            <h3 className="text-xl font-bold text-neutral-900 mb-6">Property Market Analytics</h3>
            
            {/* Chart Selection */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="font-medium text-neutral-600">Location: </div>
              <div className="flex space-x-2">
                {["Thoraipakkam", "Navalur", "Siruseri"].map(location => (
                  <button
                    key={location}
                    onClick={() => setSelectedLocation(location)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                      selectedLocation === location 
                        ? 'bg-electric text-white' 
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    {location}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Price Trend Chart */}
              <div className="bg-neutral-50 p-4 rounded-xl">
                <h4 className="text-neutral-800 font-medium mb-4">Price Trends (2023)</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={priceTrendData}>
                      <defs>
                        <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis 
                        tick={{ fontSize: 12 }} 
                        tickFormatter={(value) => `₹${value/1000}k`}
                      />
                      <Tooltip 
                        formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Price per sqft']}
                        labelFormatter={(label) => `Month: ${label}`}
                      />
                      <Area 
                        type="monotone" 
                        dataKey={selectedLocation} 
                        stroke="#3b82f6" 
                        fillOpacity={1}
                        fill="url(#priceGradient)" 
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2 text-xs text-neutral-500 text-center">
                  Average price per sq. ft. in {selectedLocation} area
                </div>
              </div>
              
              {/* Amenities Distribution */}
              <div className="bg-neutral-50 p-4 rounded-xl">
                <h4 className="text-neutral-800 font-medium mb-4">Amenities Distribution</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={amenitiesData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="count"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {amenitiesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name, props) => [`${value} facilities`, name]}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2 text-xs text-neutral-500 text-center">
                  Distribution of amenities around {selectedLocation}
                </div>
              </div>
              
              {/* Crime Statistics */}
              <div className="bg-neutral-50 p-4 rounded-xl md:col-span-2">
                <h4 className="text-neutral-800 font-medium mb-4">Safety Profile: Area Crime Statistics</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={crimeData}>
                      <defs>
                        <linearGradient id="crimeGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f87171" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#f87171" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="count" 
                        stroke="#f87171" 
                        fill="url(#crimeGradient)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2 text-xs text-neutral-500 text-center">
                  Note: Data shown is simulated for demonstration purposes
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PropertyMap;