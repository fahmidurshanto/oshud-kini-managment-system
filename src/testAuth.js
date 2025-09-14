// Simple authentication test script
import { auth } from './firebase.config';

// Test function to verify authentication
export const testAuthentication = async () => {
  console.log('=== Authentication Test ===');
  
  // Check if Firebase auth is initialized
  if (!auth) {
    console.error('❌ Firebase auth is not initialized');
    return false;
  }
  
  console.log('✅ Firebase auth is initialized');
  
  // Check current user
  const user = auth.currentUser;
  if (!user) {
    console.error('❌ No current user found. Please log in first.');
    return false;
  }
  
  console.log('✅ Current user found:', user.email);
  
  try {
    // Test token retrieval directly from Firebase
    console.log('🔄 Testing token retrieval...');
    const token = await user.getIdToken(true); // Force refresh
    
    if (!token || token.trim() === '') {
      console.error('❌ Retrieved empty token');
      return false;
    }
    
    console.log('✅ Token retrieved successfully');
    console.log('📋 Token length:', token.length);
    
    // Log part of the token for verification (but not the full token for security)
    console.log('📋 Token preview:', token.substring(0, 20) + '...');
    
    return true;
  } catch (error) {
    console.error('❌ Error retrieving token:', error.message);
    return false;
  }
};

// Run the test if this script is executed directly
if (typeof window !== 'undefined') {
  // This will run in the browser environment
  window.testAuthentication = testAuthentication;
}