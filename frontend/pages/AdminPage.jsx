import React from 'react';
import { AdminDashboard } from '../components/AdminDashboard';
import { ComplaintList } from '../components/ComplaintList';

export const AdminPage = ({ complaints, onUpdateStatus, onReminderSent }) => {
  return (
    <div className="space-y-8">
      <AdminDashboard complaints={complaints} />
      
      <div>
        <h3 className="text-2xl font-bold text-slate-800 mb-4 drop-shadow-sm">🎫 Manage Tickets</h3>
        <ComplaintList 
          complaints={complaints} 
          isAdmin={true} 
          onUpdateStatus={onUpdateStatus} 
          onReminderSent={onReminderSent}
        />
      </div>
      
      <div className="bg-gradient-to-r from-blue-100 to-indigo-100 border-2 border-blue-400 rounded-xl p-6 shadow-md hover:shadow-lg transition-all transform hover:scale-101">
        <p className="text-sm text-blue-900 font-medium">
          <strong>💡 Activity Logs:</strong> All activities are logged to the browser console. 
          Open Developer Tools (F12) to view detailed logs.
        </p>
      </div>
    </div>
  );
};
