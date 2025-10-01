import React from 'react';
import { Upload, FileSpreadsheet, Database, Download } from 'lucide-react';

export const UploadsImport: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Uploads & Import Center</h1>
          <p className="text-slate-400 mt-1">Import data and manage file uploads</p>
        </div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700/50 text-center">
        <Upload className="h-16 w-16 text-slate-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">Uploads & Import Center</h2>
        <p className="text-slate-400 mb-6">Import data from Excel, CSV and other sources</p>
        <div className="bg-blue-500/20 text-blue-400 px-4 py-2 rounded-lg inline-block">
          Coming Soon - Data import and upload interface
        </div>
      </div>
    </div>
  );
};

export default UploadsImport;