import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  
  const handleNavigation = (path) => {
    navigate(path);
  };
  
  return (
    <footer className="bg-gray-950 text-gray-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-3">
              <Link to="/">
                <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                  Promptly
                </span>
              </Link>
            </h3>
            <p className="text-gray-400">
              Your go-to platform for discovering and sharing the perfect AI prompts.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col md:items-end">
            <h4 className="font-semibold text-white mb-3">Quick Links</h4>
            <div className="flex flex-wrap gap-4 md:justify-end">
              {[
                { name: 'Home', path: '/' },
                { name: 'About', path: '/about' },
                { name: 'Community', path: '/community' }
              ].map((item) => (
                <button 
                  key={item.name} 
                  onClick={() => handleNavigation(item.path)}
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300 bg-transparent border-none cursor-pointer"
                >
                  {item.name}
                </button>
              ))}
              <a
                href="mailto:promptly.care24x7@gmail.com?subject=Support%20Request"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
              >
                Support
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 mt-6 border-t border-gray-800 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Promptly. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;