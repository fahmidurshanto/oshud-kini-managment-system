import React, { useState, useEffect } from 'react';
import { FaPlus, FaHistory, FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import * as salaryService from '../services/salaryService';
import Swal from 'sweetalert2';

const SalaryManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [salaryHistory, setSalaryHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentMonth] = useState(new Date().toLocaleString('default', { month: 'long', year: 'numeric' }));
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [salaryToDelete, setSalaryToDelete] = useState(null);
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [adjustmentData, setAdjustmentData] = useState({
    type: 'bonus',
    amount: '',
    reason: ''
  });
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Fetch data on component mount
  useEffect(() => {
    console.log('Salaries component mounted. Current user:', currentUser ? currentUser.uid : 'null');
    if (currentUser) {
      fetchData();
    }
  }, [currentUser]);

  const fetchData = async () => {
    try {
      console.log('Fetching salary data. Current user:', currentUser ? currentUser.uid : 'null');
      setLoading(true);
      
      // Add a small delay to ensure auth state is initialized
      await new Promise(resolve => setTimeout(resolve, 300));
      
      console.log('About to call service functions');
      const [employeesData, historyData] = await Promise.all([
        salaryService.getCurrentMonthEmployees(),
        salaryService.getSalaryHistory()
      ]);
      console.log('Service functions completed');
      
      // Validate and sanitize employees data
      const sanitizedEmployees = employeesData.map(emp => {
        if (!emp || typeof emp !== 'object') {
          return {
            _id: 'unknown',
            name: 'Unknown Employee',
            jobTitle: 'Unknown',
            salary: 0,
            bonuses: 0,
            deductions: 0
          };
        }
        
        return {
          ...emp,
          salary: !isNaN(parseFloat(emp.salary)) ? parseFloat(emp.salary) : 0,
          bonuses: !isNaN(parseFloat(emp.bonuses)) ? parseFloat(emp.bonuses) : 0,
          deductions: !isNaN(parseFloat(emp.deductions)) ? parseFloat(emp.deductions) : 0
        };
      });
      
      // Validate and sanitize history data
      const sanitizedHistory = historyData.map(record => {
        if (!record || typeof record !== 'object') {
          return {
            _id: 'unknown',
            month: 'Unknown',
            totalAmount: 0,
            processedDate: new Date().toISOString(),
            employeeCount: 0
          };
        }
        
        return {
          ...record,
          totalAmount: !isNaN(parseFloat(record.totalAmount)) ? parseFloat(record.totalAmount) : 0,
          employeeCount: !isNaN(parseInt(record.employeeCount)) ? parseInt(record.employeeCount) : 0,
          processedDate: record.processedDate || new Date().toISOString()
        };
      });
      
      setEmployees(sanitizedEmployees);
      setSalaryHistory(sanitizedHistory);
      setError(null);
    } catch (err) {
      console.error('Error in fetchData:', err);
      setError('Failed to fetch salary data: ' + err.message);
      console.error('Error fetching salary data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate monthly salary from annual
  const calculateMonthlySalary = (annualSalary) => {
    // Ensure we have a valid number
    const salary = !isNaN(parseFloat(annualSalary)) ? parseFloat(annualSalary) : 0;
    // If salary is invalid or negative, return 0
    if (salary <= 0) {
      return 0;
    }
    // Calculate monthly salary and ensure it's a valid number
    const monthly = Math.round(salary / 12);
    return !isNaN(monthly) ? monthly : 0;
  };

  const handleProcessSalary = () => {
    // Navigate to process salary page
    navigate('/salaries/process');
  };

  const handleViewHistory = () => {
    // In a real app, this would show detailed history
    console.log('Viewing salary history');
  };

  const handleAddAdjustment = (employee) => {
    setSelectedEmployee(employee);
    setAdjustmentData({
      type: 'bonus',
      amount: '',
      reason: ''
    });
    setShowAdjustmentModal(true);
  };

  const handleAdjustmentChange = (e) => {
    const { name, value } = e.target;
    setAdjustmentData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveAdjustment = async () => {
    try {
      if (!adjustmentData.amount || !adjustmentData.reason) {
        Swal.fire({
          icon: 'warning',
          title: 'Missing Fields',
          text: 'Please fill in all fields'
        });
        return;
      }

      const data = {
        type: adjustmentData.type,
        amount: parseFloat(adjustmentData.amount),
        reason: adjustmentData.reason
      };

      await salaryService.addAdjustment(selectedEmployee._id, data);
      
      // Close modal and refresh data
      setShowAdjustmentModal(false);
      setSelectedEmployee(null);
      setAdjustmentData({
        type: 'bonus',
        amount: '',
        reason: ''
      });
      
      // Refresh the data to show updated values
      fetchData();
      
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Adjustment added successfully'
      });
    } catch (err) {
      setError('Failed to add adjustment: ' + err.message);
      console.error('Error adding adjustment:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to add adjustment: ' + err.message
      });
    }
  };

  const handleAddSalary = () => {
    navigate('/salaries/add');
  };

  const handleEditSalary = (id) => {
    navigate(`/salaries/edit/${id}`);
  };

  const handleViewSalary = (id) => {
    navigate(`/salaries/view/${id}`);
  };

  const handleDeleteSalary = (salary) => {
    setSalaryToDelete(salary);
    setShowDeleteModal(true);
  };

  const confirmDeleteSalary = async () => {
    if (salaryToDelete) {
      try {
        // Use _id instead of id for MongoDB
        await salaryService.deleteSalaryRecord(salaryToDelete._id);
        setSalaryHistory(salaryHistory.filter(s => s._id !== salaryToDelete._id));
        setShowDeleteModal(false);
        setSalaryToDelete(null);
      } catch (err) {
        setError('Failed to delete salary record: ' + err.message);
        console.error('Error deleting salary record:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete salary record: ' + err.message
        });
      }
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    const num = !isNaN(parseFloat(amount)) ? parseFloat(amount) : 0;
    const formatted = Math.abs(num).toLocaleString('en-US', { 
      minimumFractionDigits: 0, 
      maximumFractionDigits: 0 
    });
    if (formatted === '' || isNaN(num)) {
      return '0';
    }
    return num < 0 ? `-${formatted}` : formatted;
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
          <h1 className="text-2xl font-bold text-gray-800">Salary Management</h1>
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
          <h1 className="text-2xl font-bold text-gray-800">Salary Management</h1>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-red-500">{error}</p>
          <button 
            onClick={fetchData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Calculate totals for current month
  const totalBasicSalary = employees.reduce((sum, emp) => sum + calculateMonthlySalary(emp.salary), 0);
  const totalBonuses = employees.reduce((sum, emp) => sum + (parseFloat(emp.bonuses) || 0), 0);
  const totalDeductions = employees.reduce((sum, emp) => sum + (parseFloat(emp.deductions) || 0), 0);
  const totalFinalSalary = totalBasicSalary + totalBonuses - totalDeductions;

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Salary Management</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button 
            onClick={handleViewHistory}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center w-full sm:w-auto"
          >
            <FaHistory className="mr-2" />
            View History
          </button>
          <button 
            onClick={handleProcessSalary}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center w-full sm:w-auto"
          >
            <FaPlus className="mr-2" />
            Process Salary
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Process Salary for {currentMonth}</h2>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-800">Total Employees</p>
            <p className="text-2xl font-bold text-blue-900">{employees.length}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-green-800">Basic Salary</p>
            <p className="text-2xl font-bold text-green-900">৳{formatCurrency(totalBasicSalary)}</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <p className="text-sm text-yellow-800">Bonuses</p>
            <p className="text-2xl font-bold text-yellow-900">৳{formatCurrency(totalBonuses)}</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-sm text-purple-800">Total Payable</p>
            <p className="text-2xl font-bold text-purple-900">৳{formatCurrency(totalFinalSalary)}</p>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Job Title
                </th>
                <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Basic Salary (৳)
                </th>
                <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Bonuses (৳)
                </th>
                <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Deductions (৳)
                </th>
                <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Final Salary (৳)
                </th>
                <th scope="col" className="px-4 md:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.map((employee) => {
                // Ensure all values are valid numbers with comprehensive validation
                const empSalary = !isNaN(parseFloat(employee.salary)) ? parseFloat(employee.salary) : 0;
                const empBonuses = !isNaN(parseFloat(employee.bonuses)) ? parseFloat(employee.bonuses) : 0;
                const empDeductions = !isNaN(parseFloat(employee.deductions)) ? parseFloat(employee.deductions) : 0;
                
                const monthlySalary = calculateMonthlySalary(empSalary);
                const finalSalary = monthlySalary + empBonuses - empDeductions;
                
                return (
                  <tr key={employee._id}>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                      <div className="text-sm text-gray-500 md:hidden">{employee.jobTitle}</div>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <div className="text-sm text-gray-900">{employee.jobTitle}</div>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">৳{formatCurrency(monthlySalary)}</div>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <div className="text-sm text-green-600">+৳{formatCurrency(empBonuses)}</div>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <div className="text-sm text-red-600">-৳{formatCurrency(empDeductions)}</div>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">৳{formatCurrency(finalSalary)}</div>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {/* Use _id instead of id for MongoDB */}
                      <button 
                        onClick={() => handleAddAdjustment(employee)}
                        className="text-blue-600 hover:text-blue-900 mr-3 text-sm"
                      >
                        Add Adjustment
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        <div className="flex justify-end mt-6">
          <button 
            onClick={handleProcessSalary}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded w-full sm:w-auto"
          >
            Pay All Salaries
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <h2 className="text-xl font-semibold text-gray-800">Salary History</h2>
          <button 
            onClick={handleAddSalary}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center w-full sm:w-auto justify-center"
          >
            <FaPlus className="mr-2" />
            Add Salary Record
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Month
                </th>
                <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount (৳)
                </th>
                <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Processed Date
                </th>
                <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Employee Count
                </th>
                <th scope="col" className="px-4 md:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {salaryHistory.map((record) => {
                // Ensure all values are valid numbers
                const totalAmount = !isNaN(parseFloat(record.totalAmount)) ? parseFloat(record.totalAmount) : 0;
                const employeeCount = !isNaN(parseInt(record.employeeCount)) ? parseInt(record.employeeCount) : 0;
                
                return (
                  <tr key={record._id}>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{record.month}</div>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">৳{formatCurrency(totalAmount)}</div>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <div className="text-sm text-gray-900">{formatDate(record.processedDate)}</div>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <div className="text-sm text-gray-900">{employeeCount}</div>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {/* Use _id instead of id for MongoDB */}
                      <button 
                        onClick={() => handleViewSalary(record._id)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        View Details
                      </button>
                      <button 
                        onClick={() => handleEditSalary(record._id)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        onClick={() => handleDeleteSalary(record)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-500 mb-6">
              Are you sure you want to delete the salary record for "{salaryToDelete?.month}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteSalary}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Adjustment Modal */}
      {showAdjustmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Add Adjustment for {selectedEmployee?.name}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adjustment Type
                </label>
                <select
                  name="type"
                  value={adjustmentData.type}
                  onChange={handleAdjustmentChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="bonus">Bonus</option>
                  <option value="deduction">Deduction</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (৳)
                </label>
                <input
                  type="number"
                  name="amount"
                  value={adjustmentData.amount}
                  onChange={handleAdjustmentChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason
                </label>
                <input
                  type="text"
                  name="reason"
                  value={adjustmentData.reason}
                  onChange={handleAdjustmentChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter reason for adjustment"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAdjustmentModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAdjustment}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Save Adjustment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalaryManagement;