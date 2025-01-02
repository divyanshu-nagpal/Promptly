import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserPrompts from './components/UserPrompts';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/api/user/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Ensure you're sending the auth token
          },
        });
        setUserData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);
  console.log(userData);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  return (
    <div className="profile-page max-w-4xl mx-auto p-6">
      {/* User Details Section */}
      <div className="user-details bg-white shadow-md rounded-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{userData.user.username}</h1>
        <p className="text-gray-600">Email: <span className="font-medium">{userData.user.email}</span></p>
        <p className="text-gray-600">Total Posts: <span className="font-medium">{userData.user.totalPrompts}</span></p>
      </div>

      User Posts Section
      <div className="user-posts">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Posts</h2>
        {userData.user.totalPrompts > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {userData.posts.map((post) => (
              <UserPrompts key={post._id} prompt={post} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">You haven't uploaded any posts yet.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;