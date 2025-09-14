import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import * as productService from '../services/productService';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [animated, setAnimated] = useState(false);
  const navigate = useNavigate();

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
    
    // Trigger animation after component mounts
    const animationTimer = setTimeout(() => {
      setAnimated(true);
    }, 100);
    
    return () => {
      clearTimeout(animationTimer);
    };
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Add a small delay to ensure auth state is initialized
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const data = await productService.getProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch products: ' + err.message);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      try {
        // Use _id instead of id for MongoDB
        await productService.deleteProduct(productToDelete._id);
        setProducts(products.filter(p => p._id !== productToDelete._id));
        setShowDeleteModal(false);
        setProductToDelete(null);
      } catch (err) {
        setError('Failed to delete product: ' + err.message);
        console.error('Error deleting product:', err);
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/products/edit/${id}`);
  };

  const handleAddProduct = () => {
    navigate('/products/add');
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6">
        <div className={`flex justify-between items-center mb-6 ${animated ? 'animate__animated animate__fadeInDown' : ''}`}>
          <h1 className="text-2xl font-bold text-gray-800">Product Management</h1>
        </div>
        <div className={`bg-white rounded-lg shadow-md p-6 text-center ${animated ? 'animate__animated animate__fadeInUp' : ''}`}>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6">
        <div className={`flex justify-between items-center mb-6 ${animated ? 'animate__animated animate__fadeInDown' : ''}`}>
          <h1 className="text-2xl font-bold text-gray-800">Product Management</h1>
        </div>
        <div className={`bg-white rounded-lg shadow-md p-6 text-center ${animated ? 'animate__animated animate__fadeInUp' : ''}`}>
          <p className="text-red-500">{error}</p>
          <button 
            onClick={fetchProducts}
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
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 ${animated ? 'animate__animated animate__fadeInDown' : ''}`}>
        <h1 className="text-2xl font-bold text-gray-800">Product Management</h1>
        <button 
          onClick={handleAddProduct}
          className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center w-full sm:w-auto justify-center ${animated ? 'animate__animated animate__pulse' : ''}`}
        >
          <FaPlus className="mr-2" />
          Add Product
        </button>
      </div>

      <div className={`bg-white rounded-lg shadow-md overflow-hidden ${animated ? 'animate__animated animate__fadeInUp' : ''}`}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product Name
                </th>
                <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price (৳)
                </th>
                <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Description
                </th>
                <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Added
                </th>
                <th scope="col" className="px-4 md:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product, index) => (
                <tr 
                  key={product._id} 
                  className={animated ? 'animate__animated animate__fadeIn' : ''}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                  </td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">৳{product.price}</div>
                  </td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.quantity}</div>
                  </td>
                  <td className="px-4 md:px-6 py-4 hidden md:table-cell">
                    <div className="text-sm text-gray-900">{product.description}</div>
                  </td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.dateAdded}
                  </td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      // Use _id instead of id for MongoDB
                      onClick={() => handleEdit(product._id)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      onClick={() => handleDelete(product)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`bg-white rounded-lg p-6 w-full max-w-md ${animated ? 'animate__animated animate__zoomIn' : ''}`}>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-500 mb-6">
              Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;