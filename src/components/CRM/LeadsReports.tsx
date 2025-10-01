import React, { useState } from 'react';
import { BarChart3, Download, TrendingUp, Users, DollarSign, Target, Award, Calendar } from 'lucide-react';
import { loadLeads } from '../../data/leads.mock';

export const LeadsReports: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('current-month');
  const [leads] = useState(() => loadLeads());

  // Calculate real report stats from leads data
  const reportStats = React.useMemo(() => {
    const wonLeads = leads.filter(l => l.status === 'won');
    const lostLeads = leads.filter(l => l.status === 'lost');
    const totalAttempts = wonLeads.length + lostLeads.length;
    const conversionRate = totalAttempts > 0 ? (wonLeads.length / totalAttempts * 100).toFixed(1) : '0';
    const pipelineValue = leads.filter(l => !['won', 'lost'].includes(l.status)).reduce((sum, l) => sum + l.value, 0);
    const avgDealSize = wonLeads.length > 0 ? wonLeads.reduce((sum, l) => sum + l.value, 0) / wonLeads.length : 0;

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 1,
      }).format(amount);
    };

    return [
      { label: 'Total Leads', value: leads.length.toString(), icon: Users, color: 'text-blue-400' },
      { label: 'Conversion Rate', value: `${conversionRate}%`, icon: TrendingUp, color: 'text-green-400' },
      { label: 'Pipeline Value', value: formatCurrency(pipelineValue), icon: DollarSign, color: 'text-purple-400' },
      { label: 'Avg Deal Size', value: formatCurrency(avgDealSize), icon: Target, color: 'text-orange-400' }
    ];
  }, [leads]);

  return (
    <div className="h-full flex flex-col bg-slate-900 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-yellow-400/30 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">Leads & Sales Reports</h1>
          <p className="mt-1 text-sm text-slate-400">
            Comprehensive sales analytics and performance reporting
          </p>
        </div>
        <div className="flex space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
          >
            <option value="current-month">Current Month</option>
            <option value="last-month">Last Month</option>
            <option value="current-quarter">Current Quarter</option>
            <option value="current-year">Current Year</option>
          </select>
          <button className="inline-flex items-center px-4 py-2 border border-yellow-400/30 text-sm font-medium rounded-lg text-slate-50 bg-slate-700/50 hover:bg-slate-700 transition-all backdrop-blur-sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-none">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reportStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">{stat.label}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Chart Placeholders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30">
            <h3 className="text-lg font-semibold text-slate-50 mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Lead Status Distribution
            </h3>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-yellow-400/30 rounded-xl">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto text-slate-400 mb-2" />
                <p className="text-slate-400">Status Distribution Chart</p>
                <p className="text-slate-500 text-sm">Interactive chart coming soon</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30">
            <h3 className="text-lg font-semibold text-slate-50 mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Lead Sources Analysis
            </h3>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-yellow-400/30 rounded-xl">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto text-slate-400 mb-2" />
                <p className="text-slate-400">Sources Chart</p>
                <p className="text-slate-500 text-sm">Interactive chart coming soon</p>
              </div>
            </div>
          </div>
        </div>

        {/* Lead Performance Summary */}
        <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30">
          <h3 className="text-lg font-semibold text-slate-50 mb-4 flex items-center">
            <Award className="h-5 w-5 mr-2" />
            Lead Performance Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-500/10 rounded-xl border border-blue-500/30">
              <p className="text-2xl font-bold text-blue-400">{leads.filter(l => l.status === 'new').length}</p>
              <p className="text-sm text-blue-300">New Leads</p>
            </div>
            <div className="text-center p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/30">
              <p className="text-2xl font-bold text-yellow-400">{leads.filter(l => ['contacted', 'qualified'].includes(l.status)).length}</p>
              <p className="text-sm text-yellow-300">In Progress</p>
            </div>
            <div className="text-center p-4 bg-green-500/10 rounded-xl border border-green-500/30">
              <p className="text-2xl font-bold text-green-400">{leads.filter(l => l.status === 'won').length}</p>
              <p className="text-sm text-green-300">Won Deals</p>
            </div>
            <div className="text-center p-4 bg-red-500/10 rounded-xl border border-red-500/30">
              <p className="text-2xl font-bold text-red-400">{leads.filter(l => l.status === 'lost').length}</p>
              <p className="text-sm text-red-300">Lost Deals</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};