import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { IssueType, IssueStatus, IssuePriority } from './types';
import { AuthForm } from './components/AuthForm';
import { Notification } from './components/Notification';
import { LogOut, GraduationCap, WifiOff, Shield } from 'lucide-react';
import { logActivity } from './services/activityLogger';
import { clearReminder, clearMaintenanceReminder, markAssignedToMaintenance } from './services/reminderService';
import { StudentPage } from './pages/StudentPage';
import { AdminPage } from './pages/AdminPage';
import Landing from "./pages/Landing";

const API_URL = 'http://localhost:3001/api/complaints';

// Mock Initial Data (Fallback)
const MOCK_DATA = [
  {
    id: '101',
    title: 'Water cooler leaking (Demo)',
    description: 'The water cooler on the 2nd floor near room 204 is leaking extensively.',
    location: 'Block B, 2nd Floor',
    type: IssueType.WATER,
    status: IssueStatus.PENDING,
    priority: IssuePriority.MEDIUM,
    createdAt: Date.now() - 10000000,
    assignedTo: '',
    aiAnalysis: 'Seal replacement required for water dispenser unit.'
  }
];

const App = () => {
  const [user, setUser] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isBackendOffline, setIsBackendOffline] = useState(false);
  const [notification, setNotification] = useState(null);

  // Check for local storage token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setUser({ ...JSON.parse(savedUser), token });
    }
  }, []);

  // Fetch Complaints when user logs in
  useEffect(() => {
    if (user) {
      fetchComplaints();
    }
  }, [user]);


  // Clear reminders when complaints are resolved
  useEffect(() => {
    if (!user) return;

    complaints.forEach(complaint => {
      if (complaint.status === IssueStatus.RESOLVED) {
        clearReminder(complaint.id);
        clearMaintenanceReminder(complaint.id);
      }
    });
  }, [complaints, user]);

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
  };

  const handleLogin = (token, userData) => {
    const fullUser = { ...userData, token };
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(fullUser);
    showNotification(`Welcome back, ${userData.username}!`, 'success');

    // Log login activity
    logActivity('User logged in', fullUser, {
      username: userData.username,
      role: userData.role
    });
  };

  const handleLogout = () => {
    // Log logout activity before clearing user
    if (user) {
      logActivity('User logged out', user, {
        username: user.username,
        role: user.role
      });
    }

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setComplaints([]);
    showNotification('Logged out successfully', 'info');
  };

  const fetchComplaints = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_URL, {
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });

      if (response.status === 401 || response.status === 403) {
        handleLogout();
        showNotification('Session expired. Please login again.', 'warning');
        return;
      }

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      setComplaints(data);
      setIsBackendOffline(false);
    } catch (error) {
      console.warn("Fetch error:", error);

      // Determine if it's a network error or server error
      if (error.message.includes('Failed to fetch') || error.message.includes('Network request failed')) {
        if (!isBackendOffline) {
          setIsBackendOffline(true);
          showNotification('Cannot connect to server. Switching to offline mode.', 'warning');
        }
        if (complaints.length === 0) {
          setComplaints(MOCK_DATA);
        }
      } else {
        showNotification('Failed to load complaints. Please try again later.', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddComplaint = async (data) => {
    const newComplaint = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
    };

    try {
      if (isBackendOffline) {
        // Offline simulation
        const mockSaved = {
          ...newComplaint,
          createdAt: Date.now(),
          status: IssueStatus.PENDING,
          assignedTo: ''
        };
        setComplaints([mockSaved, ...complaints]);
        showNotification('Offline mode: Complaint saved locally (simulation).', 'info');

        // Log offline complaint
        logActivity('Complaint raised (offline mode)', user, {
          complaintId: mockSaved.id,
          title: newComplaint.title,
          type: newComplaint.type,
          priority: newComplaint.priority,
          location: newComplaint.location
        });
      } else {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user?.token}`
          },
          body: JSON.stringify(newComplaint)
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || 'Failed to submit complaint');
        }

        const savedComplaint = await response.json();

        // Ensure ID is properly mapped from MongoDB _id field
        const complaintWithId = {
          ...savedComplaint,
          id: savedComplaint.id || savedComplaint._id || newComplaint.id
        };

        setComplaints([complaintWithId, ...complaints]);
        showNotification('Complaint submitted successfully!', 'success');

        // Log complaint raised activity
        logActivity('Complaint raised', user, {
          complaintId: complaintWithId.id,
          title: newComplaint.title,
          type: newComplaint.type,
          priority: newComplaint.priority,
          location: newComplaint.location
        });
      }
    } catch (error) {
      showNotification(error.message || "Error submitting complaint.", 'error');
    }
  };

  const handleReminderSent = (message) => {
    showNotification(message, 'success');
    logActivity('Reminder sent to admin', user, { message });
  };

  const handleUpdateStatus = async (id, newStatus) => {
    // Only admins
    if (user?.role !== 'admin') return;

    // Guard against undefined ID
    if (!id || typeof id !== 'string') {
      console.error('Invalid complaint ID:', id);
      showNotification('Invalid complaint ID. Cannot update.', 'error');
      return;
    }

    const previousComplaints = [...complaints];

    // Optimistic Update - handle both 'id' and '_id' from backend
    setComplaints(prev => prev.map(c => {
      const complaintId = c.id || c._id;
      if (complaintId === id) {
        return {
          ...c,
          status: newStatus,
          assignedTo: newStatus === IssueStatus.IN_PROGRESS && !c.assignedTo
            ? 'Maintenance Staff' // Generic assignment for now
            : c.assignedTo
        };
      }
      return c;
    }));

    if (!isBackendOffline) {
      try {
        const response = await fetch(`${API_URL}/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user?.token}`
          },
          body: JSON.stringify({ status: newStatus, assignedTo: 'Maintenance Staff' })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP ${response.status}: Failed to update status`);
        }

        // Get updated complaint from server response
        const updatedComplaint = await response.json();

        // Update state with server response to confirm and sync data
        setComplaints(prev => prev.map(c => {
          const complaintId = c.id || c._id;
          if (complaintId === id) {
            return {
              ...c,
              ...updatedComplaint,
              id: updatedComplaint.id || updatedComplaint._id || id
            };
          }
          return c;
        }));

        // Find the complaint for logging
        const complaint = previousComplaints.find(c => (c.id || c._id) === id);

        // Log status update activity
        let actionMessage = '';
        if (newStatus === IssueStatus.RESOLVED) {
          actionMessage = 'Issue marked resolved';
        } else if (newStatus === IssueStatus.IN_PROGRESS) {
          actionMessage = 'Issue assigned';
        } else {
          actionMessage = `Issue status updated to ${newStatus}`;
        }

        logActivity(actionMessage, user, {
          complaintId: id,
          complaintTitle: complaint?.title || 'Unknown',
          previousStatus: complaint?.status,
          newStatus: newStatus,
          assignedTo: newStatus === IssueStatus.IN_PROGRESS ? 'Maintenance Staff' : complaint?.assignedTo
        });

        // When assigned, start maintenance reminder tracking (first reminder after 2 days)
        if (newStatus === IssueStatus.IN_PROGRESS) {
          markAssignedToMaintenance(id);
        }

        showNotification(`Status updated to ${newStatus}`, 'success');
      } catch (error) {
        console.error("Failed to update status on server:", error);
        setComplaints(previousComplaints); // Revert

        // Better error messaging
        if (error.message.includes('Failed to fetch') || error.message.includes('Network')) {
          setIsBackendOffline(true);
          showNotification('Backend disconnected. Switched to offline mode.', 'warning');
        } else {
          showNotification(`Error: ${error.message}`, 'error');
        }
      }
    } else {
      // Log offline status update
      const complaint = complaints.find(c => c.id === id);
      let actionMessage = '';
      if (newStatus === IssueStatus.RESOLVED) {
        actionMessage = 'Issue marked resolved (offline mode)';
      } else if (newStatus === IssueStatus.IN_PROGRESS) {
        actionMessage = 'Issue assigned (offline mode)';
      } else {
        actionMessage = `Issue status updated to ${newStatus} (offline mode)`;
      }

      logActivity(actionMessage, user, {
        complaintId: id,
        complaintTitle: complaint?.title || 'Unknown',
        previousStatus: complaint?.status,
        newStatus: newStatus,
        assignedTo: newStatus === IssueStatus.IN_PROGRESS ? 'Maintenance Staff' : complaint?.assignedTo
      });

      if (newStatus === IssueStatus.IN_PROGRESS) {
        markAssignedToMaintenance(id);
      }
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 pb-20 md:pb-0">

        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}

        <Routes>
          {/* Auth Route */}
          <Route path="/auth" element={
            !user ? (
              <div className="relative min-h-screen w-full bg-cover bg-center">
                {notification && (
                  <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                  />
                )}
                <header className="absolute top-0 left-0 w-full z-50">
                  <div className="px-4 h-16 flex items-center">
                    <div className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
      onClick={() => navigate("/")}>
                      <div className=" p-2 rounded-xl backdrop-blur-sm transform hover:scale-110 transition-transform">
                        <GraduationCap className="w-7 h-7 text-black" />
                      </div>
                      <h1 className="text-2xl font-bold text-Blue drop-shadow-lg">
                        🏫 CampusFix
                      </h1>
                    </div>
                  </div>
                </header>
                <AuthForm onLogin={handleLogin} />
              </div>
            ) : (
              <Navigate to={user.role === 'admin' ? '/admin' : '/student'} />
            )
          } />

          {/* Student Route */}
          <Route path="/student" element={
            user && user.role === 'student' ? (
              <>
                {/* Navbar */}
                <header className="bg-gradient-to-r from-blue-600 to-indigo-600 border-b-4 border-blue-700 sticky top-0 z-10 shadow-lg">
                  <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm transform hover:scale-110 transition-transform">
                        <GraduationCap className="w-7 h-7 text-white" />
                      </div>
                      <h1 className="text-xl font-bold text-white drop-shadow-lg">
                        🏫 CampusFix <span className="text-xs font-normal text-blue-100 ml-2 border-l border-blue-200 pl-2 uppercase tracking-widest">Student Portal</span>
                      </h1>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-sm text-blue-100 hidden sm:block font-medium">
                        👋 <span className="text-white font-bold">{user.username}</span>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="text-blue-100 hover:text-red-300 transition-all p-2 transform hover:scale-110 hover:rotate-180 duration-300"
                        title="Logout"
                      >
                        <LogOut className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </header>

                {isBackendOffline && (
                  <div className="bg-gradient-to-r from-orange-400 to-rose-400 text-white text-sm font-bold text-center py-3 px-4 flex justify-center items-center animate-pulse shadow-lg">
                    <WifiOff className="w-5 h-5 mr-2" />
                    ⚠️ Backend disconnected. Running in offline demo mode.
                  </div>
                )}

                <main className="max-w-5xl mx-auto px-4 py-6">
                  <StudentPage
                    complaints={complaints}
                    isLoading={isLoading}
                    onAddComplaint={handleAddComplaint}
                    onReminderSent={handleReminderSent}
                  />
                </main>
              </>
            ) : (
              <Navigate to="/auth" />
            )
          } />

          {/* Admin Route */}
          <Route path="/admin" element={
            user && user.role === 'admin' ? (
              <>
                {/* Navbar */}
                <header className="bg-gradient-to-r from-blue-600 to-indigo-600 border-b-4 border-blue-700 sticky top-0 z-10 shadow-lg">
                  <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-purple-500/30 p-2 rounded-xl backdrop-blur-sm transform hover:scale-110 transition-transform">
                        <Shield className="w-7 h-7 text-white" />
                      </div>
                      <h1 className="text-xl font-bold text-white drop-shadow-lg">
                        🏫 CampusFix <span className="text-xs font-normal text-blue-100 ml-2 border-l border-blue-200 pl-2 uppercase tracking-widest">Admin Portal</span>
                      </h1>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-sm text-blue-100 hidden sm:block font-medium">
                        👋 <span className="text-white font-bold">{user.username}</span>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="text-blue-100 hover:text-red-300 transition-all p-2 transform hover:scale-110 hover:rotate-180 duration-300"
                        title="Logout"
                      >
                        <LogOut className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </header>

                {isBackendOffline && (
                  <div className="bg-gradient-to-r from-orange-400 to-rose-400 text-white text-sm font-bold text-center py-3 px-4 flex justify-center items-center animate-pulse shadow-lg">
                    <WifiOff className="w-5 h-5 mr-2" />
                    ⚠️ Backend disconnected. Running in offline demo mode.
                  </div>
                )}

                <main className="max-w-5xl mx-auto px-4 py-6">
                  <AdminPage
                    complaints={complaints}
                    onUpdateStatus={handleUpdateStatus}
                    onReminderSent={handleReminderSent}
                  />
                </main>
              </>
            ) : (
              <Navigate to="/auth" />
            )
          } />

          {/* Landing Page */}
          <Route path="/" element={
            user ? (
              <Navigate to={user.role === 'admin' ? '/admin' : '/student'} />
            ) : (
              <Landing />
            )
          } />
        </Routes>

      </div>
    </Router>
  );
};

export default App;
