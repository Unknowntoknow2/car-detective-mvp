
// Only updating the problematic status check part
export const fixStatusCheck = (status?: string) => {
  if (!status) return 'Unknown';
  
  // Convert status to lowercase for case-insensitive comparison
  const lowerStatus = status.toLowerCase();
  
  // Check if the status is 'available' and return 'Active' instead
  if (lowerStatus === 'available') {
    return 'Active';
  }
  
  // For all other statuses, capitalize the first letter
  return status.charAt(0).toUpperCase() + status.slice(1);
};
