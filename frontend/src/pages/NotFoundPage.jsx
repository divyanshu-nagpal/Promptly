import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="max-w-md text-center">
        <h1 className="text-9xl font-bold text-gray-800">404</h1>
        <p className="text-6xl font-medium text-gray-600">Page Not Found</p>
        <p className="mt-4 text-lg text-gray-500">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8">
          <Link 
            to="/" 
            className="px-6 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;