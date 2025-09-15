import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://oshud-kini-management-server.onrender.com/api';

// Send OTP to user's email
export const sendOTP = async (email) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/send-otp`, { email });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to send OTP');
  }
};

// Verify OTP
export const verifyOTP = async (email, otp) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/verify-otp`, { email, otp });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to verify OTP');
  }
};