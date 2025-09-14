import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as salaryService from '../services/salaryService';

const ViewSalary = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [salary, setSalary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch salary data on component mount
  useEffect(() => {
    fetchSalary();
  }, [id]);

  const fetchSalary = async () => {
    try {
      setLoading(true);
      const data = await salaryService.getSalaryById(id);
      // The API returns { salary: {...} }, so we need to extract the salary object
      setSalary(data.salary || data);
    } catch (err) {
      console.error('Error fetching salary:', err);
      setError('Failed to load salary data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '0';
    return parseFloat(amount).toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Salary Details</h1>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p>Loading salary data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Salary Details</h1>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-red-500">{error}</p>
          <button 
            onClick={fetchSalary}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Salary Details</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Salary Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Month</label>
                <p className="text-lg font-medium text-gray-900">{salary?.month}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Total Amount</label>
                <p className="text-lg font-medium text-gray-900">৳{formatCurrency(salary?.totalAmount)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Processed Date</label>
                <p className="text-lg font-medium text-gray-900">{formatDate(salary?.processedDate)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Employee Count</label>
                <p className="text-lg font-medium text-gray-900">{salary?.employeeCount}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Additional Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Record ID</label>
                <p className="text-lg font-medium text-gray-900">{salary?._id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Status</label>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Processed
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end mt-8">
          <button
            onClick={() => navigate('/salaries')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
          >
            Back to Salary Records
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewSalary;