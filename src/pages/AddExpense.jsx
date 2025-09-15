import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as expenseService from '../services/expenseService';
import Swal from 'sweetalert2';

const AddExpense = () => {
  const [purpose, setPurpose] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!purpose.trim() || !amount || !date) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please fill in all fields'
      });
      return;
    }
    
    if (amount <= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Amount',
        text: 'Amount must be greater than zero'
      });
      return;
    }

    try {
      const expenseData = {
        purpose,
        amount: parseFloat(amount),
        date
      };

      await expenseService.createExpense(expenseData);
      
      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Expense added successfully!'
      }).then(() => {
        // Redirect to expenses list
        navigate('/expenses');
      });
      
      // Dispatch event to notify dashboard of update
      window.dispatchEvent(new CustomEvent('expenseUpdated'));
    } catch (error) {
      console.error('Error adding expense:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to add expense: ' + error.message
      });
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Add Expense</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 max-w-2xl">
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
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Expense Date
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Add Expense
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