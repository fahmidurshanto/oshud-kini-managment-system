import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as salaryService from '../services/salaryService';

const EditSalary = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [salary, setSalary] = useState({
    month: '',
    totalAmount: '',
    processedDate: '',
    employeeCount: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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
      setErrors({
        ...errors,
        fetch: 'Failed to load salary data. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSalary({
      ...salary,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!salary.month.trim()) {
      newErrors.month = 'Month is required';
    }
    
    if (!salary.totalAmount) {
      newErrors.totalAmount = 'Total amount is required';
    } else if (isNaN(salary.totalAmount) || parseFloat(salary.totalAmount) <= 0) {
      newErrors.totalAmount = 'Total amount must be a positive number';
    }
    
    if (!salary.employeeCount) {
      newErrors.employeeCount = 'Employee count is required';
    } else if (isNaN(salary.employeeCount) || parseInt(salary.employeeCount) <= 0) {
      newErrors.employeeCount = 'Employee count must be a positive number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        setSubmitting(true);
        const salaryData = {
          month: salary.month,
          totalAmount: parseFloat(salary.totalAmount),
          processedDate: salary.processedDate,
          employeeCount: parseInt(salary.employeeCount)
        };
        
        await salaryService.updateSalaryRecord(id, salaryData);
        // Redirect back to salaries list
        navigate('/salaries');
      } catch (err) {
        console.error('Error updating salary record:', err);
        setErrors({
          ...errors,
          submit: 'Failed to update salary record. Please try again.'
        });
      } finally {
        setSubmitting(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Edit Salary Record</h1>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p>Loading salary data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Edit Salary Record</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        {errors.fetch && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {errors.fetch}
            <button 
              onClick={fetchSalary}
              className="ml-4 text-blue-600 hover:underline"
            >
              Retry
            </button>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {errors.submit && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {errors.submit}
            </div>
          )}
          
          <div className="grid grid-cols-1 gap-4 md:gap-6">
            <div>
              <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-1">
                Month <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="month"
                name="month"
                value={salary.month}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.month ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter month (e.g., October 2023)"
              />
              {errors.month && <p className="mt-1 text-sm text-red-600">{errors.month}</p>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label htmlFor="totalAmount" className="block text-sm font-medium text-gray-700 mb-1">
                  Total Amount (৳) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="totalAmount"
                  name="totalAmount"
                  value={salary.totalAmount}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.totalAmount ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter total amount"
                />
                {errors.totalAmount && <p className="mt-1 text-sm text-red-600">{errors.totalAmount}</p>}
              </div>
              
              <div>
                <label htmlFor="employeeCount" className="block text-sm font-medium text-gray-700 mb-1">
                  Employee Count <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="employeeCount"
                  name="employeeCount"
                  value={salary.employeeCount}
                  onChange={handleChange}
                  min="0"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.employeeCount ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter employee count"
                />
                {errors.employeeCount && <p className="mt-1 text-sm text-red-600">{errors.employeeCount}</p>}
              </div>
            </div>
            
            <div>
              <label htmlFor="processedDate" className="block text-sm font-medium text-gray-700 mb-1">
                Processed Date
              </label>
              <input
                type="date"
                id="processedDate"
                name="processedDate"
                value={salary.processedDate ? new Date(salary.processedDate).toISOString().split('T')[0] : ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-6">
            <button
              type="button"
              onClick={() => navigate('/salaries')}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 w-full sm:w-auto"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 w-full sm:w-auto flex items-center justify-center"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </>
              ) : 'Update Salary Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSalary;