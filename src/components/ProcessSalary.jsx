import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as salaryService from '../services/salaryService';

const ProcessSalary = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM format
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch employees on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await salaryService.getCurrentMonthEmployees();
      setEmployees(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch employees');
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate monthly salary from annual
  const calculateMonthlySalary = (annualSalary) => {
    return Math.round(annualSalary / 12);
  };

  // Format month for display
  const formatMonth = (monthString) => {
    const date = new Date(monthString + '-01');
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const handleProcessSalaries = async () => {
    try {
      // Prepare salary data for processing
      const salaryData = {
        month: formatMonth(selectedMonth),
        employees: employees.map(emp => ({
          id: emp.id,
          name: emp.name,
          basicSalary: emp.basicSalary,
          bonuses: emp.bonuses || 0,
          deductions: emp.deductions || 0
        })),
        processedDate: new Date().toISOString().split('T')[0]
      };
      
      await salaryService.processSalaries(salaryData);
      // Redirect back to salaries list
      navigate('/salaries');
    } catch (err) {
      setError('Failed to process salaries');
      console.error('Error processing salaries:', err);
    }
  };

  const handleAddAdjustment = (employeeId) => {
    // In a real app, this would open an adjustment form
    console.log('Adding adjustment for employee:', employeeId);
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Process Salary</h1>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p>Loading employee data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Process Salary</h1>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-red-500">{error}</p>
          <button 
            onClick={fetchEmployees}
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
        <h1 className="text-2xl font-bold text-gray-800">Process Salary</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
          <div>
            <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-1">
              Select Month
            </label>
            <input
              type="month"
              id="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Salary Details for {formatMonth(selectedMonth)}
        </h2>
        
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
                const monthlySalary = calculateMonthlySalary(employee.basicSalary);
                const bonuses = employee.bonuses || 0;
                const deductions = employee.deductions || 0;
                const finalSalary = monthlySalary + bonuses - deductions;
                
                return (
                  <tr key={employee.id}>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                      <div className="text-sm text-gray-500 md:hidden">{employee.jobTitle}</div>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <div className="text-sm text-gray-900">{employee.jobTitle}</div>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">৳{monthlySalary.toLocaleString()}</div>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <div className="text-sm text-green-600">+৳{bonuses.toLocaleString()}</div>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <div className="text-sm text-red-600">-৳{deductions.toLocaleString()}</div>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">৳{finalSalary.toLocaleString()}</div>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleAddAdjustment(employee.id)}
                        className="text-blue-600 hover:text-blue-900 text-sm"
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
        
        <div className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0 mt-6">
          <button
            onClick={() => navigate('/salaries')}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 w-full sm:w-auto"
          >
            Cancel
          </button>
          <button 
            onClick={handleProcessSalaries}
            className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 w-full sm:w-auto"
          >
            Process All Salaries
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProcessSalary;