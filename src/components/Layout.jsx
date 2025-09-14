import React, { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    setIsVisible(true);
  }, []);

  return (
    <div className={`flex flex-col min-h-screen ${isVisible ? 'animate__animated animate__fadeIn' : ''}`}>
      <div className={isVisible ? 'animate__animated animate__fadeInDown' : ''}>
        <Header setSidebarOpen={setSidebarOpen} />
      </div>
      <div className="flex flex-1">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden animate__animated animate__fadeIn"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}
        
        {/* Sidebar */}
        <div 
          className={`fixed md:relative z-50 md:z-auto inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out w-64 ${isVisible ? 'animate__animated animate__fadeInLeft' : ''}`}
        >
          <Sidebar setSidebarOpen={setSidebarOpen} />
        </div>
        
        {/* Main content */}
        <main className="flex-1 bg-gray-100 min-h-screen w-full md:ml-0">
          <div className={isVisible ? 'animate__animated animate__fadeInUp' : ''}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;