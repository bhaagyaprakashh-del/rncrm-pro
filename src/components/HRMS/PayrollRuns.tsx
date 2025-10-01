import React, { useState } from 'react';
import { Plus, Search, Filter, Eye, DollarSign, Calendar, Users, FileText, Download } from 'lucide-react';

export const PayrollRuns: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="h-full flex flex-col bg-slate-900 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-yellow-400/30 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">Payroll Runs & Payslips</h1>
          <p className="mt-1 text-sm text-slate-400">
            Process payroll, generate payslips, and manage salary components
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-all">
            <Plus className="h-4 w-4 mr-2" />
            Run Payroll
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-none">
        <div className="text-center py-12">
          <div className="bg-slate-700/30 backdrop-blur-sm rounded-full p-4 mb-4 border border-slate-600/50 inline-block">
            <DollarSign className="h-16 w-16 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-50 mb-2">Payroll Runs & Payslips</h3>
          <p className="text-slate-400">Payroll processing and payslip generation coming soon!</p>
        </div>
      </div>
    </div>
  );
};