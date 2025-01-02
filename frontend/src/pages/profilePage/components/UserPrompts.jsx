import React from 'react';

const UserPrompts = ({ prompt }) => {
  return (
    <div className="prompt-card bg-white shadow-md rounded-lg p-4">
      {/* Prompt Title */}
      <h3 className="text-xl font-bold text-gray-800 mb-2">{prompt.title}</h3>
      
      {/* Tags */}
      <div className="tags mb-2">
        {prompt.tags.map((tag, index) => (
          <span 
            key={index} 
            className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded mr-2">
            #{tag}
          </span>
        ))}
      </div>

      {/* Prompt Content */}
      <p className="text-gray-600 mb-2">{prompt.input}</p>

      {/* AI Model */}
      <p className="text-gray-500 text-sm">Generated using: <span className="font-medium">{prompt.aiModel}</span></p>

      {/* Optional: Date/Time */}
      <p className="text-gray-400 text-xs mt-2">Posted on: {new Date(prompt.createdAt).toLocaleDateString()}</p>
    </div>
  );
};

export default UserPrompts;