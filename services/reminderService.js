import { IssueStatus } from '../types';

const REMINDER_STORAGE_KEY = 'campusfix_reminders';
const MAINT_REMINDER_STORAGE_KEY = 'campusfix_maintenance_reminders';
const REMINDER_INTERVAL_MS = 2 * 24 * 60 * 60 * 1000; // 2 days in milliseconds

/**
 * Get all reminders from storage
 */
export const getReminders = () => {
  try {
    const reminders = localStorage.getItem(REMINDER_STORAGE_KEY);
    return reminders ? JSON.parse(reminders) : {};
  } catch (error) {
    console.error('Error reading reminders:', error);
    return {};
  }
};

// Get maintenance reminder state from storage
 
export const getMaintenanceReminders = () => {
  try {
    const reminders = localStorage.getItem(MAINT_REMINDER_STORAGE_KEY);
    return reminders ? JSON.parse(reminders) : {};
  } catch (error) {
    console.error('Error reading maintenance reminders:', error);
    return {};
  }
};

const saveMaintenanceReminders = (reminders) => {
  try {
    localStorage.setItem(MAINT_REMINDER_STORAGE_KEY, JSON.stringify(reminders));
  } catch (error) {
    console.error('Error saving maintenance reminders:', error);
  }
};


 // Save reminders to storage
 
const saveReminders = (reminders) => {
  try {
    localStorage.setItem(REMINDER_STORAGE_KEY, JSON.stringify(reminders));
  } catch (error) {
    console.error('Error saving reminders:', error);
  }
};


//Get last reminder timestamp for a complaint

export const getLastReminderTime = (complaintId) => {
  const reminders = getReminders();
  return reminders[complaintId] || null;
};

 
//Set reminder timestamp for a complaint
export const setReminderTime = (complaintId) => {
  const reminders = getReminders();
  reminders[complaintId] = Date.now();
  saveReminders(reminders);
};


//Mark a complaint as assigned to maintenance (sets assignedAt if missing)

export const markAssignedToMaintenance = (complaintId) => {
  const reminders = getMaintenanceReminders();
  if (!reminders[complaintId]) {
    reminders[complaintId] = { assignedAt: Date.now(), lastReminderAt: null };
  } else if (!reminders[complaintId].assignedAt) {
    reminders[complaintId].assignedAt = Date.now();
  }
  saveMaintenanceReminders(reminders);
};

export const getLastMaintenanceReminderTime = (complaintId) => {
  const reminders = getMaintenanceReminders();
  return reminders[complaintId]?.lastReminderAt || null;
};

export const setMaintenanceReminderTime = (complaintId) => {
  const reminders = getMaintenanceReminders();
  if (!reminders[complaintId]) {
    reminders[complaintId] = { assignedAt: Date.now(), lastReminderAt: Date.now() };
  } else {
    reminders[complaintId].lastReminderAt = Date.now();
    reminders[complaintId].assignedAt = reminders[complaintId].assignedAt || Date.now();
  }
  saveMaintenanceReminders(reminders);
};

export const needsMaintenanceReminder = (complaintId) => {
  const reminders = getMaintenanceReminders();
  const record = reminders[complaintId];
  const now = Date.now();

  // If we don't know assignment time yet, do not remind.
  if (!record?.assignedAt) return false;

  // If never reminded, remind 2 days after assignment.
  if (!record.lastReminderAt) {
    return now - record.assignedAt >= REMINDER_INTERVAL_MS;
  }

  // Otherwise remind every 2 days after last reminder.
  return now - record.lastReminderAt >= REMINDER_INTERVAL_MS;
};

/**
 * Check if a complaint needs a reminder (2 days have passed since last reminder)
 */
export const needsReminder = (complaintId, complaintCreatedAt) => {
  const lastReminder = getLastReminderTime(complaintId);
  const now = Date.now();
  
  // If never reminded, check if complaint is older than 2 days
  if (!lastReminder) {
    const complaintAge = now - complaintCreatedAt;
    return complaintAge >= REMINDER_INTERVAL_MS;
  }
  
  // If reminded before, check if 2 days have passed since last reminder
  const timeSinceLastReminder = now - lastReminder;
  return timeSinceLastReminder >= REMINDER_INTERVAL_MS;
};

/**
 * Get all pending complaints that need reminders
 */
export const getPendingComplaintsNeedingReminders = (complaints) => {
  const pendingComplaints = complaints.filter(
    c => c.status === IssueStatus.PENDING || c.status === 'Pending' || c.status === 'pending'
  );
  
  return pendingComplaints.filter(complaint => 
    needsReminder(complaint.id, complaint.createdAt)
  );
};

/**
 * Get all in-progress complaints that need maintenance reminders
 * Only applies if they have been assigned to maintenance (via markAssignedToMaintenance)
 */
export const getInProgressComplaintsNeedingMaintenanceReminders = (complaints) => {
  const inProgress = complaints.filter(c => c.status === IssueStatus.IN_PROGRESS);
  return inProgress.filter(c => needsMaintenanceReminder(c.id));
};

/**
 * Send a manual reminder (student-initiated)
 */
export const sendManualReminder = (complaintId, complaintTitle) => {
  setReminderTime(complaintId);
  
  // Log the reminder
  console.log(
    `%c[REMINDER] Manual reminder sent for complaint: ${complaintTitle} (ID: ${complaintId})`,
    'color: #f59e0b; font-weight: bold; font-size: 12px;'
  );
  
  return {
    success: true,
    message: `Reminder sent to admin for: ${complaintTitle}`
  };
};

/**
 * Send a manual reminder to maintenance (admin-initiated)
 */
export const sendMaintenanceReminder = (complaintId, complaintTitle) => {
  setMaintenanceReminderTime(complaintId);

  console.log(
    `%c[REMINDER] Maintenance reminder sent for: ${complaintTitle} (ID: ${complaintId})`,
    'color: #0ea5e9; font-weight: bold; font-size: 12px;'
  );

  return {
    success: true,
    message: `Reminder sent to maintenance for: ${complaintTitle}`
  };
};

/**
 * Send a reminder from student to admin to follow up with maintenance team
 */
export const sendMaintenanceFollowUpReminder = (complaintId, complaintTitle) => {
  setMaintenanceReminderTime(complaintId);

  console.log(
    `%c[REMINDER] Student reminder to admin for maintenance follow-up: ${complaintTitle} (ID: ${complaintId})`,
    'color: #3b82f6; font-weight: bold; font-size: 12px;'
  );

  return {
    success: true,
    message: `Reminder sent to admin to follow up with maintenance team for: ${complaintTitle}`
  };
};

/**
 * Format time since last reminder
 */
export const getTimeSinceLastReminder = (complaintId) => {
  const lastReminder = getLastReminderTime(complaintId);
  if (!lastReminder) return null;
  
  const diff = Date.now() - lastReminder;
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  return 'Just now';
};

export const getTimeSinceLastMaintenanceReminder = (complaintId) => {
  const lastReminder = getLastMaintenanceReminderTime(complaintId);
  if (!lastReminder) return null;

  const diff = Date.now() - lastReminder;
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  return 'Just now';
};

/**
 * Clear reminder data for a complaint (when resolved)
 */
export const clearReminder = (complaintId) => {
  const reminders = getReminders();
  delete reminders[complaintId];
  saveReminders(reminders);
};

export const clearMaintenanceReminder = (complaintId) => {
  const reminders = getMaintenanceReminders();
  delete reminders[complaintId];
  saveMaintenanceReminders(reminders);
};

