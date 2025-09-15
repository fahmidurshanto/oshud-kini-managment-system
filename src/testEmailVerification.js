// Test function for email verification
export const testEmailVerification = async (user) => {
  try {
    // This would be called after registration to send verification email
    console.log('Testing email verification for user:', user.email);
    return { success: true, message: 'Verification email would be sent' };
  } catch (error) {
    console.error('Email verification test failed:', error);
    return { success: false, message: error.message };
  }
};