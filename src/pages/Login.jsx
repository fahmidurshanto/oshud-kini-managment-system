import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [animated, setAnimated] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    // Trigger animation after component mounts
    const animationTimer = setTimeout(() => {
      setAnimated(true);
    }, 100);
    
    return () => {
      clearTimeout(animationTimer);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className={`max-w-md w-full space-y-8 ${animated ? 'animate__animated animate__fadeIn' : ''}`}>
        <div className={animated ? 'animate__animated animate__fadeInDown' : ''}>
          <div className="flex justify-center">
            <img 
              src="https://i.ibb.co.com/xtkn5SmL/Your-paragraph-text-removebg-preview.png" 
              alt="Oshud Kini Logo" 
              className="h-20 w-auto"
            />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        {error && (
          <div className={`bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative ${animated ? 'animate__animated animate__shakeX' : ''}`}>
            {error}
          </div>
        )}
        <form className={`mt-8 space-y-6 ${animated ? 'animate__animated animate__fadeInUp' : ''}`} onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className={animated ? 'animate__animated animate__fadeIn' : ''} style={{ animationDelay: '0.2s' }}>
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
            <div className={animated ? 'animate__animated animate__fadeIn' : ''} style={{ animationDelay: '0.3s' }}>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div className={animated ? 'animate__animated animate__fadeIn' : ''} style={{ animationDelay: '0.4s' }}>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
        <div className={`text-center ${animated ? 'animate__animated animate__fadeIn' : ''}`} style={{ animationDelay: '0.5s' }}>
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;