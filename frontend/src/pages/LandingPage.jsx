import React, { useState, useEffect, useRef } from 'react';
import { Search, Share2, Star, ArrowRight, ChevronRight, Zap, Award, Users } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";

function LandingPageContent() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [animatedSections, setAnimatedSections] = useState({});
  const [visibleTiles, setVisibleTiles] = useState({});
  const token = localStorage.getItem("token");
  const categories = ['ChatGPT', 'DALL-E', 'Midjourney', 'Stable Diffusion'];
  const navigate = useNavigate();

  // Cycle through categories automatically
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentCategoryIndex(prevIndex => (prevIndex + 1) % categories.length);
    }, 2000); // Change category every 2 seconds
    
    return () => clearInterval(intervalId);
  }, [categories.length]);

  // Set up intersection observer to detect when sections enter viewport
  useEffect(() => {
    const observerOptions = {
      root: null, // viewport
      rootMargin: '0px',
      threshold: 0.1 // 10% of the element visible
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
    
    // Target all sections that should animate on scroll
    const sections = document.querySelectorAll('.animate-on-scroll');
    sections.forEach(section => {
      observer.observe(section);
    });

    // Set up a separate observer for tile animations
    const tileObserverOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    };

    const tileObserverCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const tileId = entry.target.dataset.tileId;
          if (tileId) {
            setVisibleTiles(prev => ({
              ...prev,
              [tileId]: true
            }));
          }
        }
      });
    };

    const tileObserver = new IntersectionObserver(tileObserverCallback, tileObserverOptions);
    
    // Target all tiles that should animate on scroll
    const tiles = document.querySelectorAll('.animate-tile');
    tiles.forEach(tile => {
      tileObserver.observe(tile);
    });

    return () => {
      sections.forEach(section => {
        observer.unobserve(section);
      });
      
      tiles.forEach(tile => {
        tileObserver.unobserve(tile);
      });
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      // Redirect to community page with search query parameter
      if (token) {
        navigate(`/community?search=${encodeURIComponent(query.trim())}`);
      }
      else{
        navigate("/login");
        return;
      }
    }
  };


  const isTileVisible = (id) => {
    return visibleTiles[id] === true;
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200">
      {/* Hero Section with animated gradient background */}
      <section id="hero" className="animate-on-scroll relative pt-20 pb-24 px-4 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gray-950">
          <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-[radial-gradient(circle_at_30%_20%,#2563eb,transparent_40%)]"></div>
          <div className="absolute bottom-0 right-0 w-full h-full opacity-20 bg-[radial-gradient(circle_at_70%_80%,#8b5cf6,transparent_40%)]"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-5 bg-[radial-gradient(circle_at_50%_50%,#ffffff,transparent_70%)]"></div>
        </div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBoMzB2MzBIMzB6TTAgMGgzMHYzMEgweiIgZmlsbD0iIzIwMjAyMCIgZmlsbC1vcGFjaXR5PSIuMDUiLz48L2c+PC9zdmc+')] opacity-10"></div>
        
        <div className={`max-w-5xl mx-auto relative ${animatedSections.hero ? 'animate-fade-in' : 'opacity-0'}`}>
          <div className="absolute -top-32 -left-32 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob"></div>
          <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob animation-delay-2000"></div>
          
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-3/5 mb-12 md:mb-0 md:pr-8">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-900/30 text-blue-400 text-sm mb-6 border border-blue-800/50">
                <span>AI Prompts Community</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
                Find the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">Perfect Prompt</span> for Your AI Needs
              </h1>
              <p className="text-xl text-gray-400 leading-relaxed">
                Discover, share, and optimize AI prompts for{" "}
                <span className="text-blue-400 animate-category-fade transition-opacity duration-500 ease-in-out">
                  {categories[currentCategoryIndex]}
                </span>
              </p>
              <p className="text-xl text-gray-400 leading-relaxed mt-2">
                and more in our curated community.
              </p>
              <br/>
              
              <form onSubmit={handleSearch} className="mb-6 relative">
  <div className="relative flex items-center bg-gray-950 rounded-md border-0 overflow-hidden shadow-xl">
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search for prompts..."
      className="w-full px-5 py-4 bg-transparent text-white focus:outline-none placeholder:text-gray-500 caret-indigo-400"
    />
    <button
      type="submit"
      className="absolute right-2 p-2 bg-indigo-600 rounded-md text-white flex items-center justify-center transition-all duration-200 hover:bg-indigo-700"
    >
      <Search className="h-5 w-5" />
    </button>
  </div>
  {error && <p className="text-sm text-red-400 mt-2">{error}</p>}
</form>
</div>
            
            {/* Animated illustration */}
            <div className="md:w-2/5 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-lg opacity-20 animate-pulse"></div>
              <div className="relative bg-gray-900 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-xs text-gray-500">Promptly</div>
                </div>

                <div className="space-y-3 font-mono text-white text-sm">
                  <p className="whitespace-nowrap overflow-hidden border-r-2 border-white animate-typewriter">
                    Hello, welcome to the world of prompts!
                  </p>
                  <p className="whitespace-nowrap overflow-hidden border-r-2 border-white animate-typewriter2">
                    Let's build something amazing with AI.
                  </p>
                  <div className="bg-gray-800 h-6 w-5/6 rounded-md animate-pulse"></div>
                  <div className="bg-gray-800 h-6 w-2/3 rounded-md animate-pulse"></div>
                </div>

                <div className="mt-6 flex justify-between">
                  <div className="bg-blue-600/20 text-blue-400 text-xs px-3 py-1 rounded-full">AI Prompt</div>
                  <div className="text-xs text-gray-500">5,302 uses</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

     
      {/* Stats Section with animated tiles */}
      <section id="stats" className="animate-on-scroll px-4 py-16">
        <div className={`max-w-6xl mx-auto ${animatedSections.stats ? 'animate-fade-in' : 'opacity-0 translate-y-8'}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: <Users className="h-6 w-6 text-blue-500" />,
                label: 'Active Users', 
                value: '100+',
                description: 'creators and explorers'
              },
              { 
                icon: <Zap className="h-6 w-6 text-purple-500" />,
                label: 'Prompts Shared', 
                value: '500+',
                description: 'and growing daily'
              },
              { 
                icon: <Award className="h-6 w-6 text-yellow-500" />,
                label: 'Success Rate', 
                value: '95%',
                description: 'rated by our community'
              }
            ].map((stat, index) => (
              <div 
                key={stat.label} 
                className="animate-tile"
                data-tile-id={`stat-${index}`}
                style={{
                  opacity: isTileVisible(`stat-${index}`) ? 1 : 0,
                  transform: isTileVisible(`stat-${index}`) ? 'translateY(0)' : 'translateY(30px)',
                  transition: 'opacity 0.5s ease, transform 0.5s ease',
                  transitionDelay: `${index * 200}ms`
                }}
              >
                <div className="bg-gray-900 border-2 border-gray-800 rounded-xl p-8 text-center hover:border-blue-500 hover:transform hover:scale-105 transition-all duration-300 shadow-lg">
                  <div className="inline-block p-3 bg-gray-800 rounded-xl mb-4">
                    {stat.icon}
                  </div>
                  <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2">{stat.value}</div>
                  <div className="text-white font-medium mb-1">{stat.label}</div>
                  <div className="text-sm text-gray-500">{stat.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section with animated tiles */}
      <section id="features" className="animate-on-scroll py-20">
        <div className={`max-w-6xl mx-auto px-4 ${animatedSections.features ? 'animate-fade-in' : 'opacity-0'}`}>
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-900/30 text-blue-400 text-sm mb-6 border border-blue-800/50">
              <span>Why Choose Promptly</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-6">
              Features Designed for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">AI Prompt Enthusiasts</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Everything you need to discover, create, and share the most effective AI prompts
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Search className="h-6 w-6" />,
                title: 'Find Perfect Prompts',
                description: 'Search through thousands of curated prompts tested by our community.',
                color: 'from-blue-600 to-blue-400'
              },
              {
                icon: <Share2 className="h-6 w-6" />,
                title: 'Share Your Expertise',
                description: 'Contribute your successful prompts and help others achieve better results.',
                color: 'from-purple-600 to-purple-400'
              },
              {
                icon: <Star className="h-6 w-6" />,
                title: 'Quality Assured',
                description: 'All prompts are rated and reviewed by the community for effectiveness.',
                color: 'from-yellow-600 to-yellow-400'
              }
            ].map((feature, index) => (
              <div 
                key={feature.title} 
                className="relative group animate-tile"
                data-tile-id={`feature-${index}`}
                style={{
                  opacity: isTileVisible(`feature-${index}`) ? 1 : 0,
                  transform: isTileVisible(`feature-${index}`) ? 'translateY(0)' : 'translateY(30px)',
                  transition: 'opacity 0.6s ease, transform 0.6s ease',
                  transitionDelay: `${index * 200}ms`
                }}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-0 group-hover:opacity-50 transition duration-500"></div>
                <div className="relative p-8 rounded-xl bg-gray-900 border border-gray-800 hover:border-gray-700 transition-all duration-300 h-full flex flex-col">
                  <div className={`bg-gradient-to-r ${feature.color} p-3 rounded-xl w-12 h-12 flex items-center justify-center text-white mb-6`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                  <p className="text-gray-400 mb-6">{feature.description}</p>

                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials with animated tiles - FIXED STRUCTURE */}
      <section id="testimonials" className="animate-on-scroll py-20 bg-gray-900/50">
        <div className={`max-w-6xl mx-auto px-4 ${animatedSections.testimonials ? 'animate-fade-in' : 'opacity-0'}`}>
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-purple-900/30 text-purple-400 text-sm mb-6 border border-purple-800/50">
              <Users className="h-3.5 w-3.5 mr-2" />
              <span>Community Voices</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-6">
              What <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">Our Users</span> Are Saying
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                quote: "I've 10x'd my productivity with AI tools thanks to the prompts I found on Promptly. The quality and variety of prompts is unmatched.",
                author: "Alex Chen",
                role: "UX Designer",
                image: "/api/placeholder/80/80"
              },
              {
                quote: "The quality of prompts here is outstanding. I've found exactly what I needed for my creative projects and even contributed some of my own discoveries.",
                author: "Sofia Rodriguez",
                role: "Content Creator",
                image: "/api/placeholder/80/80"
              }
            ].map((testimonial, index) => (
              <div 
                key={index} 
                className="animate-tile"
                data-tile-id={`testimonial-${index}`}
                style={{
                  opacity: isTileVisible(`testimonial-${index}`) ? 1 : 0,
                  transform: isTileVisible(`testimonial-${index}`) ? 'translateY(0)' : 'translateY(40px)',
                  transition: 'opacity 0.7s ease, transform 0.7s ease',
                  transitionDelay: `${index * 300}ms`
                }}
              >
                {/* Fixed testimonial box structure */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-800 rounded-xl p-8 h-full backdrop-blur-sm hover:border-blue-800 transition-all duration-300">
                  <div className="flex flex-col h-full">
                    <div className="text-2xl text-blue-400 mb-6">"</div>
                    <p className="text-gray-300 mb-6 leading-relaxed flex-grow">{testimonial.quote}</p>
                    <div className="flex items-center">
                      <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-full p-0.5">
                        <div className="bg-gray-900 rounded-full p-0.5">
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center text-gray-600 text-lg font-bold">
                            {testimonial.author.charAt(0)}
                          </div>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-white font-medium">{testimonial.author}</div>
                        <div className="text-gray-500 text-sm">{testimonial.role}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="animate-on-scroll py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-purple-900 opacity-20"></div>
        
        <div className={`max-w-4xl mx-auto px-4 text-center relative ${animatedSections.cta ? 'animate-fade-in' : 'opacity-0'}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Promptly</span> Community?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Become part of our growing network of prompt creators and AI enthusiasts to share your knowledge and discover new possibilities.
          </p>
          <div 
            className="inline-block animate-tile"
            data-tile-id="cta-button"
            style={{
              opacity: isTileVisible("cta-button") ? 1 : 0,
              transform: isTileVisible("cta-button") ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
              transition: 'opacity 0.5s ease, transform 0.5s ease',
            }}
          >
            <button
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 flex items-center"
            onClick={() => navigate('/register')}
            >
            Get Started Today
            <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Custom styles for animations */}
      <style jsx global>{`
        .perspective {
          perspective: 1000px;
        }
        
        .preserve-3d {
          transform-style: preserve-3d;
        }
        
        .backface-hidden {
          backface-visibility: hidden;
        }
        
        .my-rotate-y-180 {
          transform: rotateY(180deg);
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        .animate-slide-up {
          animation: slideUp 0.8s ease-out forwards;
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
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
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes blob {
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
        
        /* Add staggered tile animations */
        .category-text {
          position: absolute;
          left: 0;
          top: 0;
          transition: opacity 0.5s ease-in-out;
        }
        
        .animate-category-fade {
          animation: categoryFade 2s infinite;
        }
        
        @keyframes categoryFade {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        
        /* Input focus effect */
        input:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
        }

        @keyframes typewriter {
          from { width: 0 }
          to { width: 100% }
        }

        @keyframes blink {
          0%, 100% { border-color: transparent }
          50% { border-color: white }
        }

        @keyframes hide-cursor {
          to { border-right: none; }
        }

        .animate-typewriter {
          width: 0;
          white-space: nowrap;
          overflow: hidden;
          border-right: 2px solid white;
          animation: 
            typewriter 3s steps(30) 1s forwards,
            blink 0.75s step-end 1s 4,
            hide-cursor 0.01s linear 4s forwards;
        }

        .animate-typewriter2 {
          width: 0;
          white-space: nowrap;
          overflow: hidden;
          border-right: 2px solid white;
          animation: 
            typewriter 3s steps(30) 4s forwards,
            blink 0.75s step-end 4s 4,
            hide-cursor 0.01s linear 7s forwards;
        }


      `}</style>
    </div>
  );
}

export default LandingPageContent;