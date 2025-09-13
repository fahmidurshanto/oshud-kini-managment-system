import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaBox, FaUsers, FaMoneyBillWave, FaSignOutAlt, FaTimes, FaUser } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';

const Sidebar = ({ setSidebarOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const navItems = [
    { path: '/dashboard', icon: <FaTachometerAlt />, label: 'Dashboard' },
    { path: '/products', icon: <FaBox />, label: 'Products' },
    { path: '/employees', icon: <FaUsers />, label: 'Employees' },
    { path: '/salaries', icon: <FaMoneyBillWave />, label: 'Salaries' },
    { path: '/test-auth', icon: <FaUser />, label: 'Test Auth' },
  ];

  return (
    <aside className="bg-gray-800 text-white h-full min-h-screen shadow-lg w-64 flex flex-col">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Navigation</h2>
        <button 
          className="md:hidden text-white"
          onClick={() => setSidebarOpen && setSidebarOpen(false)}
        >
          <FaTimes />
        </button>
      </div>
      <nav className="mt-4 flex-1">
        <ul>
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center px-6 py-3 text-sm font-medium transition-colors duration-200 ${
                  isActive(item.path)
                    ? 'bg-blue-600 text-white border-l-4 border-blue-400'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
                onClick={() => setSidebarOpen && setSidebarOpen(false)}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-700">
        <button 
          onClick={handleLogout}
          className="flex items-center text-gray-300 hover:text-white w-full px-6 py-3 text-sm font-medium"
        >
          <FaSignOutAlt className="mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;