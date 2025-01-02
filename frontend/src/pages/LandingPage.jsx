import React from 'react';
import { Search, Share2, Star, Users } from 'lucide-react';

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Find the Perfect Prompt for Your AI Needs
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Promptable is a community-driven platform where you can discover, share, and optimize AI prompts for ChatGPT, DALL-E, Midjourney, and more.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="flex items-center bg-white rounded-full shadow-sm border p-2">
              <Search className="h-5 w-5 text-gray-400 ml-3" />
              <input
                type="text"
                placeholder="Search for prompts..."
                className="w-full px-4 py-2 focus:outline-none text-gray-800"
              />
              <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors">
                Search
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex justify-center space-x-12 mb-16">
            {[
              { label: 'Active Users', value: '10K+' },
              { label: 'Prompts Shared', value: '50K+' },
              { label: 'Success Rate', value: '95%' }
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-blue-600">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose Promptable?
          </h2>
          
          <div className="grid grid-cols-3 gap-8">
            {[
              {
                icon: <Search className="h-8 w-8 text-blue-600" />,
                title: 'Find Perfect Prompts',
                description: 'Search through thousands of curated prompts tested by our community.'
              },
              {
                icon: <Share2 className="h-8 w-8 text-blue-600" />,
                title: 'Share Your Expertise',
                description: 'Contribute your successful prompts and help others achieve better results.'
              },
              {
                icon: <Star className="h-8 w-8 text-blue-600" />,
                title: 'Quality Assured',
                description: 'All prompts are rated and reviewed by the community for effectiveness.'
              }
            ].map((feature) => (
              <div key={feature.title} className="text-center p-6 rounded-lg bg-gray-50">
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Find Your Perfect Prompt?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join our community today and start discovering the best prompts for your AI projects.
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
            Get Started — It's Free
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

