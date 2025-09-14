import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  
  console.log('ProtectedRoute check. Current user:', currentUser ? currentUser.uid : 'null');
  console.log('Current user object:', currentUser);
  
  // If there's no current user, redirect to login
  if (!currentUser) {
    console.log('No current user, redirecting to login');
    return <Navigate to="/login" />;
  }
  
  console.log('User authenticated, rendering children');
  // Otherwise, render the children
  return children;
};

export default ProtectedRoute;