import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://oshud-kini-management-server.onrender.com/api';

// Create an axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to fetch employees from backend API (without authentication)
export const getEmployees = async () => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const response = await apiClient.get('/employees');
    
    console.log('Successfully fetched employees');
    // Extract the employees array from the response data
    return response.data.employees || [];
  } catch (error) {
    console.error('Error fetching employees:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch employees');
  }
};

// Function to fetch a single employee by ID from backend API (without authentication)
export const getEmployeeById = async (id) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const response = await apiClient.get(`/employees/${id}`);
    
    console.log('Successfully fetched employee');
    return response.data;
  } catch (error) {
    console.error(`Error fetching employee with id ${id}:`, error.response?.data || error.message);
    throw new Error(error.response?.data?.message || `Failed to fetch employee with id ${id}`);
  }
};

// Function to create a new employee using backend API (without authentication)
export const createEmployee = async (employeeData) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const response = await apiClient.post('/employees', employeeData);
    
    console.log('Successfully created employee');
    return response.data;
  } catch (error) {
    console.error('Error creating employee:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to create employee');
  }
};

// Function to update an existing employee using backend API (without authentication)
export const updateEmployee = async (id, employeeData) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const response = await apiClient.put(`/employees/${id}`, employeeData);
    
    console.log('Successfully updated employee');
    return response.data;
  } catch (error) {
    console.error(`Error updating employee with id ${id}:`, error.response?.data || error.message);
    throw new Error(error.response?.data?.message || `Failed to update employee with id ${id}`);
  }
};

// Function to delete an employee using backend API (without authentication)
export const deleteEmployee = async (id) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const response = await apiClient.delete(`/employees/${id}`);
    
    console.log('Successfully deleted employee');
    return response.data;
  } catch (error) {
    console.error(`Error deleting employee with id ${id}:`, error.response?.data || error.message);
    throw new Error(error.response?.data?.message || `Failed to delete employee with id ${id}`);
  }
};

// Function to activate an employee using backend API (without authentication)
export const activateEmployee = async (id) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const response = await apiClient.put(`/employees/${id}/activate`);
    
    console.log('Successfully activated employee');
    return response.data;
  } catch (error) {
    console.error(`Error activating employee with id ${id}:`, error.response?.data || error.message);
    throw new Error(error.response?.data?.message || `Failed to activate employee with id ${id}`);
  }
};

// Function to deactivate an employee using backend API (without authentication)
export const deactivateEmployee = async (id) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const response = await apiClient.put(`/employees/${id}/deactivate`);
    
    console.log('Successfully deactivated employee');
    return response.data;
  } catch (error) {
    console.error(`Error deactivating employee with id ${id}:`, error.response?.data || error.message);
    throw new Error(error.response?.data?.message || `Failed to deactivate employee with id ${id}`);
  }
};