import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Menu, X, Search, MapPin, User, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(authStatus);
    
    if (authStatus) {
      const storedName = localStorage.getItem('userName');
      setUserName(storedName || 'User');
    }

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    setIsAuthenticated(false);
    setUserName('');
    setIsUserMenuOpen(false);
    window.location.href = '/';
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center text-neutral-900">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="mr-2"
            >
              <svg className="w-8 h-8" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 5L30 15H25V25H15V15H10L20 5Z" fill="#04BFAD" />
                <path d="M30 35L20 25H25V15H35V25H40L30 35Z" fill="#04BFAD" />
                <path d="M10 5L0 15H5V25H15V15H20L10 5Z" fill="#0496C7" />
              </svg>
            </motion.div>
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <span className="font-bold text-xl">Dreamy</span>
              <span className="font-light text-xl">Haven</span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {['Properties', 'Compare', 'AI Insights', 'Neighborhoods', 'Rental Agreement'].map((item) => (
              <Link
                key={item}
                to={`/${item === 'Properties' ? '' : item.toLowerCase().replace(' ', '-')}`}
                className="font-medium text-sm text-neutral-700 hover:text-electric transition-colors"
              >
                {item}
              </Link>
            ))}
          </nav>

          {/* Sign In / Profile */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              {isAuthenticated ? (
                <>
                  <button 
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} 
                    className="flex items-center space-x-2 py-1 px-3 rounded-full bg-electric-light text-electric transition-colors hover:bg-electric hover:text-white"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">{userName}</span>
                  </button>
                  
                  {isUserMenuOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
                    >
                      <Link 
                        to="/profile" 
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Your Profile
                      </Link>
                      <Link 
                        to="/profile" 
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Saved Properties
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-neutral-100"
                      >
                        <div className="flex items-center">
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign out
                        </div>
                      </button>
                    </motion.div>
                  )}
                </>
              ) : (
                <div className="flex space-x-2">
                  <Link
                    to="/signin"
                    className="py-1 px-3 rounded-md text-sm font-medium text-electric border border-electric hover:bg-electric-light transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="py-1 px-3 rounded-md text-sm font-medium text-white bg-electric hover:bg-electric-dark transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-neutral-500 hover:text-neutral-900 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg p-6 glass-dark animate-slide-down">
          <nav className="flex flex-col space-y-4">
            {['Properties', 'Compare', 'AI Insights', 'Neighborhoods', 'Rental Agreement'].map((item) => (
              <Link
                key={item}
                to={`/${item === 'Properties' ? '' : item.toLowerCase().replace(' ', '-')}`}
                className="font-medium text-neutral-900 py-2 border-b border-neutral-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item}
              </Link>
            ))}
            
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="font-medium text-neutral-900 py-2 border-b border-neutral-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Your Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 font-medium text-red-600 py-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign out</span>
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2 mt-2">
                <Link
                  to="/signin"
                  className="flex items-center justify-center py-2 px-4 border border-electric rounded-md text-electric font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center justify-center py-2 px-4 rounded-md bg-electric text-white font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
