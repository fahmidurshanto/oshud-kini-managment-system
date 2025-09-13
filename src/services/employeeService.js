// Function to fetch employees from the JSON file
export const getEmployees = async () => {
  try {
    const response = await fetch('/employeeService.json');
    if (!response.ok) {
      throw new Error('Failed to fetch employees');
    }
    const data = await response.json();
    return data.employees;
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
};

// Function to get a single employee by ID
export const getEmployeeById = async (id) => {
  try {
    const employees = await getEmployees();
    const employee = employees.find(e => e.id === parseInt(id));
    if (!employee) {
      throw new Error('Employee not found');
    }
    return employee;
  } catch (error) {
    console.error(`Error fetching employee with id ${id}:`, error);
    throw error;
  }
};

// Function to create a new employee
export const createEmployee = async (employeeData) => {
  try {
    // In a real app, this would make a POST request to the server
    // For now, we'll simulate the creation by fetching existing employees
    // and returning the new employee with an incremented ID
    const employees = await getEmployees();
    const newId = employees.length > 0 ? Math.max(...employees.map(e => e.id)) + 1 : 1;
    
    const newEmployee = {
      id: newId,
      ...employeeData
    };
    
    // Note: In a real implementation, this would persist the data to the server
    // For this demo, we're just simulating the creation
    console.log('Creating employee:', newEmployee);
    return newEmployee;
  } catch (error) {
    console.error('Error creating employee:', error);
    throw error;
  }
};

// Function to update an existing employee
export const updateEmployee = async (id, employeeData) => {
  try {
    // In a real app, this would make a PUT request to the server
    // For now, we'll simulate the update
    console.log(`Updating employee with id ${id}:`, employeeData);
    
    // Return the updated employee data
    const updatedEmployee = {
      id: parseInt(id),
      ...employeeData
    };
    
    return updatedEmployee;
  } catch (error) {
    console.error(`Error updating employee with id ${id}:`, error);
    throw error;
  }
};

// Function to deactivate an employee
export const deactivateEmployee = async (id) => {
  try {
    // In a real app, this would make a PUT request to update the employee status
    // For now, we'll simulate the deactivation
    console.log(`Deactivating employee with id ${id}`);
    return id;
  } catch (error) {
    console.error(`Error deactivating employee with id ${id}:`, error);
    throw error;
  }
};

// Function to activate an employee
export const activateEmployee = async (id) => {
  try {
    // In a real app, this would make a PUT request to update the employee status
    // For now, we'll simulate the activation
    console.log(`Activating employee with id ${id}`);
    return id;
  } catch (error) {
    console.error(`Error activating employee with id ${id}:`, error);
    throw error;
  }
};

// Function to delete an employee
export const deleteEmployee = async (id) => {
  try {
    // In a real app, this would make a DELETE request to the server
    // For now, we'll simulate the deletion
    console.log(`Deleting employee with id ${id}`);
    return id;
  } catch (error) {
    console.error(`Error deleting employee with id ${id}:`, error);
    throw error;
  }
};

// Function to get employee statistics
export const getEmployeeStats = async () => {
  try {
    const employees = await getEmployees();
    const activeEmployees = employees.filter(e => e.status === 'Active').length;
    const inactiveEmployees = employees.filter(e => e.status === 'Inactive').length;
    
    return {
      total: employees.length,
      active: activeEmployees,
      inactive: inactiveEmployees
    };
  } catch (error) {
    console.error('Error fetching employee statistics:', error);
    throw error;
  }
};