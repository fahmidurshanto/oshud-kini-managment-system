import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://oshud-kini-management-server.onrender.com/api';

// Create an axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to fetch all expenses from backend API (without authentication)
export const getExpenses = async () => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const response = await apiClient.get('/expenses');
    
    console.log('Successfully fetched expenses');
    // Extract the expenses array from the response data
    return response.data.expenses || [];
  } catch (error) {
    console.error('Error fetching expenses:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch expenses');
  }
};

// Function to create a new expense record using backend API (without authentication)
export const createExpense = async (expenseData) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const response = await apiClient.post('/expenses', expenseData);
    
    console.log('Successfully created expense');
    return response.data;
  } catch (error) {
    console.error('Error creating expense:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to create expense');
  }
};

// Function to update an existing expense record using backend API (without authentication)
export const updateExpense = async (expenseId, expenseData) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const response = await apiClient.put(`/expenses/${expenseId}`, expenseData);
    
    console.log('Successfully updated expense');
    return response.data;
  } catch (error) {
    console.error('Error updating expense:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to update expense');
  }
};

// Function to delete an expense record using backend API (without authentication)
export const deleteExpense = async (expenseId) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const response = await apiClient.delete(`/expenses/${expenseId}`);
    
    console.log('Successfully deleted expense');
    return response.data;
  } catch (error) {
    console.error('Error deleting expense:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to delete expense');
  }
};

// Function to get expense statistics from backend API (without authentication)
export const getExpenseStats = async () => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const response = await apiClient.get('/expenses/stats');
    
    console.log('Successfully fetched expense stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching expense stats:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch expense stats');
  }
};