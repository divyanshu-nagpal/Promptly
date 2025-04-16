import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserPrompts from './components/UserPrompts';
import { User, FileText, Plus } from 'lucide-react';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [animatedSections, setAnimatedSections] = useState({
    'profile-hero': true,
    'profile-content': true,
    'stats-section': true,
    'posts-section': true,
    'no-posts': true
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/api/user/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setUserData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setLoading(false);
      }
    };

    fetchProfile();

    // Setup animation observer
    setTimeout(() => {
      const sections = document.querySelectorAll('.animate-on-scroll');
      
      // If IntersectionObserver is available, use it
      if ('IntersectionObserver' in window) {
        const observerOptions = {
          root: null,
          rootMargin: '0px',
          threshold: 0.1
        };

        const observerCallback = (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting && entry.target.id) {
              setAnimatedSections(prev => ({
                ...prev,
                [entry.target.id]: true
              }));
            }
          });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        
        sections.forEach(section => {
          if (section.id) {
            observer.observe(section);
          }
        });

        return () => {
          sections.forEach(section => {
            if (section.id) {
              observer.unobserve(section);
            }
          });
        };
      } else {
        // Fallback for browsers without IntersectionObserver support
        const allSectionsVisible = {};
        sections.forEach(section => {
          if (section.id) {
            allSectionsVisible[section.id] = true;
          }
        });
        setAnimatedSections(prev => ({
          ...prev,
          ...allSectionsVisible
        }));
      }
    }, 100);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-75 mb-4"></div>
          <p className="text-gray-400">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const getRoleBadgeStyle = (role) => {
    if (role === 'moderator') return 'bg-blue-900/30 border-blue-800/50 text-blue-400';
    if (role === 'admin') return 'bg-purple-900/30 border-purple-800/50 text-purple-400';
    return 'bg-green-900/30 border-green-800/50 text-green-400';
  };

  return (
    <div className="min-h-screen bg-gray-950 py-12 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gray-950">
        <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-[radial-gradient(circle_at_30%_20%,#2563eb,transparent_40%)]"></div>
        <div className="absolute bottom-0 right-0 w-full h-full opacity-20 bg-[radial-gradient(circle_at_70%_80%,#8b5cf6,transparent_40%)]"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-5 bg-[radial-gradient(circle_at_50%_50%,#ffffff,transparent_70%)]"></div>
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBoMzB2MzBIMzB6TTAgMGgzMHYzMEgweiIgZmlsbD0iIzIwMjAyMCIgZmlsbC1vcGFjaXR5PSIuMDUiLz48L2c+PC9zdmc+')] opacity-10"></div>
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Hero Section */}
        <section id="profile-hero" className="animate-on-scroll relative mb-12">
          <div className={`text-center ${animatedSections['profile-hero'] ? 'animate-fade-in' : ''}`}>
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-900/30 text-blue-400 text-sm mb-6 border border-blue-800/50">
              <User className="h-3.5 w-3.5 mr-2" />
              <span>Your Profile</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">{userData.user.username}</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Manage your content and account details
            </p>
          </div>
        </section>
        
        {/* Profile Content Section */}
        <section id="profile-content" className="animate-on-scroll relative">
          <div className={`${animatedSections['profile-content'] ? 'animate-fade-in' : ''}`}>
            {/* User Stats Overview */}
            <div id="stats-section" className="animate-on-scroll grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {/* Account Info */}
              <div className={`relative group ${animatedSections['stats-section'] ? 'animate-fade-in-delayed-1' : ''}`}>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-gray-900 p-6 rounded-xl border border-gray-800 backdrop-blur-sm">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-900/30 p-3 rounded-lg">
                      <User className="h-6 w-6 text-blue-400" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-300">Account Type</h3>
                      <p className="text-lg font-semibold text-white capitalize">{userData.user.role}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Posts Count */}
              <div className={`relative group ${animatedSections['stats-section'] ? 'animate-fade-in-delayed-2' : ''}`}>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-gray-900 p-6 rounded-xl border border-gray-800 backdrop-blur-sm">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-900/30 p-3 rounded-lg">
                      <FileText className="h-6 w-6 text-blue-400" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-300">Total Posts</h3>
                      <p className="text-lg font-semibold text-white">{userData.user.totalPrompts}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Details Card with Gradient Border */}
            <div className="relative group mb-12">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-gray-900 rounded-xl p-8 border border-gray-800 backdrop-blur-sm">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  {/* User Profile Image */}
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-300"></div>
                    {userData.user.profilePicture ? (
                      <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-800">
                        <img 
                          src={userData.user.profilePicture} 
                          alt={`${userData.user.username}'s profile`} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-blue-800/30 to-purple-800/30 border-2 border-gray-800 flex items-center justify-center">
                        <User size={32} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  {/* User Details */}
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                      <div className="flex items-center mb-3 md:mb-0">
                        <h2 className="text-2xl font-bold text-white mr-3">{userData.user.username}</h2>
                        {userData.user.role !== 'user' && (
                          <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getRoleBadgeStyle(userData.user.role)}`}>
                            {userData.user.role.toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-400 mb-1">Email</h3>
                          <p className="text-white">{userData.user.email}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-400 mb-1">Username</h3>
                          <p className="text-white">{userData.user.username}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* User Posts Section */}
            <section id="posts-section" className="animate-on-scroll relative mb-12">
              <div className={`${animatedSections['posts-section'] ? 'animate-fade-in' : ''}`}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="bg-blue-900/30 rounded-full p-2 mr-3 border border-blue-800/50">
                      <FileText size={18} className="text-blue-400" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Your Content</h2>
                  </div>
                  
                  <button 
                    onClick={() => window.location.href = '/add-prompt'} 
                    className="flex items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Post
                  </button>
                </div>
                
                {userData.user.totalPrompts > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userData.posts.map((post) => (
                      <div 
                        key={post._id} 
                        className="relative group"
                      >
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative bg-gray-900 rounded-lg p-5 h-full border border-gray-800">
                          <UserPrompts prompt={post} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div id="no-posts" className="animate-on-scroll relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative bg-gray-900 rounded-xl p-8 text-center border border-gray-800">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-4 border border-gray-800">
                        <FileText size={24} className="text-gray-400" />
                      </div>
                      <h3 className="text-xl font-medium text-white mb-2">No Posts Yet</h3>
                      <p className="text-gray-400 mb-4">You haven't uploaded any posts yet. Create your first post now!</p>
                      <button 
                        onClick={() => window.location.href = '/add-prompt'} 
                        className="py-3 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
                      >
                        <Plus className="h-4 w-4 mr-2 inline" />
                        Create Your First Post
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        </section>
      </div>
      
      {/* Custom animation styles */}
      <style jsx global>{`
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        .animate-fade-in-delayed-1 {
          animation: fadeIn 0.8s ease-out 0.1s forwards;
        }
        
        .animate-fade-in-delayed-2 {
          animation: fadeIn 0.8s ease-out 0.3s forwards;
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

export default ProfilePage;