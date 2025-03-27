import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Settings, LogOut, Heart, Bell, Key, Home, MapPin, Calendar, Edit2, Trash2, ChevronRight, Loader2, Check } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Define interfaces for our data types
interface SavedProperty {
  id: string;
  title: string;
  location: string;
  price: number;
  image: string;
  bedrooms: number;
  bathrooms: number;
  dateAdded: string;
}

interface UserPreference {
  key: string;
  value: string | number | boolean;
  label: string;
  type: 'location' | 'budget' | 'property-type' | 'toggle';
}

const Profile = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [activeTab, setActiveTab] = useState('saved');
  const [savedProperties, setSavedProperties] = useState<SavedProperty[]>([]);
  const [preferences, setPreferences] = useState<UserPreference[]>([]);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }

    // Load user data
    const storedEmail = localStorage.getItem('userEmail') || '';
    const storedName = localStorage.getItem('userName') || '';
    setUserEmail(storedEmail);
    setUserName(storedName);
    setNewName(storedName);

    // Load mock saved properties
    const mockSavedProperties: SavedProperty[] = [
      {
        id: '1',
        title: 'Luxury Villa in Thoraipakkam',
        location: 'Thoraipakkam, OMR',
        price: 8500000,
        image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
        bedrooms: 3,
        bathrooms: 2,
        dateAdded: '2023-10-15'
      },
      {
        id: '2',
        title: 'Modern Apartment in Siruseri',
        location: 'Siruseri, OMR',
        price: 6200000,
        image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
        bedrooms: 2,
        bathrooms: 2,
        dateAdded: '2023-11-02'
      },
      {
        id: '3',
        title: 'Garden View Flat in Navalur',
        location: 'Navalur, OMR',
        price: 7200000,
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
        bedrooms: 3,
        bathrooms: 2,
        dateAdded: '2023-09-28'
      }
    ];
    setSavedProperties(mockSavedProperties);

    // Load mock user preferences
    const mockPreferences: UserPreference[] = [
      { key: 'preferred-location', value: 'OMR', label: 'Preferred Location', type: 'location' },
      { key: 'budget-min', value: 6000000, label: 'Budget (Min)', type: 'budget' },
      { key: 'budget-max', value: 9000000, label: 'Budget (Max)', type: 'budget' },
      { key: 'property-type', value: 'Apartment', label: 'Property Type', type: 'property-type' },
      { key: 'notifications', value: true, label: 'Email Notifications', type: 'toggle' },
      { key: 'price-alerts', value: true, label: 'Price Drop Alerts', type: 'toggle' }
    ];
    setPreferences(mockPreferences);

    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    navigate('/signin');
  };

  const handleRemoveProperty = (propertyId: string) => {
    setSavedProperties(savedProperties.filter(property => property.id !== propertyId));
  };

  const handleUpdateName = () => {
    if (newName.trim() !== '') {
      setUserName(newName);
      localStorage.setItem('userName', newName);
    }
    setIsEditingName(false);
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

  const updatePreference = (key: string, value: string | number | boolean) => {
    setPreferences(preferences.map(pref => 
      pref.key === key ? { ...pref, value } : pref
    ));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="h-10 w-10 text-electric" />
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow bg-neutral-50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Profile Sidebar */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="col-span-1"
            >
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="h-24 w-24 rounded-full bg-electric flex items-center justify-center mb-4">
                    <User className="h-12 w-12 text-white" />
                  </div>
                  
                  {isEditingName ? (
                    <div className="mt-2 flex items-center">
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="text-lg font-medium text-neutral-900 border-b border-electric focus:outline-none focus:border-electric"
                        autoFocus
                      />
                      <button 
                        onClick={handleUpdateName}
                        className="ml-2 text-electric"
                      >
                        <Check className="h-5 w-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <h2 className="text-xl font-medium text-neutral-900">{userName || 'User'}</h2>
                      <button 
                        onClick={() => setIsEditingName(true)}
                        className="ml-2 text-neutral-400 hover:text-electric"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  
                  <p className="text-neutral-500">{userEmail}</p>
                </div>
                
                <nav className="space-y-1">
                  <button
                    onClick={() => setActiveTab('saved')}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${
                      activeTab === 'saved' 
                        ? 'bg-electric-light text-electric' 
                        : 'text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <Heart className={`mr-3 h-5 w-5 ${activeTab === 'saved' ? 'text-electric' : 'text-neutral-400'}`} />
                    Saved Properties
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('preferences')}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${
                      activeTab === 'preferences' 
                        ? 'bg-electric-light text-electric' 
                        : 'text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <Settings className={`mr-3 h-5 w-5 ${activeTab === 'preferences' ? 'text-electric' : 'text-neutral-400'}`} />
                    Preferences
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('security')}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${
                      activeTab === 'security' 
                        ? 'bg-electric-light text-electric' 
                        : 'text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <Key className={`mr-3 h-5 w-5 ${activeTab === 'security' ? 'text-electric' : 'text-neutral-400'}`} />
                    Account Security
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md w-full"
                  >
                    <LogOut className="mr-3 h-5 w-5 text-red-500" />
                    Log Out
                  </button>
                </nav>
              </div>
            </motion.div>
            
            {/* Main Content Area */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="col-span-1 md:col-span-3"
            >
              {/* Saved Properties Tab */}
              {activeTab === 'saved' && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-neutral-900">Saved Properties</h2>
                    <span className="bg-electric text-white text-xs px-2 py-1 rounded-full">
                      {savedProperties.length} Properties
                    </span>
                  </div>
                  
                  {savedProperties.length === 0 ? (
                    <div className="text-center py-12">
                      <Home className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-neutral-900 mb-1">No saved properties yet</h3>
                      <p className="text-neutral-500">
                        Properties you save will appear here for easier access
                      </p>
                      <button 
                        onClick={() => navigate('/')}
                        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-electric hover:bg-electric-dark"
                      >
                        Browse Properties
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {savedProperties.map((property) => (
                        <motion.div 
                          key={property.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex flex-col sm:flex-row border border-neutral-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                        >
                          <div className="w-full sm:w-48 h-48 sm:h-auto">
                            <img 
                              src={property.image} 
                              alt={property.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-grow p-4 flex flex-col">
                            <div className="flex justify-between">
                              <h3 className="text-lg font-medium text-neutral-900 mb-1">{property.title}</h3>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleRemoveProperty(property.id)}
                                  className="text-neutral-400 hover:text-red-500"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              </div>
                            </div>
                            <div className="flex items-center text-neutral-500 mb-2">
                              <MapPin className="h-4 w-4 mr-1" />
                              {property.location}
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-neutral-700 mb-2">
                              <span>{property.bedrooms} Beds</span>
                              <span>•</span>
                              <span>{property.bathrooms} Baths</span>
                            </div>
                            <div className="flex items-center text-neutral-500 text-sm mb-2">
                              <Calendar className="h-4 w-4 mr-1" />
                              Saved on {property.dateAdded}
                            </div>
                            <div className="mt-auto flex justify-between items-center">
                              <span className="text-lg font-semibold text-neutral-900">
                                {formatPrice(property.price)}
                              </span>
                              <button 
                                onClick={() => alert(`Viewing details for ${property.title}`)}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-electric bg-electric-light hover:bg-electric hover:text-white"
                              >
                                View Details
                                <ChevronRight className="ml-1 h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-2xl font-bold text-neutral-900 mb-6">Your Preferences</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-neutral-900 mb-3">Search Preferences</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {preferences
                          .filter(pref => pref.type !== 'toggle')
                          .map(preference => (
                            <div key={preference.key} className="border border-neutral-200 rounded-lg p-4">
                              <label className="block text-sm font-medium text-neutral-500 mb-1">
                                {preference.label}
                              </label>
                              {preference.type === 'location' && (
                                <div className="flex items-center">
                                  <MapPin className="h-5 w-5 text-neutral-400 mr-2" />
                                  <select
                                    value={preference.value as string}
                                    onChange={(e) => updatePreference(preference.key, e.target.value)}
                                    className="block w-full border-none focus:ring-0 py-1 text-neutral-900"
                                  >
                                    <option value="OMR">OMR</option>
                                    <option value="Velachery">Velachery</option>
                                    <option value="Thoraipakkam">Thoraipakkam</option>
                                    <option value="Siruseri">Siruseri</option>
                                    <option value="Navalur">Navalur</option>
                                  </select>
                                </div>
                              )}
                              
                              {preference.type === 'budget' && (
                                <div className="flex items-center">
                                  <input
                                    type="number"
                                    value={preference.value as number}
                                    onChange={(e) => updatePreference(
                                      preference.key, 
                                      e.target.value ? parseInt(e.target.value) : 0
                                    )}
                                    className="block w-full border-none focus:ring-0 py-1 text-neutral-900"
                                    placeholder="Enter amount"
                                  />
                                </div>
                              )}
                              
                              {preference.type === 'property-type' && (
                                <div className="flex items-center">
                                  <Home className="h-5 w-5 text-neutral-400 mr-2" />
                                  <select
                                    value={preference.value as string}
                                    onChange={(e) => updatePreference(preference.key, e.target.value)}
                                    className="block w-full border-none focus:ring-0 py-1 text-neutral-900"
                                  >
                                    <option value="Apartment">Apartment</option>
                                    <option value="Villa">Villa</option>
                                    <option value="Independent House">Independent House</option>
                                    <option value="Plot">Plot</option>
                                  </select>
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-neutral-900 mb-3">Notification Settings</h3>
                      <div className="space-y-3">
                        {preferences
                          .filter(pref => pref.type === 'toggle')
                          .map(preference => (
                            <div key={preference.key} className="flex items-center justify-between py-2 border-b border-neutral-100">
                              <div className="flex items-center">
                                <Bell className="h-5 w-5 text-neutral-400 mr-3" />
                                <span className="text-neutral-700">{preference.label}</span>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  checked={preference.value as boolean}
                                  onChange={(e) => updatePreference(preference.key, e.target.checked)}
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-electric-light rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-electric"></div>
                              </label>
                            </div>
                          ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <button 
                        onClick={() => alert('Preferences saved')}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-electric hover:bg-electric-dark"
                      >
                        Save Preferences
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Account Security Tab */}
              {activeTab === 'security' && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-2xl font-bold text-neutral-900 mb-6">Account Security</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-neutral-900 mb-4">Change Password</h3>
                      <form className="space-y-4">
                        <div>
                          <label htmlFor="current-password" className="block text-sm font-medium text-neutral-700 mb-1">
                            Current Password
                          </label>
                          <input
                            type="password"
                            id="current-password"
                            className="appearance-none block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-electric focus:border-electric sm:text-sm"
                            placeholder="Enter current password"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="new-password" className="block text-sm font-medium text-neutral-700 mb-1">
                            New Password
                          </label>
                          <input
                            type="password"
                            id="new-password"
                            className="appearance-none block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-electric focus:border-electric sm:text-sm"
                            placeholder="Enter new password"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="confirm-password" className="block text-sm font-medium text-neutral-700 mb-1">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            id="confirm-password"
                            className="appearance-none block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-electric focus:border-electric sm:text-sm"
                            placeholder="Confirm new password"
                          />
                        </div>
                        
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => alert('Password updated')}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-electric hover:bg-electric-dark"
                          >
                            Update Password
                          </button>
                        </div>
                      </form>
                    </div>
                    
                    <div className="border-t border-neutral-200 pt-6">
                      <h3 className="text-lg font-medium text-neutral-900 mb-4">Account Management</h3>
                      
                      <button
                        onClick={() => alert('This would show a confirmation dialog in a real app')}
                        className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                      >
                        Delete Account
                      </button>
                      <p className="mt-2 text-sm text-neutral-500">
                        This will permanently delete your account and all associated data.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile; 