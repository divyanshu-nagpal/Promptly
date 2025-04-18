import React, { useState, useEffect } from 'react';
import { useNavigate, Link, NavLink, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Settings, 
  LogOut, 
  HelpCircle, 
  FileText, 
  ChevronDown,
  User,
  BarChart3,
  Calendar,
  Mail,
  ChevronRight,
  PlusCircle
} from 'lucide-react';
import { useUserData } from '../Hooks/useUserData';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user: userData, isAuthenticated, logout } = useUserData();
  const isOnCommunityPage = location.pathname === '/community' || location.pathname.startsWith('/community/');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserMenuOpen && !event.target.closest('.user-menu')) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserMenuOpen]);

  const handleProfileClick = () => {
    setIsUserMenuOpen(false);
    navigate('/profile');
  };
  const handleLoginClick = () => navigate('/login');
  const handleSettingsClick = () => {
    setIsUserMenuOpen(false);
    navigate('/settings');
  };
  const handleReports = () => {
    setIsUserMenuOpen(false);
    navigate('/reports');
  };
  const handleRegisterClick = () => navigate('/register');
  
  const handleAddEvent = () => {
    setIsUserMenuOpen(false);
    navigate('/add-event');
  };
  
  const handleLogout = () => {
    setIsUserMenuOpen(false);
    logout();
  };

  const handleAddPost = () => {
    navigate('/add-prompt');
  };
  
  const handleNavClick = (e, item) => {
    if (item === 'Community' && !isAuthenticated) {
      e.preventDefault(); // Prevent default navigation
      navigate('/login'); // Redirect to login
    }
  };

  const navItems = ['Home', 'Community', 'About'];

  const UserMenu = () => (
    <div className="user-menu absolute right-0 mt-2 w-64 max-w-sm rounded-lg bg-gray-900 border border-gray-800 shadow-lg shadow-blue-900/20 ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden animate-in">
      <div className="p-5 border-b border-gray-800 bg-gradient-to-br from-blue-900/40 via-blue-800/30 to-purple-900/30">
        <div onClick={handleProfileClick} className="flex items-center space-x-3 hover:cursor-pointer">
          <div className="relative h-10 w-10 flex-shrink-0 rounded-full overflow-hidden ring-2 ring-blue-500/40">
            <img 
              src={userData?.profilePicture || "https://res.cloudinary.com/djncnauta/image/upload/v1735364671/profile_photo_gaqfit.jpg"} 
              alt="profilepic" 
              className="h-full w-full object-cover" 
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white truncate">{userData?.username}</p>
            <div className="flex items-center text-xs text-blue-200">
              Profile
              <ChevronRight className="h-3 w-3 ml-1 text-blue-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="py-2">
        {userData?.role !== 'user' && (
          <button className="w-full text-left px-4 py-3 text-sm text-gray-200 hover:bg-gray-800/80 hover:text-blue-300 flex items-center space-x-3" onClick={handleReports}>
            <BarChart3 className="h-4 w-4 text-blue-400" />
            <span>Reports Manager</span>
          </button>
        )}
        {userData?.role !== 'user' && (
          <button
            className="w-full text-left px-4 py-3 text-sm text-gray-200 hover:bg-gray-800/80 hover:text-blue-300 flex items-center space-x-3"
            onClick={handleAddEvent}
          >
            <Calendar className="h-4 w-4 text-blue-400" />
            <span>Add Event</span>
          </button>
        )}
        <button className="w-full text-left px-4 py-3 text-sm text-gray-200 hover:bg-gray-800/80 hover:text-blue-300 flex items-center space-x-3" onClick={handleSettingsClick}>
          <Settings className="h-4 w-4 text-blue-400" />
          <span>Settings</span>
        </button>
        <a
          href="mailto:promptly.care24x7@gmail.com?subject=Support%20Request"
          className="w-full text-left px-4 py-3 text-sm text-gray-200 hover:bg-gray-800/80 hover:text-blue-300 flex items-center space-x-3"
          onClick={() => setIsUserMenuOpen(false)}
        >
          <Mail className="h-4 w-4 text-blue-400" />
          <span>Help & Support</span>
        </a>
      </div>

      <div className="border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-gray-800/80 hover:text-red-300 flex items-center space-x-3"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="h-16 w-full" />

      <header className="w-full fixed top-0 z-50">
        <div className="backdrop-blur-lg bg-gray-950/90 border-b border-gray-800 shadow-lg shadow-blue-900/10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex-shrink-0">
                <Link to="/home" className="flex items-center">
                  <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                    Promptly
                  </span>
                </Link>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-8">
                {navItems.map((item) => (
                  <NavLink
                    key={item}
                    to={`/${item.toLowerCase()}`}
                    onClick={(e) => handleNavClick(e, item)}
                    className={({ isActive }) =>
                      isActive
                        ? "text-blue-400 transition-all duration-200 text-sm font-medium relative group"
                        : "text-gray-300 hover:text-blue-400 transition-all duration-200 text-sm font-medium relative group"
                    }
                  >
                    {item}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-200 group-hover:w-full" />
                  </NavLink>
                ))}
              </nav>

              {/* Desktop Auth Buttons */}
              <div className="hidden md:flex items-center space-x-4">
                {isAuthenticated ? (
                  <div className="flex items-center space-x-4 relative">
                    <div className="relative">
                      <button
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-900/40 to-blue-800/40 hover:from-blue-800/50 hover:to-blue-700/50 border border-blue-700/40 transition-all duration-300 group"
                      >
                        {/* Modern avatar display with shimmer effect */}
                        <div className="relative h-8 w-8 flex-shrink-0 rounded-full overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-400/20 animate-pulse"></div>
                          <img 
                            src={userData?.profilePicture || "https://res.cloudinary.com/djncnauta/image/upload/v1735364671/profile_photo_gaqfit.jpg"} 
                            className="h-full w-full object-cover relative z-10" 
                            alt="User profile"
                          />
                          <div className="absolute inset-0 ring-2 ring-blue-500/50 rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors duration-300 truncate max-w-32">
                          {userData?.username?.split(' ')[0] || 'Profile'}
                        </span>
                        <ChevronDown className="w-4 h-4 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
                      </button>
                      {isUserMenuOpen && <UserMenu />}
                    </div>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={handleLoginClick}
                      className="text-sm font-medium text-gray-300 hover:text-blue-400 transition-colors duration-200"
                    >
                      Log In
                    </button>
                    <button
                      onClick={handleRegisterClick}
                      className="text-sm px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full hover:from-blue-500 hover:to-blue-600 transition-all duration-200 shadow-md shadow-blue-900/30 hover:shadow-lg hover:shadow-blue-800/40"
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </div>

              {/* Mobile menu buttons */}
              <div className="md:hidden flex items-center space-x-2">
                {isAuthenticated && isOnCommunityPage && (
                  <button
                    onClick={handleAddPost}
                    className="p-2 text-blue-400 hover:text-blue-300 transition-colors duration-200"
                    aria-label="Add Post"
                  >
                    <PlusCircle size={24} />
                  </button>
                )}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 rounded-md text-gray-300 hover:text-blue-400 hover:bg-gray-800/50"
                >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-gray-900 border-t border-gray-800/50">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item}
                    to={`/${item.toLowerCase()}`}
                    className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-blue-400 hover:bg-gray-800/50 rounded-md"
                    onClick={(e) => {
                      handleNavClick(e, item);
                      setIsMobileMenuOpen(false); // Additional action for mobile only - close menu
                    }}
                  >
                    {item}
                  </Link>
                ))}
                
                {!isAuthenticated && (
                  <div className="mt-4 pt-3 border-t border-gray-800 flex flex-col space-y-3 px-3">
                    <button
                      onClick={() => {
                        handleLoginClick();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full py-2 text-center text-gray-300 border border-gray-700 rounded-lg hover:border-blue-500 transition-all duration-200"
                    >
                      Log In
                    </button>
                    <button
                      onClick={() => {
                        handleRegisterClick();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full py-2 text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:opacity-90 transition-all duration-200"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
                
                {isAuthenticated && (
                  <div 
                    onClick={() => {
                      handleProfileClick();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 px-3 py-3 mt-4 border-t border-gray-800"
                  >
                    {/* Mobile profile display */}
                    <div className="relative h-10 w-10 flex-shrink-0 rounded-full overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-400/20 animate-pulse"></div>
                      <img 
                        src={userData?.profilePicture || "https://res.cloudinary.com/djncnauta/image/upload/v1735364671/profile_photo_gaqfit.jpg"} 
                        alt="profilepic" 
                        className="h-full w-full object-cover relative z-10" 
                      />
                      <div className="absolute inset-0 ring-2 ring-blue-500/50 rounded-full"></div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-white truncate">{userData?.username}</p>
                      <div className="flex items-center text-xs text-blue-200">
                        Profile
                        <ChevronRight className="h-3 w-3 ml-1 text-blue-400" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Animation styles */}
      <style jsx>{`
        .animate-in {
          animation: fadeIn 0.2s ease-out forwards;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default Header;