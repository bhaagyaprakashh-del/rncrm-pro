import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Download, Filter, TrendingUp, TrendingDown, Users, CheckSquare, Clock, AlertTriangle, Target, BarChart3, PieChart, Activity, Star, Award, Zap } from 'lucide-react';
import { Task, Ticket, TaskReport, TicketReport } from '../../types/tasks';
import { loadTasks, loadTickets } from '../../data/tasks.mock';
import { getEmployees } from '../../data/employees.mock';
import { Employee } from '../../types/hrms';
import toast from 'react-hot-toast';

interface ReportFilters {
  dateRange: 'week' | 'month' | 'quarter' | 'year' | 'custom';
  startDate: string;
  endDate: string;
  assignee: string;
  department: string;
}

export const Reports: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'tasks' | 'tickets' | 'performance'>('tasks');
  const [filters, setFilters] = useState<ReportFilters>({
    dateRange: 'month',
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    assignee: '',
    department: ''
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [tasksData, ticketsData, employeesData] = await Promise.all([
          loadTasks(),
          loadTickets(),
          getEmployees()
        ]);
        setTasks(tasksData);
        setTickets(ticketsData);
        setEmployees(employeesData);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load reports data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Update date range when preset is selected
  useEffect(() => {
    const now = new Date();
    let startDate: Date;
    let endDate = now;

    switch (filters.dateRange) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'quarter':
        const quarterStart = Math.floor(now.getMonth() / 3) * 3;
        startDate = new Date(now.getFullYear(), quarterStart, 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        return; // Don't update for custom range
    }

    setFilters(prev => ({
      ...prev,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    }));
  }, [filters.dateRange]);

  // Filter data based on date range and other filters
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const taskDate = new Date(task.createdAt);
      const startDate = new Date(filters.startDate);
      const endDate = new Date(filters.endDate);
      
      const inDateRange = taskDate >= startDate && taskDate <= endDate;
      const matchesAssignee = !filters.assignee || task.assignedTo === filters.assignee;
      
      // Get employee department for task assignee
      const employee = employees.find(e => `${e.firstName} ${e.lastName}` === task.assignedTo);
      const matchesDepartment = !filters.department || employee?.department === filters.department;

      return inDateRange && matchesAssignee && matchesDepartment;
    });
  }, [tasks, filters, employees]);

  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      const ticketDate = new Date(ticket.createdAt);
      const startDate = new Date(filters.startDate);
      const endDate = new Date(filters.endDate);
      
      const inDateRange = ticketDate >= startDate && ticketDate <= endDate;
      const matchesAssignee = !filters.assignee || ticket.assignedTo === filters.assignee;
      const matchesDepartment = !filters.department || ticket.department === filters.department;

      return inDateRange && matchesAssignee && matchesDepartment;
    });
  }, [tickets, filters]);

  // Calculate task report
  const taskReport = useMemo((): TaskReport => {
    const totalTasks = filteredTasks.length;
    const completedTasks = filteredTasks.filter(t => t.status === 'completed').length;
    const overdueTasks = filteredTasks.filter(t => 
      new Date(t.dueDate) < new Date() && t.status !== 'completed'
    ).length;

    const tasksByPriority = filteredTasks.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const tasksByStatus = filteredTasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const tasksByAssignee = filteredTasks.reduce((acc, task) => {
      acc[task.assignedTo] = (acc[task.assignedTo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Calculate average completion time
    const completedTasksWithTime = filteredTasks.filter(t => 
      t.status === 'completed' && t.completedAt && t.createdAt
    );
    
    const totalCompletionTime = completedTasksWithTime.reduce((sum, task) => {
      const created = new Date(task.createdAt).getTime();
      const completed = new Date(task.completedAt!).getTime();
      return sum + (completed - created);
    }, 0);

    const averageCompletionTime = completedTasksWithTime.length > 0 
      ? totalCompletionTime / completedTasksWithTime.length / (1000 * 60 * 60) // Convert to hours
      : 0;

    // Calculate productivity score (completed tasks / total tasks * 100)
    const productivityScore = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return {
      totalTasks,
      completedTasks,
      overdueTasks,
      tasksByPriority,
      tasksByStatus,
      tasksByAssignee,
      averageCompletionTime,
      productivityScore
    };
  }, [filteredTasks]);

  // Calculate ticket report
  const ticketReport = useMemo((): TicketReport => {
    const totalTickets = filteredTickets.length;
    const resolvedTickets = filteredTickets.filter(t => t.status === 'resolved' || t.status === 'closed').length;
    const overdueTickets = filteredTickets.filter(t => 
      new Date(t.slaDeadline) < new Date() && t.status !== 'resolved' && t.status !== 'closed'
    ).length;

    const ticketsByCategory = filteredTickets.reduce((acc, ticket) => {
      acc[ticket.category] = (acc[ticket.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const ticketsByPriority = filteredTickets.reduce((acc, ticket) => {
      acc[ticket.priority] = (acc[ticket.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const ticketsByStatus = filteredTickets.reduce((acc, ticket) => {
      acc[ticket.status] = (acc[ticket.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Calculate average resolution time
    const resolvedTicketsWithTime = filteredTickets.filter(t => 
      (t.status === 'resolved' || t.status === 'closed') && t.resolvedAt && t.createdAt
    );
    
    const totalResolutionTime = resolvedTicketsWithTime.reduce((sum, ticket) => {
      const created = new Date(ticket.createdAt).getTime();
      const resolved = new Date(ticket.resolvedAt!).getTime();
      return sum + (resolved - created);
    }, 0);

    const averageResolutionTime = resolvedTicketsWithTime.length > 0 
      ? totalResolutionTime / resolvedTicketsWithTime.length / (1000 * 60 * 60) // Convert to hours
      : 0;

    // Calculate SLA compliance (tickets resolved within SLA / total resolved tickets * 100)
    const slaCompliantTickets = resolvedTicketsWithTime.filter(ticket => {
      const resolved = new Date(ticket.resolvedAt!).getTime();
      const slaDeadline = new Date(ticket.slaDeadline).getTime();
      return resolved <= slaDeadline;
    }).length;

    const slaCompliance = resolvedTicketsWithTime.length > 0 
      ? (slaCompliantTickets / resolvedTicketsWithTime.length) * 100 
      : 0;

    // Mock customer satisfaction score
    const customerSatisfaction = 85; // In real app, this would come from customer feedback

    return {
      totalTickets,
      resolvedTickets,
      overdueTickets,
      ticketsByCategory,
      ticketsByPriority,
      ticketsByStatus,
      averageResolutionTime,
      slaCompliance,
      customerSatisfaction
    };
  }, [filteredTickets]);

  // Calculate performance metrics by employee
  const performanceMetrics = useMemo(() => {
    const metrics: Record<string, any> = {};

    employees.forEach(employee => {
      const fullName = `${employee.firstName} ${employee.lastName}`;
      const employeeTasks = filteredTasks.filter(t => t.assignedTo === fullName);
      const employeeTickets = filteredTickets.filter(t => t.assignedTo === fullName);

      const completedTasks = employeeTasks.filter(t => t.status === 'completed').length;
      const resolvedTickets = employeeTickets.filter(t => t.status === 'resolved' || t.status === 'closed').length;
      const overdueTasks = employeeTasks.filter(t => 
        new Date(t.dueDate) < new Date() && t.status !== 'completed'
      ).length;
      const overdueTickets = employeeTickets.filter(t => 
        new Date(t.slaDeadline) < new Date() && t.status !== 'resolved' && t.status !== 'closed'
      ).length;

      const taskCompletionRate = employeeTasks.length > 0 ? (completedTasks / employeeTasks.length) * 100 : 0;
      const ticketResolutionRate = employeeTickets.length > 0 ? (resolvedTickets / employeeTickets.length) * 100 : 0;
      const overallScore = (taskCompletionRate + ticketResolutionRate) / 2;

      metrics[fullName] = {
        employee,
        totalTasks: employeeTasks.length,
        completedTasks,
        totalTickets: employeeTickets.length,
        resolvedTickets,
        overdueTasks,
        overdueTickets,
        taskCompletionRate,
        ticketResolutionRate,
        overallScore
      };
    });

    return Object.values(metrics).sort((a: any, b: any) => b.overallScore - a.overallScore);
  }, [employees, filteredTasks, filteredTickets]);

  const handleExportReport = () => {
    const reportData = {
      dateRange: `${filters.startDate} to ${filters.endDate}`,
      filters,
      taskReport,
      ticketReport,
      performanceMetrics,
      generatedAt: new Date().toISOString()
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tasks-tickets-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success('Report exported successfully!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-50 mb-2">Tasks & Tickets Reports</h1>
            <p className="text-slate-400">Comprehensive analytics and performance insights</p>
          </div>
          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            <button
              onClick={handleExportReport}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg shadow-sm hover:bg-green-700 transition-all"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-yellow-400/40 rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-50 mb-2">Date Range</label>
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value as any }))}
                className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
              >
                <option value="week">Last 7 Days</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            {filters.dateRange === 'custom' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-50 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-50 mb-2">End Date</label>
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-50 mb-2">Assignee</label>
              <select
                value={filters.assignee}
                onChange={(e) => setFilters(prev => ({ ...prev, assignee: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
              >
                <option value="">All Assignees</option>
                {employees.filter(e => e.status === 'active').map(employee => (
                  <option key={employee.id} value={`${employee.firstName} ${employee.lastName}`}>
                    {employee.firstName} {employee.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-50 mb-2">Department</label>
              <select
                value={filters.department}
                onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
              >
                <option value="">All Departments</option>
                <option value="Sales">Sales</option>
                <option value="Marketing">Marketing</option>
                <option value="Customer Service">Customer Service</option>
                <option value="Technical Support">Technical Support</option>
                <option value="Operations">Operations</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-yellow-400/30 mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'tasks'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300'
              }`}
            >
              Task Reports
            </button>
            <button
              onClick={() => setActiveTab('tickets')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'tickets'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300'
              }`}
            >
              Ticket Reports
            </button>
            <button
              onClick={() => setActiveTab('performance')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'performance'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300'
              }`}
            >
              Performance Analytics
            </button>
          </nav>
        </div>

        {/* Task Reports */}
        {activeTab === 'tasks' && (
          <div className="space-y-8">
            {/* Task Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-slate-800/50 backdrop-blur-xl border border-yellow-400/40 rounded-2xl p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-500/20 rounded-xl">
                    <CheckSquare className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-400">Total Tasks</p>
                    <p className="text-2xl font-bold text-slate-50">{taskReport.totalTasks}</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-xl border border-yellow-400/40 rounded-2xl p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-500/20 rounded-xl">
                    <TrendingUp className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-400">Completed</p>
                    <p className="text-2xl font-bold text-slate-50">{taskReport.completedTasks}</p>
                    <p className="text-xs text-green-400">
                      {taskReport.totalTasks > 0 ? ((taskReport.completedTasks / taskReport.totalTasks) * 100).toFixed(1) : 0}% completion rate
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-xl border border-yellow-400/40 rounded-2xl p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-red-500/20 rounded-xl">
                    <AlertTriangle className="h-6 w-6 text-red-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-400">Overdue</p>
                    <p className="text-2xl font-bold text-slate-50">{taskReport.overdueTasks}</p>
                    <p className="text-xs text-red-400">
                      {taskReport.totalTasks > 0 ? ((taskReport.overdueTasks / taskReport.totalTasks) * 100).toFixed(1) : 0}% overdue rate
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-xl border border-yellow-400/40 rounded-2xl p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-500/20 rounded-xl">
                    <Clock className="h-6 w-6 text-purple-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-400">Avg Completion</p>
                    <p className="text-2xl font-bold text-slate-50">{taskReport.averageCompletionTime.toFixed(1)}h</p>
                    <p className="text-xs text-purple-400">Average time to complete</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Task Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Tasks by Status */}
              <div className="bg-slate-800/50 backdrop-blur-xl border border-yellow-400/40 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-slate-50 mb-4">Tasks by Status</h3>
                <div className="space-y-4">
                  {Object.entries(taskReport.tasksByStatus).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-3 ${
                          status === 'completed' ? 'bg-green-500' :
                          status === 'in-progress' ? 'bg-blue-500' :
                          status === 'review' ? 'bg-purple-500' :
                          status === 'todo' ? 'bg-gray-500' : 'bg-red-500'
                        }`}></div>
                        <span className="text-slate-50 capitalize">{status.replace('-', ' ')}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-50 font-medium">{count}</span>
                        <span className="text-slate-400 text-sm ml-2">
                          ({taskReport.totalTasks > 0 ? ((count / taskReport.totalTasks) * 100).toFixed(1) : 0}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tasks by Priority */}
              <div className="bg-slate-800/50 backdrop-blur-xl border border-yellow-400/40 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-slate-50 mb-4">Tasks by Priority</h3>
                <div className="space-y-4">
                  {Object.entries(taskReport.tasksByPriority).map(([priority, count]) => (
                    <div key={priority} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-3 ${
                          priority === 'critical' ? 'bg-red-500' :
                          priority === 'high' ? 'bg-orange-500' :
                          priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}></div>
                        <span className="text-slate-50 capitalize">{priority}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-50 font-medium">{count}</span>
                        <span className="text-slate-400 text-sm ml-2">
                          ({taskReport.totalTasks > 0 ? ((count / taskReport.totalTasks) * 100).toFixed(1) : 0}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Performers */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-yellow-400/40 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-slate-50 mb-4">Task Performance by Assignee</h3>
              <div className="space-y-4">
                {Object.entries(taskReport.tasksByAssignee)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 10)
                  .map(([assignee, count]) => {
                    const completedCount = filteredTasks.filter(t => 
                      t.assignedTo === assignee && t.status === 'completed'
                    ).length;
                    const completionRate = count > 0 ? (completedCount / count) * 100 : 0;
                    
                    return (
                      <div key={assignee} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                            {assignee.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="text-slate-50">{assignee}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-slate-50 font-medium">{count} tasks</span>
                          <span className="text-green-400 text-sm ml-2">
                            {completionRate.toFixed(1)}% completed
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {/* Ticket Reports */}
        {activeTab === 'tickets' && (
          <div className="space-y-8">
            {/* Ticket Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-slate-800/50 backdrop-blur-xl border border-yellow-400/40 rounded-2xl p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-500/20 rounded-xl">
                    <Target className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-400">Total Tickets</p>
                    <p className="text-2xl font-bold text-slate-50">{ticketReport.totalTickets}</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-xl border border-yellow-400/40 rounded-2xl p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-500/20 rounded-xl">
                    <CheckSquare className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-400">Resolved</p>
                    <p className="text-2xl font-bold text-slate-50">{ticketReport.resolvedTickets}</p>
                    <p className="text-xs text-green-400">
                      {ticketReport.totalTickets > 0 ? ((ticketReport.resolvedTickets / ticketReport.totalTickets) * 100).toFixed(1) : 0}% resolution rate
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-xl border border-yellow-400/40 rounded-2xl p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-500/20 rounded-xl">
                    <Clock className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-400">Avg Resolution</p>
                    <p className="text-2xl font-bold text-slate-50">{ticketReport.averageResolutionTime.toFixed(1)}h</p>
                    <p className="text-xs text-yellow-400">Average time to resolve</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-xl border border-yellow-400/40 rounded-2xl p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-500/20 rounded-xl">
                    <Award className="h-6 w-6 text-purple-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-400">SLA Compliance</p>
                    <p className="text-2xl font-bold text-slate-50">{ticketReport.slaCompliance.toFixed(1)}%</p>
                    <p className="text-xs text-purple-400">Within SLA deadline</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Ticket Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Tickets by Category */}
              <div className="bg-slate-800/50 backdrop-blur-xl border border-yellow-400/40 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-slate-50 mb-4">Tickets by Category</h3>
                <div className="space-y-4">
                  {Object.entries(ticketReport.ticketsByCategory).map(([category, count]) => (
                    <div key={category} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-3 ${
                          category === 'billing' ? 'bg-green-500' :
                          category === 'technical' ? 'bg-blue-500' :
                          category === 'complaint' ? 'bg-red-500' :
                          category === 'feature-request' ? 'bg-purple-500' : 'bg-gray-500'
                        }`}></div>
                        <span className="text-slate-50 capitalize">{category.replace('-', ' ')}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-50 font-medium">{count}</span>
                        <span className="text-slate-400 text-sm ml-2">
                          ({ticketReport.totalTickets > 0 ? ((count / ticketReport.totalTickets) * 100).toFixed(1) : 0}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tickets by Priority */}
              <div className="bg-slate-800/50 backdrop-blur-xl border border-yellow-400/40 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-slate-50 mb-4">Tickets by Priority</h3>
                <div className="space-y-4">
                  {Object.entries(ticketReport.ticketsByPriority).map(([priority, count]) => (
                    <div key={priority} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-3 ${
                          priority === 'critical' ? 'bg-red-500' :
                          priority === 'high' ? 'bg-orange-500' :
                          priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}></div>
                        <span className="text-slate-50 capitalize">{priority}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-50 font-medium">{count}</span>
                        <span className="text-slate-400 text-sm ml-2">
                          ({ticketReport.totalTickets > 0 ? ((count / ticketReport.totalTickets) * 100).toFixed(1) : 0}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Customer Satisfaction */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-yellow-400/40 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-slate-50 mb-4">Customer Satisfaction & SLA Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">{ticketReport.customerSatisfaction}%</div>
                  <p className="text-slate-400">Customer Satisfaction</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">{ticketReport.slaCompliance.toFixed(1)}%</div>
                  <p className="text-slate-400">SLA Compliance</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">{ticketReport.overdueTickets}</div>
                  <p className="text-slate-400">Overdue Tickets</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Performance Analytics */}
        {activeTab === 'performance' && (
          <div className="space-y-8">
            {/* Performance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-slate-800/50 backdrop-blur-xl border border-yellow-400/40 rounded-2xl p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-500/20 rounded-xl">
                    <Users className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-400">Active Employees</p>
                    <p className="text-2xl font-bold text-slate-50">{performanceMetrics.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-xl border border-yellow-400/40 rounded-2xl p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-500/20 rounded-xl">
                    <TrendingUp className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-400">Avg Task Completion</p>
                    <p className="text-2xl font-bold text-slate-50">
                      {performanceMetrics.length > 0 
                        ? (performanceMetrics.reduce((sum: number, m: any) => sum + m.taskCompletionRate, 0) / performanceMetrics.length).toFixed(1)
                        : 0}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-xl border border-yellow-400/40 rounded-2xl p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-500/20 rounded-xl">
                    <Target className="h-6 w-6 text-purple-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-400">Avg Ticket Resolution</p>
                    <p className="text-2xl font-bold text-slate-50">
                      {performanceMetrics.length > 0 
                        ? (performanceMetrics.reduce((sum: number, m: any) => sum + m.ticketResolutionRate, 0) / performanceMetrics.length).toFixed(1)
                        : 0}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-xl border border-yellow-400/40 rounded-2xl p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-500/20 rounded-xl">
                    <Star className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-400">Top Performer Score</p>
                    <p className="text-2xl font-bold text-slate-50">
                      {performanceMetrics.length > 0 ? performanceMetrics[0].overallScore.toFixed(1) : 0}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Employee Performance Ranking */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-yellow-400/40 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-slate-50 mb-6">Employee Performance Ranking</h3>
              <div className="space-y-4">
                {performanceMetrics.slice(0, 10).map((metric: any, index: number) => (
                  <div key={metric.employee.id} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium mr-4 ${
                        index === 0 ? 'bg-yellow-500' :
                        index === 1 ? 'bg-gray-400' :
                        index === 2 ? 'bg-orange-600' : 'bg-blue-500'
                      }`}>
                        {index < 3 ? (
                          index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'
                        ) : (
                          index + 1
                        )}
                      </div>
                      <div>
                        <h4 className="text-slate-50 font-medium">
                          {metric.employee.firstName} {metric.employee.lastName}
                        </h4>
                        <p className="text-slate-400 text-sm">{metric.employee.designation} • {metric.employee.department}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-6 text-center">
                      <div>
                        <p className="text-slate-50 font-medium">{metric.totalTasks}</p>
                        <p className="text-slate-400 text-xs">Tasks</p>
                      </div>
                      <div>
                        <p className="text-slate-50 font-medium">{metric.totalTickets}</p>
                        <p className="text-slate-400 text-xs">Tickets</p>
                      </div>
                      <div>
                        <p className="text-green-400 font-medium">{metric.taskCompletionRate.toFixed(1)}%</p>
                        <p className="text-slate-400 text-xs">Task Rate</p>
                      </div>
                      <div>
                        <p className="text-blue-400 font-medium">{metric.overallScore.toFixed(1)}%</p>
                        <p className="text-slate-400 text-xs">Overall</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};