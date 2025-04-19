import React from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CheckEmail = () => {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col justify-center py-6 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gray-950">
        <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-[radial-gradient(circle_at_30%_20%,#2563eb,transparent_40%)]"></div>
        <div className="absolute bottom-0 right-0 w-full h-full opacity-20 bg-[radial-gradient(circle_at_70%_80%,#8b5cf6,transparent_40%)]"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-5 bg-[radial-gradient(circle_at_50%_50%,#ffffff,transparent_70%)]"></div>
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBoMzB2MzBIMzB6TTAgMGgzMHYzMEgweiIgZmlsbD0iIzIwMjAyMCIgZmlsbC1vcGFjaXR5PSIuMDUiLz48L2c+PC9zdmc+')] opacity-10"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-900/30 text-blue-400 text-xs mb-3 border border-blue-800/50">
            <span>Verification Required</span>
          </div>
        </div>
        <h2 className="text-center text-3xl font-bold text-white">
          Check Your Email
        </h2>
        <p className="mt-2 text-center text-gray-400 text-sm max-w-md mx-auto">
          We've sent a verification email to your inbox. Please click the link to activate your account.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-gray-900 py-8 px-6 shadow-lg sm:rounded-xl border border-gray-800 backdrop-blur-sm flex flex-col items-center">
            {/* Email icon in circle */}
            <div className="w-16 h-16 rounded-full bg-blue-900/30 flex items-center justify-center mb-4 border border-blue-800/50">
              <Mail className="h-8 w-8 text-blue-400" />
            </div>
            
            <p className="text-gray-300 text-center mb-6">
              If you don't see the email in your inbox, please check your spam folder or request a new verification email.
            </p>
            
            {/* Email client buttons */}
            <div className="w-full space-y-3">
              <a 
                href="https://mail.google.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full flex justify-between items-center py-2 px-4 rounded-md bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700 transition-colors duration-200"
              >
                <span className="flex items-center">
                  <img 
                    src="https://res.cloudinary.com/dcxvvyyvc/image/upload/v1744829043/Static_Images/GmailLogo.png" 
                    alt="Gmail" 
                    className="h-5 w-5 mr-2" 
                  />
                  Open Gmail
                </span>
                <ArrowRight className="h-4 w-4 text-gray-500" />
              </a>
              
              <a 
                href="https://outlook.live.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full flex justify-between items-center py-2 px-4 rounded-md bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700 transition-colors duration-200"
              >
                <span className="flex items-center">
                  <img 
                    src="https://res.cloudinary.com/dcxvvyyvc/image/upload/v1744829045/Static_Images/OutlookLogo.png" 
                    alt="Outlook" 
                    className="h-5 w-5 mr-2" 
                  />
                  Open Outlook
                </span>
                <ArrowRight className="h-4 w-4 text-gray-500" />
              </a>
            </div>
            
            {/* Return to login link */}
            <div className="mt-6 text-center">
              <Link to ="/login" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                Return to login page
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Custom animation styles */}
      <style jsx global>{`
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(5px);
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

export default CheckEmail;