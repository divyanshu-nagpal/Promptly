import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Shield, ShieldOff, LayoutDashboard, Mail, ChevronRight, FileText, Settings } from 'lucide-react';

const SettingsPage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [isLoading2FA, setIsLoading2FA] = useState(false);
  const [error, setError] = useState(null);
  const [animatedSections, setAnimatedSections] = useState({});

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/api/user/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setUserData(response.data);
        setIs2FAEnabled(response.data.user.is2FAEnabled);
        setLoading(false);
      } catch (error) {
        setError('Error fetching user data');
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Intersection Observer for animations
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setAnimatedSections(prev => ({
            ...prev,
            [entry.target.id]: true
          }));
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Only set up observer if not loading
    if (!loading) {
      setTimeout(() => {
        const sections = document.querySelectorAll('.animate-on-scroll');
        sections.forEach(section => {
          if (section) {
            observer.observe(section);
          }
        });
      }, 100);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [loading]);

  // Handle enabling 2FA
  const handleEnable2FA = async () => {
    setIsLoading2FA(true);
    setError(null);
    try {
      await axios.post('/api/auth/enable-2fa', { userId: userData.user._id }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setIs2FAEnabled(true);
    } catch (error) {
      setError('Error enabling 2FA');
    } finally {
      setIsLoading2FA(false);
    }
  };

  // Handle disabling 2FA
  const handleDisable2FA = async () => {
    setIsLoading2FA(true);
    setError(null);
    try {
      await axios.post('/api/auth/disable-2fa', { userId: userData.user._id }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setIs2FAEnabled(false);
    } catch (error) {
      setError('Error disabling 2FA');
    } finally {
      setIsLoading2FA(false);
    }
  };

  const handleAdminPanel = () => navigate('/admin-panel');

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} retryFn={() => window.location.reload()} />;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200">
      {/* Hero Section with animated gradient background */}
      <section id="settings-hero" className="animate-on-scroll relative pt-24 pb-12 px-4 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gray-950">
          <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-[radial-gradient(circle_at_30%_20%,#2563eb,transparent_40%)]"></div>
          <div className="absolute bottom-0 right-0 w-full h-full opacity-20 bg-[radial-gradient(circle_at_70%_80%,#8b5cf6,transparent_40%)]"></div>
        </div>
        
        <div className={`max-w-5xl mx-auto relative ${animatedSections['settings-hero'] ? 'animate-fade-in' : 'opacity-0'}`}>
          <div className="text-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-900/30 text-blue-400 text-sm mb-6 border border-blue-800/50">
              <Settings className="h-3.5 w-3.5 mr-2" />
              <span>Account Settings</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
              Manage Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">Account</span>
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto">
              Update your profile settings and security preferences
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section id="settings-content" className="animate-on-scroll relative px-4 pb-20">
        <div className={`max-w-5xl mx-auto relative z-10 ${animatedSections['settings-content'] ? 'animate-fade-in' : 'opacity-0'}`}>          
          {/* Header Section with Gradient Border */}
          <div className="relative group mb-10">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-gray-900 rounded-xl p-8 border border-gray-800">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <div className="flex items-center">
                    <h1 className="text-3xl font-bold text-white">
                      {userData.user.username}
                    </h1>
                    
                    {userData.user.role !== 'user' && (
                      <span className={`ml-3 px-3 py-1 text-xs font-medium rounded-full border ${
                        userData.user.role === 'moderator' 
                          ? 'bg-blue-900/30 border-blue-800/50 text-blue-400'
                          : 'bg-purple-900/30 border-purple-800/50 text-purple-400'
                      }`}>
                        {userData.user.role.toUpperCase()}
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-4 flex flex-col sm:flex-row gap-4">
                    <div className="flex items-center text-gray-400">
                      <Mail size={16} className="mr-2 text-blue-400" />
                      <span>{userData.user.email}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-400">
                      <FileText size={16} className="mr-2 text-purple-400" />
                      <span>{userData.user.totalPrompts} Posts</span>
                    </div>
                  </div>
                </div>
                
                {/* Admin Panel Button */}
                {userData.user.role === 'admin' && (
                <div className="relative group">
                  <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 blur opacity-60 group-hover:opacity-100 transition duration-300"></div>
                  <button
                    onClick={handleAdminPanel}
                    className="relative z-10 flex items-center space-x-2 px-5 py-3 text-sm font-medium rounded-lg bg-gray-900 border border-gray-700 text-white hover:bg-gray-800 hover:shadow-md transition-all duration-200"
                  >
                    <LayoutDashboard className="h-4 w-4 text-purple-400" />
                    <span>Admin Panel</span>
                  </button>
                </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Two-Factor Authentication Section */}
          <div id="security-section" className="animate-on-scroll mt-12">
            <div className={`${animatedSections['security-section'] ? 'animate-fade-in' : 'opacity-0'}`}>
              <div className="flex items-center mb-6">
                <div className="bg-blue-900/30 rounded-full p-2 mr-3 border border-blue-800/50">
                  <Shield size={18} className="text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Security Settings</h2>
              </div>
              
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-gray-900 rounded-xl p-8 border border-gray-800">
                  <h3 className="text-xl font-bold text-white mb-4">Two-Factor Authentication</h3>
                  <p className="text-gray-400 mb-6">
                    Add an additional layer of security to your account by enabling two-factor authentication.
                    This helps protect your account even if your password is compromised.
                  </p>
                  
                  {is2FAEnabled ? (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                      <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                        <div className="w-12 h-12 rounded-full bg-blue-900/50 flex items-center justify-center border border-blue-800/50">
                          <Shield size={24} className="text-blue-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">2FA is enabled</p>
                          <p className="text-gray-400 text-sm">Your account has additional protection</p>
                        </div>
                      </div>
                      <button
                        onClick={handleDisable2FA}
                        disabled={isLoading2FA}
                        className="py-3 px-6 rounded-md bg-gray-800 hover:bg-red-900/50 border border-gray-700 hover:border-red-800/50 text-white font-medium transition-all duration-200 disabled:opacity-50"
                      >
                        {isLoading2FA ? 'Disabling...' : 'Disable 2FA'}
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                      <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                        <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700">
                          <ShieldOff size={24} className="text-gray-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">2FA is disabled</p>
                          <p className="text-gray-400 text-sm">Enable for better account security</p>
                        </div>
                      </div>
                      <button
                        onClick={handleEnable2FA}
                        disabled={isLoading2FA}
                        className="py-3 px-6 rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
                      >
                        {isLoading2FA ? 'Enabling...' : (
                          <span className="flex items-center">
                            Enable 2FA
                            <ChevronRight className="ml-2 h-5 w-5" />
                          </span>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Custom animation styles */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

// Loading State Component - Redesigned without circle loading
const LoadingState = () => (
  <div className="min-h-screen bg-gray-950 relative">
    <div className="absolute inset-0 bg-gray-950">
      <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-[radial-gradient(circle_at_30%_20%,#2563eb,transparent_40%)]"></div>
      <div className="absolute bottom-0 right-0 w-full h-full opacity-20 bg-[radial-gradient(circle_at_70%_80%,#8b5cf6,transparent_40%)]"></div>
    </div>

    <div className="flex flex-col items-center justify-center h-screen relative z-10">
      <div className="max-w-md w-full">
        {/* Title skeleton */}
        <div className="animate-pulse mb-6 flex flex-col items-center">
          <div className="h-6 w-32 bg-gray-800 rounded-full mb-4"></div>
          <div className="h-10 w-64 bg-gray-800 rounded-lg mb-3"></div>
          <div className="h-4 w-48 bg-gray-800 rounded-full"></div>
        </div>
        
        {/* Card skeleton */}
        <div className="relative group mb-6">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-10 transition duration-1000"></div>
          <div className="relative bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="animate-pulse flex flex-col space-y-4">
              <div className="h-6 w-36 bg-gray-800 rounded mb-2"></div>
              <div className="h-4 w-full bg-gray-800 rounded"></div>
              <div className="h-12 w-full bg-gray-800 rounded-lg"></div>
              <div className="h-12 w-full bg-gray-800 rounded-lg"></div>
            </div>
          </div>
        </div>
        
        {/* Second card skeleton */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-10 transition duration-1000"></div>
          <div className="relative bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="animate-pulse flex flex-col space-y-4">
              <div className="h-6 w-48 bg-gray-800 rounded mb-2"></div>
              <div className="h-4 w-full bg-gray-800 rounded"></div>
              <div className="h-4 w-2/3 bg-gray-800 rounded"></div>
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-gray-800 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 w-24 bg-gray-800 rounded mb-2"></div>
                  <div className="h-3 w-32 bg-gray-800 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-6">
          <p className="text-gray-400 animate-pulse">Loading your settings...</p>
        </div>
      </div>
    </div>
  </div>
);

// Error State Component
const ErrorState = ({ message, retryFn }) => (
  <div className="min-h-screen bg-gray-950 flex items-center justify-center relative">
    <div className="absolute inset-0 bg-gray-950">
      <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-[radial-gradient(circle_at_30%_20%,#2563eb,transparent_40%)]"></div>
      <div className="absolute bottom-0 right-0 w-full h-full opacity-20 bg-[radial-gradient(circle_at_70%_80%,#8b5cf6,transparent_40%)]"></div>
    </div>
    <div className="relative z-10">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-purple-500 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative bg-gray-900 rounded-xl p-8 text-center border border-gray-800 max-w-md">
          <div className="w-16 h-16 rounded-full bg-red-900/30 flex items-center justify-center mx-auto mb-4 border border-red-800/50">
            <span className="text-2xl">❌</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-gray-400 mb-6">{message}</p>
          <button 
            onClick={retryFn}
            className="py-3 px-6 rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default SettingsPage;