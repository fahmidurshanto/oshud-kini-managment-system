import React from 'react';
import { useNavigate } from 'react-router-dom';

const TestSales = () => {
  const navigate = useNavigate();

  const handleNavigateToSell = () => {
    navigate('/sell');
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Test Sales Functionality</h2>
      <button 
        onClick={handleNavigateToSell}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Go to Sell Page
      </button>
    </div>
  );
};

export default TestSales;