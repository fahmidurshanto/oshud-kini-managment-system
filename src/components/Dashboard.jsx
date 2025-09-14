import React, { useState, useEffect } from 'react';
import * as dashboardService from '../services/dashboardService';
import { FaBox, FaUsers, FaDollarSign, FaExclamationTriangle, FaChartLine, FaShoppingCart, FaReceipt } from 'react-icons/fa';
import ApiTest from './ApiTest';
import TestSales from './TestSales'; // Add missing import

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    stats: [],
    recentActivity: [],
    additionalData: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data on component mount
  useEffect(() => {
    fetchData();
    
    // Listen for saleDeleted and saleCreated events to refresh data
    const handleSaleDeleted = () => {
      fetchData();
    };
    
    const handleSaleCreated = () => {
      fetchData();
    };
    
    window.addEventListener('saleDeleted', handleSaleDeleted);
    window.addEventListener('saleCreated', handleSaleCreated);
    
    // Cleanup event listeners
    return () => {
      window.removeEventListener('saleDeleted', handleSaleDeleted);
      window.removeEventListener('saleCreated', handleSaleCreated);
    };
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('Fetching dashboard data...');
      
      // Use the correct function that returns both stats and recent activity
      const data = await dashboardService.getDashboardData();
      console.log('Dashboard data received:', data);
      
      setDashboardData({
        stats: data.stats || [],
        recentActivity: data.recentActivity || [],
        additionalData: data.additionalData || {}
      });
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to fetch dashboard data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to render icons based on activity type
  const renderActivityIcon = (activity) => {
    // Since we're now using string icons from the backend, we need to map them to React components
    switch (activity.icon) {
      case '📦':
        return <FaBox />;
      case '👤':
        return <FaUsers />;
      case '💰':
        return <FaDollarSign />;
      case '📈':
        return <FaChartLine />;
      case '🛒':
        return <FaShoppingCart />;
      case '📋':
        return <FaReceipt />;
      default:
        return <FaExclamationTriangle />;
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-red-500">{error}</p>
          <button 
            onClick={fetchData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Retry
          </button>
          {/* Add API test component for debugging */}
          <div className="mt-6">
            <ApiTest />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
      
      {/* Add API test component for debugging */}
      <div className="mb-6">
        <ApiTest />
      </div>
      
      {/* Add Test Sales component */}
      <div className="mb-6">
        <TestSales />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        {dashboardData.stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <div className="flex items-center">
              <div className={`${stat.color} rounded-full p-3 text-white text-xl mr-4`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <p className="text-xl md:text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional charts or data visualization */}
      {dashboardData.additionalData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Product Categories Chart */}
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Product Categories</h2>
            <div className="space-y-3">
              {dashboardData.additionalData.productCategories?.map((category, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{category.name}</span>
                    <span className="text-sm font-medium text-gray-700">{category.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(category.count / Math.max(...dashboardData.additionalData.productCategories.map(c => c.count))) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Employee Distribution Chart */}
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Employee Distribution</h2>
            <div className="space-y-3">
              {dashboardData.additionalData.employeeDistribution?.map((dept, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{dept.department}</span>
                    <span className="text-sm font-medium text-gray-700">{dept.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${(dept.count / Math.max(...dashboardData.additionalData.employeeDistribution.map(d => d.count))) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {dashboardData.recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center border-b pb-3 last:border-b-0 last:pb-0">
              <div className={`${activity.iconColor} rounded-full p-2 mr-3`}>
                <span className={activity.iconTextColor}>
                  {renderActivityIcon(activity)}
                </span>
              </div>
              <div>
                <p className="font-medium">{activity.title}</p>
                <p className="text-sm text-gray-500">{activity.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;