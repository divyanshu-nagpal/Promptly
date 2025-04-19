// CommentList.jsx
import React, { useState, useEffect } from 'react';
import { Heart, Reply, Flag, MoreHorizontal, X, AlertTriangle } from 'lucide-react';
import api from '../../../lib/api';
import CommentInput from './CommentInput';

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

  return <span className="text-xs text-gray-500">{getTimeAgo(timestamp)}</span>;
};

// Updated ReportModal to match PromptCard's style
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

const CommentList = ({ promptId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportTarget, setReportTarget] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchComments();
  }, [promptId]);

  const fetchComments = async () => {
    try {
      const response = await api.get(`/api/comments/${promptId}`);
      setComments(response.data);
    } catch (err) {
      console.error('Error fetching comments:', err);
      showNotification('Failed to load comments. Please try again later.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleReportSuccess = () => {
    showNotification('Report submitted successfully');
  };

  const handleReportError = (errorMessage) => {
    showNotification(errorMessage, 'error');
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2].map(i => (
          <div key={i} className="flex items-start gap-3">
            <div className="w-8 h-8 bg-gray-800 rounded-full" />
            <div className="flex-1">
              <div className="h-4 bg-gray-800 rounded w-24 mb-2" />
              <div className="h-3 bg-gray-800 rounded w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {comments.map((comment, index) => (
        <div 
          key={comment._id} 
          className="group bg-gray-900/50 p-3 rounded-lg border border-gray-800 transition-all duration-300 hover:border-gray-700"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-start gap-3">
            <img
              src={comment.user.profilePicture || "https://res.cloudinary.com/djncnauta/image/upload/v1735364671/profile_photo_gaqfit.jpg"}
              alt={comment.user.username}
              className="w-8 h-8 rounded-full border border-gray-700"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-200">{comment.user.username}</span>
                <TimeAgo timestamp={comment.createdAt} />
              </div>
              <p className="mt-1 text-gray-400">{comment.text}</p>
              <div className="flex items-center gap-4 mt-2">
                
              </div>
            </div>
            <button
              onClick={() => setReportTarget(comment._id)}
              className="p-1.5 rounded-full hover:bg-gray-800 opacity-0 group-hover:opacity-100 transition-all duration-300"
              title="Report"
            >
              <Flag className="w-4 h-4 text-gray-500 hover:text-red-400" />
            </button>
          </div>
        </div>
      ))}

      {reportTarget && (
        <ReportModal
          targetId={reportTarget}
          targetType="comment"
          onClose={() => setReportTarget(null)}
          onSuccess={handleReportSuccess}
          onError={handleReportError}
        />
      )}

      {notification && (
        <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 ${
          notification.type === 'error' 
            ? 'bg-gradient-to-r from-red-600 to-red-500 border-red-500/50' 
            : 'bg-gradient-to-r from-green-600 to-emerald-600 border-green-500/50'
          } text-white px-5 py-3 rounded-lg shadow-xl z-50 border animate-fade-in flex items-center gap-2`}>
          <div className={`h-2 w-2 ${notification.type === 'error' ? 'bg-red-300' : 'bg-green-300'} rounded-full`}></div>
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default CommentList;