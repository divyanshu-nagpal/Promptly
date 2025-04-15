import React from 'react';
import { Calendar, Tag, Cpu } from 'lucide-react';

const UserPrompts = ({ prompt }) => {
  return (
    <div className="h-full flex flex-col justify-between relative group">
      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-purple-600/0 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg blur-sm"></div>
      
      <div className="relative z-10">
        {/* Prompt Title */}
        <h3 className="text-lg font-bold text-white mb-3 line-clamp-2">{prompt.title}</h3>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {prompt.tags.map((tag, index) => (
            <div 
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-full bg-blue-900/30 text-blue-400 text-xs border border-blue-800/50"
            >
              <Tag size={10} className="mr-1" />
              <span>{tag}</span>
            </div>
          ))}
        </div>

        {/* Prompt Content - truncated */}
        <p className="text-gray-400 text-sm mb-4 line-clamp-3">{prompt.input}</p>
      </div>

      {/* Footer Info */}
      <div className="mt-2 pt-3 border-t border-gray-700/50 relative z-10">
        <div className="flex items-center justify-between">
          {/* AI Model */}
          <div className="flex items-center text-xs text-purple-300">
            <Cpu size={12} className="mr-1 text-purple-400" />
            <span>{prompt.aiModel}</span>
          </div>

          {/* Date/Time */}
          <div className="flex items-center text-xs text-gray-500">
            <Calendar size={12} className="mr-1" />
            <span>{new Date(prompt.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPrompts;