
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, Facebook, Twitter, Instagram, Linkedin, ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          <div>
            <Link to="/" className="flex items-center space-x-3 mb-6">
              <div className="relative w-10 h-10 bg-electric rounded-full flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-radial from-electric to-electric-dark opacity-80"></div>
                <MapPin className="w-5 h-5 text-white relative z-10" />
              </div>
              <span className="font-display font-semibold text-xl">OmrHaven</span>
            </Link>
            
            <p className="text-neutral-400 mb-6">
              Revolutionizing property search with AI-powered insights and analytics for 2BHK flats in OMR, Chennai.
            </p>
            
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-electric transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-electric transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-electric transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-electric transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-6">Explore</h4>
            <ul className="space-y-4">
              {['All Properties', 'Featured Projects', 'Near Tech Parks', 'Luxury 2BHK', 'Budget Friendly', 'New Launches'].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-neutral-400 hover:text-white flex items-center">
                    <ArrowRight className="w-4 h-4 mr-2 text-electric" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-4">
              {['About Us', 'Our Services', 'How AI Works', 'Value Score', 'Privacy Policy', 'Terms of Service'].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-neutral-400 hover:text-white flex items-center">
                    <ArrowRight className="w-4 h-4 mr-2 text-electric" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-6">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-electric mr-3 mt-1" />
                <span className="text-neutral-400">
                  123 Tech Park, OMR Road, <br />
                  Chennai - 600097, Tamil Nadu
                </span>
              </div>
              
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-electric mr-3" />
                <span className="text-neutral-400">+91 9876543210</span>
              </div>
              
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-electric mr-3" />
                <span className="text-neutral-400">info@omrhaven.ai</span>
              </div>
            </div>
            
            <div className="mt-6">
              <h5 className="font-medium mb-3">Subscribe to Newsletter</h5>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 py-2 px-4 bg-neutral-800 border border-neutral-700 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-electric"
                />
                <button className="bg-electric hover:bg-electric-dark text-white py-2 px-4 rounded-r-lg">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-neutral-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-neutral-500 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} OmrHaven.ai. All rights reserved.
            </p>
            
            <div className="flex space-x-6">
              <a href="#" className="text-neutral-500 hover:text-white text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-neutral-500 hover:text-white text-sm">
                Terms of Service
              </a>
              <a href="#" className="text-neutral-500 hover:text-white text-sm">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
