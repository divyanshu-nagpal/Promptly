import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Shield, 
  Globe, 
  Code, 
  MessageSquare, 
  BookOpen, 
  Zap, 
  ChevronRight, 
  ArrowRight 
} from 'lucide-react';
import { useNavigate } from "react-router-dom";


function AboutUs() {
  const [animatedSections, setAnimatedSections] = useState({});
  const [visibleTiles, setVisibleTiles] = useState({});

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

  const isTileVisible = (id) => {
    return visibleTiles[id] === true;
  };

  const teamMembers = [
    {
      name: "Divyanshu Nagpal",
      role: "Founder",
      bio: "3rd Year CSE Student",
      image: "https://res.cloudinary.com/dcxvvyyvc/image/upload/v1744571280/dPROFILE.jpg"
    },
    {
      name: "Gahan Pradhan",
      role: "Founder",
      bio: "3rd Year CSE Student",
      image: "https://res.cloudinary.com/dcxvvyyvc/image/upload/v1744571340/gPROFILE.jpg"
    },
  ];

  const milestones = [
    {
      year: "2024",
      title: "The Beginning",
      description: "Promptly started as a small collection of AI prompts shared among friends working in tech."
    },
    {
      year: "2025",
      title: "Platform Launch",
      description: "We’re officially launching Promptly — a dedicated space to explore, share, and discover powerful AI prompts with a growing set of features."
    },
    {
      year: "2025",
      title: "Looking Ahead",
      description: "We're focused on building smart prompt optimization tools, growing a vibrant AI community, and becoming the go-to platform for AI prompt creators and learners."
    }
  ];
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200">
      {/* Hero Section with animated gradient background */}
      <section id="about-hero" className="animate-on-scroll relative pt-24 pb-20 px-4 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gray-950">
          <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-[radial-gradient(circle_at_30%_20%,#2563eb,transparent_40%)]"></div>
          <div className="absolute bottom-0 right-0 w-full h-full opacity-20 bg-[radial-gradient(circle_at_70%_80%,#8b5cf6,transparent_40%)]"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-5 bg-[radial-gradient(circle_at_50%_50%,#ffffff,transparent_70%)]"></div>
        </div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBoMzB2MzBIMzB6TTAgMGgzMHYzMEgweiIgZmlsbD0iIzIwMjAyMCIgZmlsbC1vcGFjaXR5PSIuMDUiLz48L2c+PC9zdmc+')] opacity-10"></div>
        
        <div className={`max-w-5xl mx-auto relative ${animatedSections['about-hero'] ? 'animate-fade-in' : 'opacity-0'}`}>
          <div className="text-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-900/30 text-blue-400 text-sm mb-6 border border-blue-800/50">
              <Users className="h-3.5 w-3.5 mr-2" />
              <span>Our Story</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">Promptly</span>
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto">
              We're building the world's most comprehensive library of AI prompts to 
              help people unlock the full potential of artificial intelligence.
            </p>
          </div>
          
          <div className="mt-16 relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-30"></div>
            <div className="relative bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-xl">
              <div className="aspect-w-16 aspect-h-9 w-full h-64 md:h-96 bg-gradient-to-br from-blue-900/40 to-purple-900/40 flex items-center justify-center">
                <div className="text-center px-4">
                  <h2 className="text-3xl font-bold text-white mb-2">Empowering Creativity Through AI</h2>
                  <p className="text-blue-200 max-w-lg mx-auto">
                    Our mission is to help everyone harness the power of AI through better prompts
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section id="mission" className="animate-on-scroll px-4 py-20">
        <div className={`max-w-5xl mx-auto ${animatedSections.mission ? 'animate-fade-in' : 'opacity-0'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-900/30 text-purple-400 text-sm mb-6 border border-purple-800/50">
                <span>Our Mission</span>
              </div>
              <h2 className="text-4xl font-bold text-white mb-6">
                Democratizing <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">AI Access</span> Through Better Prompts
              </h2>
              <p className="text-gray-400 leading-relaxed mb-6">
                We believe that the key to unlocking AI's potential lies in how we communicate with it. Our mission is to make powerful AI tools accessible to everyone by providing the prompts that get the best results.
              </p>
              <p className="text-gray-400 leading-relaxed">
                Whether you're a professional looking to increase productivity, a creator seeking inspiration, or simply curious about what AI can do, we're here to help you find the perfect prompts for your needs.
              </p>
            </div>
            
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative bg-gray-900 border border-gray-800 rounded-xl p-8">
                <div className="space-y-6">
                  {[
                    {
                      icon: <Shield className="h-5 w-5 text-blue-400" />,
                      title: "Accessibility",
                      description: "Making AI tools useful for everyone, regardless of technical background."
                    },
                    {
                      icon: <Globe className="h-5 w-5 text-purple-400" />,
                      title: "Community",
                      description: "Building a global network of prompt creators and AI enthusiasts."
                    },
                    {
                      icon: <BookOpen className="h-5 w-5 text-green-400" />,
                      title: "Education",
                      description: "Teaching best practices for effective communication with AI models."
                    }
                  ].map((value, index) => (
                    <div 
                      key={value.title} 
                      className="flex animate-tile"
                      data-tile-id={`value-${index}`}
                      style={{
                        opacity: isTileVisible(`value-${index}`) ? 1 : 0,
                        transform: isTileVisible(`value-${index}`) ? 'translateX(0)' : 'translateX(20px)',
                        transition: 'opacity 0.5s ease, transform 0.5s ease',
                        transitionDelay: `${index * 150}ms`
                      }}
                    >
                      <div className="flex-shrink-0 bg-gray-800 p-3 rounded-lg mr-4">
                        {value.icon}
                      </div>
                      <div>
                        <h3 className="text-white font-medium mb-1">{value.title}</h3>
                        <p className="text-gray-400 text-sm">{value.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Company History Timeline */}
      <section id="history" className="animate-on-scroll py-20 bg-gray-900/30">
        <div className={`max-w-5xl mx-auto px-4 ${animatedSections.history ? 'animate-fade-in' : 'opacity-0'}`}>
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-900/30 text-blue-400 text-sm mb-6 border border-blue-800/50">
              <BookOpen className="h-3.5 w-3.5 mr-2" />
              <span>Our Journey</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-6">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">Promptly</span> Story
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              From a simple collection of prompts to a thriving community
            </p>
          </div>
          
          <div className="relative pl-8 sm:pl-32 py-6 group">
            {/* Timeline line */}
            <div className="hidden sm:block absolute top-0 left-0 w-px h-full bg-gradient-to-b from-blue-500 to-purple-500"></div>
            
            {/* Timeline events */}
            {milestones.map((milestone, index) => (
              <div 
                key={milestone.year} 
                className="mb-12 last:mb-0 relative animate-tile"
                data-tile-id={`milestone-${index}`}
                style={{
                  opacity: isTileVisible(`milestone-${index}`) ? 1 : 0,
                  transform: isTileVisible(`milestone-${index}`) ? 'translateY(0)' : 'translateY(30px)',
                  transition: 'opacity 0.6s ease, transform 0.6s ease',
                  transitionDelay: `${index * 200}ms`
                }}
              >
                {/* Year marker */}
                <div className="hidden sm:flex absolute left-0 transform -translate-x-1/2 -translate-y-1/2 top-6 items-center justify-center w-16 h-16 rounded-full border-4 border-gray-900 bg-gray-800 text-white font-bold">
                  {milestone.year}
                </div>
                
                {/* Small colorful dot for mobile */}
                <div className="sm:hidden absolute left-0 transform -translate-x-1/2 top-2 w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 ml-0 sm:ml-4 relative">
                  {/* Mobile year display */}
                  <div className="sm:hidden text-blue-500 font-bold mb-2">{milestone.year}</div>
                  
                  <h3 className="text-xl font-bold text-white mb-2">{milestone.title}</h3>
                  <p className="text-gray-400">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Meet the Team Section */}
      <section id="team" className="animate-on-scroll py-20">
        <div className={`max-w-5xl mx-auto px-4 ${animatedSections.team ? 'animate-fade-in' : 'opacity-0'}`}>
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-900/30 text-blue-400 text-sm mb-6 border border-blue-800/50">
              <Users className="h-3.5 w-3.5 mr-2" />
              <span>Our Team</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-6">
              Meet the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">Minds</span> Behind Promptly
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              We're a passionate team of AI enthusiasts, engineers, and designers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {teamMembers.map((member, index) => (
              <div 
                key={member.name} 
                className="animate-tile"
                data-tile-id={`team-${index}`}
                style={{
                  opacity: isTileVisible(`team-${index}`) ? 1 : 0,
                  transform: isTileVisible(`team-${index}`) ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
                  transition: 'opacity 0.7s ease, transform 0.7s ease',
                  transitionDelay: `${index * 200}ms`
                }}
              >
                <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-blue-800 transition-all duration-300 group">
                  <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 p-8 text-center">
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 blur-md opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                      <div className="relative rounded-full overflow-hidden border-2 border-white/20">
                        <img 
                            src={member.image} 
                            alt={`${member.name} profile`} 
                            className="w-24 h-24 object-cover"
                        />
                        </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                    <p className="text-blue-400 mb-4">{member.role}</p>
                    <p className="text-gray-400 text-sm">{member.bio}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-400 mb-6">
              Beyond our core team, we're supported by a network of advisors, investors, and community contributors who share our vision.
            </p>
          </div>
        </div>
      </section>
      
      {/* Values Section */}
      <section id="values" className="animate-on-scroll py-20 bg-gray-900/30">
        <div className={`max-w-5xl mx-auto px-4 ${animatedSections.values ? 'animate-fade-in' : 'opacity-0'}`}>
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-900/30 text-purple-400 text-sm mb-6 border border-purple-800/50">
              <Shield className="h-3.5 w-3.5 mr-2" />
              <span>Our Principles</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-6">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">Values</span> That Drive Us
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: <MessageSquare className="h-6 w-6 text-blue-400" />,
                title: "Open Communication",
                description: "We believe in transparent dialogue with our community and incorporating their feedback into our growth."
              },
              {
                icon: <Users className="h-6 w-6 text-purple-400" />,
                title: "Inclusive Community",
                description: "We're building a diverse platform where everyone's voice and contributions are valued equally."
              },
              {
                icon: <Code className="h-6 w-6 text-green-400" />,
                title: "Technical Excellence",
                description: "We strive for innovation and quality in everything we build, constantly pushing the boundaries."
              },
              {
                icon: <Zap className="h-6 w-6 text-yellow-400" />,
                title: "Empowerment Through Knowledge",
                description: "We're committed to educating users about AI capabilities and responsible usage."
              }
            ].map((value, index) => (
              <div 
                key={value.title} 
                className="animate-tile"
                data-tile-id={`core-value-${index}`}
                style={{
                  opacity: isTileVisible(`core-value-${index}`) ? 1 : 0,
                  transform: isTileVisible(`core-value-${index}`) ? 'translateY(0)' : 'translateY(30px)',
                  transition: 'opacity 0.6s ease, transform 0.6s ease',
                  transitionDelay: `${index * 200}ms`
                }}
              >
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 h-full hover:border-gray-700 transition-all duration-300">
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-3 rounded-lg inline-block mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{value.title}</h3>
                  <p className="text-gray-400">{value.description}</p>
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
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        
        .animation-delay-400 {
          animation-delay: 0.4s;
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
}

export default AboutUs;