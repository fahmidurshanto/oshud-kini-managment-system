import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://oshud-kini-management-server.onrender.com/api';

// Create an axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to fetch products from backend API (without authentication)
export const getProducts = async () => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const response = await apiClient.get('/products');
    
    console.log('Successfully fetched products');
    // Extract the products array from the response data
    return response.data.products || [];
  } catch (error) {
    console.error('Error fetching products:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch products');
  }
};

// Function to fetch a single product by ID from backend API (without authentication)
export const getProductById = async (id) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const response = await apiClient.get(`/products/${id}`);
    
    console.log('Successfully fetched product');
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error.response?.data || error.message);
    throw new Error(error.response?.data?.message || `Failed to fetch product with id ${id}`);
  }
};

// Function to create a new product using backend API (without authentication)
export const createProduct = async (productData) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const response = await apiClient.post('/products', productData);
    
    console.log('Successfully created product');
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to create product');
  }
};

// Function to update an existing product using backend API (without authentication)
export const updateProduct = async (id, productData) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const response = await apiClient.put(`/products/${id}`, productData);
    
    console.log('Successfully updated product');
    return response.data;
  } catch (error) {
    console.error(`Error updating product with id ${id}:`, error.response?.data || error.message);
    throw new Error(error.response?.data?.message || `Failed to update product with id ${id}`);
  }
};

// Function to delete a product using backend API (without authentication)
export const deleteProduct = async (id) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const response = await apiClient.delete(`/products/${id}`);
    
    console.log('Successfully deleted product');
    return response.data;
  } catch (error) {
    console.error(`Error deleting product with id ${id}:`, error.response?.data || error.message);
    throw new Error(error.response?.data?.message || `Failed to delete product with id ${id}`);
  }
};