// Function to fetch dashboard data from the JSON file
export const getDashboardData = async () => {
  try {
    const response = await fetch('/dashboardService.json');
    if (!response.ok) {
      throw new Error('Failed to fetch dashboard data');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};

// Function to get dashboard statistics
export const getDashboardStats = async () => {
  try {
    const data = await getDashboardData();
    return data.stats;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

// Function to get recent activity
export const getRecentActivity = async () => {
  try {
    const data = await getDashboardData();
    return data.recentActivity;
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    throw error;
  }
};

// Function to get all dashboard data with updated statistics
export const getDashboardDataWithStats = async () => {
  try {
    const dashboardData = await getDashboardData();
    return dashboardData;
  } catch (error) {
    console.error('Error fetching dashboard data with stats:', error);
    throw error;
  }
};