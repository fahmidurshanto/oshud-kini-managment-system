import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  
  // If there's no current user, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  // Otherwise, render the children
  return children;
};

export default ProtectedRoute;