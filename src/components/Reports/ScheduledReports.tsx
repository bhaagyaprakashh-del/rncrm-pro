import React from 'react';
import { Clock, Calendar, Settings, Play, Pause } from 'lucide-react';

export const ScheduledReports: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Scheduled Reports</h1>
          <p className="text-slate-400 mt-1">Manage automated report generation</p>
        </div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700/50 text-center">
        <Clock className="h-16 w-16 text-slate-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">Scheduled Reports</h2>
        <p className="text-slate-400 mb-6">Set up automated report generation and delivery</p>
        <div className="bg-blue-500/20 text-blue-400 px-4 py-2 rounded-lg inline-block">
          Coming Soon - Report scheduling interface
        </div>
      </div>
    </div>
  );
};

export default ScheduledReports;