import React, { useState } from 'react';
import { Users, Plus, Search, CreditCard as Edit3, Trash2, Building2, UserCheck, Crown } from 'lucide-react';

interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  head: string;
  employeeCount: number;
  budget: number;
  status: 'active' | 'inactive';
  parentId?: string;
}

export const Departments: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  const [departments] = useState<Department[]>([
    {
      id: '1',
      name: 'Executive Management',
      code: 'EXEC',
      description: 'Top-level management and strategic decision making',
      head: 'Rajesh Kumar',
      employeeCount: 3,
      budget: 5000000,
      status: 'active'
    },
    {
      id: '2',
      name: 'Sales & Marketing',
      code: 'SALES',
      description: 'Customer acquisition, lead generation, and marketing campaigns',
      head: 'Priya Sharma',
      employeeCount: 12,
      budget: 2500000,
      status: 'active'
    },
    {
      id: '3',
      name: 'Operations',
      code: 'OPS',
      description: 'Day-to-day operations, chit fund management, and customer service',
      head: 'Amit Patel',
      employeeCount: 18,
      budget: 3200000,
      status: 'active'
    },
    {
      id: '4',
      name: 'Finance & Accounts',
      code: 'FIN',
      description: 'Financial planning, accounting, auditing, and compliance',
      head: 'Sunita Joshi',
      employeeCount: 8,
      budget: 1800000,
      status: 'active'
    },
    {
      id: '5',
      name: 'Human Resources',
      code: 'HR',
      description: 'Employee management, recruitment, training, and development',
      head: 'Vikram Singh',
      employeeCount: 5,
      budget: 1200000,
      status: 'active'
    },
    {
      id: '6',
      name: 'Information Technology',
      code: 'IT',
      description: 'Technology infrastructure, software development, and digital solutions',
      head: 'Neha Gupta',
      employeeCount: 7,
      budget: 2000000,
      status: 'active'
    },
    {
      id: '7',
      name: 'Legal & Compliance',
      code: 'LEGAL',
      description: 'Legal affairs, regulatory compliance, and risk management',
      head: 'Ravi Mehta',
      employeeCount: 4,
      budget: 800000,
      status: 'inactive'
    }
  ]);

  const filteredDepartments = departments.filter(dept => {
    const matchesSearch = dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dept.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dept.head.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || dept.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const stats = {
    total: departments.length,
    active: departments.filter(d => d.status === 'active').length,
    inactive: departments.filter(d => d.status === 'inactive').length,
    totalEmployees: departments.reduce((sum, d) => sum + d.employeeCount, 0),
    totalBudget: departments.reduce((sum, d) => sum + d.budget, 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Department Structure</h1>
          <p className="text-slate-400 mt-1">Manage organizational departments and hierarchy</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition-colors font-medium">
          <Plus className="h-4 w-4" />
          Add Department
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Departments</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <Building2 className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Active</p>
              <p className="text-2xl font-bold text-green-400">{stats.active}</p>
            </div>
            <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Inactive</p>
              <p className="text-2xl font-bold text-red-400">{stats.inactive}</p>
            </div>
            <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Employees</p>
              <p className="text-2xl font-bold text-white">{stats.totalEmployees}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Budget</p>
              <p className="text-lg font-bold text-white">{formatCurrency(stats.totalBudget)}</p>
            </div>
            <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
              <Crown className="h-4 w-4 text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search departments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredDepartments.map((department) => (
          <div key={department.id} className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 hover:border-slate-600/50 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-700/50 rounded-lg flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{department.name}</h3>
                  <p className="text-slate-400 text-sm">Code: {department.code}</p>
                </div>
              </div>
              
              <div className={`w-3 h-3 rounded-full ${department.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
            </div>

            <p className="text-slate-300 text-sm mb-4">{department.description}</p>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-400 text-sm">Department Head</span>
                </div>
                <span className="text-white text-sm font-medium">{department.head}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-400 text-sm">Employees</span>
                </div>
                <span className="text-white text-sm font-medium">{department.employeeCount}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-400 text-sm">Annual Budget</span>
                </div>
                <span className="text-white text-sm font-medium">{formatCurrency(department.budget)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
              <span className={`px-3 py-1 rounded-full text-sm ${
                department.status === 'active' 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {department.status === 'active' ? 'Active' : 'Inactive'}
              </span>

              <div className="flex items-center gap-2">
                <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors">
                  <Edit3 className="h-4 w-4" />
                </button>
                <button className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDepartments.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No departments found</h3>
          <p className="text-slate-400">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};