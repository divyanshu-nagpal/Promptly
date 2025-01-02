// Header.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, User, Settings, LogOut, HelpCircle, Bell } from 'lucide-react';
import axios from 'axios';

const Header = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [user, setUser] = useState([]);

  // Handle scrollbar width calculation
  useEffect(() => {
    const setScrollbarWidth = () => {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
    };
    
    setScrollbarWidth();
    window.addEventListener('resize', setScrollbarWidth);
    
    // Cleanup
    return () => window.removeEventListener('resize', setScrollbarWidth);
  }, []);

  // Authentication check
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
    setIsAuthenticated(true);
      fetchUserData(token);
    }
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserMenuOpen && !event.target.closest('.user-menu')) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserMenuOpen]);

  const fetchUserData = async (token) => {
    try {
      const response = await axios.get('/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        navigate('/login');
      }
    }
  };
  const handleprofileClick = () => navigate('/profile');
  const handleLoginClick = () => navigate('/login');
  const handleRegisterClick = () => navigate('/register');
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const navItems = ['Home', 'Community', 'About'];

  const UserMenu = () => (
    <div className="user-menu absolute right-0 mt-2 w-64 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
      <div className="p-4 border-b border-gray-100">
        <div onClick={handleprofileClick} className="flex items-center space-x-2 hover:cursor-pointer">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center overflow-hidden">
          <img src={user?.user?.profilePicture || "https://res.cloudinary.com/djncnauta/image/upload/v1735364671/profile_photo_gaqfit.jpg"} className="h-full w-full object-cover"/>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700">{user?.user?.username}</p>
            <p className="text-xs text-gray-500">{user?.user?.email}</p>
          </div>
        </div>
      </div>
      
      <div className="py-2">
        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </button>
        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
          <HelpCircle className="h-4 w-4" />
          <span>Help & Support</span>
        </button>
      </div>
      
      <div className="border-t border-gray-100">
        <button 
          onClick={handleLogout}
          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Header height placeholder */}
      <div className="h-16 w-full" />
      
      <header className="w-full fixed top-0 z-50">
        <div className="backdrop-blur-md bg-white/70 border-b border-gray-200/20 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingRight: 'calc(1rem + var(--scrollbar-width, 0px))' }}>
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex-shrink-0">
                <a href="/home" className="flex items-center">
                  {/* <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Promptable
                  </span> */}
                  <span
                  className="text-2xl font-bold bg-clip-text text-transparent"
                  style={{ backgroundImage: 'linear-gradient(90deg, #2563EB, #2563EB)' }}
                >
                Promptly
                </span>
                </a>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-8">
                {navItems.map((item) => (
                  <a
                    key={item}
                    href={`/${item.toLowerCase()}`}
                    className="text-gray-600 hover:text-blue-600 transition-all duration-200 text-sm font-medium relative group"
                  >
                    {item}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full" />
                  </a>
                ))}
              </nav>

              {/* Desktop Auth Buttons */}
              <div className="hidden md:flex items-center space-x-4">
                {isAuthenticated ? (
                  <div className="flex items-center space-x-4 relative">
                    {/* Notifications */}
                    <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-full relative">
                      <Bell size={20} />
                      <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                    </button>
                    
                    {/* User Menu Button */}
                    <div className="relative">
                      <button
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                      >
                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center overflow-hidden">
                          <img src={user?.user?.profilePicture || "https://res.cloudinary.com/djncnauta/image/upload/v1735364671/profile_photo_gaqfit.jpg"} className="h-full w-full object-cover"/>
                        </div>
                        {/* <span className="text-sm text-gray-700 font-medium">{user.name}</span> */}
                        <span className="ml-2">
                          <svg className="w-4 h-4 text-gray-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d={isUserMenuOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}></path>
                          </svg>
                        </span>
                      </button>
                      
                      {/* User Dropdown Menu */}
                      {isUserMenuOpen && <UserMenu />}
                    </div>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={handleLoginClick}
                      className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors duration-200"
                    >
                      Log In
                    </button>
                    <button
                      onClick={handleRegisterClick}
                      className="text-sm px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:opacity-90 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100"
                >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navItems.map((item) => (
                  <a
                    key={item}
                    href={`/${item.toLowerCase()}`}
                    className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                  >
                    {item}
                  </a>
                ))}
                {isAuthenticated ? (
                  <div className="border-t border-gray-200 mt-4 pt-4">
                    <div className="px-3 py-2 flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center overflow-hidden">
                      <img src={user?.user?.profilePicture || "https://res.cloudinary.com/djncnauta/image/upload/v1735364671/profile_photo_gaqfit.jpg"} className="h-full w-full object-cover"/>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">{user.user.username}</p>
                        <p className="text-xs text-gray-500">{user.user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="mt-2 w-full px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md flex items-center space-x-2"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Sign out</span>
                    </button>
                  </div>
                ) : (
                  <div className="mt-4 space-y-2">
                    <button
                      onClick={handleLoginClick}
                      className="w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                    >
                      Log In
                    </button>
                    <button
                      onClick={handleRegisterClick}
                      className="w-full px-3 py-2 text-base font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-md"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;