import React from 'react';
import { useGetUserProfileQuery } from '../slices/userApiSlice';

const ProfileScreen = () => {
  const { data: userProfile, isLoading, error } = useGetUserProfileQuery();

  if (isLoading) return <p className="text-center text-blue-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray-100 border border-gray-300 rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">User Profile</h1>
      {userProfile && (
        <div className="space-y-4">
          <p className="text-lg text-gray-700">
            <span className="font-medium">Name:</span> {userProfile.name}
          </p>
          <p className="text-lg text-gray-700">
            <span className="font-medium">Email:</span> {userProfile.email}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProfileScreen;
