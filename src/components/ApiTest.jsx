import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import * as salaryService from '../services/salaryService';

const ApiTest = () => {
  const { currentUser } = useAuth();
  const [testResult, setTestResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testApiConnection = async () => {
    try {
      setLoading(true);
      setTestResult('Testing API connection...');
      
      console.log('Starting API test with user:', currentUser ? currentUser.uid : 'No user');
      
      // Test the salary service
      const salaryData = await salaryService.getSalaryData();
      console.log('Salary data received:', salaryData);
      
      setTestResult(`Success! Retrieved ${salaryData.length || 0} salary records.`);
    } catch (error) {
      console.error('API Test Error:', error);
      setTestResult(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">API Connection Test</h2>
      <p className="mb-2">Current User: {currentUser ? currentUser.email : 'Not logged in'}</p>
      <button 
        onClick={testApiConnection}
        disabled={loading || !currentUser}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test API Connection'}
      </button>
      {testResult && (
        <div className="mt-4 p-3 bg-gray-100 rounded">
          <p className="font-mono text-sm">{testResult}</p>
        </div>
      )}
    </div>
  );
};

export default ApiTest;