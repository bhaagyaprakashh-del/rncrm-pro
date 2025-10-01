import React from 'react';
import { BarChart3, TrendingUp, Users, DollarSign, Calendar, Download, Filter, RefreshCw } from 'lucide-react';

export const ReportsDashboard: React.FC = () => {
  const reportCategories = [
    {
      title: 'Sales & CRM Reports',
      icon: <TrendingUp className="h-5 w-5" />,
      reports: [
        { name: 'Lead Conversion Analysis', lastRun: '2 hours ago', status: 'ready' },
        { name: 'Sales Performance by Agent', lastRun: '1 day ago', status: 'ready' },
        { name: 'Monthly Revenue Trends', lastRun: '3 hours ago', status: 'ready' },
        { name: 'Pipeline Health Report', lastRun: '5 hours ago', status: 'ready' }
      ]
    },
    {
      title: 'HRMS Reports',
      icon: <Users className="h-5 w-5" />,
      reports: [
        { name: 'Employee Attendance Summary', lastRun: '1 hour ago', status: 'ready' },
        { name: 'Payroll Analysis', lastRun: '2 days ago', status: 'ready' },
        { name: 'Department Performance', lastRun: '6 hours ago', status: 'ready' },
        { name: 'Leave Balance Report', lastRun: '4 hours ago', status: 'ready' }
      ]
    },
    {
      title: 'Chit Fund Reports',
      icon: <DollarSign className="h-5 w-5" />,
      reports: [
        { name: 'Group Collection Status', lastRun: '30 minutes ago', status: 'ready' },
        { name: 'Auction Results Summary', lastRun: '1 day ago', status: 'ready' },
        { name: 'Member Payment History', lastRun: '2 hours ago', status: 'ready' },
        { name: 'Branch Performance', lastRun: '3 hours ago', status: 'ready' }
      ]
    },
    {
      title: 'Financial Reports',
      icon: <BarChart3 className="h-5 w-5" />,
      reports: [
        { name: 'Monthly P&L Statement', lastRun: '1 day ago', status: 'ready' },
        { name: 'Cash Flow Analysis', lastRun: '2 days ago', status: 'ready' },
        { name: 'Outstanding Receivables', lastRun: '4 hours ago', status: 'ready' },
        { name: 'Expense Breakdown', lastRun: '6 hours ago', status: 'ready' }
      ]
    }
  ];

  const quickStats = [
    { label: 'Total Reports', value: '156', change: '+12%', trend: 'up' },
    { label: 'Generated Today', value: '23', change: '+8%', trend: 'up' },
    { label: 'Scheduled Reports', value: '45', change: '+5%', trend: 'up' },
    { label: 'Failed Reports', value: '2', change: '-50%', trend: 'down' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Reports Dashboard</h1>
          <p className="text-slate-400 mt-1">
            Comprehensive analytics and reporting across all modules
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors">
            <Filter className="h-4 w-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-colors">
            <RefreshCw className="h-4 w-4" />
            Refresh All
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <div key={index} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <div className={`flex items-center gap-1 text-sm ${
                stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
              }`}>
                <TrendingUp className={`h-4 w-4 ${stat.trend === 'down' ? 'rotate-180' : ''}`} />
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Report Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {reportCategories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50">
            <div className="p-6 border-b border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-400">
                  {category.icon}
                </div>
                <h3 className="text-lg font-semibold text-white">{category.title}</h3>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {category.reports.map((report, reportIndex) => (
                <div key={reportIndex} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
                  <div>
                    <h4 className="font-medium text-white">{report.name}</h4>
                    <p className="text-sm text-slate-400">Last run: {report.lastRun}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                      {report.status}
                    </span>
                    <button className="p-2 text-slate-400 hover:text-white transition-colors">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50">
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-yellow-400" />
            <h3 className="text-lg font-semibold text-white">Recent Report Activity</h3>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[
              { action: 'Generated', report: 'Monthly Sales Report', user: 'John Doe', time: '2 minutes ago' },
              { action: 'Scheduled', report: 'Employee Attendance Summary', user: 'Jane Smith', time: '15 minutes ago' },
              { action: 'Downloaded', report: 'Chit Fund Collections', user: 'Mike Johnson', time: '1 hour ago' },
              { action: 'Failed', report: 'Financial Statement', user: 'System', time: '2 hours ago' },
              { action: 'Generated', report: 'Lead Conversion Analysis', user: 'Sarah Wilson', time: '3 hours ago' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-700/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.action === 'Generated' ? 'bg-green-400' :
                    activity.action === 'Failed' ? 'bg-red-400' :
                    activity.action === 'Downloaded' ? 'bg-blue-400' :
                    'bg-yellow-400'
                  }`} />
                  <div>
                    <p className="text-white">
                      <span className="font-medium">{activity.action}</span> {activity.report}
                    </p>
                    <p className="text-sm text-slate-400">by {activity.user}</p>
                  </div>
                </div>
                <span className="text-sm text-slate-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsDashboard;