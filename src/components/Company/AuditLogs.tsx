import React, { useState } from 'react';
import { Shield, Search, Filter, Calendar, User, Activity, AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  module: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'warning' | 'error' | 'info';
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface ErrorLog {
  id: string;
  timestamp: string;
  level: 'error' | 'warning' | 'info' | 'debug';
  message: string;
  module: string;
  stack?: string;
  user?: string;
  resolved: boolean;
}

export const AuditLogs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'audit' | 'errors'>('audit');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterModule, setFilterModule] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('7days');

  const [auditLogs] = useState<AuditLog[]>([
    {
      id: '1',
      timestamp: '2024-01-15 14:30:25',
      user: 'admin@chitfund.com',
      action: 'User Login',
      module: 'Authentication',
      details: 'Successful login from dashboard',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      status: 'success',
      severity: 'low'
    },
    {
      id: '2',
      timestamp: '2024-01-15 14:25:12',
      user: 'manager@chitfund.com',
      action: 'Lead Created',
      module: 'CRM',
      details: 'New lead created: John Doe - Premium Chit Fund',
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      status: 'success',
      severity: 'medium'
    },
    {
      id: '3',
      timestamp: '2024-01-15 14:20:45',
      user: 'agent@chitfund.com',
      action: 'Failed Login Attempt',
      module: 'Authentication',
      details: 'Invalid password attempt',
      ipAddress: '192.168.1.102',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      status: 'warning',
      severity: 'medium'
    },
    {
      id: '4',
      timestamp: '2024-01-15 14:15:30',
      user: 'admin@chitfund.com',
      action: 'User Role Modified',
      module: 'User Management',
      details: 'Changed role for user: employee@chitfund.com from Employee to Manager',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      status: 'info',
      severity: 'high'
    },
    {
      id: '5',
      timestamp: '2024-01-15 14:10:15',
      user: 'system',
      action: 'Database Backup',
      module: 'System',
      details: 'Automated daily database backup completed successfully',
      ipAddress: 'localhost',
      userAgent: 'System Process',
      status: 'success',
      severity: 'low'
    },
    {
      id: '6',
      timestamp: '2024-01-15 14:05:00',
      user: 'finance@chitfund.com',
      action: 'Payment Processing Error',
      module: 'Payments',
      details: 'Failed to process payment for chit group CG001 - Gateway timeout',
      ipAddress: '192.168.1.103',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      status: 'error',
      severity: 'critical'
    }
  ]);

  const [errorLogs] = useState<ErrorLog[]>([
    {
      id: '1',
      timestamp: '2024-01-15 14:35:20',
      level: 'error',
      message: 'Database connection timeout',
      module: 'Database',
      stack: 'Error: Connection timeout\n    at Database.connect (db.js:45)\n    at async Server.start (server.js:12)',
      user: 'system',
      resolved: false
    },
    {
      id: '2',
      timestamp: '2024-01-15 14:30:15',
      level: 'warning',
      message: 'High memory usage detected',
      module: 'System',
      user: 'system',
      resolved: true
    },
    {
      id: '3',
      timestamp: '2024-01-15 14:25:10',
      level: 'error',
      message: 'Payment gateway API error',
      module: 'Payments',
      stack: 'Error: Gateway timeout\n    at PaymentService.process (payment.js:78)\n    at async processPayment (controller.js:23)',
      user: 'finance@chitfund.com',
      resolved: false
    },
    {
      id: '4',
      timestamp: '2024-01-15 14:20:05',
      level: 'info',
      message: 'Scheduled backup completed',
      module: 'System',
      user: 'system',
      resolved: true
    },
    {
      id: '5',
      timestamp: '2024-01-15 14:15:00',
      level: 'warning',
      message: 'Multiple failed login attempts detected',
      module: 'Security',
      user: 'system',
      resolved: true
    }
  ]);

  const filteredAuditLogs = auditLogs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModule = filterModule === 'all' || log.module === filterModule;
    const matchesStatus = filterStatus === 'all' || log.status === filterStatus;
    
    return matchesSearch && matchesModule && matchesStatus;
  });

  const filteredErrorLogs = errorLogs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.module.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModule = filterModule === 'all' || log.module === filterModule;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'resolved' && log.resolved) ||
                         (filterStatus === 'unresolved' && !log.resolved);
    
    return matchesSearch && matchesModule && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-400" />;
      case 'info': return <Info className="h-4 w-4 text-blue-400" />;
      default: return <Info className="h-4 w-4 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-500/20 text-green-400';
      case 'warning': return 'bg-yellow-500/20 text-yellow-400';
      case 'error': return 'bg-red-500/20 text-red-400';
      case 'info': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'bg-red-500/20 text-red-400';
      case 'warning': return 'bg-yellow-500/20 text-yellow-400';
      case 'info': return 'bg-blue-500/20 text-blue-400';
      case 'debug': return 'bg-slate-500/20 text-slate-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const modules = ['all', 'Authentication', 'CRM', 'User Management', 'System', 'Payments', 'Database', 'Security'];
  const auditStatuses = ['all', 'success', 'warning', 'error', 'info'];
  const errorStatuses = ['all', 'resolved', 'unresolved'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Audit Logs & Error Log</h1>
          <p className="text-slate-400 mt-1">Monitor system activities and track errors</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="1day">Last 24 hours</option>
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-1">
        <div className="flex">
          <button
            onClick={() => setActiveTab('audit')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'audit'
                ? 'bg-yellow-500 text-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="h-4 w-4" />
            Audit Logs
          </button>
          <button
            onClick={() => setActiveTab('errors')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'errors'
                ? 'bg-yellow-500 text-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <AlertTriangle className="h-4 w-4" />
            Error Logs
          </button>
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
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <select
              value={filterModule}
              onChange={(e) => setFilterModule(e.target.value)}
              className="px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              {modules.map(module => (
                <option key={module} value={module}>
                  {module === 'all' ? 'All Modules' : module}
                </option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              {(activeTab === 'audit' ? auditStatuses : errorStatuses).map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Audit Logs Tab */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          {filteredAuditLogs.map((log) => (
            <div key={log.id} className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 hover:border-slate-600/50 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-slate-700/50 rounded-lg">
                    {getStatusIcon(log.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{log.action}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(log.status)}`}>
                        {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs border ${getSeverityColor(log.severity)}`}>
                        {log.severity.charAt(0).toUpperCase() + log.severity.slice(1)}
                      </span>
                    </div>
                    <p className="text-slate-300 text-sm mb-2">{log.details}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{log.timestamp}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{log.user}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Activity className="h-3 w-3" />
                        <span>{log.module}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-700/30 rounded-lg p-3 text-xs text-slate-400">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>IP Address: {log.ipAddress}</div>
                  <div>User Agent: {log.userAgent.substring(0, 50)}...</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error Logs Tab */}
      {activeTab === 'errors' && (
        <div className="space-y-4">
          {filteredErrorLogs.map((log) => (
            <div key={log.id} className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 hover:border-slate-600/50 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="flex items-center justify-center w-10 h-10 bg-slate-700/50 rounded-lg">
                    {log.level === 'error' ? <XCircle className="h-4 w-4 text-red-400" /> :
                     log.level === 'warning' ? <AlertTriangle className="h-4 w-4 text-yellow-400" /> :
                     <Info className="h-4 w-4 text-blue-400" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${getLevelColor(log.level)}`}>
                        {log.level.toUpperCase()}
                      </span>
                      <span className="text-slate-400 text-sm">{log.module}</span>
                      {log.resolved && (
                        <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400">
                          Resolved
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{log.message}</h3>
                    <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{log.timestamp}</span>
                      </div>
                      {log.user && (
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{log.user}</span>
                        </div>
                      )}
                    </div>
                    
                    {log.stack && (
                      <div className="bg-slate-700/30 rounded-lg p-3 text-xs text-slate-300 font-mono">
                        <pre className="whitespace-pre-wrap">{log.stack}</pre>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {((activeTab === 'audit' && filteredAuditLogs.length === 0) || 
        (activeTab === 'errors' && filteredErrorLogs.length === 0)) && (
        <div className="text-center py-12">
          {activeTab === 'audit' ? (
            <Shield className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          ) : (
            <AlertTriangle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          )}
          <h3 className="text-lg font-medium text-white mb-2">
            No {activeTab === 'audit' ? 'audit logs' : 'error logs'} found
          </h3>
          <p className="text-slate-400">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};