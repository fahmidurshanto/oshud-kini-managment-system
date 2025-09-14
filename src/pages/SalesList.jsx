import React, { useState, useEffect } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import SaleInvoice from '../components/SaleInvoice';
import * as salesService from '../services/salesService';

const SalesList = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch sales on component mount
  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const data = await salesService.getSales();
      setSales(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch sales: ' + err.message);
      console.error('Error fetching sales:', err);
    } finally {
      setLoading(false);
    }
  };

  // Delete a sale
  const handleDeleteSale = async (saleId) => {
    if (!window.confirm('Are you sure you want to delete this sale? This will restore the product quantities.')) {
      return;
    }

    try {
      await salesService.deleteSale(saleId);
      
      // Refresh sales list
      fetchSales();
      
      // Dispatch a custom event to notify other components (like Dashboard) to refresh their data
      window.dispatchEvent(new CustomEvent('saleDeleted'));
      
      // Show success message
      alert('Sale deleted successfully!');
    } catch (err) {
      setError('Failed to delete sale: ' + err.message);
      console.error('Error deleting sale:', err);
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Sales List</h1>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p>Loading sales...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Sales List</h1>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-red-500">{error}</p>
          <button 
            onClick={fetchSales}
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
        <h1 className="text-2xl font-bold text-gray-800">Sales List</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        {sales.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No sales records found</p>
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
                    Customer
                  </th>
                  <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Products
                  </th>
                  <th scope="col" className="px-4 md:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total (৳)
                  </th>
                  <th scope="col" className="px-4 md:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sales.map((sale) => (
                  <tr key={sale._id}>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(sale.saleDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {sale.customerName}
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <div className="text-sm text-gray-900">
                        <ul className="list-disc pl-5">
                          {sale.items.map((item, index) => (
                            <li key={index}>
                              {item.productName} - Qty: {item.quantity}, Sold Price: ৳{item.price.toLocaleString()}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm font-medium text-gray-900">
                        ৳{sale.finalAmount.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2 justify-end">
                        <PDFDownloadLink 
                          document={<SaleInvoice sale={sale} />} 
                          fileName={`invoice-${sale._id.substring(0, 8)}.pdf`}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
                        >
                          {({ loading }) => (loading ? 'Loading...' : 'Download')}
                        </PDFDownloadLink>
                        <button
                          onClick={() => handleDeleteSale(sale._id)}
                          className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesList;