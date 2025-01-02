import React, { useState, useEffect } from 'react';
import { Search, Plus, Users, Bookmark, Tag as TagIcon, Calendar, Filter, Settings, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
  
  

  // Fetch Prompts
  useEffect(() => {
    fetchPrompts(setPrompts, setError); // Using centralized function
  }, []);

  // Fetch Bookmarked Prompts
  useEffect(() => {
    fetchBookmarkedPrompts(setBookmarkedPrompts, setError, showBookmarked); // Using centralized function
  }, [showBookmarked]);

  // Fetch Top users
  useEffect(() => {
    fetchTopUsers( setTopUsers, setError); // Using centralized function
  }, []);
  

  const handleSearch = (e) => setSearch(e.target.value);


  const filteredPrompts = showBookmarked 
    ? bookmarkedPrompts.filter(
        prompt => prompt?.title?.toLowerCase().includes(search.toLowerCase()) &&
        (filterTag ? prompt?.tags?.includes(filterTag) : true)
      )
    : prompts.filter(
        prompt => prompt.title?.toLowerCase()?.includes(search.toLowerCase()) &&
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
    },
  },
  {
    id: 'add',
    label: 'Add Post',
    icon: Plus,
    onClick: () => {
      setSelectedNav('add');
      navigate('/add-prompt');
    },
  },
  {
    id: 'saved',
    label: 'Saved',
    icon: Bookmark,
    onClick: () => {
      setSelectedNav('saved');
      setShowBookmarked(true);
    },
  },
];

  const upcomingEvents = [
    { id: 1, name: "Advanced Prompt Engineering", date: "Mar 15", attendees: 45 },
    { id: 2, name: "AI Ethics Discussion", date: "Mar 18", attendees: 32 },
    { id: 3, name: "Community Meetup", date: "Mar 22", attendees: 78 },
  ];

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Left Sidebar - Fixed */}
      <div className="w-64 bg-white border-r border-gray-200">
        <div className="p-6 h-full flex flex-col">
          

          {/* Sidebar Navigation */}
          <div className="space-y-8 flex-1 overflow-y-auto">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Categories</h3>
              <nav className="space-y-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={item.onClick}
                      className={`w-full flex items-center px-3 py-2 rounded-lg transition-all ${
                        selectedNav === item.id
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
               {['AI', 'Writing', 'Code', 'Business', 'Creative', 'Marketing', 'Productivity', 'Technology', 'Design', 'Education'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setFilterTag(tag)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filterTag === tag ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Content - Scrollable */}
      <div className="flex-1 h-screen overflow-y-auto">
        <div className="max-w-3xl mx-auto px-8 py-8">
          <div className="bg-white rounded-xl p-6 mb-8 shadow-sm">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {showBookmarked ? 'Saved Prompts' : 'Community Prompts'}
            </h1>
            <p className="text-gray-600 mb-6">
              {showBookmarked 
                ? 'Your collection of saved prompts' 
                : 'Discover and share powerful prompts with the community'}
            </p>
            
            <div className="flex gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-" />
                <input
                  type="text"
                  value={search}
                  onChange={handleSearch}
                  placeholder="Search prompts..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                />
              </div>
              <button 
                onClick={() => setView(view === 'grid' ? 'list' : 'grid')}
                className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className={'space-y-4'}>
            {filteredPrompts.map((prompt) => (
              <PromptCard 
                key={prompt._id} 
                prompt={prompt} 
                setPrompts={setPrompts}
                view={view}
                setBookmarkedPrompts={setBookmarkedPrompts}
              />
            ))}
            {showBookmarked && filteredPrompts.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No saved prompts found.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Fixed */}
      <div className="w-64 bg-white border-l border-gray-200 h-screen overflow-hidden">
        <div className="p-6 h-full">
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Top Contributors</h3>
              <div className="space-y-4">
                {topUsers.map((contributor) => (
                  <div key={contributor.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center overflow-hidden gap-2">
                        <img src={contributor.profilePicture || "https://res.cloudinary.com/djncnauta/image/upload/v1735364671/profile_photo_gaqfit.jpg"} className="h-full w-full object-cover"/>
                      </div>
                        <span className="text-sm font-medium text-gray-900">{contributor.name}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                        {contributor.badge}
                      </span>
                      <span className="text-gray-500">{contributor.contributions} prompts</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Upcoming Events</h3>
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900">{event.name}</p>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {event.date}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {event.attendees}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommunityPage;