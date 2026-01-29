import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { IssueType, IssueStatus } from '../types';

export const AdminDashboard = ({ complaints }) => {
  // Calculate Stats
  const total = complaints.length;
  const pending = complaints.filter(c => c.status === IssueStatus.PENDING).length;
  const resolved = complaints.filter(c => c.status === IssueStatus.RESOLVED).length;
  const inProgress = complaints.filter(c => c.status === IssueStatus.IN_PROGRESS).length;

  // Chart Data: By Type
  const typeData = Object.values(IssueType).map(type => ({
    name: type,
    count: complaints.filter(c => c.type === type).length
  }));

  const COLORS = ['#3b82f6', '#0ea5e9', '#22c55e', '#f59e0b', '#ec4899', '#8b5cf6'];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-5 rounded-xl shadow-lg border-2 border-slate-300 hover:shadow-xl transform hover:scale-105 transition-all hover:from-slate-100 hover:to-slate-200">
          <p className="text-xs text-slate-600 uppercase font-bold">📊 Total Issues</p>
          <p className="text-3xl font-bold text-slate-800 mt-2">{total}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-5 rounded-xl shadow-lg border-2 border-yellow-300 hover:shadow-xl transform hover:scale-105 transition-all hover:from-yellow-100 hover:to-amber-100">
          <p className="text-xs text-yellow-700 uppercase font-bold">⏳ Pending</p>
          <p className="text-3xl font-bold text-yellow-800 mt-2">{pending}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-5 rounded-xl shadow-lg border-2 border-blue-300 hover:shadow-xl transform hover:scale-105 transition-all hover:from-blue-100 hover:to-cyan-100">
          <p className="text-xs text-blue-700 uppercase font-bold">▶️ In Progress</p>
          <p className="text-3xl font-bold text-blue-800 mt-2">{inProgress}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-xl shadow-lg border-2 border-green-300 hover:shadow-xl transform hover:scale-105 transition-all hover:from-green-100 hover:to-emerald-100">
          <p className="text-xs text-green-700 uppercase font-bold">✓ Resolved</p>
          <p className="text-3xl font-bold text-green-800 mt-2">{resolved}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Issues by Category Chart */}
        <div className="bg-gradient-to-br from-white to-slate-50 p-6 rounded-xl shadow-lg border-2 border-slate-300 hover:shadow-xl transition-all">
          <h4 className="text-sm font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">📈 Issues by Category</h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={typeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  tick={{ fill: '#64748b', fontWeight: 'bold' }}
                  height={30}
                />
                <YAxis 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  allowDecimals={false}
                  tick={{ fill: '#64748b', fontWeight: 'bold' }}
                  width={40}
                />
                <Tooltip 
                    cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                    contentStyle={{ borderRadius: '12px', border: '2px solid #3b82f6', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.2)', backgroundColor: '#f0f9ff' }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]} animationDuration={800}>
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity Mini Feed (Simulated) */}
        <div className="bg-gradient-to-br from-white to-slate-50 p-6 rounded-xl shadow-lg border-2 border-slate-300 hover:shadow-xl transition-all">
           <h4 className="text-sm font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">🎯 Hotspot Areas</h4>
           <div className="space-y-3">
               <div className="flex justify-between items-center text-sm border-b-2 border-slate-200 pb-3 px-3 py-2 rounded-lg hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50 transition-all transform hover:scale-102">
                   <span className="text-slate-700 font-medium">Block A - Washrooms</span>
                   <span className="font-bold text-white bg-gradient-to-r from-red-500 to-rose-500 px-3 py-1 rounded-full text-xs shadow-md">🔴 Critical</span>
               </div>
               <div className="flex justify-between items-center text-sm border-b-2 border-slate-200 pb-3 px-3 py-2 rounded-lg hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 transition-all transform hover:scale-102">
                   <span className="text-slate-700 font-medium">Library - 2nd Floor</span>
                   <span className="font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 px-3 py-1 rounded-full text-xs shadow-md">🟠 High</span>
               </div>
               <div className="flex justify-between items-center text-sm border-b-2 border-slate-200 pb-3 px-3 py-2 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all transform hover:scale-102">
                   <span className="text-slate-700 font-medium">Cafeteria</span>
                   <span className="font-bold text-white bg-gradient-to-r from-blue-500 to-cyan-500 px-3 py-1 rounded-full text-xs shadow-md">🔵 Normal</span>
               </div>
               <div className="mt-4 p-4 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg border-2 border-indigo-300 hover:shadow-md transition-all transform hover:scale-102">
                   <p className="text-xs text-indigo-900 font-semibold">
                       💡 <strong>Insight:</strong> 40% of issues are electrical this week. Recommend checking main fuse box in Block A.
                   </p>
               </div>
           </div>
        </div>
      </div>
    </div>
  );
};