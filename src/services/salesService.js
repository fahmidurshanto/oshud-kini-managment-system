import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://oshud-kini-management-server.onrender.com/api';

// Create an axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to fetch all sales records from backend API (without authentication)
export const getSales = async () => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const response = await apiClient.get('/sales');
    
    console.log('Successfully fetched sales');
    // Extract the sales array from the response data
    return response.data.sales || [];
  } catch (error) {
    console.error('Error fetching sales:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch sales');
  }
};

// Function to create a new sale record using backend API (without authentication)
export const createSale = async (saleData) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const response = await apiClient.post('/sales', saleData);
    
    console.log('Successfully created sale');
    return response.data;
  } catch (error) {
    console.error('Error creating sale:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to create sale');
  }
};

// Function to delete a sale record using backend API (without authentication)
export const deleteSale = async (saleId) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const response = await apiClient.delete(`/sales/${saleId}`);
    
    console.log('Successfully deleted sale');
    return response.data;
  } catch (error) {
    console.error('Error deleting sale:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to delete sale');
  }
};

// Function to get sales statistics from backend API (without authentication)
export const getSalesStats = async () => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const response = await apiClient.get('/sales/stats');
    
    console.log('Successfully fetched sales stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching sales stats:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch sales stats');
  }
};