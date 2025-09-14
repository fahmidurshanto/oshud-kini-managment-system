import React, { useState, useEffect } from 'react';
import * as productService from '../services/productService';
import * as salesService from '../services/salesService';

const Sell = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [cart, setCart] = useState([]);
  const [discount, setDiscount] = useState(0);

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
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

  // Add product to cart
  const addToCart = (product) => {
    // Check if product already in cart
    const existingItem = cart.find(item => item.productId === product._id);
    
    if (existingItem) {
      // Increase quantity if already in cart
      setCart(cart.map(item => 
        item.productId === product._id 
          ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.manualPrice }
          : item
      ));
    } else {
      // Add new item to cart with manual price field
      const newItem = {
        productId: product._id,
        productName: product.name,
        quantity: 1,
        price: product.price, // Original product price
        manualPrice: product.price, // Manual price (editable)
        total: product.price
      };
      setCart([...cart, newItem]);
    }
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  // Update item quantity in cart
  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    
    setCart(cart.map(item => 
      item.productId === productId 
        ? { ...item, quantity, total: quantity * item.manualPrice }
        : item
    ));
  };

  // Update manual price in cart
  const updateManualPrice = (productId, manualPrice) => {
    if (manualPrice < 0) return;
    
    setCart(cart.map(item => 
      item.productId === productId 
        ? { 
            ...item, 
            manualPrice, 
            total: item.quantity * manualPrice
          }
        : item
    ));
  };

  // Calculate cart totals
  const calculateTotals = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
    const finalTotal = subtotal - discount;
    return { subtotal, finalTotal };
  };

  // Process sale
  const processSale = async () => {
    if (!customerName.trim()) {
      setError('Please enter customer name');
      return;
    }
    
    if (cart.length === 0) {
      setError('Please add items to the cart');
      return;
    }

    try {
      calculateTotals();
      
      const saleData = {
        customerName,
        items: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.manualPrice // Use manual price for the sale
        })),
        discount
      };

      await salesService.createSale(saleData);
      
      // Reset form
      setCustomerName('');
      setCart([]);
      setDiscount(0);
      
      // Dispatch a custom event to notify other components (like Dashboard) to refresh their data
      window.dispatchEvent(new CustomEvent('saleCreated'));
      
      // Show success message
      alert('Sale processed successfully!');
      
      // Refresh products to show updated quantities
      fetchProducts();
    } catch (err) {
      setError('Failed to process sale: ' + err.message);
      console.error('Error processing sale:', err);
    }
  };

  const { subtotal, finalTotal } = calculateTotals();

  if (loading) {
    return (
      <div className="p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Sell Products</h1>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Sell Products</h1>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Sell Products</h1>
        <a 
          href="/sales" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          View Sales List
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Available Products</h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price (৳)
                    </th>
                    <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th scope="col" className="px-4 md:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.filter(product => product.quantity > 0).map((product) => (
                    <tr key={product._id}>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">৳{product.price.toLocaleString()}</div>
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{product.quantity}</div>
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => addToCart(product)}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
                        >
                          Add to Cart
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Cart */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6 sticky top-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Shopping Cart</h2>
            
            <div className="mb-4">
              <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
                Customer Name
              </label>
              <input
                type="text"
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter customer name"
              />
            </div>
            
            <div className="border rounded-md mb-4 max-h-60 overflow-y-auto">
              {cart.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <p>No items in cart</p>
                </div>
              ) : (
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((item) => (
                      <tr key={item.productId} className="border-b">
                        <td className="px-4 py-2 text-sm">
                          <div className="font-medium">{item.productName}</div>
                        </td>
                        <td className="px-4 py-2 text-right">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.manualPrice}
                            onChange={(e) => updateManualPrice(item.productId, parseFloat(e.target.value) || 0)}
                            className="w-20 px-1 py-1 border border-gray-300 rounded-md text-right"
                          />
                        </td>
                        <td className="px-4 py-2 text-right">
                          <div className="flex items-center justify-end">
                            <button 
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-l"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || 1)}
                              className="w-12 text-center border-t border-b"
                            />
                            <button 
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-r"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-2 text-right text-sm">৳{item.total.toLocaleString()}</td>
                        <td className="px-4 py-2 text-right">
                          <button 
                            onClick={() => removeFromCart(item.productId)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">৳{subtotal.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Discount:</span>
                <input
                  type="number"
                  min="0"
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  className="w-24 px-2 py-1 border border-gray-300 rounded-md text-right"
                />
              </div>
              
              <div className="flex justify-between mb-4 font-bold text-lg">
                <span>Total:</span>
                <span>৳{finalTotal.toLocaleString()}</span>
              </div>
              
              <button 
                onClick={processSale}
                disabled={cart.length === 0 || !customerName.trim()}
                className={`w-full py-2 px-4 rounded-md font-medium ${
                  cart.length === 0 || !customerName.trim()
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                Process Sale
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sell;