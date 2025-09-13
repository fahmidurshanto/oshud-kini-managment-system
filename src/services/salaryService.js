// Function to fetch salary data from the JSON file
export const getSalaryData = async () => {
  try {
    const response = await fetch('/salaryService.json');
    if (!response.ok) {
      throw new Error('Failed to fetch salary data');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching salary data:', error);
    throw error;
  }
};

// Function to get salary history
export const getSalaryHistory = async () => {
  try {
    const data = await getSalaryData();
    return data.salaries;
  } catch (error) {
    console.error('Error fetching salary history:', error);
    throw error;
  }
};

// Function to get current month employees for salary processing
export const getCurrentMonthEmployees = async () => {
  try {
    const data = await getSalaryData();
    return data.currentMonthEmployees;
  } catch (error) {
    console.error('Error fetching current month employees:', error);
    throw error;
  }
};

// Function to process salaries
export const processSalaries = async (salaryData) => {
  try {
    // In a real app, this would make a POST request to the server
    // For now, we'll simulate the processing
    console.log('Processing salaries:', salaryData);
    return salaryData;
  } catch (error) {
    console.error('Error processing salaries:', error);
    throw error;
  }
};

// Function to add adjustment (bonus/deduction) for an employee
export const addAdjustment = async (employeeId, adjustmentData) => {
  try {
    // In a real app, this would make a POST request to the server
    // For now, we'll simulate adding an adjustment
    console.log(`Adding adjustment for employee ${employeeId}:`, adjustmentData);
    return { employeeId, ...adjustmentData };
  } catch (error) {
    console.error(`Error adding adjustment for employee ${employeeId}:`, error);
    throw error;
  }
};

// Function to get a specific salary record by ID
export const getSalaryById = async (id) => {
  try {
    const salaries = await getSalaryHistory();
    const salary = salaries.find(s => s.id === parseInt(id));
    if (!salary) {
      throw new Error('Salary record not found');
    }
    return salary;
  } catch (error) {
    console.error(`Error fetching salary with id ${id}:`, error);
    throw error;
  }
};

// Function to create a new salary record
export const createSalaryRecord = async (salaryData) => {
  try {
    // In a real app, this would make a POST request to the server
    // For now, we'll simulate the creation
    const salaries = await getSalaryHistory();
    const newId = salaries.length > 0 ? Math.max(...salaries.map(s => s.id)) + 1 : 1;
    
    const newSalary = {
      id: newId,
      ...salaryData
    };
    
    console.log('Creating salary record:', newSalary);
    return newSalary;
  } catch (error) {
    console.error('Error creating salary record:', error);
    throw error;
  }
};

// Function to update an existing salary record
export const updateSalaryRecord = async (id, salaryData) => {
  try {
    // In a real app, this would make a PUT request to the server
    // For now, we'll simulate the update
    console.log(`Updating salary record with id ${id}:`, salaryData);
    
    const updatedSalary = {
      id: parseInt(id),
      ...salaryData
    };
    
    return updatedSalary;
  } catch (error) {
    console.error(`Error updating salary record with id ${id}:`, error);
    throw error;
  }
};

// Function to delete a salary record
export const deleteSalaryRecord = async (id) => {
  try {
    // In a real app, this would make a DELETE request to the server
    // For now, we'll simulate the deletion
    console.log(`Deleting salary record with id ${id}`);
    return id;
  } catch (error) {
    console.error(`Error deleting salary record with id ${id}:`, error);
    throw error;
  }
};