import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import EmailVerificationRequired from './EmailVerificationRequired';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  // If no user is logged in, redirect to login page
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user is logged in but email is not verified, show verification required page
  if (currentUser && !currentUser.emailVerified) {
    return <EmailVerificationRequired />;
  }

  // If user is logged in and email is verified, allow access to protected routes
  return children;
};

export default ProtectedRoute;