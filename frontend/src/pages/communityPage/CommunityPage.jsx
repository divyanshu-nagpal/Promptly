import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Users, Bookmark, Calendar, Filter, Menu } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../lib/api';
import PromptCard from './components/PromptCard';
import { fetchBookmarkedPrompts, fetchPrompts, fetchTopUsers } from '../../utils/utils';


function CommunityPage() {
  const navigate = useNavigate();
  const [prompts, setPrompts] = useState([]);
  const [search, setSearch] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [error, setError] = useState('');
  const [view, setView] = useState('grid');
  const [selectedNav, setSelectedNav] = useState('community');
  const [bookmarkedPrompts, setBookmarkedPrompts] = useState([]);
  const [showBookmarked, setShowBookmarked] = useState(false);
  const [topUsers, setTopUsers] = useState([]);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [animatedSections, setAnimatedSections] = useState({});
  const [visibleItems, setVisibleItems] = useState({});
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  const token = localStorage.getItem("token");


  // Reference for the main container
  const pageRef = useRef(null);
  
  // Handle window resizing
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      // Close mobile nav on resize to desktop
      if (window.innerWidth >= 768) {
        setMobileNavOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  
  useEffect(() => {
    // Get search query from URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    
    // If search query exists in URL, set it in state and perform search
    if (searchQuery) {
      setSearch(searchQuery);
      // The search will be performed automatically by the existing useEffect that watches 'search'
    }
  }, []);
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        console.log('Requesting events from: /api/events/upcoming');
        const res = await fetch('/api/events/upcoming');
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const data = await res.json();
        console.log('Events data received:', data);
        
        // Process the events data to ensure consistent formatting
        const processedEvents = data.map(event => ({
          _id: event._id,
          title: event.title || 'Untitled Event',
          date: event.eventDate ? new Date(event.eventDate) : new Date(),
          timing: event.eventTime || 'TBA',
          organizer: event.organizer || 'Anonymous',
          registrationLink: event.registrationLink || null,
        }));
        
        setUpcomingEvents(processedEvents);
      } catch (err) {
        console.error('Failed to load events - Error details:', err);
        setUpcomingEvents([]);
      }
    };

    fetchEvents();
  }, []);

  // Page load animation effect
  useEffect(() => {
    document.body.classList.add('loading');
    
    const timer = setTimeout(() => {
      setPageLoaded(true);
      document.body.classList.remove('loading');
      setIsInitialLoad(false);
      
      setTimeout(() => {
        setAnimatedSections(prev => ({
          ...prev,
          header: true,
          sidebar: true
        }));
        
        setTimeout(() => {
          setAnimatedSections(prev => ({
            ...prev,
            content: true,
            rightSidebar: true
          }));
        }, 200);
      }, 100);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const itemId = entry.target.dataset.animateId;
          if (itemId) {
            setVisibleItems(prev => ({
              ...prev,
              [itemId]: true
            }));
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    const animatableItems = document.querySelectorAll('[data-animate-id]');
    animatableItems.forEach(item => {
      observer.observe(item);
    });

    return () => {
      animatableItems.forEach(item => {
        observer.unobserve(item);
      });
    };
  }, [prompts, bookmarkedPrompts, topUsers]);

  // Fetch all prompts initially
  useEffect(() => {
    fetchPrompts(setPrompts, setError);
  }, []);

  // Fetch Bookmarked
  useEffect(() => {
    fetchBookmarkedPrompts(setBookmarkedPrompts, setError, showBookmarked);
  }, [showBookmarked]);

  // Fetch Top Users
  useEffect(() => {
    fetchTopUsers(setTopUsers, setError);
  }, []);


// Step 1: Create a separate function for performing the search
const performSearch = async (searchTerm) => {
  if (searchTerm.trim() === '') {
    fetchPrompts(setPrompts, setError);
    return;
  }

  try {
    const response = await api.get('/api/auth/prompts/search', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      params: { q: searchTerm }
    });
    console.log('Search results:', response.data);
    setPrompts(response.data);
  } catch (err) {
    console.error('Search error:', err);
    setError('Search failed. Please try again later.');
  }
};

// Step 2: Update your event handler to call the search function
const handleSearch = (e) => {
  const value = e.target.value;
  setSearch(value);
};

// Step 3: Use the useEffect to call the search function when search state changes
useEffect(() => {
  const timer = setTimeout(() => {
    if (search.trim() === '') {
      // Reset to all prompts if search is cleared
      fetchPrompts(setPrompts, setError);
    } else {
      performSearch(search);
    }
  }, 500); // 500ms debounce

  return () => clearTimeout(timer);
}, [search]);

  const filteredPrompts = (showBookmarked ? bookmarkedPrompts : prompts).filter(prompt =>
    (filterTag ? prompt?.tags?.includes(filterTag) : true)
  );

  const navigationItems = [
    {
      id: 'community',
      label: 'Community Picks',
      icon: Users,
      onClick: () => {
        setSelectedNav('community');
        setShowBookmarked(false);
        if (isMobile) setMobileNavOpen(false);
      },
    },
    {
      id: 'add',
      label: 'Add Post',
      icon: Plus,
      onClick: () => {
        setSelectedNav('add');
        navigate('/add-prompt');
        if (isMobile) setMobileNavOpen(false);
      },
    },
    {
      id: 'saved',
      label: 'Saved',
      icon: Bookmark,
      onClick: () => {
        setSelectedNav('saved');
        setShowBookmarked(true);
        if (isMobile) setMobileNavOpen(false);
      },
    },
  ];

  const popularTags = ['AI', 'Writing', 'Business', 'Code', 'Creative', 'Productivity','Tools', 'Storytelling', 'Marketing', 'Design', 'Education', 'Inspiration'];

  const isVisible = (id) => visibleItems[id] === true;

  const toggleMobileNav = () => {
    setMobileNavOpen(!mobileNavOpen);
  };

  return (
    <div 
      ref={pageRef}
      className={`min-h-screen bg-gray-950 flex relative overflow-hidden transition-opacity duration-500 ${pageLoaded ? 'opacity-100' : 'opacity-0'}`}
    >
      {/* Initial loading indicator - only visible during first load */}
      {isInitialLoad && (
        <div className="fixed inset-0 bg-gray-950 z-50 flex items-center justify-center transition-opacity duration-500">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-spin-slow opacity-30"></div>
              <div className="absolute inset-2 bg-gray-950 rounded-full"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-ping opacity-20"></div>
            </div>
            <div className="mt-4 text-gray-400 animate-pulse">Loading community...</div>
          </div>
        </div>
      )}

      {/* Background elements */}
      <div className="absolute inset-0 bg-gray-950 transition-opacity duration-1000">
        <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-[radial-gradient(circle_at_30%_20%,#2563eb,transparent_40%)]"></div>
        <div className="absolute bottom-0 right-0 w-full h-full opacity-20 bg-[radial-gradient(circle_at_70%_80%,#8b5cf6,transparent_40%)]"></div>
      </div>
      
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBoMzB2MzBIMzB6TTAgMGgzMHYzMEgweiIgZmlsbD0iIzIwMjAyMCIgZmlsbC1vcGFjaXR5PSIuMDUiLz48L2c+PC9zdmc+')] opacity-0 transition-opacity duration-1000 ease-in-out" style={{ opacity: pageLoaded ? 0.1 : 0 }}></div>

      {/* Mobile Navigation Overlay */}
      {isMobile && mobileNavOpen && (
        <div 
          className="fixed inset-0 bg-gray-950/90 z-40 backdrop-blur-sm"
          onClick={() => setMobileNavOpen(false)}
        ></div>
      )}

      {/* Left Sidebar - Hidden on mobile by default */}
      <div 
        className={`${isMobile ? 'fixed z-50 top-0 left-0 h-full transform transition-transform duration-300' : 'w-64 relative z-10 border-r border-gray-800 custom-scrollbar transition-transform duration-700 ease-out'} 
        ${isMobile && mobileNavOpen ? 'translate-x-0' : isMobile ? '-translate-x-full' : ''} 
        ${!isMobile && animatedSections.sidebar ? 'translate-x-0 opacity-100' : !isMobile ? '-translate-x-6 opacity-0' : ''}`}
      >
        <div className="p-6 h-full flex flex-col backdrop-blur-sm bg-gray-950/95">
          {isMobile && (
            <div className="flex justify-end mb-6">
              <button 
                onClick={() => setMobileNavOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          <div className="space-y-8 flex-1 overflow-y-auto">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Categories</h3>
              <nav className="space-y-1">
                {navigationItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={item.onClick}
                      className={`w-full flex items-center px-3 py-2 rounded-lg transition-all duration-300 ${
                        selectedNav === item.id
                          ? 'bg-blue-900/30 text-blue-400 border border-blue-800/50'
                          : 'text-gray-300 hover:bg-gray-800/50 hover:text-blue-400'
                      }`}
                      style={{
                        transitionDelay: `${100 + index * 100}ms`,
                        opacity: animatedSections.sidebar || isMobile ? 1 : 0,
                        transform: animatedSections.sidebar || isMobile ? 'translateX(0)' : 'translateX(-10px)'
                      }}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag, index) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setFilterTag(filterTag === tag ? '' : tag);
                      if (isMobile) setMobileNavOpen(false);
                    }}
                    className={`px-3 py-1 rounded-full text-sm transition-all duration-300 ${
                      filterTag === tag
                        ? 'bg-blue-900/50 text-blue-400 border border-blue-800/50'
                        : 'bg-gray-800/70 text-gray-300 hover:bg-gray-700/70'
                    }`}
                    style={{
                      transitionDelay: `${400 + index * 75}ms`,
                      opacity: animatedSections.sidebar || isMobile ? 1 : 0,
                      transform: animatedSections.sidebar || isMobile ? 'translateY(0)' : 'translateY(10px)'
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Center Content */}
      <div className="flex-1 h-screen overflow-y-auto custom-scrollbar relative z-10">
        <div className={`${isMobile ? 'px-4' : 'max-w-3xl mx-auto px-8'} py-8`}>
          {/* Mobile header with menu button */}
          {isMobile && (
            <div className="flex items-center justify-between mb-6">
              <button 
                className="p-2 rounded-lg border border-gray-700 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300"
                onClick={toggleMobileNav}
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="text-lg font-medium text-white">
                {showBookmarked ? 'Saved Prompts' : 'Community Prompts'}
              </div>
              <button
                onClick={() => setView(view === 'grid' ? 'list' : 'grid')}
                className="p-2 rounded-lg border border-gray-700 bg-gray-800/50 hover:bg-gray-700/50 transition-colors text-gray-300"
              >
                <Filter className="w-5 h-5" />
              </button>
            </div>
          )}
          
          {/* Header card - Simplified for mobile */}
          <div className={`mb-8 ${isMobile ? 'simplified-header' : ''}`}>
            <div className="bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-800 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,#3b82f6,transparent_60%)]"></div>
                <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,#8b5cf6,transparent_60%)]"></div>
              </div>
              
              {!isMobile && (
                <div className="flex justify-center mb-4">
                  <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-900/30 text-blue-400 text-sm border border-blue-800/50">
                    <span>{showBookmarked ? 'Your Collection' : 'Community Hub'}</span>
                  </div>
                </div>
              )}
              
              {!isMobile && (
                <>
                  <h1 className="text-3xl font-bold text-white mb-2 text-center">
                    {showBookmarked ? 'Saved Prompts' : 'Community Prompts'}
                  </h1>
                  <p className="text-gray-400 mb-6 text-center">
                    {showBookmarked
                      ? 'Your collection of saved prompts'
                      : 'Discover and share powerful prompts with the community'}
                  </p>
                </>
              )}

              <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-4 items-center`}>
                <div className="relative flex-1 group w-full">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      name="search"
                      value={search}
                      onChange={handleSearch}
                      placeholder="Search prompts..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-800/50 text-white transition-all duration-300"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6">
              <div className="bg-red-900/30 border border-red-800 text-red-400 px-4 py-3 rounded-lg">
                {error}
              </div>
            </div>
          )}

          {/* Prompt cards */}
          <div className="space-y-4">
            {filteredPrompts.map((prompt) => (
              <div key={prompt._id}>
                <div className="bg-gray-900 rounded-xl border border-gray-800 backdrop-blur-sm overflow-hidden hover:border-gray-700 transition-colors duration-300 hover:shadow-lg hover:shadow-blue-900/10">
                  <PromptCard
                    prompt={prompt}
                    setPrompts={setPrompts}
                    view={view}
                    setBookmarkedPrompts={setBookmarkedPrompts}
                    darkMode={true}
                  />
                </div>
              </div>
            ))}
            {showBookmarked && filteredPrompts.length === 0 && (
              <div className="text-center py-16 text-gray-400">No saved prompts found.</div>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Hidden on mobile */}
      {!isMobile && (
        <div 
          className={`w-64 relative z-10 border-l border-gray-800 transition-transform duration-700 ease-out ${
            animatedSections.rightSidebar ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0'
          }`}
        >
          <div className="p-6 h-full backdrop-blur-sm overflow-y-auto custom-scrollbar">
            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Top Contributors</h3>
                <div className="space-y-4">
                  {topUsers.map((contributor, index) => (
                    <div 
                      key={contributor.id} 
                      data-animate-id={`contributor-${contributor.id}`}
                      className="transition-all duration-500"
                      style={{
                        opacity: isVisible(`contributor-${contributor.id}`) || animatedSections.rightSidebar ? 1 : 0,
                        transform: isVisible(`contributor-${contributor.id}`) || animatedSections.rightSidebar ? 'translateX(0)' : 'translateX(15px)',
                        transitionDelay: `${index * 150 + 200}ms`
                      }}
                    >
                      <div className="bg-gray-900 rounded-lg p-3 border border-gray-800 backdrop-blur-sm hover:border-blue-500/40 hover:shadow-sm transition-all duration-300">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center overflow-hidden">
                              <img
                                src={
                                  contributor.profilePicture ||
                                  "https://res.cloudinary.com/djncnauta/image/upload/v1735364671/profile_photo_gaqfit.jpg"
                                }
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-200">{contributor.name}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-blue-400 bg-blue-900/30 px-2 py-1 rounded-full border border-blue-800/50">{contributor.badge}</span>
                          <span className="text-gray-400">{contributor.contributions} prompts</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Upcoming Events</h3>
                {upcomingEvents && upcomingEvents.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingEvents.map((event, index) => (
                      <div 
                        key={event._id || `event-${index}`} 
                        data-animate-id={`event-${event._id || index}`}
                        className="transition-all duration-500"
                        style={{
                          opacity: isVisible(`event-${event._id || index}`) || animatedSections.rightSidebar ? 1 : 0,
                          transform: isVisible(`event-${event._id || index}`) || animatedSections.rightSidebar ? 'translateY(0)' : 'translateY(10px)',
                          transitionDelay: `${index * 150 + 500}ms`
                        }}
                      >
                        <div className="bg-gray-900 rounded-lg p-4 border border-gray-800 backdrop-blur-sm hover:border-blue-500/40 hover:shadow-sm transition-all duration-300">
                          <div className="mb-2 flex justify-between items-start">
                            <p className="text-sm font-medium text-gray-200">{event.title}</p>
                            {event.registrationLink && (
                              <a 
                                href={event.registrationLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 transition-colors duration-300"
                                title="Register"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>
                            )}
                          </div>
                          
                          <div className="space-y-2 text-xs">
                            <div className="flex items-center text-gray-400">
                              <Calendar className="w-4 h-4 mr-2 text-blue-400" />
                              {event.date instanceof Date && !isNaN(event.date) 
                                ? event.date.toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })
                                : 'Date TBA'}
                            </div>
                            
                            <div className="flex items-center text-gray-400">
                              <div className="w-4 h-4 mr-2 flex items-center justify-center text-blue-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                              {event.timing || 'Time TBA'}
                            </div>
                            
                            <div className="flex items-center text-gray-400">
                              <div className="w-4 h-4 mr-2 flex items-center justify-center text-blue-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              </div>
                              <span>
                                Organized by <span className="text-blue-400">{event.organizer}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 px-4 bg-gray-900/50 border border-gray-800 rounded-lg">
                    <div className="text-gray-500 mb-2">No upcoming events</div>
                    <div className="text-xs text-gray-600">Check back soon for new events</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom animation and scrollbar styles */}
      <style jsx global>{`
        body.loading {
          overflow: hidden;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
        
        .animate-fade-in-slow {
          animation: fadeIn 0.6s ease-out forwards;
        }
        
        .animate-spin-slow {
          animation: spin 2s linear infinite;
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        s@keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        /* Custom scrollbar styling */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.1);
          border-radius: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.2);
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.4);
        }
        
        /* For Firefox */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(59, 130, 246, 0.2) transparent;
        }
        
        /* Hide scrollbar but keep functionality (for cleaner look) */
        @media (min-width: 1024px) {
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          
          .hide-scrollbar {
            -ms-overflow-style: none; /* IE and Edge */
            scrollbar-width: none; /* Firefox */
          }
        }

        /* Mobile-specific styles */
        @media (max-width: 767px) {
          .simplified-header {
            padding: 0;
          }
          
          .simplified-header h1 {
            font-size: 1.5rem;
          }
          
          .simplified-header p {
            font-size: 0.875rem;
          }
        }
      `}</style>
    </div>
  );
}

export default CommunityPage;