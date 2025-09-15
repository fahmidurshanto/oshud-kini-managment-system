import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { auth } from '../firebase.config';
import { applyActionCode, reload } from 'firebase/auth';
import { sendOTP as sendOTPService, verifyOTP } from '../services/otpService';
import Swal from 'sweetalert2';

const OTPVerification = () => {
  const [searchParams] = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [error, setError] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Get email from search params or auth user
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    } else if (auth.currentUser) {
      setEmail(auth.currentUser.email);
    }
  }, [searchParams]);

  useEffect(() => {
    // Timer for OTP expiration
    if (timeLeft > 0 && verificationStatus === 'verifying') {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && verificationStatus === 'verifying') {
      setVerificationStatus('error');
      setError('OTP has expired. Please request a new one.');
    }
  }, [timeLeft, verificationStatus]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text');
    if (/^\d{6}$/.test(paste)) {
      const newOtp = paste.split('');
      setOtp(newOtp);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    
    if (otpCode.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      // For email verification, we still need to use the oobCode from email
      const oobCode = searchParams.get('oobCode');
      
      if (oobCode) {
        // Apply the email verification code
        await applyActionCode(auth, oobCode);
        setVerificationStatus('success');
        Swal.fire({
          title: 'Success!',
          text: 'Email verified successfully!',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          navigate('/dashboard');
        });
      } else {
        // Custom OTP verification
        const result = await verifyOTP(email, otpCode);
        if (result.verified) {
          setVerificationStatus('success');
          Swal.fire({
            title: 'Success!',
            text: 'Email verified successfully!',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            // Reload user to update verification status
            const user = auth.currentUser;
            if (user) {
              reload(user).then(() => {
                navigate('/dashboard');
              });
            } else {
              navigate('/dashboard');
            }
          });
        }
      }
    } catch (err) {
      console.error('Email verification error:', err);
      setVerificationStatus('error');
      setError(err.message || 'Failed to verify email');
      Swal.fire({
        title: 'Error!',
        text: err.message || 'Failed to verify email',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const handleResendOTP = async () => {
    try {
      if (searchParams.get('oobCode')) {
        // Resend Firebase verification email
        const user = auth.currentUser;
        if (user) {
          await user.sendEmailVerification();
          setTimeLeft(300); // Reset timer
          setVerificationStatus('verifying');
          setOtp(['', '', '', '', '', '']);
          setError('');
          Swal.fire({
            title: 'Success!',
            text: 'Verification email resent successfully. Please check your inbox.',
            icon: 'success',
            confirmButtonText: 'OK'
          });
        }
      } else {
        // Send custom OTP
        await sendOTPService(email);
        setTimeLeft(300); // Reset timer
        setVerificationStatus('verifying');
        setOtp(['', '', '', '', '', '']);
        setError('');
        Swal.fire({
          title: 'Success!',
          text: 'OTP sent successfully. Please check your email.',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      }
    } catch (err) {
      setError('Failed to resend verification: ' + err.message);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to resend verification: ' + err.message,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <img 
              src="https://i.ibb.co.com/xtkn5SmL/Your-paragraph-text-removebg-preview.png" 
              alt="Oshud Kini Logo" 
              className="h-20 w-auto"
            />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Email Verification
          </h2>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          {verificationStatus === 'verifying' && (
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Enter Verification Code</h3>
              <p className="text-gray-600 mb-6">
                We've sent a 6-digit code to your email <strong>{email}</strong>. Please enter it below.
              </p>
              
              <form onSubmit={handleSubmit}>
                <div className="flex justify-center space-x-3 mb-6">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      onPaste={handlePaste}
                      className="w-12 h-12 text-center text-2xl border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      autoFocus={index === 0}
                    />
                  ))}
                </div>
                
                <div className="mb-6">
                  <p className="text-sm text-gray-600">
                    Expires in: <span className="font-medium">{formatTime(timeLeft)}</span>
                  </p>
                </div>
                
                {error && (
                  <div className="mb-4 text-red-600 text-sm">
                    {error}
                  </div>
                )}
                
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Verify Email
                </button>
              </form>
              
              <div className="mt-6">
                <button
                  onClick={handleResendOTP}
                  className="text-blue-600 hover:text-blue-500 text-sm"
                >
                  Resend Verification Code
                </button>
              </div>
            </div>
          )}
          
          {verificationStatus === 'success' && (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                Your email has been successfully verified!
              </p>
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Continue to Dashboard
              </button>
            </div>
          )}
          
          {verificationStatus === 'error' && (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                {error || 'Failed to verify your email address.'}
              </p>
              <button
                onClick={handleResendOTP}
                className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mb-4"
              >
                Resend Verification Code
              </button>
              <button
                onClick={() => navigate('/register')}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back to Register
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;