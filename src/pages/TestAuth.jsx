import React from 'react';
import { useAuth } from '../hooks/useAuth';

const TestAuth = () => {
  const { currentUser } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Backend Auth Test</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2">Current User Status</h2>
        {currentUser ? (
          <div>
            <p><strong>User ID:</strong> {currentUser.id}</p>
            <p><strong>Email:</strong> {currentUser.email}</p>
            <p><strong>Name:</strong> {currentUser.name}</p>
            <p><strong>Role:</strong> {currentUser.role || 'Not set'}</p>
          </div>
        ) : (
          <p>No user is currently signed in.</p>
        )}
      </div>
    </div>
  );
};

export default TestAuth;