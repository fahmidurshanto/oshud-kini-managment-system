import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

const RedirectIfAuthenticated = ({ children }) => {
  const { currentUser } = useAuth();
  
  // If there's a current user, redirect to dashboard
  if (currentUser) {
    return <Navigate to="/dashboard" />;
  }
  
  // Otherwise, render the children
  return children;
};

export default RedirectIfAuthenticated;