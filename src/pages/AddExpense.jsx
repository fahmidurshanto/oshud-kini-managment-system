import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as expenseService from '../services/expenseService';

const AddExpense = () => {
  const [purpose, setPurpose] = useState('');
  const [amount, setAmount] = useState('');
  const [expenseDate, setExpenseDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!purpose.trim()) {
      setError('Please enter expense purpose');
      return;
    }
    
    if (!amount || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const expenseData = {
        purpose,
        amount: parseFloat(amount),
        expenseDate: expenseDate || new Date().toISOString().split('T')[0]
      };
      
      await expenseService.createExpense(expenseData);
      
      // Show success message
      alert('Expense added successfully!');
      
      // Reset form
      setPurpose('');
      setAmount('');
      setExpenseDate('');
      
      // Navigate to expenses list
      navigate('/expenses');
    } catch (err) {
      setError('Failed to add expense: ' + err.message);
      console.error('Error adding expense:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Add Expense</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 max-w-2xl">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-1">
              Expense Purpose
            </label>
            <input
              type="text"
              id="purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter expense purpose"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Expense Amount (৳)
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter expense amount"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="expenseDate" className="block text-sm font-medium text-gray-700 mb-1">
              Expense Date
            </label>
            <input
              type="date"
              id="expenseDate"
              value={expenseDate}
              onChange={(e) => setExpenseDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              {loading ? 'Adding Expense...' : 'Add Expense'}
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/expenses')}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              View Expenses
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpense;