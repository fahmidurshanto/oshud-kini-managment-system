import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { auth } from '../firebase.config';
import { sendEmailVerification } from 'firebase/auth';
import Swal from 'sweetalert2';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [verificationMethod, setVerificationMethod] = useState('link'); // 'link' or 'otp'
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const user = await register(email, password);
      
      // Send email verification
      await sendEmailVerification(user);
      setVerificationSent(true);
      setVerificationEmail(email);
      
      // Show success message with SweetAlert
      Swal.fire({
        title: 'Success!',
        text: 'Account created successfully. Please check your email for verification.',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to register');
      Swal.fire({
        title: 'Error!',
        text: err.message || 'Failed to register',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await sendEmailVerification(user);
        Swal.fire({
          title: 'Success!',
          text: 'Verification email resent successfully. Please check your inbox.',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      }
    } catch (err) {
      setError('Failed to resend verification email: ' + err.message);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to resend verification email: ' + err.message,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  if (verificationSent) {
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
              Verify Your Email
            </h2>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <p className="text-center text-gray-700 mb-4">
              We've sent a verification {verificationMethod === 'link' ? 'link' : 'code'} to:
            </p>
            <p className="text-center font-bold text-blue-600 mb-6">
              {verificationEmail}
            </p>
            <p className="text-center text-gray-700 mb-6">
              {verificationMethod === 'link' 
                ? 'Please check your inbox and click the verification link to complete your registration.' 
                : 'Please check your inbox for the 6-digit code and enter it to complete your registration.'}
            </p>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verification Method:
              </label>
              <div className="flex space-x-4">
                <button
                  onClick={() => setVerificationMethod('link')}
                  className={`flex-1 py-2 px-4 border rounded-md text-sm font-medium ${
                    verificationMethod === 'link'
                      ? 'bg-blue-100 border-blue-500 text-blue-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Email Link
                </button>
                <button
                  onClick={() => setVerificationMethod('otp')}
                  className={`flex-1 py-2 px-4 border rounded-md text-sm font-medium ${
                    verificationMethod === 'otp'
                      ? 'bg-blue-100 border-blue-500 text-blue-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  OTP Code
                </button>
              </div>
            </div>
            
            <button
              onClick={handleResendVerification}
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Resend Verification {verificationMethod === 'link' ? 'Link' : 'Code'}
            </button>
            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setVerificationSent(false);
                  navigate('/login');
                }}
                className="text-blue-600 hover:text-blue-500"
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            Create a new account
          </h2>
        </div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
            <div>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Confirm Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Register'}
            </button>
          </div>
        </form>
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;