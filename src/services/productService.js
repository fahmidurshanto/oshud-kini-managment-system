// Function to fetch products from the JSON file
export const getProducts = async () => {
  try {
    const response = await fetch('/productService.json');
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const data = await response.json();
    return data.products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Function to get a single product by ID
export const getProductById = async (id) => {
  try {
    const products = await getProducts();
    const product = products.find(p => p.id === parseInt(id));
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    throw error;
  }
};

// Function to create a new product
export const createProduct = async (productData) => {
  try {
    // In a real app, this would make a POST request to the server
    // For now, we'll simulate the creation by fetching existing products
    // and returning the new product with an incremented ID
    const products = await getProducts();
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    
    const newProduct = {
      id: newId,
      ...productData
    };
    
    // Note: In a real implementation, this would persist the data to the server
    // For this demo, we're just simulating the creation
    console.log('Creating product:', newProduct);
    return newProduct;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// Function to update an existing product
export const updateProduct = async (id, productData) => {
  try {
    // In a real app, this would make a PUT request to the server
    // For now, we'll simulate the update
    console.log(`Updating product with id ${id}:`, productData);
    
    // Return the updated product data
    const updatedProduct = {
      id: parseInt(id),
      ...productData
    };
    
    return updatedProduct;
  } catch (error) {
    console.error(`Error updating product with id ${id}:`, error);
    throw error;
  }
};

// Function to delete a product
export const deleteProduct = async (id) => {
  try {
    // In a real app, this would make a DELETE request to the server
    // For now, we'll simulate the deletion
    console.log(`Deleting product with id ${id}`);
    return id;
  } catch (error) {
    console.error(`Error deleting product with id ${id}:`, error);
    throw error;
  }
};