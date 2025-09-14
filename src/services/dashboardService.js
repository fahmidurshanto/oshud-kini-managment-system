import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://oshud-kini-management-server.onrender.com/api';

// Create an axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to fetch dashboard data from backend API (without authentication)
export const getDashboardData = async () => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const response = await apiClient.get('/dashboard');
    
    console.log('Successfully fetched dashboard data');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch dashboard data');
  }
};

// Function to fetch dashboard stats (for backward compatibility)
export const getDashboardStats = async () => {
  try {
    const dashboardData = await getDashboardData();
    return dashboardData.stats;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch dashboard stats');
  }
};