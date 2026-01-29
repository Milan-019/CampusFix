import React, { useState } from 'react';
import { Plus, LayoutDashboard } from 'lucide-react';
import { ComplaintForm } from '../components/ComplaintForm';
import { ComplaintList } from '../components/ComplaintList';

export const StudentPage = ({ complaints, isLoading, onAddComplaint, onReminderSent }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleAddComplaint = (data) => {
    onAddComplaint(data);
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6">
      {!isFormOpen && (
        <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-2xl mb-8 transform hover:scale-102 transition-transform hover:shadow-3xl border-4 border-blue-400">
          <h2 className="text-3xl font-bold mb-3">🎯 Spot a problem? Fix it.</h2>
          <p className="text-blue-100 mb-6 max-w-lg text-lg">
            Report broken fans, lights, or cleanliness issues instantly. 
            Our AI helps categorize it automatically!
          </p>
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-bold shadow-xl hover:shadow-2xl hover:bg-blue-50 transition-all transform hover:scale-105 active:scale-95 flex items-center border-2 border-blue-300"
          >
            <Plus className="w-6 h-6 mr-2" />
            Raise New Complaint
          </button>
        </div>
      )}

      {isFormOpen ? (
        <ComplaintForm onSubmit={handleAddComplaint} onCancel={() => setIsFormOpen(false)} />
      ) : (
        <div>
          <h3 className="text-2xl font-bold text-slate-800 mb-4 flex items-center drop-shadow-sm">
            <LayoutDashboard className="w-6 h-6 mr-2 text-blue-600" />
            📋 Your Campus Feed
          </h3>
          {isLoading ? (
            <div className="text-center py-10 text-slate-500 font-medium text-lg">⏳ Loading complaints...</div>
          ) : (
            <ComplaintList 
              complaints={complaints} 
              onReminderSent={onReminderSent}
            />
          )}
        </div>
      )}
    </div>
  );
};
