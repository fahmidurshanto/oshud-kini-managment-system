import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Login from '../pages/Login';
import Register from '../pages/Register';
import DashboardPage from '../pages/Dashboard';
import ProductList from '../pages/Products';
import EmployeeList from '../pages/Employees';
import SalaryManagement from '../pages/Salaries';
import AddProduct from '../components/AddProduct';
import AddEmployee from '../components/AddEmployee';
import EditProduct from '../components/EditProduct';
import EditEmployee from '../components/EditEmployee';
import ProcessSalary from '../components/ProcessSalary';
import AddSalary from '../components/AddSalary';
import EditSalary from '../components/EditSalary';
import ViewSalary from '../components/ViewSalary';
import ProtectedRoute from '../components/ProtectedRoute';
import RedirectIfAuthenticated from '../components/RedirectIfAuthenticated';
import TestAuth from '../pages/TestAuth';

const routes = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute><App /></ProtectedRoute>,
    children: [
      {
        path: '/dashboard',
        element: <DashboardPage />
      },
      {
        path: '/products',
        element: <ProductList />
      },
      {
        path: '/products/add',
        element: <AddProduct />
      },
      {
        path: '/products/edit/:id',
        element: <EditProduct />
      },
      {
        path: '/employees',
        element: <EmployeeList />
      },
      {
        path: '/employees/add',
        element: <AddEmployee />
      },
      {
        path: '/employees/edit/:id',
        element: <EditEmployee />
      },
      {
        path: '/salaries',
        element: <SalaryManagement />
      },
      {
        path: '/salaries/add',
        element: <AddSalary />
      },
      {
        path: '/salaries/edit/:id',
        element: <EditSalary />
      },
      {
        path: '/salaries/view/:id',
        element: <ViewSalary />
      },
      {
        path: '/salaries/process',
        element: <ProcessSalary />
      },
      {
        path: '/test-auth',
        element: <TestAuth />
      }
    ]
  },
  {
    path: '/login',
    element: <RedirectIfAuthenticated><Login /></RedirectIfAuthenticated>
  },
  {
    path: '/register',
    element: <RedirectIfAuthenticated><Register /></RedirectIfAuthenticated>
  }
]);

export default routes;