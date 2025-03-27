import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import axios from 'axios';

// Initialize the Google Generative AI with the API key
const API_KEY = "AIzaSyAcPjcrfZmDrxN92qAvvws7C-hj7IHu4gI";
const genAI = new GoogleGenerativeAI(API_KEY);

// Configure safety settings
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// Get the Gemini 1.5 Pro model
const getGeminiModel = () => {
  return genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
    safetySettings,
  });
};

// Function to generate property analysis based on provided details
export const generatePropertyAnalysis = async (propertyDetails: string) => {
  try {
    const model = getGeminiModel();
    
    const prompt = `Analyze the following real estate property details and provide insights:
    
    ${propertyDetails}
    
    Please include:
    1. Overall assessment of the property
    2. Potential investment value
    3. Pros and cons
    4. Recommendations for negotiation
    5. Future value prediction
    
    Format the response with clear sections and bullet points where appropriate.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating property analysis:", error);
    throw error;
  }
};

// Function to generate neighborhood insights
export const generateNeighborhoodInsights = async (neighborhood: string) => {
  try {
    const model = getGeminiModel();
    
    const prompt = `Provide detailed insights for the ${neighborhood} area from a real estate perspective.
    
    Please include:
    1. Overview of the neighborhood
    2. Infrastructure development status and plans
    3. Proximity to key locations (offices, schools, hospitals, etc.)
    4. Price trends over the last 5 years
    5. Growth potential in the next 5-10 years
    6. Best property types to invest in this area
    
    Format the response with clear sections and bullet points where appropriate.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating neighborhood insights:", error);
    throw error;
  }
};

// Function to get investment advice based on preferences
export const getInvestmentAdvice = async (preferences: {
  budget: string;
  location: string;
  propertyType: string;
  investmentGoal: string;
  timeHorizon: string;
}) => {
  try {
    const model = getGeminiModel();
    
    const prompt = `Provide personalized real estate investment advice based on the following preferences:
    
    Budget: ${preferences.budget}
    Preferred Location: ${preferences.location}
    Property Type: ${preferences.propertyType}
    Investment Goal: ${preferences.investmentGoal}
    Time Horizon: ${preferences.timeHorizon}
    
    Please include:
    1. Best areas to consider within the location
    2. Property types that match the budget and goals
    3. Expected ROI based on historical data
    4. Risks to consider
    5. Alternative investment options if applicable
    
    Format the response with clear sections and bullet points where appropriate.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating investment advice:", error);
    throw error;
  }
};

// Function for real-time Q&A about real estate
export const askRealEstateQuestion = async (question: string) => {
  try {
    const model = getGeminiModel();
    
    const prompt = `As a real estate AI assistant, please answer the following question with accurate and helpful information:
    
    ${question}
    
    Provide a comprehensive but concise answer with relevant facts and insights.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error answering real estate question:", error);
    throw error;
  }
};

// Chat history interface
export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

// Function to manage chat conversations
export const chatWithAI = async (history: ChatMessage[], userMessage: string): Promise<string> => {
  try {
    // For property search queries, use the custom search functionality
    if (isPropertySearchQuery(userMessage)) {
      return searchProperties(userMessage);
    }
    
    // For neighborhood queries, use the custom neighborhood functionality
    if (isNeighborhoodQuery(userMessage)) {
      return getNeighborhoodInfo(userMessage);
    }

    // For other queries, simulate a response based on the query type
    const lowerCaseMessage = userMessage.toLowerCase();
    
    if (lowerCaseMessage.includes('price') || lowerCaseMessage.includes('cost')) {
      return generatePriceResponse(userMessage);
    }
    
    if (lowerCaseMessage.includes('amenities') || lowerCaseMessage.includes('facilities')) {
      return generateAmenitiesResponse(userMessage);
    }
    
    if (lowerCaseMessage.includes('investment') || lowerCaseMessage.includes('roi')) {
      return generateInvestmentResponse(userMessage);
    }
    
    // For general queries, provide a helpful response
    return `I'd be happy to help you with your real estate search! You can ask me about properties, neighborhoods, pricing, amenities, or investment potential. If you're looking for specific property recommendations, let me know your budget, preferred location, or other requirements.`;
  } catch (error) {
    console.error('Error in AI response:', error);
    return "I'm sorry, I encountered an error processing your request. Please try again with a different query.";
  }
};

// Image analysis for property images
export const analyzePropertyImage = async (base64Image: string): Promise<string> => {
  try {
    // Simulate image analysis (in a real app, this would call an AI vision API)
    return `Based on the image analysis, I can see this appears to be a modern residential property. It looks like a well-maintained apartment in a residential complex with good landscaping. The architectural style is contemporary with large windows that would allow plenty of natural light. Properties with this aesthetic typically range from ₹75L to ₹1.2Cr in the OMR area, depending on the exact location and amenities. Would you like to know about similar properties available in our listings?`;
  } catch (error) {
    console.error('Error analyzing image:', error);
    return "I'm sorry, I couldn't analyze that image properly. Please try again with a clearer image or ask me specific questions about properties you're interested in.";
  }
};

// Sample properties data (in a real app, this would come from an API or database)
const properties = [
  {
    id: 'p1',
    title: 'Prestige Lakeside Habitat',
    location: 'Thoraipakkam, OMR',
    price: 9500000,
    size: 1275,
    bedrooms: 2,
    bathrooms: 2,
    amenities: ['Swimming Pool', 'Gym', 'Garden', 'Security', 'Parking'],
    description: 'Luxury 2 BHK apartment with premium amenities in a gated community.',
    valueScore: 87,
    tags: ['luxury', 'gated', 'family', 'new']
  },
  {
    id: 'p2',
    title: 'Casagrand Luxus',
    location: 'Navalur, OMR',
    price: 8200000,
    size: 1180,
    bedrooms: 2,
    bathrooms: 2,
    amenities: ['Swimming Pool', 'Club House', 'Play Area', 'Security'],
    description: 'Modern 2 BHK apartment close to IT parks with great connectivity.',
    valueScore: 82,
    tags: ['modern', 'it-proximity', 'investment']
  },
  {
    id: 'p3',
    title: 'DLF Garden City',
    location: 'Siruseri, OMR',
    price: 10500000,
    size: 1350,
    bedrooms: 2,
    bathrooms: 2,
    amenities: ['Swimming Pool', 'Gym', 'Tennis Court', 'Garden', 'Clubhouse'],
    description: 'Premium 2 BHK apartment in a township with extensive amenities.',
    valueScore: 91,
    tags: ['premium', 'township', 'extensive-amenities']
  },
  {
    id: 'p4',
    title: 'Mantri Synergy',
    location: 'Padur, OMR',
    price: 7500000,
    size: 1150,
    bedrooms: 2,
    bathrooms: 2,
    amenities: ['Swimming Pool', 'Gym', 'Play Area'],
    description: 'Affordable 2 BHK apartment with good connectivity to IT parks.',
    valueScore: 78,
    tags: ['affordable', 'value', 'connectivity']
  },
  {
    id: 'p5',
    title: 'Hiranandani Parks',
    location: 'Oragadam',
    price: 6800000,
    size: 1220,
    bedrooms: 2,
    bathrooms: 2,
    amenities: ['Swimming Pool', 'Park', 'Gym', 'Play Area'],
    description: 'Township apartment with green surroundings and peaceful atmosphere.',
    valueScore: 80,
    tags: ['peaceful', 'green', 'township']
  },
  {
    id: 'p6',
    title: 'Alliance Galleria Residences',
    location: 'Sholinganallur, OMR',
    price: 8900000,
    size: 1230,
    bedrooms: 2,
    bathrooms: 2,
    amenities: ['Swimming Pool', 'Gym', 'Play Area', 'Club House', 'Multipurpose Hall'],
    description: 'Premium apartment in prime location with excellent amenities.',
    valueScore: 85,
    tags: ['premium', 'prime-location', 'well-connected']
  },
  {
    id: 'p7',
    title: 'VGN Fairmont',
    location: 'Guindy',
    price: 12000000,
    size: 1450,
    bedrooms: 3,
    bathrooms: 2,
    amenities: ['Swimming Pool', 'Gym', 'Spa', 'Club House', 'Banquet Hall'],
    description: 'Luxury 3 BHK apartment in the heart of the city with premium amenities.',
    valueScore: 92,
    tags: ['luxury', 'city-center', 'premium']
  },
  {
    id: 'p8',
    title: 'PBEL City',
    location: 'Kelambakkam, OMR',
    price: 6500000,
    size: 1100,
    bedrooms: 2,
    bathrooms: 2,
    amenities: ['Swimming Pool', 'Garden', 'Security'],
    description: 'Affordable apartment with basic amenities, ideal for first-time buyers.',
    valueScore: 75,
    tags: ['affordable', 'basic', 'first-time-buyer']
  }
];

// Mock neighborhoods data
const neighborhoods = [
  {
    name: 'Thoraipakkam',
    description: 'A vibrant IT hub with excellent connectivity to major tech parks. Popular among young professionals.',
    connectivity: 90,
    amenities: 85,
    safety: 80,
    schools: 75,
    valueScore: 87,
    priceRange: '₹7,500 - ₹9,000 per sq.ft'
  },
  {
    name: 'Navalur',
    description: 'A rapidly developing area with excellent infrastructure and proximity to IT corridors.',
    connectivity: 80,
    amenities: 78,
    safety: 85,
    schools: 70,
    valueScore: 82,
    priceRange: '₹6,800 - ₹8,500 per sq.ft'
  },
  {
    name: 'Siruseri',
    description: 'Home to SIPCOT IT Park with growing residential developments and good investment potential.',
    connectivity: 75,
    amenities: 70,
    safety: 82,
    schools: 65,
    valueScore: 76,
    priceRange: '₹6,200 - ₹7,800 per sq.ft'
  },
  {
    name: 'Kelambakkam',
    description: 'An emerging residential hub with affordable housing options and good infrastructure.',
    connectivity: 70,
    amenities: 65,
    safety: 80,
    schools: 60,
    valueScore: 74,
    priceRange: '₹5,800 - ₹7,200 per sq.ft'
  },
  {
    name: 'Pallikaranai',
    description: 'A rapidly developing residential area with good connectivity and amenities.',
    connectivity: 85,
    amenities: 80,
    safety: 75,
    schools: 85,
    valueScore: 83,
    priceRange: '₹7,000 - ₹8,500 per sq.ft'
  }
];

/**
 * Determine if a query is a property search
 */
function isPropertySearchQuery(query: string): boolean {
  const searchTerms = [
    'find', 'search', 'looking for', 'show me', 'properties', 'apartments', 
    'houses', 'flats', 'villas', 'in', 'near', 'budget', 'bhk', 'bedroom', 
    'bathroom', 'recommend', 'suggest'
  ];
  
  const lowerCaseQuery = query.toLowerCase();
  return searchTerms.some(term => lowerCaseQuery.includes(term));
}

/**
 * Determine if a query is about a neighborhood
 */
function isNeighborhoodQuery(query: string): boolean {
  const lowerCaseQuery = query.toLowerCase();
  
  // Check if the query mentions any neighborhood by name
  const isAboutSpecificNeighborhood = neighborhoods.some(
    neighborhood => lowerCaseQuery.includes(neighborhood.name.toLowerCase())
  );
  
  // Check if it's a general neighborhood query
  const neighborhoodTerms = [
    'neighborhood', 'area', 'locality', 'location', 'place', 'community', 'zone',
    'district', 'connectivity', 'infrastructure', 'schools', 'safety'
  ];
  
  const isAboutNeighborhoods = neighborhoodTerms.some(term => lowerCaseQuery.includes(term));
  
  return isAboutSpecificNeighborhood || isAboutNeighborhoods;
}

/**
 * Search for properties based on user query
 */
function searchProperties(query: string): string {
  const lowerCaseQuery = query.toLowerCase();
  
  // Extract budget information (if any)
  let minBudget = 0;
  let maxBudget = Infinity;
  
  const budgetMatch = lowerCaseQuery.match(/budget\s+(?:of\s+)?(?:rs\.?|₹)?\s*(\d+(?:\.\d+)?)\s*(l|lakh|lakhs|cr|crore|crores)?(?:\s*(?:to|-)\s*(?:rs\.?|₹)?\s*(\d+(?:\.\d+)?)\s*(l|lakh|lakhs|cr|crore|crores)?)?/i);
  
  if (budgetMatch) {
    const lowerValue = parseFloat(budgetMatch[1]);
    const lowerUnit = budgetMatch[2]?.toLowerCase() || 'l';
    let lowerMultiplier = lowerUnit.startsWith('cr') ? 10000000 : 100000;
    
    minBudget = lowerValue * lowerMultiplier;
    
    if (budgetMatch[3]) {
      const upperValue = parseFloat(budgetMatch[3]);
      const upperUnit = budgetMatch[4]?.toLowerCase() || 'l';
      let upperMultiplier = upperUnit.startsWith('cr') ? 10000000 : 100000;
      
      maxBudget = upperValue * upperMultiplier;
    } else {
      // If only one value is provided, assume it's the maximum budget
      maxBudget = minBudget;
      minBudget = 0;
    }
  }
  
  // Extract location information (if any)
  let preferredLocations: string[] = [];
  
  neighborhoods.forEach(neighborhood => {
    if (lowerCaseQuery.includes(neighborhood.name.toLowerCase())) {
      preferredLocations.push(neighborhood.name);
    }
  });
  
  // Extract BHK preference (if any)
  let bedrooms = 0;
  const bhkMatch = lowerCaseQuery.match(/(\d+)\s*bhk/i);
  if (bhkMatch) {
    bedrooms = parseInt(bhkMatch[1]);
  }
  
  // Filter properties based on extracted criteria
  let filteredProperties = [...properties];
  
  if (minBudget > 0) {
    filteredProperties = filteredProperties.filter(property => property.price >= minBudget);
  }
  
  if (maxBudget < Infinity) {
    filteredProperties = filteredProperties.filter(property => property.price <= maxBudget);
  }
  
  if (preferredLocations.length > 0) {
    filteredProperties = filteredProperties.filter(property => 
      preferredLocations.some(loc => property.location.includes(loc))
    );
  }
  
  if (bedrooms > 0) {
    filteredProperties = filteredProperties.filter(property => property.bedrooms === bedrooms);
  }
  
  // Sort properties by value score (best deals first)
  filteredProperties.sort((a, b) => b.valueScore - a.valueScore);
  
  // Limit results
  const topProperties = filteredProperties.slice(0, 3);
  
  // Generate response
  if (topProperties.length === 0) {
    return `I couldn't find any properties matching your criteria. Would you like to broaden your search? Maybe adjust your budget or consider different locations?`;
  }
  
  // Construct response with property recommendations
  let response = `Based on your search, here are the best properties I found:\n\n`;
  
  topProperties.forEach((property, index) => {
    const formattedPrice = property.price >= 10000000 
      ? `₹${(property.price / 10000000).toFixed(2)} Cr` 
      : `₹${(property.price / 100000).toFixed(2)} L`;
    
    response += `${index + 1}. **${property.title}** in ${property.location}\n`;
    response += `   ${property.bedrooms} BHK, ${property.size} sq.ft, ${formattedPrice}\n`;
    response += `   Value Score: ${property.valueScore}/100 (${getValueDescription(property.valueScore)})\n`;
    response += `   Key features: ${property.amenities.slice(0, 3).join(', ')}\n\n`;
  });
  
  response += `Would you like more details about any of these properties, or would you like to refine your search further?`;
  
  return response;
}

/**
 * Get information about a neighborhood
 */
function getNeighborhoodInfo(query: string): string {
  const lowerCaseQuery = query.toLowerCase();
  
  // Find which neighborhood the user is asking about
  let targetNeighborhood = null;
  for (const neighborhood of neighborhoods) {
    if (lowerCaseQuery.includes(neighborhood.name.toLowerCase())) {
      targetNeighborhood = neighborhood;
      break;
    }
  }
  
  // If no specific neighborhood is found, provide general information
  if (!targetNeighborhood) {
    return `I can provide information about various neighborhoods in Chennai, especially along OMR. Popular areas include Thoraipakkam, Navalur, Siruseri, Kelambakkam, and Pallikaranai. Each has different advantages in terms of connectivity, amenities, and price points. Which specific area would you like to know more about?`;
  }
  
  // Generate detailed response about the neighborhood
  let response = `**${targetNeighborhood.name}** - Neighborhood Analysis\n\n`;
  response += `${targetNeighborhood.description}\n\n`;
  response += `Value Score: ${targetNeighborhood.valueScore}/100\n`;
  response += `Price Range: ${targetNeighborhood.priceRange}\n\n`;
  
  response += `Key Metrics:\n`;
  response += `- Connectivity: ${targetNeighborhood.connectivity}/100\n`;
  response += `- Amenities: ${targetNeighborhood.amenities}/100\n`;
  response += `- Safety: ${targetNeighborhood.safety}/100\n`;
  response += `- Schools: ${targetNeighborhood.schools}/100\n\n`;
  
  // Add property recommendations in this neighborhood
  const propertiesInArea = properties.filter(p => 
    p.location.toLowerCase().includes(targetNeighborhood!.name.toLowerCase())
  );
  
  if (propertiesInArea.length > 0) {
    response += `Top Properties in ${targetNeighborhood.name}:\n`;
    
    propertiesInArea
      .sort((a, b) => b.valueScore - a.valueScore)
      .slice(0, 2)
      .forEach((property, index) => {
        const formattedPrice = property.price >= 10000000 
          ? `₹${(property.price / 10000000).toFixed(2)} Cr` 
          : `₹${(property.price / 100000).toFixed(2)} L`;
        
        response += `${index + 1}. ${property.title}: ${property.bedrooms} BHK, ${property.size} sq.ft, ${formattedPrice}\n`;
      });
  }
  
  return response;
}

/**
 * Generate a response about property prices
 */
function generatePriceResponse(query: string): string {
  const lowerCaseQuery = query.toLowerCase();
  
  // Check if query is about a specific area
  let targetArea = null;
  for (const neighborhood of neighborhoods) {
    if (lowerCaseQuery.includes(neighborhood.name.toLowerCase())) {
      targetArea = neighborhood;
      break;
    }
  }
  
  if (targetArea) {
    return `In ${targetArea.name}, property prices generally range from ${targetArea.priceRange}. The average price per square foot is around ₹${parseInt(targetArea.priceRange.split(' - ')[0].replace(/[^\d]/g, ''))}. For a 2 BHK apartment of approximately 1200 sq.ft, you can expect to pay between ₹75L to ₹1.1Cr depending on the exact location, builder reputation, and amenities. Would you like me to recommend some specific properties in this area?`;
  }
  
  // Generic price response
  return `Property prices in OMR, Chennai vary by location. In premium areas like Thoraipakkam and Sholinganallur, prices range from ₹7,500 to ₹9,000 per sq.ft. Mid-range areas like Navalur and Siruseri range from ₹6,200 to ₹8,500 per sq.ft. A typical 2 BHK apartment (1100-1300 sq.ft) costs between ₹65L to ₹1.2Cr depending on location and amenities. Which specific area are you interested in?`;
}

/**
 * Generate a response about amenities
 */
function generateAmenitiesResponse(query: string): string {
  return `Most premium residential projects in OMR come with amenities like swimming pools, gyms, children's play areas, landscaped gardens, and 24/7 security. Higher-end properties may also offer clubhouses, indoor game rooms, multipurpose halls, jogging tracks, and sometimes even mini theaters or co-working spaces. Some newer developments are incorporating smart home features and EV charging points as well. Are you looking for any specific amenities in your property?`;
}

/**
 * Generate a response about investment potential
 */
function generateInvestmentResponse(query: string): string {
  return `OMR (Old Mahabalipuram Road) is considered one of the best areas for real estate investment in Chennai, with an average annual appreciation of 8-10%. The IT corridor continues to develop, and the upcoming metro connection is expected to boost property values further. Areas near the proposed metro stations like Thoraipakkam and Sholinganallur are likely to see the highest appreciation in the next 3-5 years. For rental yield, properties near IT parks can generate 3-4% annual returns. Would you like specific investment recommendations based on your budget?`;
}

/**
 * Get a descriptive label for a value score
 */
function getValueDescription(score: number): string {
  if (score >= 90) return 'Excellent value';
  if (score >= 80) return 'Very good value';
  if (score >= 70) return 'Good value';
  return 'Fair value';
} 