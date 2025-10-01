import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Filter, Calendar, Clock, User, Tag, AlertTriangle, Star, MoreVertical, CreditCard as Edit, Trash2, Eye, Settings, Users, Target, TrendingUp, CheckCircle, XCircle, Save, X, Shield, Zap, Crown, CheckSquare } from 'lucide-react';
import { SLAPolicy, EscalationRule } from '../../types/tasks';
import { loadSLAPolicies, saveSLAPolicies } from '../../data/tasks.mock';
import { getEmployees } from '../../data/employees.mock';
import { Employee } from '../../types/hrms';
import toast from 'react-hot-toast';

interface CreateSLAModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (policy: SLAPolicy) => void;
  editingPolicy?: SLAPolicy | null;
  employees: Employee[];
}

const CreateSLAModal: React.FC<CreateSLAModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  editingPolicy, 
  employees 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    level: 'standard' as SLAPolicy['level'],
    firstResponseTime: 240, // 4 hours in minutes
    resolutionTime: 1440, // 24 hours in minutes
    escalationTime: 480, // 8 hours in minutes
    priority: ['medium'] as string[],
    category: ['general'] as string[],
    customerType: ['individual'] as string[],
    businessHours: {
      start: '09:00',
      end: '18:00',
      timezone: 'Asia/Kolkata',
      workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as string[]
    },
    escalationRules: [] as EscalationRule[],
    isActive: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingPolicy) {
      setFormData({
        name: editingPolicy.name,
        description: editingPolicy.description,
        level: editingPolicy.level,
        firstResponseTime: editingPolicy.firstResponseTime,
        resolutionTime: editingPolicy.resolutionTime,
        escalationTime: editingPolicy.escalationTime,
        priority: editingPolicy.priority,
        category: editingPolicy.category,
        customerType: editingPolicy.customerType,
        businessHours: editingPolicy.businessHours,
        escalationRules: editingPolicy.escalationRules,
        isActive: editingPolicy.isActive
      });
    } else {
      setFormData({
        name: '',
        description: '',
        level: 'standard',
        firstResponseTime: 240,
        resolutionTime: 1440,
        escalationTime: 480,
        priority: ['medium'],
        category: ['general'],
        customerType: ['individual'],
        businessHours: {
          start: '09:00',
          end: '18:00',
          timezone: 'Asia/Kolkata',
          workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
        },
        escalationRules: [],
        isActive: true
      });
    }
  }, [editingPolicy]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.firstResponseTime <= 0) newErrors.firstResponseTime = 'First response time must be greater than 0';
    if (formData.resolutionTime <= 0) newErrors.resolutionTime = 'Resolution time must be greater than 0';
    if (formData.escalationTime <= 0) newErrors.escalationTime = 'Escalation time must be greater than 0';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const policyData: SLAPolicy = {
      id: editingPolicy?.id || `sla_${Date.now()}`,
      name: formData.name,
      description: formData.description,
      level: formData.level,
      firstResponseTime: formData.firstResponseTime,
      resolutionTime: formData.resolutionTime,
      escalationTime: formData.escalationTime,
      priority: formData.priority,
      category: formData.category,
      customerType: formData.customerType,
      businessHours: formData.businessHours,
      escalationRules: formData.escalationRules,
      isActive: formData.isActive,
      createdAt: editingPolicy?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(policyData);
  };

  const handleArrayFieldChange = (field: 'priority' | 'category' | 'customerType', value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const handleWorkingDayChange = (day: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        workingDays: checked 
          ? [...prev.businessHours.workingDays, day]
          : prev.businessHours.workingDays.filter(d => d !== day)
      }
    }));
  };

  const addEscalationRule = () => {
    const newRule: EscalationRule = {
      id: `rule_${Date.now()}`,
      condition: 'response_time_exceeded',
      action: 'escalate_to_manager',
      escalateTo: '',
      notifyUsers: [],
      delayMinutes: 60
    };

    setFormData(prev => ({
      ...prev,
      escalationRules: [...prev.escalationRules, newRule]
    }));
  };

  const updateEscalationRule = (index: number, field: keyof EscalationRule, value: any) => {
    setFormData(prev => ({
      ...prev,
      escalationRules: prev.escalationRules.map((rule, i) => 
        i === index ? { ...rule, [field]: value } : rule
      )
    }));
  };

  const removeEscalationRule = (index: number) => {
    setFormData(prev => ({
      ...prev,
      escalationRules: prev.escalationRules.filter((_, i) => i !== index)
    }));
  };

  if (!isOpen) return null;

  const minutesToHours = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-slate-800/90 backdrop-blur-xl border border-yellow-400/40 rounded-2xl shadow-2xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-slate-50">
            {editingPolicy ? 'Edit SLA Policy' : 'Create SLA Policy'}
          </h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-50 hover:bg-slate-700/50 rounded-lg transition-all">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-50 mb-2">Policy Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={`w-full px-3 py-2 bg-slate-700/50 border rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm ${
                  errors.name ? 'border-red-500' : 'border-yellow-400/30'
                }`}
                placeholder="Enter policy name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-50 mb-2">SLA Level</label>
              <select
                value={formData.level}
                onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value as SLAPolicy['level'] }))}
                className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
              >
                <option value="standard">🔵 Standard</option>
                <option value="priority">🟡 Priority</option>
                <option value="premium">👑 Premium</option>
              </select>
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
                placeholder="Describe the SLA policy"
              />
              {errors.description && <p className="mt-1 text-sm text-red-400">{errors.description}</p>}
            </div>
          </div>

          {/* Time Settings */}
          <div>
            <h4 className="text-lg font-semibold text-slate-50 mb-4">Time Settings</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-50 mb-2">
                  First Response Time (minutes) *
                </label>
                <input
                  type="number"
                  value={formData.firstResponseTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstResponseTime: parseInt(e.target.value) || 0 }))}
                  className={`w-full px-3 py-2 bg-slate-700/50 border rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm ${
                    errors.firstResponseTime ? 'border-red-500' : 'border-yellow-400/30'
                  }`}
                  min="1"
                />
                <p className="text-xs text-slate-400 mt-1">{minutesToHours(formData.firstResponseTime)}</p>
                {errors.firstResponseTime && <p className="mt-1 text-sm text-red-400">{errors.firstResponseTime}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-50 mb-2">
                  Resolution Time (minutes) *
                </label>
                <input
                  type="number"
                  value={formData.resolutionTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, resolutionTime: parseInt(e.target.value) || 0 }))}
                  className={`w-full px-3 py-2 bg-slate-700/50 border rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm ${
                    errors.resolutionTime ? 'border-red-500' : 'border-yellow-400/30'
                  }`}
                  min="1"
                />
                <p className="text-xs text-slate-400 mt-1">{minutesToHours(formData.resolutionTime)}</p>
                {errors.resolutionTime && <p className="mt-1 text-sm text-red-400">{errors.resolutionTime}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-50 mb-2">
                  Escalation Time (minutes) *
                </label>
                <input
                  type="number"
                  value={formData.escalationTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, escalationTime: parseInt(e.target.value) || 0 }))}
                  className={`w-full px-3 py-2 bg-slate-700/50 border rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm ${
                    errors.escalationTime ? 'border-red-500' : 'border-yellow-400/30'
                  }`}
                  min="1"
                />
                <p className="text-xs text-slate-400 mt-1">{minutesToHours(formData.escalationTime)}</p>
                {errors.escalationTime && <p className="mt-1 text-sm text-red-400">{errors.escalationTime}</p>}
              </div>
            </div>
          </div>

          {/* Conditions */}
          <div>
            <h4 className="text-lg font-semibold text-slate-50 mb-4">Policy Conditions</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-50 mb-2">Priority Levels</label>
                <div className="space-y-2">
                  {['low', 'medium', 'high', 'critical'].map(priority => (
                    <label key={priority} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.priority.includes(priority)}
                        onChange={(e) => handleArrayFieldChange('priority', priority, e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-slate-50 capitalize">{priority}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-50 mb-2">Categories</label>
                <div className="space-y-2">
                  {['general', 'technical', 'billing', 'complaint', 'feature-request'].map(category => (
                    <label key={category} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.category.includes(category)}
                        onChange={(e) => handleArrayFieldChange('category', category, e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-slate-50 capitalize">{category.replace('-', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-50 mb-2">Customer Types</label>
                <div className="space-y-2">
                  {['individual', 'corporate', 'premium'].map(type => (
                    <label key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.customerType.includes(type)}
                        onChange={(e) => handleArrayFieldChange('customerType', type, e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-slate-50 capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div>
            <h4 className="text-lg font-semibold text-slate-50 mb-4">Business Hours</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-50 mb-2">Start Time</label>
                <input
                  type="time"
                  value={formData.businessHours.start}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    businessHours: { ...prev.businessHours, start: e.target.value }
                  }))}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-50 mb-2">End Time</label>
                <input
                  type="time"
                  value={formData.businessHours.end}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    businessHours: { ...prev.businessHours, end: e.target.value }
                  }))}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-50 mb-2">Timezone</label>
                <select
                  value={formData.businessHours.timezone}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    businessHours: { ...prev.businessHours, timezone: e.target.value }
                  }))}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                >
                  <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">America/New_York (EST)</option>
                  <option value="Europe/London">Europe/London (GMT)</option>
                </select>
              </div>

              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-slate-50 mb-2">Working Days</label>
                <div className="flex flex-wrap gap-4">
                  {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                    <label key={day} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.businessHours.workingDays.includes(day)}
                        onChange={(e) => handleWorkingDayChange(day, e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-slate-50 capitalize">{day}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Escalation Rules */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-slate-50">Escalation Rules</h4>
              <button
                type="button"
                onClick={addEscalationRule}
                className="inline-flex items-center px-3 py-1 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 transition-all"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Rule
              </button>
            </div>

            <div className="space-y-4">
              {formData.escalationRules.map((rule, index) => (
                <div key={rule.id} className="bg-slate-700/30 rounded-lg p-4 border border-yellow-400/20">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="text-sm font-medium text-slate-50">Rule #{index + 1}</h5>
                    <button
                      type="button"
                      onClick={() => removeEscalationRule(index)}
                      className="p-1 text-slate-400 hover:text-red-400 rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-50 mb-1">Condition</label>
                      <select
                        value={rule.condition}
                        onChange={(e) => updateEscalationRule(index, 'condition', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                      >
                        <option value="response_time_exceeded">Response Time Exceeded</option>
                        <option value="resolution_time_exceeded">Resolution Time Exceeded</option>
                        <option value="high_priority_ticket">High Priority Ticket</option>
                        <option value="customer_escalation">Customer Escalation</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-50 mb-1">Action</label>
                      <select
                        value={rule.action}
                        onChange={(e) => updateEscalationRule(index, 'action', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                      >
                        <option value="escalate_to_manager">Escalate to Manager</option>
                        <option value="notify_team">Notify Team</option>
                        <option value="reassign_ticket">Reassign Ticket</option>
                        <option value="immediate_escalation">Immediate Escalation</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-50 mb-1">Escalate To</label>
                      <select
                        value={rule.escalateTo}
                        onChange={(e) => updateEscalationRule(index, 'escalateTo', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                      >
                        <option value="">Select Employee</option>
                        {employees.filter(e => e.status === 'active').map(employee => (
                          <option key={employee.id} value={`${employee.firstName} ${employee.lastName}`}>
                            {employee.firstName} {employee.lastName} - {employee.designation}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-50 mb-1">Delay (minutes)</label>
                      <input
                        type="number"
                        value={rule.delayMinutes}
                        onChange={(e) => updateEscalationRule(index, 'delayMinutes', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                        min="0"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-slate-50">Active Policy</span>
            </label>
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
              {editingPolicy ? 'Update Policy' : 'Create Policy'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const SLAPriority: React.FC = () => {
  const [policies, setPolicies] = useState<SLAPolicy[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<SLAPolicy | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [policiesData, employeesData] = await Promise.all([
          loadSLAPolicies(),
          getEmployees()
        ]);
        setPolicies(policiesData);
        setEmployees(employeesData);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load SLA policies');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleCreatePolicy = (policyData: SLAPolicy) => {
    if (editingPolicy) {
      const updatedPolicies = policies.map(p => p.id === policyData.id ? policyData : p);
      setPolicies(updatedPolicies);
      saveSLAPolicies(updatedPolicies);
      toast.success('SLA policy updated successfully!');
    } else {
      const updatedPolicies = [...policies, policyData];
      setPolicies(updatedPolicies);
      saveSLAPolicies(updatedPolicies);
      toast.success('SLA policy created successfully!');
    }
    
    setShowCreateModal(false);
    setEditingPolicy(null);
  };

  const handleDeletePolicy = (policyId: string) => {
    if (window.confirm('Are you sure you want to delete this SLA policy?')) {
      const updatedPolicies = policies.filter(p => p.id !== policyId);
      setPolicies(updatedPolicies);
      saveSLAPolicies(updatedPolicies);
      toast.success('SLA policy deleted successfully!');
    }
  };

  const handleToggleStatus = (policyId: string) => {
    const updatedPolicies = policies.map(p => 
      p.id === policyId 
        ? { ...p, isActive: !p.isActive, updatedAt: new Date().toISOString() }
        : p
    );
    setPolicies(updatedPolicies);
    saveSLAPolicies(updatedPolicies);
    
    const policy = updatedPolicies.find(p => p.id === policyId);
    toast.success(`SLA policy ${policy?.isActive ? 'activated' : 'deactivated'}`);
  };

  // Filter policies
  const filteredPolicies = useMemo(() => {
    return policies.filter(policy => {
      const matchesSearch = !searchTerm || 
        policy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        policy.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesLevel = !selectedLevel || policy.level === selectedLevel;
      const matchesStatus = !selectedStatus || 
        (selectedStatus === 'active' && policy.isActive) ||
        (selectedStatus === 'inactive' && !policy.isActive);

      return matchesSearch && matchesLevel && matchesStatus;
    });
  }, [policies, searchTerm, selectedLevel, selectedStatus]);

  // Calculate statistics
  const stats = useMemo(() => {
    return {
      total: policies.length,
      active: policies.filter(p => p.isActive).length,
      standard: policies.filter(p => p.level === 'standard').length,
      priority: policies.filter(p => p.level === 'priority').length,
      premium: policies.filter(p => p.level === 'premium').length
    };
  }, [policies]);

  const getLevelColor = (level: SLAPolicy['level']) => {
    switch (level) {
      case 'standard': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'priority': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'premium': return 'text-purple-600 bg-purple-50 border-purple-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getLevelIcon = (level: SLAPolicy['level']) => {
    switch (level) {
      case 'standard': return <Shield className="h-4 w-4" />;
      case 'priority': return <Zap className="h-4 w-4" />;
      case 'premium': return <Crown className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const minutesToHours = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading SLA policies...</p>
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
            <h1 className="text-3xl font-bold text-slate-50 mb-2">SLA & Priority Management</h1>
            <p className="text-slate-400">Configure service level agreements and priority policies</p>
          </div>
          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 transition-all"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create SLA Policy
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-xl border border-yellow-400/40 rounded-2xl p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <Target className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-400">Total Policies</p>
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
                <p className="text-sm font-medium text-slate-400">Active</p>
                <p className="text-2xl font-bold text-slate-50">{stats.active}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl border border-yellow-400/40 rounded-2xl p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <Shield className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-400">Standard</p>
                <p className="text-2xl font-bold text-slate-50">{stats.standard}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl border border-yellow-400/40 rounded-2xl p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-500/20 rounded-xl">
                <Zap className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-400">Priority</p>
                <p className="text-2xl font-bold text-slate-50">{stats.priority}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl border border-yellow-400/40 rounded-2xl p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <Crown className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-400">Premium</p>
                <p className="text-2xl font-bold text-slate-50">{stats.premium}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-yellow-400/40 rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-50 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                  placeholder="Search policies..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-50 mb-2">SLA Level</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
              >
                <option value="">All Levels</option>
                <option value="standard">Standard</option>
                <option value="priority">Priority</option>
                <option value="premium">Premium</option>
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedLevel('');
                  setSelectedStatus('');
                }}
                className="w-full px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700/50 border border-yellow-400/30 rounded-lg hover:bg-slate-700 transition-all backdrop-blur-sm"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Policies List */}
        <div className="space-y-6">
          {filteredPolicies.map((policy) => (
            <div key={policy.id} className="bg-slate-800/50 backdrop-blur-xl border border-yellow-400/40 rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getLevelColor(policy.level)}`}>
                      {getLevelIcon(policy.level)}
                      <span className="ml-1 capitalize">{policy.level}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-50">{policy.name}</h3>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      policy.isActive 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : 'bg-gray-100 text-gray-800 border border-gray-200'
                    }`}>
                      {policy.isActive ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                  <p className="text-slate-400 mb-4">{policy.description}</p>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleToggleStatus(policy.id)}
                    className={`p-2 rounded-lg transition-all ${
                      policy.isActive
                        ? 'text-slate-400 hover:text-red-400 hover:bg-slate-700/50'
                        : 'text-slate-400 hover:text-green-400 hover:bg-slate-700/50'
                    }`}
                    title={policy.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {policy.isActive ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => {
                      setEditingPolicy(policy);
                      setShowCreateModal(true);
                    }}
                    className="p-2 text-slate-400 hover:text-yellow-400 hover:bg-slate-700/50 rounded-lg transition-all"
                    title="Edit Policy"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeletePolicy(policy.id)}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700/50 rounded-lg transition-all"
                    title="Delete Policy"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Time Settings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-slate-700/30 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Clock className="h-4 w-4 text-blue-400 mr-2" />
                    <h4 className="text-sm font-medium text-slate-50">First Response</h4>
                  </div>
                  <p className="text-2xl font-bold text-slate-50">{minutesToHours(policy.firstResponseTime)}</p>
                </div>

                <div className="bg-slate-700/30 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <CheckSquare className="h-4 w-4 text-green-400 mr-2" />
                    <h4 className="text-sm font-medium text-slate-50">Resolution</h4>
                  </div>
                  <p className="text-2xl font-bold text-slate-50">{minutesToHours(policy.resolutionTime)}</p>
                </div>

                <div className="bg-slate-700/30 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <AlertTriangle className="h-4 w-4 text-orange-400 mr-2" />
                    <h4 className="text-sm font-medium text-slate-50">Escalation</h4>
                  </div>
                  <p className="text-2xl font-bold text-slate-50">{minutesToHours(policy.escalationTime)}</p>
                </div>
              </div>

              {/* Conditions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <h4 className="text-sm font-medium text-slate-50 mb-2">Priority Levels</h4>
                  <div className="flex flex-wrap gap-1">
                    {policy.priority.map((priority, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {priority}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-slate-50 mb-2">Categories</h4>
                  <div className="flex flex-wrap gap-1">
                    {policy.category.map((category, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                      >
                        {category.replace('-', ' ')}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-slate-50 mb-2">Customer Types</h4>
                  <div className="flex flex-wrap gap-1">
                    {policy.customerType.map((type, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-slate-700/30 rounded-lg p-4 mb-4">
                <h4 className="text-sm font-medium text-slate-50 mb-2">Business Hours</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-400">
                  <div>
                    <span className="text-slate-50">Hours:</span> {policy.businessHours.start} - {policy.businessHours.end}
                  </div>
                  <div>
                    <span className="text-slate-50">Timezone:</span> {policy.businessHours.timezone}
                  </div>
                  <div>
                    <span className="text-slate-50">Working Days:</span> {policy.businessHours.workingDays.length} days
                  </div>
                </div>
              </div>

              {/* Escalation Rules */}
              {policy.escalationRules.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-slate-50 mb-2">Escalation Rules ({policy.escalationRules.length})</h4>
                  <div className="space-y-2">
                    {policy.escalationRules.slice(0, 2).map((rule, index) => (
                      <div key={rule.id} className="bg-slate-700/30 rounded-lg p-3 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-50 capitalize">{rule.condition.replace('_', ' ')}</span>
                          <span className="text-slate-400">→ {rule.action.replace('_', ' ')}</span>
                        </div>
                      </div>
                    ))}
                    {policy.escalationRules.length > 2 && (
                      <div className="text-xs text-slate-400 text-center">
                        +{policy.escalationRules.length - 2} more rules
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredPolicies.length === 0 && (
          <div className="text-center py-12">
            <div className="p-4 bg-slate-700/30 rounded-full w-16 h-16 mx-auto mb-4">
              <Shield className="h-8 w-8 text-slate-400 mx-auto mt-2" />
            </div>
            <h3 className="text-lg font-medium text-slate-50 mb-2">No SLA Policies Found</h3>
            <p className="text-slate-400 mb-4">
              {searchTerm || selectedLevel || selectedStatus
                ? 'No policies match your current filters.'
                : 'Get started by creating your first SLA policy.'}
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 transition-all"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create SLA Policy
            </button>
          </div>
        )}
      </div>

      {/* Create/Edit SLA Modal */}
      <CreateSLAModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setEditingPolicy(null);
        }}
        onSave={handleCreatePolicy}
        editingPolicy={editingPolicy}
        employees={employees}
      />
    </div>
  );
};