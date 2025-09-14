# API Integration Guide

This document explains how the frontend connects to the backend API for the Oshud Kini Management System.

## Base URL

All API requests are made to: `https://oshud-kini-management-server.onrender.com/api`

## Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. Users log in via `/api/auth/login` to receive a token
2. The token is stored in localStorage as `authToken`
3. All subsequent requests include the Authorization header:
   ```
   Authorization: Bearer <token>
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get a specific product
- `POST /api/products` - Create a new product
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product

### Employees
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get a specific employee
- `POST /api/employees` - Create a new employee
- `PUT /api/employees/:id` - Update an employee
- `PUT /api/employees/:id/deactivate` - Deactivate an employee
- `PUT /api/employees/:id/activate` - Activate an employee
- `DELETE /api/employees/:id` - Delete an employee
- `GET /api/employees/stats` - Get employee statistics

### Salaries
- `GET /api/salaries` - Get salary data
- `GET /api/salaries/history` - Get salary history
- `GET /api/salaries/current-month` - Get current month employees
- `POST /api/salaries/process` - Process salaries
- `POST /api/salaries/adjustment/:employeeId` - Add adjustment for employee
- `GET /api/salaries/:id` - Get a specific salary record
- `POST /api/salaries` - Create a new salary record
- `PUT /api/salaries/:id` - Update a salary record
- `DELETE /api/salaries/:id` - Delete a salary record

### Dashboard
- `GET /api/dashboard` - Get dashboard data
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/activity` - Get recent activity
- `GET /api/dashboard/summary` - Get dashboard summary

## Service Files

Each entity has a corresponding service file in `src/services/` that handles API communication:

- `productService.js` - Product-related API calls
- `employeeService.js` - Employee-related API calls
- `salaryService.js` - Salary-related API calls
- `dashboardService.js` - Dashboard-related API calls

## Error Handling

All API calls include proper error handling with try/catch blocks and meaningful error messages.

## Local Storage

Authentication tokens are stored in localStorage:
- Key: `authToken`
- Value: JWT token received from login/registration

## Usage Example

```javascript
import { getProducts } from '../services/productService';

const fetchProducts = async () => {
  try {
    const products = await getProducts();
    console.log('Products:', products);
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};
```