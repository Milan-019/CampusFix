import React from 'react';
import { IssueStatus, IssuePriority } from '../types';
import { Clock, CheckCircle2, AlertCircle, Wrench, Bell } from 'lucide-react';
import { sendManualReminder, getTimeSinceLastReminder, sendMaintenanceFollowUpReminder, getTimeSinceLastMaintenanceReminder } from '../services/reminderService';

const getStatusColor = (status) => {
  switch (status) {
    case IssueStatus.PENDING: return 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-yellow-300 shadow-md';
    case IssueStatus.IN_PROGRESS: return 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border-blue-300 shadow-md';
    case IssueStatus.RESOLVED: return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-300 shadow-md';
    default: return 'bg-slate-100 text-slate-800';
  }
};

const getPriorityColor = (priority) => {
    switch(priority) {
        case IssuePriority.CRITICAL: return 'text-red-600 font-bold drop-shadow-sm';
        case IssuePriority.HIGH: return 'text-orange-600 font-semibold drop-shadow-sm';
        case IssuePriority.LOW: return 'text-slate-500';
        default: return 'text-blue-600';
    }
}

const StatusIcon = ({ status }) => {
  switch (status) {
    case IssueStatus.PENDING: return <AlertCircle className="w-4 h-4 mr-1" />;
    case IssueStatus.IN_PROGRESS: return <Clock className="w-4 h-4 mr-1" />;
    case IssueStatus.RESOLVED: return <CheckCircle2 className="w-4 h-4 mr-1" />;
  }
};

// Helper to normalize complaint ID (handle both 'id' and '_id' from backend)
const getComplaintId = (complaint) => {
  return complaint.id || complaint._id;
};

export const ComplaintList = ({ complaints, isAdmin, onUpdateStatus, onReminderSent }) => {
  const handleSendReminder = (complaint) => {
    const complaintId = getComplaintId(complaint);
    const result = sendManualReminder(complaintId, complaint.title);
    if (onReminderSent) {
      onReminderSent(result.message);
    }
  };

  const handleSendMaintenanceFollowUpReminder = (complaint) => {
    const complaintId = getComplaintId(complaint);
    const result = sendMaintenanceFollowUpReminder(complaintId, complaint.title);
    if (onReminderSent) {
      onReminderSent(result.message);
    }
  };

  const handleSendMaintenanceReminder = (complaint) => {
    const complaintId = getComplaintId(complaint);
    const result = sendMaintenanceReminder(complaintId, complaint.title);
    if (onReminderSent) {
      onReminderSent(result.message);
    }
  };
  if (complaints.length === 0) {
    return (
      <div className="text-center py-12 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl shadow-md border-2 border-emerald-200 hover:shadow-lg transition-all">
        <div className="bg-gradient-to-r from-emerald-100 to-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 drop-shadow" />
        </div>
        <h3 className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">No complaints found</h3>
        <p className="text-teal-600 mt-1">Everything seems to be working perfectly! 🎉</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {complaints.map((complaint) => {
        const complaintId = getComplaintId(complaint);
        return (
        <div key={complaintId} className="bg-white rounded-xl shadow-md border-2 border-slate-200 p-5 transition-all duration-300 hover:shadow-xl hover:scale-101 hover:border-slate-300 transform">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <span className={`text-xs uppercase tracking-wider font-bold ${getPriorityColor(complaint.priority)}`}>
                    🚨 {complaint.priority} Priority
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1 hover:text-blue-600 transition-colors">{complaint.title}</h3>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border-2 flex items-center transition-all ${getStatusColor(complaint.status)}`}>
                  <StatusIcon status={complaint.status} />
                  {complaint.status}
                </span>
              </div>
              
              <div className="flex items-center text-sm text-slate-600 mt-2 mb-3 font-medium">
                <span className="bg-gradient-to-r from-purple-100 to-blue-100 px-2 py-1 rounded-full mr-2 text-purple-700">{complaint.type}</span>
                <span>• {complaint.location}</span>
                <span className="mx-2">•</span>
                <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
              </div>

              <p className="text-slate-600 text-sm mb-3">{complaint.description}</p>
              
              {complaint.aiAnalysis && (
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-md p-3 text-xs text-indigo-800 mb-3 flex items-start hover:shadow-md transition-all">
                      <Wrench className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-indigo-600" />
                      <span className="font-medium">{complaint.aiAnalysis}</span>
                  </div>
              )}

              {complaint.imageUrl && (
                <div className="mt-2 mb-3">
                  <img 
                    src={complaint.imageUrl} 
                    alt="Proof" 
                    className="w-24 h-24 object-cover rounded-lg border-2 border-slate-300 cursor-pointer hover:opacity-90 transform hover:scale-110 transition-all shadow-md" 
                  />
                </div>
              )}

              {/* Reminder buttons for students */}
              {!isAdmin && (
                <div className="mt-3 space-y-2">
                  {/* Reminder button for pending complaints */}
                  {complaint.status === IssueStatus.PENDING && (
                    <>
                      <button
                        onClick={() => handleSendReminder(complaint)}
                        className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-orange-100 to-rose-100 text-orange-700 text-xs font-bold rounded-lg hover:from-orange-200 hover:to-rose-200 transition-all transform hover:scale-105 border-2 border-orange-300 shadow-md hover:shadow-lg"
                      >
                        <Bell className="w-4 h-4" />
                        Send Reminder to Admin
                      </button>
                      {getTimeSinceLastReminder(complaintId) && (
                        <p className="text-xs text-slate-500 mt-1 font-medium">
                          Last reminder: {getTimeSinceLastReminder(complaintId)}
                        </p>
                      )}
                    </>
                  )}
                  
                  {/* Reminder button for in-progress complaints */}
                  {complaint.status === IssueStatus.IN_PROGRESS && (
                    <>
                      <button
                        onClick={() => handleSendMaintenanceFollowUpReminder(complaint)}
                        className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 text-xs font-bold rounded-lg hover:from-blue-200 hover:to-cyan-200 transition-all transform hover:scale-105 border-2 border-blue-300 shadow-md hover:shadow-lg"
                      >
                        <Bell className="w-4 h-4" />
                        Remind Admin to Follow Up with Maintenance
                      </button>
                      {getTimeSinceLastMaintenanceReminder(complaintId) && (
                        <p className="text-xs text-slate-500 mt-1 font-medium">
                          Last reminder: {getTimeSinceLastMaintenanceReminder(complaintId)}
                        </p>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
            
            {isAdmin && onUpdateStatus && (
              <div className="flex sm:flex-col gap-2 sm:border-l sm:pl-4 sm:ml-2 sm:w-40 justify-center sm:justify-start">
                <p className="text-xs font-bold text-slate-500 uppercase hidden sm:block mb-2">⚙️ Actions</p>
                {complaint.status === IssueStatus.PENDING && (
                  <button
                    onClick={() => onUpdateStatus(complaintId, IssueStatus.IN_PROGRESS)}
                    className="flex-1 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 text-xs font-bold px-3 py-2 rounded-lg hover:from-blue-200 hover:to-cyan-200 transition-all transform hover:scale-105 border-2 border-blue-300 shadow-md hover:shadow-lg"
                  >
                    ▶️ Assign & Start
                  </button>
                )}
                {complaint.status === IssueStatus.IN_PROGRESS && (
                  <button
                    onClick={() => onUpdateStatus(complaintId, IssueStatus.RESOLVED)}
                    className="flex-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 text-xs font-bold px-3 py-2 rounded-lg hover:from-green-200 hover:to-emerald-200 transition-all transform hover:scale-105 border-2 border-green-300 shadow-md hover:shadow-lg"
                  >
                    ✓ Mark Resolved
                  </button>
                )}
                {complaint.status === IssueStatus.RESOLVED && (
                   <div className="text-center text-xs text-green-700 font-bold py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-300">
                       ✓ Completed
                   </div>
                )}
              </div>
            )}
          </div>
          
          <div className="mt-3 pt-3 border-t-2 border-slate-200 flex justify-between items-center text-xs text-slate-500 font-medium">
            <span className="bg-slate-100 px-2 py-1 rounded">ID: #{complaintId ? complaintId.slice(0, 8) : 'N/A'}</span>
            <span className="text-slate-600">Assigned: <span className="font-bold">{complaint.assignedTo || 'Pending'}</span></span>
          </div>
        </div>
        );
      })}
    </div>
  );
};