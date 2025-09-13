import React from 'react';
import { FaUserCircle, FaBars } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Header = ({ setSidebarOpen }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold">CompanyManager Lite</h1>
        </div>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden text-white focus:outline-none"
          onClick={() => setSidebarOpen(true)}
        >
          <FaBars size={24} />
        </button>
        
        <div className="hidden md:flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <FaUserCircle className="text-2xl" />
            <span>{currentUser ? currentUser.displayName || currentUser.email : 'Admin'}</span>
          </div>
          <button 
            onClick={handleLogout}
            className="bg-white text-blue-600 px-3 py-1 rounded-md text-sm font-medium hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;