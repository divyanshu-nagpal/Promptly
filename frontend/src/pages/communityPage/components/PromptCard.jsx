import React, { useState } from 'react';
import { Heart, Share2, Bookmark, Copy, Tag, MessageSquare } from 'lucide-react';
import { handleBookmark, handleLike } from '../../../utils/utils';
import getPromptRank from '../../../utils/options';

const TimeAgo = ({ timestamp }) => {
  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;

    if (interval > 1) return Math.floor(interval) + ' years ago';
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';
    return Math.floor(seconds) + ' seconds ago';
  };

  return <span className="text-sm text-gray-500">{getTimeAgo(timestamp)}</span>;
};

const PromptCard = ({ prompt, setPrompts, setBookmarkedPrompts }) => {
  const [isICopied, setIsICopied] = useState(false);
  const [isOCopied, setIsOCopied] = useState(false);
  const OUTPUT_SPLIT = '$#iMgUrL#$';
  const [outputText, outputImage] = prompt.output.split(OUTPUT_SPLIT).map((item) => item?.trim());
  const displayName = prompt.user?.username || 'Anonymous';
  const rank = prompt?.user?.totalPrompts ? getPromptRank(prompt.user.totalPrompts) : " "; 

  const [isLiked, setIsLiked] = useState(prompt.isLiked || false);
  const [likes, setLikes] = useState(prompt.likes || 0);
  const [isBookmarked, setIsBookmarked] = useState(prompt.isBookmarked || false);
  
    // Like/Bookmark handlers

    const toggleLike = async () => {
      const updatedLikeStatus = !isLiked;
    
      // Call handleLike with the updated like status and promptId
      await handleLike(prompt._id, updatedLikeStatus, setPrompts, setBookmarkedPrompts);
    
      // Update local state for isLiked and likes
      setIsLiked(updatedLikeStatus);
      setLikes(updatedLikeStatus ? likes + 1 : likes - 1); // Increment or decrement likes based on the new status
    };
    const toggleBookmark = async () => {
      await handleBookmark(prompt._id, isBookmarked, setPrompts, setBookmarkedPrompts); // Call the centralized function
      setIsBookmarked(!isBookmarked); // Update local state
    };
  

  const handleCopy1 = () => {
    navigator.clipboard.writeText(prompt.input);
    setIsICopied(true);
    setTimeout(() => setIsICopied(false), 2000);
  };

  const handleCopy2 = () => {
    navigator.clipboard.writeText(outputText);
    setIsOCopied(true);
    setTimeout(() => setIsOCopied(false), 2000);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/prompt/${prompt._id}`);
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center overflow-hidden">
          <img src={prompt.user?.profilePicture || "https://res.cloudinary.com/djncnauta/image/upload/v1735364671/profile_photo_gaqfit.jpg"} className="h-full w-full object-cover"/>
          </div>
              <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">{displayName}</span>
                      <span className="text-sm text-gray-500">•</span>
                      <TimeAgo timestamp={prompt.createdAt} />
                    </div>
                    <span className="text-sm text-gray-500">{rank}</span>
              </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-medium bg-blue-50 text-blue-600 rounded-full">
              {prompt.aiModel}
            </span>
            <button onClick={handleShare} className="p-1.5 hover:bg-gray-100 rounded-full">
              <Share2 className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={toggleBookmark}
              className={`p-1.5 rounded-full transition-colors ${
                prompt.isBookmarked ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${prompt.isBookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mt-3">{prompt.title}</h2>
      </div>

      <div className="p-6">
        <p className="text-gray-600 mb-4">{prompt.description}</p>
        <h4 className="text-sm font-medium text-gray-600 mb-2">Input Prompt:</h4>
        <div className="bg-gray-50 rounded-lg p-4 mb-4 relative group">
          
          <p className="text-gray-700 font-mono text-sm whitespace-pre-wrap">{prompt.input}</p>
          <button
            onClick={handleCopy1}
            className="absolute top-2 right-2 p-2 rounded-lg bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100"
          >
            <Copy className="w-4 h-4 text-gray-500" />
          </button>
          {isICopied && (
            <div className="absolute top-2 right-12 bg-gray-800 text-white text-xs py-1 px-2 rounded">
              Copied!
            </div>
          )}
        </div>
        <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-600 mb-2">Output:</h4>
          <div className="space-y-3">
            {outputText && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4 relative group">
                <p className="text-gray-700 font-mono text-sm whitespace-pre-wrap">{outputText}</p>
                <button
                  onClick={handleCopy2}
                  className="absolute top-2 right-2 p-2 rounded-lg bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100"
                >
                  <Copy className="w-4 h-4 text-gray-500" />
                </button>
                {isOCopied && (
                  <div className="absolute top-2 right-12 bg-gray-800 text-white text-xs py-1 px-2 rounded">
                    Copied!
                  </div>
                )}
              </div>
            )}
            {outputImage && (
              <img src={outputImage} alt="Output" className="w-full rounded-lg shadow-sm object-cover max-h-64" />
            )}
          </div>
        </div>


      </div>

      <div className="p-4 border-t bg-gray-50">
        <div className="flex justify-between items-center">
          <div className="flex flex-wrap gap-2">
            {prompt.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 bg-white text-gray-600 rounded-full text-sm"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-3">
          <button
            onClick={toggleLike}
            className={`flex items-center space-x-2 transition-colors ${
              prompt.isLiked ? 'text-red-600 hover:text-red-400' : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <Heart className={`w-5 h-5 ${prompt.isLiked ? 'fill-current text-red-500' : ''}`} />
            <span className="text-sm">{prompt.likes || 0}</span>
          </button>
            <button className="flex items-center gap-1 text-gray-600 hover:text-purple-600">
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm">0</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptCard;