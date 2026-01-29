/**
 * Log an activity to the console
 * @param {string} action - The action performed (e.g., "Complaint raised", "Issue marked resolved")
 * @param {object} user - User object with username and role
 * @param {object} details - Additional details about the action
 */
export const logActivity = (action, user, details = {}) => {
  const timestamp = new Date().toLocaleString();
  const userInfo = {
    username: user?.username || 'Unknown',
    role: user?.role || 'unknown'
  };

  // Format the log message 
  const logMessage = `[${timestamp}] [${userInfo.role.toUpperCase()}] ${userInfo.username}: ${action}`;
  
  // Log to console 
  console.log(
    `%c${logMessage}`,
    `color: ${userInfo.role === 'admin' ? '#6366f1' : '#3b82f6'}; font-weight: bold; font-size: 12px;`
  );
  
  // Log details as a separate object for better readability
  if (Object.keys(details).length > 0) {
    console.log('Details:', details);
  }
  
  // Add a separator line for better readability
  console.log('─'.repeat(60));
};

