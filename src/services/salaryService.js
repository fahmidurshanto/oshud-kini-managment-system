import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://oshud-kini-management-server.onrender.com/api';

// Create an axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to fetch salary data from backend API (without authentication)
export const getSalaryData = async () => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const response = await apiClient.get('/salaries');
    
    console.log('Successfully fetched salary data');
    // Extract the salaries array from the response data
    return response.data.salaries || [];
  } catch (error) {
    console.error('Error fetching salary data:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch salary data');
  }
};

// Function to get salary history from backend API (without authentication)
export const getSalaryHistory = async () => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const response = await apiClient.get('/salaries/history');
    
    console.log('Successfully fetched salary history');
    // Extract the salaries array from the response data
    return response.data.salaries || [];
  } catch (error) {
    console.error('Error fetching salary history:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch salary history');
  }
};

// Function to get current month employees for salary processing from backend API (without authentication)
export const getCurrentMonthEmployees = async () => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const response = await apiClient.get('/salaries/current-month');
    
    console.log('Successfully fetched current month employees');
    // Extract the employees array from the response data
    return response.data.employees || [];
  } catch (error) {
    console.error('Error fetching current month employees:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch current month employees');
  }
};

// Function to process salaries using backend API (without authentication)
export const processSalaries = async (salaryData) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const response = await apiClient.post('/salaries/process', salaryData);
    
    console.log('Successfully processed salaries');
    return response.data;
  } catch (error) {
    console.error('Error processing salaries:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to process salaries');
  }
};

// Function to add adjustment (bonus/deduction) for an employee using backend API (without authentication)
export const addAdjustment = async (employeeId, adjustmentData) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const response = await apiClient.post(`/salaries/adjustment/${employeeId}`, adjustmentData);
    
    console.log(`Successfully added adjustment for employee ${employeeId}`);
    return response.data;
  } catch (error) {
    console.error(`Error adding adjustment for employee with id ${employeeId}:`, error.response?.data || error.message);
    throw new Error(error.response?.data?.message || `Failed to add adjustment for employee with id ${employeeId}`);
  }
};

// Function to get a specific salary record by ID from backend API (without authentication)
export const getSalaryById = async (id) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const response = await apiClient.get(`/salaries/${id}`);
    
    console.log('Successfully fetched salary record');
    return response.data;
  } catch (error) {
    console.error(`Error fetching salary record with id ${id}:`, error.response?.data || error.message);
    throw new Error(error.response?.data?.message || `Failed to fetch salary record with id ${id}`);
  }
};

// Function to create a new salary record using backend API (without authentication)
export const createSalaryRecord = async (salaryData) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const response = await apiClient.post('/salaries', salaryData);
    
    console.log('Successfully created salary record');
    return response.data;
  } catch (error) {
    console.error('Error creating salary record:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to create salary record');
  }
};

// Function to update an existing salary record using backend API (without authentication)
export const updateSalaryRecord = async (id, salaryData) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const response = await apiClient.put(`/salaries/${id}`, salaryData);
    
    console.log('Successfully updated salary record');
    return response.data;
  } catch (error) {
    console.error(`Error updating salary record with id ${id}:`, error.response?.data || error.message);
    throw new Error(error.response?.data?.message || `Failed to update salary record with id ${id}`);
  }
};

// Function to delete a salary record using backend API (without authentication)
export const deleteSalaryRecord = async (id) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const response = await apiClient.delete(`/salaries/${id}`);
    
    console.log('Successfully deleted salary record');
    return response.data;
  } catch (error) {
    console.error(`Error deleting salary record with id ${id}:`, error.response?.data || error.message);
    throw new Error(error.response?.data?.message || `Failed to delete salary record with id ${id}`);
  }
};