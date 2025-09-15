import React, { useState, useEffect, useMemo } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import SaleInvoice from '../components/SaleInvoice';
import * as salesService from '../services/salesService';
import Swal from 'sweetalert2';

const SalesList = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [animated, setAnimated] = useState(false);

  // Fetch sales on component mount
  useEffect(() => {
    fetchSales();
    
    // Trigger animation after component mounts
    const animationTimer = setTimeout(() => {
      setAnimated(true);
    }, 100);
    
    return () => {
      clearTimeout(animationTimer);
    };
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

  // Filter sales based on search term
  const filteredSales = useMemo(() => {
    if (!searchTerm) return sales;
    
    const term = searchTerm.toLowerCase();
    return sales.filter(sale => {
      // Search by sale ID
      if (sale._id.toLowerCase().includes(term)) return true;
      
      // Search by customer name
      if (sale.customerName.toLowerCase().includes(term)) return true;
      
      // Search by product names
      return sale.items.some(item => 
        item.productName.toLowerCase().includes(term)
      );
    });
  }, [sales, searchTerm]);

  // Delete a sale
  const handleDeleteSale = async (saleId) => {
    // Show confirmation dialog
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will restore the product quantities and update dashboard metrics.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await salesService.deleteSale(saleId);
        
        // Update sales list
        setSales(sales.filter(sale => sale._id !== saleId));
        
        // Dispatch event to notify dashboard of update
        window.dispatchEvent(new CustomEvent('saleUpdated'));
        
        // Show success message
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Sale deleted successfully!'
        });
      } catch (error) {
        console.error('Error deleting sale:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete sale: ' + error.message
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6">
        <div className={`flex justify-between items-center mb-6 ${animated ? 'animate__animated animate__fadeInDown' : ''}`}>
          <h1 className="text-2xl font-bold text-gray-800">Sales List</h1>
        </div>
        <div className={`bg-white rounded-lg shadow-md p-6 text-center ${animated ? 'animate__animated animate__fadeInUp' : ''}`}>
          <p>Loading sales...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6">
        <div className={`flex justify-between items-center mb-6 ${animated ? 'animate__animated animate__fadeInDown' : ''}`}>
          <h1 className="text-2xl font-bold text-gray-800">Sales List</h1>
        </div>
        <div className={`bg-white rounded-lg shadow-md p-6 ${animated ? 'animate__animated animate__fadeInUp' : ''}`}>
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
      <div className={`flex justify-between items-center mb-6 ${animated ? 'animate__animated animate__fadeInDown' : ''}`}>
        <h1 className="text-2xl font-bold text-gray-800">Sales List</h1>
      </div>

      {/* Search Field */}
      <div className={`mb-6 ${animated ? 'animate__animated animate__fadeIn' : ''}`}>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by ID, customer name, or product name..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="absolute right-3 top-2 text-gray-500 hover:text-gray-700"
              onClick={() => setSearchTerm('')}
            >
              Clear
            </button>
          )}
        </div>
        {searchTerm && (
          <p className="mt-2 text-sm text-gray-600">
            Showing {filteredSales.length} of {sales.length} sales
          </p>
        )}
      </div>

      <div className={`bg-white rounded-lg shadow-md p-4 md:p-6 ${animated ? 'animate__animated animate__fadeInUp' : ''}`}>
        {filteredSales.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {searchTerm ? 'No sales match your search criteria' : 'No sales records found'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
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
                {filteredSales.map((sale, index) => (
                  <tr 
                    key={sale._id} 
                    className={animated ? 'animate__animated animate__fadeIn' : ''}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">
                        {sale._id.substring(0, 8).toUpperCase()}
                      </div>
                    </td>
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
                          {sale.items.map((item, itemIndex) => (
                            <li key={itemIndex}>
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