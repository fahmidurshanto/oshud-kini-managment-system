import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { auth } from '../firebase.config';
import { applyActionCode } from 'firebase/auth';
import Swal from 'sweetalert2';

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      const oobCode = searchParams.get('oobCode');
      
      if (!oobCode) {
        setVerificationStatus('error');
        setError('Invalid verification link');
        return;
      }

      try {
        // Apply the email verification code
        await applyActionCode(auth, oobCode);
        setVerificationStatus('success');
        
        // Show success message
        Swal.fire({
          title: 'Success!',
          text: 'Your email has been successfully verified!',
          icon: 'success',
          confirmButtonText: 'Continue to Dashboard'
        }).then(() => {
          navigate('/dashboard');
        });
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

    verifyEmail();
  }, [searchParams, navigate]);

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
              <div className="flex justify-center mb-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
              <p className="text-gray-700">
                Verifying your email address...
              </p>
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
                onClick={() => navigate('/register')}
                className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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

export default EmailVerification;