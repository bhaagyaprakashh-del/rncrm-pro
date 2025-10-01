import React from 'react';
import { FileText, Download, Share2, Trash2, Calendar, Filter } from 'lucide-react';

export const MyReports: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">My Reports</h1>
          <p className="text-slate-400 mt-1">Manage your personal and shared reports</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors">
            <Filter className="h-4 w-4" />
            Filter
          </button>
        </div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700/50 text-center">
        <FileText className="h-16 w-16 text-slate-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">My Reports</h2>
        <p className="text-slate-400 mb-6">View and manage your personal and shared reports</p>
        <div className="bg-blue-500/20 text-blue-400 px-4 py-2 rounded-lg inline-block">
          Coming Soon - Full reports management interface
        </div>
      </div>
    </div>
  );
};

export default MyReports;