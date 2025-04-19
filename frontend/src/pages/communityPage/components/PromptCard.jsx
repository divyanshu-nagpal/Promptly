import React, { useState } from 'react';
import { Heart, Share2, Bookmark, Copy, Tag, MessageSquare, Flag, X, AlertTriangle } from 'lucide-react';
import CommentList from './CommentList';
import CommentInput from './CommentInput';
import { handleBookmark, handleLike } from '../../../utils/utils';
import getPromptRank from '../../../utils/options';
import api from "../lib/api";

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

  return <span className="text-sm text-gray-400">{getTimeAgo(timestamp)}</span>;
};

// Enhanced ReportModal Component with notification improvements
const ReportModal = ({ targetId, targetType, onClose, onSuccess, onError }) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const reasons = [
    'Spam or misleading',
    'Hate speech or symbols',
    'Harassment or bullying',
    'Violence or dangerous content',
    'Sexually explicit material',
    'Other'
  ];

  const handleSubmit = async () => {
    if (!reason.trim()) return;
    setLoading(true);
    try {
      await api.post(
        '/api/reports/submit',
        {
          targetId,
          targetType,
          reason,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      onError(`Failed to report ${targetType}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-20 z-50 animate-fade-in overflow-y-auto">
      <div className="max-w-md w-full mx-4 mb-20">
        <div className="bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
          {/* Header with gradient background */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4 border-b border-gray-700 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center">
              <AlertTriangle className="h-5 w-5 text-amber-400 mr-2" />
              Report {targetType === 'comment' ? 'Comment' : 'Prompt'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1.5 rounded-full hover:bg-gray-700/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
         
          {/* Content area */}
          <div className="p-6">
            <p className="text-gray-300 mb-5 text-sm">
              Please select a reason for reporting this {targetType}. Your report will be reviewed by our moderation team.
            </p>
           
            <div className="space-y-2 mb-6">
              {reasons.map((r) => (
                <label
                  key={r}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer border ${reason === r ? 'border-amber-500/50 bg-amber-500/5' : 'border-gray-700 hover:bg-gray-800'}`}
                >
                  <input
                    type="radio"
                    value={r}
                    checked={reason === r}
                    onChange={(e) => setReason(e.target.value)}
                    className="form-radio text-amber-500 h-4 w-4"
                  />
                  <span className={`text-sm ${reason === r ? 'text-amber-100' : 'text-gray-300'}`}>{r}</span>
                </label>
              ))}
            </div>
           
            {/* Footer with action buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!reason || loading}
                className="px-5 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-500 disabled:opacity-50 transition-colors shadow-md flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>Submit Report</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PromptCard = ({ prompt, setPrompts, setBookmarkedPrompts, darkMode = true }) => {
  const [isICopied, setIsICopied] = useState(false);
  const [isOCopied, setIsOCopied] = useState(false);
  const OUTPUT_SPLIT = '$#iMgUrL#$';
  const [outputText, outputImage] = prompt.output.split(OUTPUT_SPLIT).map((item) => item?.trim());
  const displayName = prompt.user?.username || 'Anonymous';
  const rank = prompt?.user?.totalPrompts ? getPromptRank(prompt.user.totalPrompts) : " ";

  const [isLiked, setIsLiked] = useState(prompt.isLiked || false);
  const [likes, setLikes] = useState(prompt.likes || 0);
  const [isBookmarked, setIsBookmarked] = useState(prompt.isBookmarked || false);
  const [commentCount, setCommentCount] = useState(prompt.commentsCount || 0);
  const [showComments, setShowComments] = useState(false);

  const [reportTarget, setReportTarget] = useState(null);
  const [notification, setNotification] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);

  const handleNewComment = () => {
    setCommentCount(commentCount + 1);
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const toggleLike = async () => {
    const updatedLikeStatus = !isLiked;
    await handleLike(prompt._id, updatedLikeStatus, setPrompts, setBookmarkedPrompts);
    setIsLiked(updatedLikeStatus);
    setLikes(updatedLikeStatus ? likes + 1 : likes - 1);
  };

  const toggleBookmark = async () => {
    await handleBookmark(prompt._id, isBookmarked, setPrompts, setBookmarkedPrompts);
    setIsBookmarked(!isBookmarked);
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

  // Notification system for all types of notifications
  const showNotification = (message, type = 'success') => {
    let bgGradient, borderColor, dotColor;
   
    switch(type) {
      case 'success':
        bgGradient = 'from-green-600 to-emerald-600';
        borderColor = 'border-green-500/50';
        dotColor = 'bg-green-300';
        break;
      case 'error':
        bgGradient = 'from-red-600 to-red-500';
        borderColor = 'border-red-500/50';
        dotColor = 'bg-red-300';
        break;
      case 'info':
        bgGradient = 'from-blue-600 to-indigo-600';
        borderColor = 'border-blue-500/50';
        dotColor = 'bg-blue-300';
        break;
      default:
        bgGradient = 'from-blue-600 to-indigo-600';
        borderColor = 'border-blue-500/50';
        dotColor = 'bg-blue-300';
    }
   
    setNotification({ message, bgGradient, borderColor, dotColor });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleShare = async () => {
    try {
      // Create a well-structured format for sharing
      const formattedText = `
📋 ${prompt.title}
${prompt.description ? `\n${prompt.description}` : ''}

📥 Input Prompt:
${prompt.input}

📤 Output:
${outputText || ''}


`.trim();

      await navigator.clipboard.writeText(formattedText);
      showNotification('Prompt copied to clipboard', 'info');
    } catch (err) {
      console.error('Failed to copy:', err);
      showNotification('Failed to copy to clipboard', 'error');
    }
  };

  const handleReportSuccess = () => {
    showNotification('Report submitted successfully', 'success');
  };
 
  const handleReportError = (errorMessage) => {
    showNotification(errorMessage, 'error');
  };
 
  // Functions for image modal
  const openImageModal = () => {
    if (outputImage) {
      setShowImageModal(true);
      document.body.style.overflow = 'hidden';
    }
  };
 
  const closeImageModal = () => {
    setShowImageModal(false);
    document.body.style.overflow = 'auto';
  };
 
  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden shadow-xl border border-gray-800 transition-all duration-300 hover:shadow-blue-900/20 hover:shadow-lg">
      <div className="border-b border-gray-800/80">
        <div className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full overflow-hidden ring-2 ring-blue-500/20 shadow-lg">
                <img
                  src={prompt.user?.profilePicture || "https://res.cloudinary.com/djncnauta/image/upload/v1735364671/profile_photo_gaqfit.jpg"}
                  className="h-full w-full object-cover transition-transform hover:scale-110 duration-300"
                  alt={displayName}
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white text-lg">{displayName}</span>
                  <span className="text-sm text-gray-400">•</span>
                  <TimeAgo timestamp={prompt.createdAt} />
                </div>
                <span className="text-sm text-blue-400/90 font-medium">{rank}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1.5 text-xs font-medium bg-blue-900/40 text-blue-300 rounded-full border border-blue-700/50 shadow-sm shadow-blue-500/10">
                {prompt.aiModel}
              </span>
              <div className="flex bg-gray-800/50 rounded-full p-1 backdrop-blur-sm border border-gray-700/50">
                <button
                  onClick={handleShare}
                  className="p-1.5 hover:bg-gray-700/70 rounded-full transition-colors group"
                  title="Share"
                >
                  <Share2 className="w-4 h-4 text-gray-400 group-hover:text-blue-300 transition-colors" />
                </button>
                <button
                  onClick={toggleBookmark}
                  className={`p-1.5 rounded-full transition-colors group`}
                  title="Bookmark"
                >
                  <Bookmark
                    className={`w-4 h-4 transition-colors ${isBookmarked ? 'fill-blue-400 text-blue-400' : 'text-gray-400 group-hover:text-blue-300'}`}
                  />
                </button>
                <button
                  onClick={() => setReportTarget(prompt._id)}
                  className="p-1.5 hover:bg-gray-700/70 rounded-full transition-colors group"
                  title="Report"
                >
                  <Flag className="w-4 h-4 text-gray-400 group-hover:text-red-400 transition-colors" />
                </button>
              </div>
            </div>
          </div>
          <h2 className="text-xl font-bold text-white mt-4 tracking-tight">{prompt.title}</h2>
        </div>
      </div>

      <div className="p-6 bg-gradient-to-b from-gray-900 to-gray-950">
        <p className="text-gray-300 mb-6 leading-relaxed">{prompt.description}</p>
       
        <div className="space-y-6">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
              <span className="bg-blue-500/10 px-2 py-1 rounded text-blue-300 mr-2 text-xs uppercase tracking-wider">Input Prompt</span>
            </h4>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg blur opacity-20 group-hover:opacity-70 transition duration-500"></div>
              <div className="relative bg-gray-900/90 rounded-lg p-5 mb-4 border border-gray-800 shadow-lg">
                <p className="text-gray-300 font-mono text-sm whitespace-pre-wrap leading-relaxed">{prompt.input}</p>
                <button
                  onClick={handleCopy1}
                  className="absolute top-3 right-3 p-2 rounded-lg bg-gray-800/90 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-900/70 hover:shadow-md"
                >
                  <Copy className="w-4 h-4 text-gray-300" />
                </button>
                {isICopied && (
                  <div className="absolute top-3 right-14 bg-blue-800/80 text-blue-200 text-xs py-1.5 px-3 rounded shadow-lg animate-fade-in">
                    Copied!
                  </div>
                )}
              </div>
            </div>
          </div>
         
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
              <span className="bg-purple-500/10 px-2 py-1 rounded text-purple-300 mr-2 text-xs uppercase tracking-wider">Output</span>
            </h4>
            <div className="space-y-4">
              {outputText && (
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-700 rounded-lg blur opacity-20 group-hover:opacity-70 transition duration-500"></div>
                  <div className="relative bg-gray-900/90 rounded-lg p-5 mb-4 border border-gray-800 shadow-lg">
                    <p className="text-gray-300 font-mono text-sm whitespace-pre-wrap leading-relaxed">{outputText}</p>
                    <button
                      onClick={handleCopy2}
                      className="absolute top-3 right-3 p-2 rounded-lg bg-gray-800/90 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-purple-900/70 hover:shadow-md"
                    >
                      <Copy className="w-4 h-4 text-gray-300" />
                    </button>
                    {isOCopied && (
                      <div className="absolute top-3 right-14 bg-purple-800/80 text-purple-200 text-xs py-1.5 px-3 rounded shadow-lg animate-fade-in">
                        Copied!
                      </div>
                    )}
                  </div>
                </div>
              )}
             
              {outputImage && (
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
                  <div
                    className="relative rounded-lg overflow-hidden border border-gray-800 shadow-lg cursor-pointer"
                    onClick={openImageModal}
                  >
                    <img
                      src={outputImage}
                      alt="Output"
                      className="w-full object-cover max-h-80 transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="bg-black/50 text-white text-sm py-2 px-4 rounded-full backdrop-blur-sm border border-white/20">
                        Click to enlarge
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 border-t border-gray-800 bg-gray-900/80 backdrop-blur-sm">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex flex-wrap gap-2">
            {prompt.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 bg-gray-800/80 text-gray-300 rounded-full text-sm border border-gray-700/50 hover:bg-gray-700/50 transition-colors cursor-pointer shadow-sm"
              >
                <Tag className="w-3 h-3 text-blue-400" />
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleLike}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${
                isLiked
                  ? 'text-red-400 bg-red-500/10 border border-red-500/30'
                  : 'text-gray-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current text-red-400' : ''} transition-all`} />
              <span className="text-sm font-medium">{likes}</span>
            </button>
            <button
              onClick={toggleComments}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${
                showComments
                  ? 'text-purple-400 bg-purple-500/10 border border-purple-500/30'
                  : 'text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 border border-transparent hover:border-purple-500/20'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm font-medium">{commentCount}</span>
            </button>
          </div>
        </div>
      </div>

      {showComments ? (
        <div className="p-5 bg-gray-950/50 border-t border-gray-800">
          <CommentList promptId={prompt._id} darkMode={true} />
          <div className="mt-4">
            <CommentInput promptId={prompt._id} onCommentAdded={handleNewComment} darkMode={true} />
          </div>
        </div>
      ) : (
        <div className="p-5 bg-gray-950/50 border-t border-gray-800">
          <CommentInput promptId={prompt._id} onCommentAdded={handleNewComment} darkMode={true} />
        </div>
      )}

      {/* Updated Report Modal */}
      {reportTarget && (
        <ReportModal
          targetId={reportTarget}
          targetType="prompt"
          onClose={() => setReportTarget(null)}
          onSuccess={handleReportSuccess}
          onError={handleReportError}
        />
      )}

      {/* Image Modal */}
      {showImageModal && outputImage && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in"
          onClick={closeImageModal}
        >
          <div className="relative max-w-4xl w-full mx-auto max-h-screen flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-10 backdrop-blur-sm border border-white/20 transition-all hover:scale-110"
            >
              <X className="w-5 h-5" />
            </button>
           
            <div className="overflow-auto max-h-[90vh] rounded-lg border border-gray-700/50 shadow-2xl relative">
              <img
                src={outputImage}
                alt="Output"
                className="max-w-full h-auto object-contain"
              />
            </div>
           
            <div className="mt-4 text-gray-300 text-sm bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">
              Click anywhere outside the image to close
            </div>
          </div>
        </div>
      )}

      {/* Unified Notification System */}
      {notification && (
        <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r ${notification.bgGradient} text-white px-5 py-3 rounded-lg shadow-xl z-50 border ${notification.borderColor} animate-fade-in flex items-center gap-2`}>
          <div className={`h-2 w-2 ${notification.dotColor} rounded-full`}></div>
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default PromptCard;