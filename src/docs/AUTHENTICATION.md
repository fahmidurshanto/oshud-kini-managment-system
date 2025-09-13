# Authentication Implementation

This document explains how Firebase Authentication is implemented in the CompanyManager Lite application.

## Overview

The authentication system uses Firebase Authentication with React Context API to provide a global authentication state throughout the application.

## File Structure

```
src/
  AuthProvider.jsx        # Main authentication provider component
  firebase.config.js      # Firebase configuration and initialization
  contexts/
    AuthContext.js        # Authentication context creation
  hooks/
    useAuth.js            # Custom hook to access authentication context
  components/
    ProtectedRoute.jsx    # Component to protect routes requiring authentication
    RedirectIfAuthenticated.jsx  # Component to redirect authenticated users
```

## Implementation Details

### 1. Firebase Configuration (`firebase.config.js`)

- Initializes Firebase app with configuration from environment variables
- Exports the `auth` service for authentication operations

### 2. Authentication Context (`contexts/AuthContext.js`)

- Creates a React context to share authentication state across components

### 3. Authentication Provider (`AuthProvider.jsx`)

The `AuthProvider` component manages the authentication state and provides the following functions:

- `register(email, password, name)` - Creates a new user account
- `login(email, password)` - Signs in a user with email and password
- `loginWithGoogle()` - Signs in a user with Google authentication
- `logout()` - Signs out the current user

The provider also manages:
- Current user state
- Loading state during authentication operations
- Real-time updates to user authentication status using `onAuthStateChanged`

### 4. Custom Hook (`hooks/useAuth.js`)

The `useAuth` hook provides easy access to the authentication context values from any component:

```javascript
import { useAuth } from '../hooks/useAuth';

const { currentUser, register, login, loginWithGoogle, logout } = useAuth();
```

### 5. Protected Routes (`components/ProtectedRoute.jsx`)

The `ProtectedRoute` component ensures that only authenticated users can access certain routes:

```javascript
<Route element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
```

### 6. Redirect for Authenticated Users (`components/RedirectIfAuthenticated.jsx`)

The `RedirectIfAuthenticated` component prevents authenticated users from accessing login/register pages:

```javascript
<Route element={<RedirectIfAuthenticated><Login /></RedirectIfAuthenticated>} />
```

## Environment Variables

The Firebase configuration is stored in environment variables in the `.env.local` file:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Usage in Components

### Accessing Authentication State

```javascript
import { useAuth } from '../hooks/useAuth';

const MyComponent = () => {
  const { currentUser } = useAuth();
  
  return (
    <div>
      {currentUser ? (
        <p>Welcome, {currentUser.displayName || currentUser.email}!</p>
      ) : (
        <p>Please sign in</p>
      )}
    </div>
  );
};
```

### User Registration

```javascript
import { useAuth } from '../hooks/useAuth';

const RegisterForm = () => {
  const { register } = useAuth();
  
  const handleRegister = async (email, password, name) => {
    try {
      await register(email, password, name);
      // Handle successful registration
    } catch (error) {
      // Handle registration error
    }
  };
};
```

### User Login

```javascript
import { useAuth } from '../hooks/useAuth';

const LoginForm = () => {
  const { login } = useAuth();
  
  const handleLogin = async (email, password) => {
    try {
      await login(email, password);
      // Handle successful login
    } catch (error) {
      // Handle login error
    }
  };
};
```

## Security Considerations

1. Environment variables are prefixed with `VITE_` to be accessible in the client-side code
2. Only public Firebase configuration values are stored in environment variables
3. Protected routes ensure unauthorized users cannot access protected pages
4. Firebase Security Rules should be configured in the Firebase Console for additional security