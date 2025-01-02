import axios from 'axios';
import getPromptRank from './options';

export const fetchPrompts = async (setPrompts, setError) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('/api/prompts', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setPrompts(response.data);
  } catch (err) {
    console.error('Failed to fetch prompts:', err.response?.data || err.message);
    setError('Unable to load prompts.');
  }
};


export const fetchBookmarkedPrompts = async (setBookmarkedPrompts, setError, showBookmarked) => {
  if (!showBookmarked) return;
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('/api/user/bookmarks', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setBookmarkedPrompts(response.data);
  } catch (err) {
    console.error('Failed to fetch bookmarked prompts:', err.response?.data || err.message);
    setError('Unable to load saved prompts.');
  }
};


export const handleLike = async (promptId, isLiked, setPrompts, setBookmarkedPrompts) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `/api/prompts/${promptId}/like`,
        { isLiked }, // Only send the updated isLiked status
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      // Update prompts with both isLiked and likes
      setPrompts((prev) =>
        prev.map((prompt) =>
          prompt._id === promptId
            ? { ...prompt, isLiked: response.data.isLiked, likes: response.data.likes } // Backend returns both isLiked and likes
            : prompt
        )
      );
        // Update Saved Prompts
      setBookmarkedPrompts((prev) =>
        prev ? prev.map((prompt) =>
          prompt._id === promptId
            ? { ...prompt, isLiked: response.data.isLiked, likes: response.data.likes }
            : prompt
        ) : prev
      );
      
    } catch (err) {
      console.error('Error liking the prompt:', err.response?.data || err.message);
    }
};


export const handleBookmark = async (promptId, isBookmarked, setPrompts, setBookmarkedPrompts) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `/api/prompts/${promptId}/bookmark`,
      { isBookmarked: !isBookmarked },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setPrompts((prev) =>
      prev.map((prompt) =>
        prompt._id === promptId ? { ...prompt, isBookmarked: response.data.isBookmarked } : prompt
      )
    );
    // Update bookmarked prompts
    if (response.data.isBookmarked) {
        // Add to bookmarks if newly bookmarked
        setBookmarkedPrompts((prev) => [
        ...prev,
        { ...prev.find((prompt) => prompt._id === promptId), isBookmarked: true },
        ]);
    } else {
        // Remove from bookmarks if unbookmarked
        setBookmarkedPrompts((prev) =>
        prev.filter((prompt) => prompt._id !== promptId)
        );
    }
    } catch (err) {
        console.error('Error bookmarking the prompt:', err.response?.data || err.message);
    }
};

// Function to fetch top users data
export const fetchTopUsers = async (setTopUsers, setError) => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      // If no token, handle accordingly (for example, redirect to login)
      if (!token) {
        setError('No authorization token found. Please log in.');
        return;
      }
      
      // Make the API request with Authorization header
      const response = await axios.get('/api/user/leaderboard', {
        headers: {
          Authorization: `Bearer ${token}`,  // Include token in Authorization header
        },
      });
      
      console.log(response.data.data);
      const mappedUsers = response.data.data.map(user => ({
        id: user._id,
        name: user.username,
        contributions: user.totalPrompts,
        badge: getPromptRank(user.totalPrompts),  // Assuming getPromptRank is a valid function
        profilePicture: user.profilePicture
      }));

      
      // Store the fetched users data in state
      setTopUsers(mappedUsers); // Adjust this based on the API response structure
      
    } catch (err) {
      console.error('Error fetching top users:', err);
      setError('Failed to load top users'); // Set error state if there's an error
    }
  };