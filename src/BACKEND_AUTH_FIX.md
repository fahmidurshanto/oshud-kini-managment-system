# Backend Authentication Fix

This document explains the changes made to fix the 403 Forbidden errors related to invalid tokens when connecting to the backend API.

## Problem Identified

The application was using Firebase authentication tokens with a backend that expects its own JWT tokens. The error message "Invalid token" indicated that the backend was rejecting the Firebase tokens.

## Solution Implemented

1. **Created authService.js**: A new service file to handle backend authentication including:
   - User registration
   - User login
   - User logout
   - Token management
   - Current user retrieval

2. **Updated AuthProvider.jsx**: Modified to use backend authentication instead of Firebase authentication:
   - Removed Firebase dependencies
   - Implemented backend login/logout functionality
   - Added token storage in localStorage
   - Added user data retrieval on initial load

3. **Updated Login.jsx**: Modified to use backend authentication:
   - Removed Firebase Google Sign-In
   - Updated form submission to use backend login

4. **Updated Register.jsx**: Modified to use backend authentication:
   - Removed Firebase Google Sign-Up
   - Updated form submission to use backend registration
   - Added automatic login after registration

5. **Updated Service Files**: Modified all service files to use backend JWT tokens:
   - dashboardService.js
   - productService.js
   - employeeService.js
   - salaryService.js

6. **Updated Header.jsx**: Modified to work with the new user object structure

## How It Works Now

1. **User Registration**:
   - User fills registration form
   - Data is sent to `/api/auth/register`
   - Backend creates user and returns user data

2. **User Login**:
   - User fills login form
   - Credentials are sent to `/api/auth/login`
   - Backend validates credentials and returns JWT token
   - Token is stored in localStorage
   - User data is stored in AuthProvider state

3. **API Requests**:
   - All service files retrieve token from localStorage
   - Token is included in Authorization header as `Bearer <token>`
   - Backend validates token for each request

4. **User Logout**:
   - Token is removed from localStorage
   - User state is cleared in AuthProvider

## Testing the Fix

1. Navigate to the login page
2. Enter valid credentials
3. Check localStorage for `authToken`
4. Navigate to dashboard
5. Check browser console for successful API requests

## Files Modified

- `/src/services/authService.js` (new)
- `/src/AuthProvider.jsx` (updated)
- `/src/pages/Login.jsx` (updated)
- `/src/pages/Register.jsx` (updated)
- `/src/components/Header.jsx` (updated)
- `/src/services/dashboardService.js` (updated)
- `/src/services/productService.js` (updated)
- `/src/services/employeeService.js` (updated)
- `/src/services/salaryService.js` (updated)