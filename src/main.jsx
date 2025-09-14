import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import routes from './Routes/Routes.jsx'
import AuthProvider from './AuthProvider.jsx'
import { testAuthentication } from './testAuth.js'

// Make the test function available globally for debugging
window.testAuth = testAuthentication;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={routes}/>
    </AuthProvider>
  </StrictMode>,
)