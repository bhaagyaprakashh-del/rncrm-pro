import React from 'react';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  CreditCard,
  Building,
  Target,
  Award,
  Activity,
  Eye,
  Plus,
  BarChart3,
  PieChart
} from 'lucide-react';
import { calculateDashboardStats, formatCurrency } from '../../utils/calculations';

interface DashboardHomeProps {
  onPageChange: (page: string) => void;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({ onPageChange }) => {
  const stats = calculateDashboardStats();

  const quickActions = [
    { title: 'Add New Member', description: 'Register a new chit fund member', icon: Users, action: 'members' },
    { title: 'Create Scheme', description: 'Set up a new chit fund scheme', icon: CreditCard, action: 'schemes' },
    { title: 'Record Payment', description: 'Log a payment transaction', icon: DollarSign, action: 'payments' },
    { title: 'View Reports', description: 'Access business analytics', icon: BarChart3, action: 'reports-dashboard' }
  ];

  const recentActivities = [
    { action: 'New member "Rajesh Kumar" added to Premium Gold scheme', time: '2 hours ago', type: 'success' },
    { action: 'Payment of ₹50,000 received from Silver Monthly group', time: '4 hours ago', type: 'success' },
    { action: 'Auction completed for Basic Savings group - Winner: Member #5', time: '1 day ago', type: 'info' },
    { action: 'Monthly collection target achieved for March', time: '2 days ago', type: 'success' },
    { action: 'KYC verification pending for 3 new members', time: '3 days ago', type: 'warning' }
  ];

  return (
    <div className="h-full flex flex-col bg-slate-900 overflow-hidden">
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-none">
        {/* Welcome Section */}
        <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-50 mb-2">Welcome to Ramnirmalchits CRM</h2>
              <p className="text-slate-400">
                Your comprehensive business management platform for chit fund operations
              </p>
            </div>
            <div className="text-right">
              <p className="text-slate-400 text-sm">Today</p>
              <p className="text-slate-50 font-semibold">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-slate-400 text-sm">Total Members</p>
                <p className="text-3xl font-bold text-blue-400">{stats.totalMembers}</p>
              </div>
              <div className="p-4 bg-blue-500/20 rounded-xl border border-yellow-400/30">
                <Users className="h-8 w-8 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-slate-400 text-sm">Active Schemes</p>
                <p className="text-3xl font-bold text-green-400">{stats.activeSchemes}</p>
              </div>
              <div className="p-4 bg-green-500/20 rounded-xl border border-yellow-400/30">
                <CreditCard className="h-8 w-8 text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-slate-400 text-sm">Total Collections</p>
                <p className="text-3xl font-bold text-emerald-400">{formatCurrency(stats.totalCollections)}</p>
              </div>
              <div className="p-4 bg-emerald-500/20 rounded-xl border border-yellow-400/30">
                <DollarSign className="h-8 w-8 text-emerald-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-slate-400 text-sm">Pending Payments</p>
                <p className="text-3xl font-bold text-yellow-400">{stats.pendingPayments}</p>
              </div>
              <div className="p-4 bg-yellow-500/20 rounded-xl border border-yellow-400/30">
                <Clock className="h-8 w-8 text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-slate-400 text-sm">Overdue Payments</p>
                <p className="text-3xl font-bold text-red-400">{stats.overduePayments}</p>
              </div>
              <div className="p-4 bg-red-500/20 rounded-xl border border-yellow-400/30">
                <AlertTriangle className="h-8 w-8 text-red-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-slate-400 text-sm">Monthly Target</p>
                <p className="text-3xl font-bold text-purple-400">{formatCurrency(stats.monthlyTarget)}</p>
              </div>
              <div className="p-4 bg-purple-500/20 rounded-xl border border-yellow-400/30">
                <Target className="h-8 w-8 text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30">
          <h3 className="text-lg font-semibold text-slate-50 mb-6 flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={() => onPageChange(action.action)}
                  className="flex items-center space-x-3 p-4 bg-slate-700/30 hover:bg-slate-700/50 rounded-xl border border-yellow-400/20 hover:border-yellow-400/40 transition-all group text-left"
                >
                  <div className="p-3 bg-blue-500/20 rounded-lg border border-yellow-400/30 group-hover:bg-blue-500/30 transition-all">
                    <Icon className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-slate-50 font-medium">{action.title}</p>
                    <p className="text-slate-400 text-sm">{action.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Charts Placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30">
            <h3 className="text-lg font-semibold text-slate-50 mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Monthly Collections Trend
            </h3>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-yellow-400/30 rounded-xl">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto text-slate-400 mb-2" />
                <p className="text-slate-400">Collections Chart</p>
                <p className="text-slate-500 text-sm">Interactive chart coming soon</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30">
            <h3 className="text-lg font-semibold text-slate-50 mb-4 flex items-center">
              <PieChart className="h-5 w-5 mr-2" />
              Scheme Distribution
            </h3>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-yellow-400/30 rounded-xl">
              <div className="text-center">
                <PieChart className="h-12 w-12 mx-auto text-slate-400 mb-2" />
                <p className="text-slate-400">Distribution Chart</p>
                <p className="text-slate-500 text-sm">Interactive chart coming soon</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30">
          <h3 className="text-lg font-semibold text-slate-50 mb-6 flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Recent Activities
          </h3>
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-xl border border-yellow-400/20">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'success' ? 'bg-green-400' :
                  activity.type === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'
                }`} />
                <div className="flex-1">
                  <p className="text-sm text-slate-50">{activity.action}</p>
                  <p className="text-xs text-slate-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};