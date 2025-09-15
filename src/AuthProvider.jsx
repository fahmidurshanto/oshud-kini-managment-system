import React, { useEffect, useState } from 'react';
import { auth } from './firebase.config';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  reload
} from 'firebase/auth';
import Swal from 'sweetalert2';
import { AuthContext } from './contexts/AuthContext';

// Auth Provider Component
const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Register a new user with email and password
  const register = async (email, password, name) => {
    try {
      console.log('Registering user with email:', email);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Update the user's display name
      if (name) {
        await userCredential.user.updateProfile({
          displayName: name
        });
      }
      setCurrentUser({
        ...userCredential.user,
        name: name
      });
      console.log('User registered successfully:', userCredential.user.uid);
      return userCredential.user;
    } catch (error) {
      console.error('Registration error:', error);
      Swal.fire({
        title: 'Error!',
        text: error.message || 'Failed to register',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      throw new Error(error.message || 'Failed to register');
    }
  };

  // Login with email and password
  const login = async (email, password) => {
    try {
      console.log('Logging in user with email:', email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Reload user to get the latest email verification status
      await reload(userCredential.user);
      
      // Check if email is verified
      if (!userCredential.user.emailVerified) {
        // Show SweetAlert instead of throwing error directly
        await Swal.fire({
          title: 'Email Not Verified',
          text: 'Please verify your email before logging in. Check your inbox for the verification email.',
          icon: 'warning',
          confirmButtonText: 'OK'
        });
        throw new Error('Please verify your email before logging in. Check your inbox for the verification email.');
      }
      
      console.log('User logged in successfully:', userCredential.user.uid);
      setCurrentUser(userCredential.user);
      return userCredential.user;
    } catch (error) {
      console.error('Login error:', error);
      Swal.fire({
        title: 'Login Error',
        text: error.message || 'Failed to login',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      throw new Error(error.message || 'Failed to login');
    }
  };

  // Google Sign-In
  const loginWithGoogle = async () => {
    try {
      console.log('Logging in with Google');
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log('Google sign in successful:', result.user.uid);
      setCurrentUser(result.user);
      return result.user;
    } catch (error) {
      console.error('Google sign in error:', error);
      Swal.fire({
        title: 'Google Sign-In Error',
        text: error.message || 'Failed to sign in with Google',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      throw new Error(error.message || 'Failed to sign in with Google');
    }
  };

  // Logout
  const logout = async () => {
    try {
      console.log('Logging out user');
      await signOut(auth);
      setCurrentUser(null);
      console.log('User logged out successfully');
      Swal.fire({
        title: 'Logged Out',
        text: 'You have been successfully logged out.',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    } catch (error) {
      console.error('Logout error:', error);
      Swal.fire({
        title: 'Logout Error',
        text: error.message || 'Failed to logout',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      throw new Error(error.message || 'Failed to logout');
    }
  };

  // Subscribe to user state changes
  useEffect(() => {
    console.log('Setting up auth state listener');
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed. User:', user ? user.uid : 'null');
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Auth context value
  const value = {
    currentUser,
    register,
    login,
    loginWithGoogle,
    logout
  };

  console.log('AuthProvider rendering. Loading:', loading, 'CurrentUser:', currentUser ? currentUser.uid : 'null');

  return (
    <AuthContext.Provider value={value}>
      {/* Show loading state until auth state is determined */}
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-lg">Loading...</div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export default AuthProvider;