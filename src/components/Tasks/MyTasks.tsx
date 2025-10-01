import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Filter, Calendar, Clock, User, Tag, CheckSquare, AlertTriangle, Star, MoreVertical, CreditCard as Edit, Trash2, Eye, MessageSquare, Paperclip, Users, Target, TrendingUp, CheckCircle, XCircle, Play, Pause, X, Save } from 'lucide-react';
import { Task } from '../../types/tasks';
import { loadTasks, saveTasks, addTask, updateTask, deleteTask } from '../../data/tasks.mock';
import { getEmployees } from '../../data/employees.mock';
import { Employee } from '../../types/hrms';
import toast from 'react-hot-toast';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  editingTask?: Task | null;
  employees: Employee[];
  currentUser: string;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  editingTask, 
  employees,
  currentUser 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'other' as Task['type'],
    priority: 'medium' as Task['priority'],
    assignedTo: '',
    dueDate: '',
    estimatedHours: 0,
    tags: [] as string[],
    watchers: [] as string[],
    collaborators: [] as string[]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title,
        description: editingTask.description,
        type: editingTask.type,
        priority: editingTask.priority,
        assignedTo: editingTask.assignedTo,
        dueDate: editingTask.dueDate.split('T')[0],
        estimatedHours: editingTask.estimatedHours || 0,
        tags: editingTask.tags,
        watchers: editingTask.watchers,
        collaborators: editingTask.collaborators
      });
    } else {
      setFormData({
        title: '',
        description: '',
        type: 'other',
        priority: 'medium',
        assignedTo: '',
        dueDate: '',
        estimatedHours: 0,
        tags: [],
        watchers: [],
        collaborators: []
      });
    }
  }, [editingTask]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.assignedTo) newErrors.assignedTo = 'Please assign to someone';
    if (!formData.dueDate) newErrors.dueDate = 'Due date is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const taskData: Task = {
      id: editingTask?.id || `task_${Date.now()}`,
      title: formData.title,
      description: formData.description,
      type: formData.type,
      priority: formData.priority,
      status: editingTask?.status || 'todo',
      assignedTo: formData.assignedTo,
      assignedBy: currentUser,
      dueDate: new Date(formData.dueDate).toISOString(),
      estimatedHours: formData.estimatedHours,
      actualHours: editingTask?.actualHours,
      tags: formData.tags,
      attachments: editingTask?.attachments || [],
      comments: editingTask?.comments || [],
      subtasks: editingTask?.subtasks || [],
      createdAt: editingTask?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      startedAt: editingTask?.startedAt,
      completedAt: editingTask?.completedAt,
      watchers: formData.watchers,
      collaborators: formData.collaborators,
      progressPercentage: editingTask?.progressPercentage || 0
    };

    onSave(taskData);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-slate-800/90 backdrop-blur-xl border border-yellow-400/40 rounded-2xl shadow-2xl p-6 w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-slate-50">
            {editingTask ? 'Edit Task' : 'Create New Task'}
          </h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-50 hover:bg-slate-700/50 rounded-lg transition-all">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-50 mb-2">Task Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className={`w-full px-3 py-2 bg-slate-700/50 border rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm ${
                  errors.title ? 'border-red-500' : 'border-yellow-400/30'
                }`}
                placeholder="Enter task title"
              />
              {errors.title && <p className="mt-1 text-sm text-red-400">{errors.title}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-50 mb-2">Description *</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className={`w-full px-3 py-2 bg-slate-700/50 border rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm ${
                  errors.description ? 'border-red-500' : 'border-yellow-400/30'
                }`}
                placeholder="Describe the task in detail"
              />
              {errors.description && <p className="mt-1 text-sm text-red-400">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-50 mb-2">Task Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as Task['type'] }))}
                className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
              >
                <option value="call">📞 Call</option>
                <option value="meeting">🤝 Meeting</option>
                <option value="email">📧 Email</option>
                <option value="documentation">📄 Documentation</option>
                <option value="other">📋 Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-50 mb-2">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as Task['priority'] }))}
                className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
              >
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🟠 High</option>
                <option value="critical">🔴 Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-50 mb-2">Assign To *</label>
              <select
                value={formData.assignedTo}
                onChange={(e) => setFormData(prev => ({ ...prev, assignedTo: e.target.value }))}
                className={`w-full px-3 py-2 bg-slate-700/50 border rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm ${
                  errors.assignedTo ? 'border-red-500' : 'border-yellow-400/30'
                }`}
              >
                <option value="">Select Employee</option>
                {employees.filter(e => e.status === 'active').map(employee => (
                  <option key={employee.id} value={`${employee.firstName} ${employee.lastName}`}>
                    {employee.firstName} {employee.lastName} - {employee.designation}
                  </option>
                ))}
              </select>
              {errors.assignedTo && <p className="mt-1 text-sm text-red-400">{errors.assignedTo}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-50 mb-2">Due Date *</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                className={`w-full px-3 py-2 bg-slate-700/50 border rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm ${
                  errors.dueDate ? 'border-red-500' : 'border-yellow-400/30'
                }`}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.dueDate && <p className="mt-1 text-sm text-red-400">{errors.dueDate}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-50 mb-2">Estimated Hours</label>
              <input
                type="number"
                value={formData.estimatedHours}
                onChange={(e) => setFormData(prev => ({ ...prev, estimatedHours: parseFloat(e.target.value) || 0 }))}
                className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                placeholder="0"
                min="0"
                step="0.5"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-50 mb-2">Tags</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="flex-1 px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-l-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                  placeholder="Add tag and press Enter"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-all"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-yellow-400/30">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700/50 border border-yellow-400/30 rounded-lg hover:bg-slate-700 transition-all backdrop-blur-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 transition-all"
            >
              <Save className="h-4 w-4 mr-2" />
              {editingTask ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const MyTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [viewMode, setViewMode] = useState<'my' | 'team'>('my');
  
  // Mock current user - in real app, get from auth context
  const currentUser = 'Priya Sharma';

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [tasksData, employeesData] = await Promise.all([
          loadTasks(),
          getEmployees()
        ]);
        setTasks(tasksData);
        setEmployees(employeesData);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Listen for task updates
    const handleTasksUpdate = () => {
      setTasks(loadTasks());
    };

    window.addEventListener('tasksUpdated', handleTasksUpdate);
    return () => window.removeEventListener('tasksUpdated', handleTasksUpdate);
  }, []);

  const handleCreateTask = (taskData: Task) => {
    if (editingTask) {
      updateTask(taskData);
      setTasks(prev => prev.map(t => t.id === taskData.id ? taskData : t));
      toast.success('Task updated successfully!');
    } else {
      addTask(taskData);
      setTasks(prev => [...prev, taskData]);
      toast.success('Task created successfully!');
    }
    
    setShowCreateModal(false);
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
      toast.success('Task deleted successfully!');
    }
  };

  const handleStatusChange = (taskId: string, newStatus: Task['status']) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const updatedTask: Task = {
      ...task,
      status: newStatus,
      updatedAt: new Date().toISOString(),
      startedAt: newStatus === 'in-progress' && !task.startedAt ? new Date().toISOString() : task.startedAt,
      completedAt: newStatus === 'completed' ? new Date().toISOString() : undefined
    };

    updateTask(updatedTask);
    setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
    toast.success(`Task ${newStatus.replace('-', ' ')}`);
  };

  // Filter tasks based on view mode and filters
  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Filter by view mode
    if (viewMode === 'my') {
      filtered = filtered.filter(task => task.assignedTo === currentUser);
    }

    // Apply search and filters
    filtered = filtered.filter(task => {
      const matchesSearch = !searchTerm || 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPriority = !selectedPriority || task.priority === selectedPriority;
      const matchesStatus = !selectedStatus || task.status === selectedStatus;
      const matchesType = !selectedType || task.type === selectedType;

      return matchesSearch && matchesPriority && matchesStatus && matchesType;
    });

    return filtered.sort((a, b) => {
      // Sort by priority first, then by due date
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  }, [tasks, viewMode, currentUser, searchTerm, selectedPriority, selectedStatus, selectedType]);

  // Calculate statistics
  const stats = useMemo(() => {
    const myTasks = tasks.filter(task => task.assignedTo === currentUser);
    const teamTasks = tasks;
    
    const currentTasks = viewMode === 'my' ? myTasks : teamTasks;
    
    return {
      total: currentTasks.length,
      completed: currentTasks.filter(t => t.status === 'completed').length,
      inProgress: currentTasks.filter(t => t.status === 'in-progress').length,
      overdue: currentTasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed').length,
      highPriority: currentTasks.filter(t => t.priority === 'high' || t.priority === 'critical').length
    };
  }, [tasks, viewMode, currentUser]);

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'in-progress': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'review': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'todo': return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'cancelled': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTypeIcon = (type: Task['type']) => {
    switch (type) {
      case 'call': return '📞';
      case 'meeting': return '🤝';
      case 'email': return '📧';
      case 'documentation': return '📄';
      default: return '📋';
    }
  };

  const isOverdue = (dueDate: string, status: Task['status']) => {
    return new Date(dueDate) < new Date() && status !== 'completed';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading tasks...</p>
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
            <h1 className="text-3xl font-bold text-slate-50 mb-2">
              {viewMode === 'my' ? 'My Tasks' : 'Team Tasks'}
            </h1>
            <p className="text-slate-400">
              {viewMode === 'my' ? 'Manage your assigned tasks' : 'Overview of all team tasks'}
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            <div className="flex bg-slate-700/50 rounded-lg p-1">
              <button
                onClick={() => setViewMode('my')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  viewMode === 'my'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-slate-50'
                }`}
              >
                My Tasks
              </button>
              <button
                onClick={() => setViewMode('team')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  viewMode === 'team'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-slate-50'
                }`}
              >
                Team Tasks
              </button>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 transition-all"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Task
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-xl border border-yellow-400/40 rounded-2xl p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <CheckSquare className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-400">Total Tasks</p>
                <p className="text-2xl font-bold text-slate-50">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl border border-yellow-400/40 rounded-2xl p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-400">Completed</p>
                <p className="text-2xl font-bold text-slate-50">{stats.completed}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl border border-yellow-400/40 rounded-2xl p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-500/20 rounded-xl">
                <Play className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-400">In Progress</p>
                <p className="text-2xl font-bold text-slate-50">{stats.inProgress}</p>
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
                <p className="text-2xl font-bold text-slate-50">{stats.overdue}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl border border-yellow-400/40 rounded-2xl p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <Star className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-400">High Priority</p>
                <p className="text-2xl font-bold text-slate-50">{stats.highPriority}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-yellow-400/40 rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-50 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                  placeholder="Search tasks..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-50 mb-2">Priority</label>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
              >
                <option value="">All Priorities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-50 mb-2">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
              >
                <option value="">All Status</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="review">Review</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-50 mb-2">Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
              >
                <option value="">All Types</option>
                <option value="call">Call</option>
                <option value="meeting">Meeting</option>
                <option value="email">Email</option>
                <option value="documentation">Documentation</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedPriority('');
                  setSelectedStatus('');
                  setSelectedType('');
                }}
                className="w-full px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700/50 border border-yellow-400/30 rounded-lg hover:bg-slate-700 transition-all backdrop-blur-sm"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <div key={task.id} className="bg-slate-800/50 backdrop-blur-xl border border-yellow-400/40 rounded-2xl p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-lg">{getTypeIcon(task.type)}</span>
                    <h3 className="text-lg font-semibold text-slate-50">{task.title}</h3>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                      {task.status.replace('-', ' ')}
                    </div>
                    {isOverdue(task.dueDate, task.status) && (
                      <div className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                        Overdue
                      </div>
                    )}
                  </div>
                  
                  <p className="text-slate-400 mb-4">{task.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-400 mb-4">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Assigned to: <span className="text-slate-50 ml-1">{task.assignedTo}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Due: <span className={`ml-1 ${isOverdue(task.dueDate, task.status) ? 'text-red-400' : 'text-slate-50'}`}>
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Est: <span className="text-slate-50 ml-1">{task.estimatedHours}h</span>
                      {task.actualHours && (
                        <span className="text-slate-50 ml-1">/ Actual: {task.actualHours}h</span>
                      )}
                    </div>
                  </div>

                  {task.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {task.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {task.progressPercentage > 0 && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-slate-400 mb-1">
                        <span>Progress</span>
                        <span>{task.progressPercentage}%</span>
                      </div>
                      <div className="w-full bg-slate-600/50 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all"
                          style={{ width: `${task.progressPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-4 text-sm text-slate-400">
                    {task.comments.length > 0 && (
                      <div className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        {task.comments.length} comments
                      </div>
                    )}
                    {task.attachments.length > 0 && (
                      <div className="flex items-center">
                        <Paperclip className="h-4 w-4 mr-1" />
                        {task.attachments.length} attachments
                      </div>
                    )}
                    {task.subtasks.length > 0 && (
                      <div className="flex items-center">
                        <CheckSquare className="h-4 w-4 mr-1" />
                        {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length} subtasks
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  {task.status !== 'completed' && (
                    <div className="flex space-x-1">
                      {task.status === 'todo' && (
                        <button
                          onClick={() => handleStatusChange(task.id, 'in-progress')}
                          className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700/50 rounded-lg transition-all"
                          title="Start Task"
                        >
                          <Play className="h-4 w-4" />
                        </button>
                      )}
                      {task.status === 'in-progress' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(task.id, 'review')}
                            className="p-2 text-slate-400 hover:text-purple-400 hover:bg-slate-700/50 rounded-lg transition-all"
                            title="Send for Review"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleStatusChange(task.id, 'completed')}
                            className="p-2 text-slate-400 hover:text-green-400 hover:bg-slate-700/50 rounded-lg transition-all"
                            title="Mark Complete"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      {task.status === 'review' && (
                        <button
                          onClick={() => handleStatusChange(task.id, 'completed')}
                          className="p-2 text-slate-400 hover:text-green-400 hover:bg-slate-700/50 rounded-lg transition-all"
                          title="Approve & Complete"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  )}
                  
                  <button
                    onClick={() => {
                      setEditingTask(task);
                      setShowCreateModal(true);
                    }}
                    className="p-2 text-slate-400 hover:text-yellow-400 hover:bg-slate-700/50 rounded-lg transition-all"
                    title="Edit Task"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700/50 rounded-lg transition-all"
                    title="Delete Task"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <div className="p-4 bg-slate-700/30 rounded-full w-16 h-16 mx-auto mb-4">
              <CheckSquare className="h-8 w-8 text-slate-400 mx-auto mt-2" />
            </div>
            <h3 className="text-lg font-medium text-slate-50 mb-2">No Tasks Found</h3>
            <p className="text-slate-400 mb-4">
              {searchTerm || selectedPriority || selectedStatus || selectedType
                ? 'No tasks match your current filters.'
                : `No ${viewMode === 'my' ? 'assigned' : 'team'} tasks found.`}
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 transition-all"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Task
            </button>
          </div>
        )}
      </div>

      {/* Create/Edit Task Modal */}
      <CreateTaskModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setEditingTask(null);
        }}
        onSave={handleCreateTask}
        editingTask={editingTask}
        employees={employees}
        currentUser={currentUser}
      />
    </div>
  );
};