import React, { useState, useEffect } from "react";
import axios from "axios";
import { X, CheckCircle, Calendar, Clock, User, Plus, ChevronRight, Link } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EventPage = () => {
  const navigate = useNavigate();
  const [eventDetails, setEventDetails] = useState({
    title: "",
    eventDate: "",
    eventTime: "",
    organizer: "",
    registrationLink: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [animatedSections, setAnimatedSections] = useState({});

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
    
    const sections = document.querySelectorAll('.animate-on-scroll');
    sections.forEach(section => {
      observer.observe(section);
    });

    return () => {
      sections.forEach(section => {
        observer.unobserve(section);
      });
    };
  }, []);

  // Set up redirection after success
  useEffect(() => {
    let redirectTimer;
    if (success) {
      redirectTimer = setTimeout(() => {
        navigate("/community");
      }, 3000);
    }
    
    return () => {
      if (redirectTimer) clearTimeout(redirectTimer);
    };
  }, [success, navigate]);

  const handleChange = (e) => {
    setEventDetails({
      ...eventDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      // For testing purposes, simulate a successful API call
      // In a real application, you'd use axios like this:
      
      const response = await axios.post(
        "/api/events/add",
        eventDetails,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      
      
      // Simulating a successful response
      setTimeout(() => {
        setSuccess(true);
        setLoading(false);
        setEventDetails({
          title: "",
          eventDate: "",
          eventTime: "",
          organizer: "",
          registrationLink: "",
        });
        // Redirect happens in useEffect
      }, 1000);
      
    } catch (err) {
      console.error("Error creating event:", err);
      setError("Failed to create event. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200">
      {/* Hero Section with animated gradient background */}
      <section id="event-form-hero" className="animate-on-scroll relative pt-16 md:pt-24 pb-12 md:pb-20 px-4 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gray-950">
          <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-[radial-gradient(circle_at_30%_20%,#2563eb,transparent_40%)]"></div>
          <div className="absolute bottom-0 right-0 w-full h-full opacity-20 bg-[radial-gradient(circle_at_70%_80%,#8b5cf6,transparent_40%)]"></div>
        </div>
        
        <div className={`max-w-5xl mx-auto relative ${animatedSections['event-form-hero'] ? 'animate-fade-in' : 'opacity-0'}`}>
          <div className="text-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-900/30 text-blue-400 text-sm mb-4 md:mb-6 border border-blue-800/50">
              <Calendar className="h-3.5 w-3.5 mr-2" />
              <span>Create Event</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 md:mb-6">
              Plan Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">Community Event</span>
            </h1>
            <p className="text-base md:text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto">
              Share your knowledge, connect with others, and grow the AI prompt community together.
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section id="event-form" className="animate-on-scroll relative px-4 pb-16 md:pb-20">
        <div className={`max-w-3xl mx-auto relative z-10 ${animatedSections['event-form'] ? 'animate-fade-in' : 'opacity-0'}`}>
          {/* Success Message */}
          {success && (
            <div className="bg-green-900/30 border border-green-500 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <p className="text-green-400 font-medium">
                  Event created successfully!
                </p>
              </div>
              {/* Progress bar for redirection countdown */}
              <div className="mt-3 w-full bg-gray-800 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full animate-progress"></div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/30 border border-red-500 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <X className="h-5 w-5 text-red-500 mr-3" />
                <p className="text-red-400 font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Form Card with Glow Effect */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-30 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-gray-900 border border-gray-800 rounded-xl p-4 sm:p-6 md:p-8 shadow-xl">
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                {/* Title Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 flex flex-wrap sm:flex-nowrap items-center">
                    <span className="bg-gradient-to-r from-blue-800 to-blue-900 p-2 rounded-lg mr-3 mb-2 sm:mb-0">
                      <Plus className="h-4 w-4 text-blue-300" />
                    </span>
                    Event Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={eventDetails.title}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-gray-200 bg-gray-800/50 rounded-lg border border-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-500/20 focus:outline-none transition-all duration-200"
                    placeholder="Give your event a catchy title"
                    required
                    disabled={success}
                  />
                </div>

                {/* Date Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 flex flex-wrap sm:flex-nowrap items-center">
                    <span className="bg-gradient-to-r from-purple-800 to-purple-900 p-2 rounded-lg mr-3 mb-2 sm:mb-0">
                      <Calendar className="h-4 w-4 text-purple-300" />
                    </span>
                    Event Date
                  </label>
                  <input
                    type="date"
                    name="eventDate"
                    value={eventDetails.eventDate}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-gray-200 bg-gray-800/50 rounded-lg border border-gray-700 focus:border-purple-500 focus:ring focus:ring-purple-500/20 focus:outline-none transition-all duration-200"
                    required
                    disabled={success}
                  />
                </div>

                {/* Time Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 flex flex-wrap sm:flex-nowrap items-center">
                    <span className="bg-gradient-to-r from-green-800 to-green-900 p-2 rounded-lg mr-3 mb-2 sm:mb-0">
                      <Clock className="h-4 w-4 text-green-300" />
                    </span>
                    Event Time
                  </label>
                  <input
                    type="time"
                    name="eventTime"
                    value={eventDetails.eventTime}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-gray-200 bg-gray-800/50 rounded-lg border border-gray-700 focus:border-green-500 focus:ring focus:ring-green-500/20 focus:outline-none transition-all duration-200"
                    required
                    disabled={success}
                  />
                </div>

                {/* Organizer Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 flex flex-wrap sm:flex-nowrap items-center">
                    <span className="bg-gradient-to-r from-yellow-800 to-yellow-900 p-2 rounded-lg mr-3 mb-2 sm:mb-0">
                      <User className="h-4 w-4 text-yellow-300" />
                    </span>
                    Organizer Name
                  </label>
                  <input
                    type="text"
                    name="organizer"
                    value={eventDetails.organizer}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-gray-200 bg-gray-800/50 rounded-lg border border-gray-700 focus:border-yellow-500 focus:ring focus:ring-yellow-500/20 focus:outline-none transition-all duration-200"
                    placeholder="Who's organizing this event?"
                    required
                    disabled={success}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 flex flex-wrap sm:flex-nowrap items-center">
                    <span className="bg-gradient-to-r from-pink-800 to-pink-900 p-2 rounded-lg mr-3 mb-2 sm:mb-0">
                      <Link className="h-4 w-4 text-pink-300" />
                    </span>
                    Registration Link
                  </label>
                  <input
                    type="url"
                    name="registrationLink"
                    value={eventDetails.registrationLink}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-gray-200 bg-gray-800/50 rounded-lg border border-gray-700 focus:border-pink-500 focus:ring focus:ring-pink-500/20 focus:outline-none transition-all duration-200"
                    placeholder="https://example.com/register"
                    required
                    disabled={success}
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2 md:pt-4">
                  <button
                    type="submit"
                    disabled={loading || success}
                    className={`w-full py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg text-white font-medium flex items-center justify-center transition-all duration-300 ${
                      loading || success
                        ? "bg-gray-700 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transform hover:scale-[1.02]"
                    }`}
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : success ? (
                      <span className="flex items-center">
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Event Created
                      </span>
                    ) : (
                      <span className="flex items-center">
                        Create Event
                        <ChevronRight className="ml-2 h-5 w-5" />
                      </span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Custom styles for animations */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        .animate-progress {
          animation: progress 3s linear forwards;
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
        
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default EventPage;