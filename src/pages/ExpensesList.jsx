import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as expenseService from '../services/expenseService';
import Swal from 'sweetalert2';

const ExpensesList = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editAmount, setEditAmount] = useState('');
  const navigate = useNavigate();

  // Fetch expenses on component mount
  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const data = await expenseService.getExpenses();
      setExpenses(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch expenses: ' + err.message);
      console.error('Error fetching expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (expense) => {
    setEditingId(expense._id);
    setEditAmount(expense.amount.toString());
  };

  const handleSaveEdit = async (id) => {
    try {
      const newAmount = parseFloat(editAmount);
      if (isNaN(newAmount) || newAmount <= 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Invalid Amount',
          text: 'Please enter a valid amount greater than zero'
        });
        return;
      }

      // Update the expense with the new amount
      const updatedExpense = {
        ...expenses.find(exp => exp._id === id),
        amount: newAmount
      };

      // Call the update service (you might need to implement this in expenseService)
      await expenseService.updateExpense(id, updatedExpense);
      
      // Update the local state
      setExpenses(expenses.map(exp => 
        exp._id === id ? { ...exp, amount: newAmount } : exp
      ));
      
      // Exit edit mode
      setEditingId(null);
      setEditAmount('');
      
      // Dispatch event to notify dashboard of update
      window.dispatchEvent(new CustomEvent('expenseUpdated'));
      
      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Expense updated successfully!'
      });
    } catch (error) {
      console.error('Error updating expense:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update expense: ' + error.message
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditAmount('');
  };

  const handleDeleteExpense = async (id) => {
    // Show confirmation dialog
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await expenseService.deleteExpense(id);
        setExpenses(expenses.filter(expense => expense._id !== id));
        
        // Dispatch event to notify dashboard of update
        window.dispatchEvent(new CustomEvent('expenseUpdated'));
        
        // Show success message
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Expense deleted successfully!'
        });
      } catch (error) {
        console.error('Error deleting expense:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete expense: ' + error.message
        });
      }
    }
  };

  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  if (loading) {
    return (
      <div className="p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Expenses List</h1>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p>Loading expenses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Expenses List</h1>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-red-500">{error}</p>
          <button 
            onClick={fetchExpenses}
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
        <h1 className="text-2xl font-bold text-gray-800">Expenses List</h1>
        <button
          onClick={() => navigate('/expenses/add')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Expense
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Total Expenses</h2>
          <p className="text-2xl font-bold text-red-600">৳{totalExpenses.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        {expenses.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No expenses found</p>
            <button
              onClick={() => navigate('/expenses/add')}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Add Your First Expense
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Purpose
                  </th>
                  <th scope="col" className="px-4 md:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount (৳)
                  </th>
                  <th scope="col" className="px-4 md:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {expenses.map((expense) => (
                  <tr key={expense._id}>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(expense.expenseDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {expense.purpose}
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-right">
                      {editingId === expense._id ? (
                        <div className="flex items-center justify-end space-x-2">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={editAmount}
                            onChange={(e) => setEditAmount(e.target.value)}
                            className="w-24 px-2 py-1 border border-gray-300 rounded-md text-right"
                          />
                          <button
                            onClick={() => handleSaveEdit(expense._id)}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-sm"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="text-sm font-medium text-gray-900">
                          ৳{expense.amount.toLocaleString()}
                        </div>
                      )}
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {editingId === expense._id ? null : (
                        <>
                          <button
                            onClick={() => handleEditClick(expense)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded mr-2"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteExpense(expense._id)}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 font-bold">
                <tr>
                  <td colSpan="2" className="px-4 md:px-6 py-3 text-right text-sm uppercase">
                    Total:
                  </td>
                  <td className="px-4 md:px-6 py-3 text-right text-sm">
                    ৳{totalExpenses.toLocaleString()}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpensesList;