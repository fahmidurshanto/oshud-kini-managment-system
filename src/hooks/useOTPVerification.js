import { useState } from 'react';
import { auth } from '../firebase.config';
import { applyActionCode } from 'firebase/auth';

export const useOTPVerification = () => {
  const [verificationStatus, setVerificationStatus] = useState('idle'); // 'idle', 'verifying', 'success', 'error'
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  const verifyOTP = async (otpCode, oobCode) => {
    setVerificationStatus('verifying');
    setError('');

    try {
      if (oobCode) {
        // For email verification links
        await applyActionCode(auth, oobCode);
      } else {
        // For custom OTP verification
        // This would be implemented with a backend service
        // For now, we'll simulate verification
        if (otpCode === '123456') { // This is just for demonstration
          // In a real app, you would verify with your backend
          const user = auth.currentUser;
          if (user) {
            await user.reload();
            // Simulate email verification
            // In a real implementation, this would be handled by your backend
          }
        } else {
          throw new Error('Invalid OTP code');
        }
      }
      
      setVerificationStatus('success');
      return { success: true };
    } catch (err) {
      console.error('OTP verification error:', err);
      setVerificationStatus('error');
      setError(err.message || 'Failed to verify OTP');
      return { success: false, error: err.message };
    }
  };

  const sendOTP = async (email) => {
    try {
      // In a real implementation, you would call your backend to send OTP
      // For Firebase, we send a verification email
      const user = auth.currentUser;
      if (user) {
        await user.sendEmailVerification();
        setTimeLeft(300); // Reset timer
        return { success: true };
      } else {
        throw new Error('No user found');
      }
    } catch (err) {
      console.error('Send OTP error:', err);
      setError(err.message || 'Failed to send OTP');
      return { success: false, error: err.message };
    }
  };

  const resetVerification = () => {
    setVerificationStatus('idle');
    setError('');
  };

  return {
    verificationStatus,
    error,
    timeLeft,
    setTimeLeft,
    verifyOTP,
    sendOTP,
    resetVerification
  };
};