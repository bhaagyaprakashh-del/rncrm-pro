import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Search, CreditCard as Edit, Trash2, Eye, Target, TrendingUp, DollarSign, Users, CheckSquare, Calendar, Award, AlertTriangle, Star, Activity, BarChart3, PieChart, Filter, Download, Upload, Settings, MoreVertical, User, Building, Clock, CheckCircle, XCircle, Flag, Zap, Crown, Save, X, RefreshCw, FileText, Phone, Mail, UserPlus } from 'lucide-react';
import { EmployeeKPI, KPITarget, KPIAchievement } from '../../types/kpi';
import { getEmployeeKPIs, saveEmployeeKPIs, updateKPIAchievement, initializeKPIData } from '../../data/kpi.mock';
import { getEmployees, initializeEmployeesData } from '../../data/employees.mock';
import { Employee } from '../../types/hrms';
import { loadLeads, addLead, updateLead } from '../../data/leads.mock';
import { Lead } from '../../types/crm';
import toast from 'react-hot-toast';

interface CreateKPIModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (kpiData: any) => void;
  editingKPI?: EmployeeKPI | null;
  employees: Employee[];
}

interface UpdateAchievementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  kpi: EmployeeKPI | null;
  targetType: string;
}

interface KPISettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (leadData: any) => void;
  employeeId: string;
  employeeName: string;
}

const AddLeadModal: React.FC<AddLeadModalProps> = ({ isOpen, onClose, onSave, employeeId, employeeName }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    source: 'cold-call' as Lead['source'],
    priority: 'medium' as Lead['priority'],
    value: 0,
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (formData.value <= 0) newErrors.value = 'Lead value must be greater than 0';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const leadData: Lead = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      company: formData.company || undefined,
      source: formData.source,
      status: 'new',
      priority: formData.priority,
      value: formData.value,
      assignedTo: employeeName,
      assignedToEmployee: employeeName,
      branch: 'Bangalore Main',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: formData.notes ? [formData.notes, `Added via KPI module by ${employeeName}`] : [`Added via KPI module by ${employeeName}`],
      tags: ['kpi-generated', 'employee-lead'],
      nextFollowUp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    };

    onSave(leadData);
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      source: 'cold-call',
      priority: 'medium',
      value: 0,
      notes: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-slate-800/90 backdrop-blur-xl border border-yellow-400/40 rounded-2xl shadow-2xl p-6 w-full max-w-2xl mx-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-slate-50">Add New Lead</h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-50 hover:bg-slate-700/50 rounded-lg transition-all">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 text-sm">
            <strong>KPI Integration:</strong> This lead will be automatically counted towards {employeeName}'s lead generation target.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-50 mb-2">Lead Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={`w-full px-3 py-2 bg-slate-700/50 border rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm ${
                  errors.name ? 'border-red-500' : 'border-yellow-400/30'
                }`}
                placeholder="Enter lead name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-50 mb-2">Company</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                placeholder="Company name (optional)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-50 mb-2">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className={`w-full px-3 py-2 bg-slate-700/50 border rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm ${
                  errors.email ? 'border-red-500' : 'border-yellow-400/30'
                }`}
                placeholder="lead@example.com"
              />
              {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-50 mb-2">Phone *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className={`w-full px-3 py-2 bg-slate-700/50 border rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm ${
                  errors.phone ? 'border-red-500' : 'border-yellow-400/30'
                }`}
                placeholder="+91 98765 43210"
              />
              {errors.phone && <p className="mt-1 text-sm text-red-400">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-50 mb-2">Lead Source</label>
              <select
                value={formData.source}
                onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value as Lead['source'] }))}
                className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
              >
                <option value="website">Website</option>
                <option value="referral">Referral</option>
                <option value="cold-call">Cold Call</option>
                <option value="social-media">Social Media</option>
                <option value="advertisement">Advertisement</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-50 mb-2">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as Lead['priority'] }))}
                className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-50 mb-2">Lead Value (₹) *</label>
              <input
                type="number"
                value={formData.value}
                onChange={(e) => setFormData(prev => ({ ...prev, value: parseFloat(e.target.value) || 0 }))}
                className={`w-full px-3 py-2 bg-slate-700/50 border rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm ${
                  errors.value ? 'border-red-500' : 'border-yellow-400/30'
                }`}
                placeholder="500000"
              />
              {errors.value && <p className="mt-1 text-sm text-red-400">{errors.value}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-50 mb-2">Notes</label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
              placeholder="Additional notes about the lead"
            />
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
              <UserPlus className="h-4 w-4 mr-2" />
              Add Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const KPISettingsModal: React.FC<KPISettingsModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    minimumPerformanceThreshold: 50,
    incentiveCalculationMethod: 'linear' as 'linear' | 'tiered' | 'threshold',
    payrollIntegration: true,
    autoApproval: false,
    penaltyEnabled: true,
    maxPenaltyPercentage: 25,
    manualDataEntry: {
      collectionAmount: 0,
      groupTicketsFilled: 0,
      notes: ''
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save settings to localStorage
    localStorage.setItem('kpi_settings', JSON.stringify(formData));
    
    // If manual data is entered, update KPIs
    if (formData.manualDataEntry.collectionAmount > 0 || formData.manualDataEntry.groupTicketsFilled > 0) {
      updateManualKPIData();
    }
    
    onSave(formData);
    toast.success('KPI settings updated successfully!');
  };

  const updateManualKPIData = () => {
    const kpis = getEmployeeKPIs();
    const updatedKPIs = kpis.map(kpi => {
      const updatedTargets = kpi.targets.map(target => {
        if (target.type === 'collection' && formData.manualDataEntry.collectionAmount > 0) {
          const newAchieved = target.achievedValue + formData.manualDataEntry.collectionAmount;
          const newPercentage = (newAchieved / target.targetValue) * 100;
          return {
            ...target,
            achievedValue: newAchieved,
            achievementPercentage: newPercentage,
            incentiveEarned: newPercentage >= 50 ? (target.incentiveAmount * newPercentage) / 100 : -((target.incentiveAmount * (50 - newPercentage)) / 100),
            status: newPercentage >= 100 ? 'achieved' as const : 'in_progress' as const,
            updatedAt: new Date().toISOString()
          };
        }
        
        if (target.type === 'group_filling' && formData.manualDataEntry.groupTicketsFilled > 0) {
          const newAchieved = target.achievedValue + formData.manualDataEntry.groupTicketsFilled;
          const newPercentage = (newAchieved / target.targetValue) * 100;
          return {
            ...target,
            achievedValue: newAchieved,
            achievementPercentage: newPercentage,
            incentiveEarned: newPercentage >= 50 ? (target.incentiveAmount * newPercentage) / 100 : -((target.incentiveAmount * (50 - newPercentage)) / 100),
            status: newPercentage >= 100 ? 'achieved' as const : 'in_progress' as const,
            updatedAt: new Date().toISOString()
          };
        }
        
        return target;
      });

      // Recalculate overall performance
      const totalPerformance = updatedTargets.reduce((sum, t) => sum + t.achievementPercentage, 0);
      const overallPerformance = totalPerformance / updatedTargets.length;
      const totalIncentive = updatedTargets.reduce((sum, t) => sum + t.incentiveEarned, 0);

      return {
        ...kpi,
        targets: updatedTargets,
        overallPerformance,
        totalIncentive,
        updatedAt: new Date().toISOString()
      };
    });

    saveEmployeeKPIs(updatedKPIs);
    toast.success('Manual KPI data updated for all employees!');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-slate-800/90 backdrop-blur-xl border border-yellow-400/40 rounded-2xl shadow-2xl p-6 w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-slate-50">KPI Settings</h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-50 hover:bg-slate-700/50 rounded-lg transition-all">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Settings */}
          <div>
            <h4 className="text-lg font-semibold text-slate-50 mb-4">General KPI Settings</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-50 mb-2">Minimum Performance Threshold (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.minimumPerformanceThreshold}
                  onChange={(e) => setFormData(prev => ({ ...prev, minimumPerformanceThreshold: parseInt(e.target.value) || 50 }))}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                />
                <p className="text-xs text-slate-400 mt-1">Below this threshold, penalties will be applied</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-50 mb-2">Incentive Calculation Method</label>
                <select
                  value={formData.incentiveCalculationMethod}
                  onChange={(e) => setFormData(prev => ({ ...prev, incentiveCalculationMethod: e.target.value as any }))}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                >
                  <option value="linear">Linear (Proportional)</option>
                  <option value="tiered">Tiered (Step-based)</option>
                  <option value="threshold">Threshold (All or Nothing)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-50 mb-2">Maximum Penalty (%)</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={formData.maxPenaltyPercentage}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxPenaltyPercentage: parseInt(e.target.value) || 25 }))}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                />
                <p className="text-xs text-slate-400 mt-1">Maximum penalty as percentage of incentive</p>
              </div>

              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.payrollIntegration}
                    onChange={(e) => setFormData(prev => ({ ...prev, payrollIntegration: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-slate-50">Payroll Integration</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.autoApproval}
                    onChange={(e) => setFormData(prev => ({ ...prev, autoApproval: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-slate-50">Auto Approval</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.penaltyEnabled}
                    onChange={(e) => setFormData(prev => ({ ...prev, penaltyEnabled: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-slate-50">Enable Penalties</span>
                </label>
              </div>
            </div>
          </div>

          {/* Manual Data Entry */}
          <div className="border-t border-yellow-400/30 pt-6">
            <h4 className="text-lg font-semibold text-slate-50 mb-4">Manual Data Entry</h4>
            <p className="text-slate-400 text-sm mb-4">
              Manually enter collection amounts and group ticket filling data to update all employee KPIs
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-50 mb-2">Collection Amount (₹)</label>
                <input
                  type="number"
                  value={formData.manualDataEntry.collectionAmount}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    manualDataEntry: { 
                      ...prev.manualDataEntry, 
                      collectionAmount: parseFloat(e.target.value) || 0 
                    }
                  }))}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                  placeholder="Enter collection amount"
                />
                <p className="text-xs text-slate-400 mt-1">This will be added to all employees' collection targets</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-50 mb-2">Group Tickets Filled</label>
                <input
                  type="number"
                  value={formData.manualDataEntry.groupTicketsFilled}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    manualDataEntry: { 
                      ...prev.manualDataEntry, 
                      groupTicketsFilled: parseInt(e.target.value) || 0 
                    }
                  }))}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                  placeholder="Enter number of tickets filled"
                />
                <p className="text-xs text-slate-400 mt-1">This will be added to all employees' group filling targets</p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-50 mb-2">Notes</label>
                <textarea
                  rows={2}
                  value={formData.manualDataEntry.notes}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    manualDataEntry: { 
                      ...prev.manualDataEntry, 
                      notes: e.target.value 
                    }
                  }))}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                  placeholder="Notes about this manual data entry"
                />
              </div>
            </div>

            {(formData.manualDataEntry.collectionAmount > 0 || formData.manualDataEntry.groupTicketsFilled > 0) && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h5 className="text-sm font-medium text-green-900 mb-2">📊 Manual Data Impact</h5>
                <div className="text-sm text-green-800 space-y-1">
                  {formData.manualDataEntry.collectionAmount > 0 && (
                    <p>• Collection amount ₹{formData.manualDataEntry.collectionAmount.toLocaleString()} will be added to all employees' collection targets</p>
                  )}
                  {formData.manualDataEntry.groupTicketsFilled > 0 && (
                    <p>• {formData.manualDataEntry.groupTicketsFilled} group tickets will be added to all employees' group filling targets</p>
                  )}
                  <p>• KPI achievements and incentives will be automatically recalculated</p>
                  <p>• Changes will be reflected in payroll if integration is enabled</p>
                </div>
              </div>
            )}
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
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const UpdateAchievementModal: React.FC<UpdateAchievementModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  kpi, 
  targetType 
}) => {
  const [formData, setFormData] = useState({
    value: 0,
    description: ''
  });

  const target = kpi?.targets.find(t => t.type === targetType);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.value || !formData.description.trim()) {
      toast.error('Please enter value and description');
      return;
    }
    onSave(formData);
    setFormData({ value: 0, description: '' });
  };

  if (!isOpen || !kpi || !target) return null;

  const getTargetLabel = (type: string) => {
    switch (type) {
      case 'leads': return 'Leads Generated';
      case 'tasks': return 'Tasks Completed';
      case 'business': return 'Business Value (₹)';
      case 'collection': return 'Collection Amount (₹)';
      case 'group_filling': return 'Group Tickets Filled';
      default: return 'Achievement';
    }
  };

  const getUnit = (type: string) => {
    switch (type) {
      case 'business':
      case 'collection':
        return '₹';
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-slate-800/90 backdrop-blur-xl border border-yellow-400/40 rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-50">Update Achievement</h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-50 hover:bg-slate-700/50 rounded-lg transition-all">
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <div className="mb-4 p-4 bg-slate-700/30 rounded-lg border border-yellow-400/20">
          <h4 className="text-slate-50 font-medium">{target.name}</h4>
          <p className="text-slate-400 text-sm">{kpi.employeeName}</p>
          <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-400">Target:</span>
              <span className="text-slate-50 ml-1">{getUnit(targetType)}{target.targetValue.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-slate-400">Current:</span>
              <span className="text-slate-50 ml-1">{getUnit(targetType)}{target.achievedValue.toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-50 mb-2">
              {getTargetLabel(targetType)}
            </label>
            <input
              type="number"
              value={formData.value}
              onChange={(e) => setFormData(prev => ({ ...prev, value: parseFloat(e.target.value) || 0 }))}
              className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
              placeholder={`Enter ${targetType === 'business' || targetType === 'collection' ? 'amount' : 'count'}`}
              min="0"
              step={targetType === 'business' || targetType === 'collection' ? '1000' : '1'}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-50 mb-2">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
              placeholder="Describe the achievement..."
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700/50 border border-yellow-400/30 rounded-lg hover:bg-slate-700 transition-all backdrop-blur-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg shadow-sm hover:bg-green-700 transition-all"
            >
              <Save className="h-4 w-4 mr-2" />
              Update Achievement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CreateKPIModal: React.FC<CreateKPIModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  editingKPI, 
  employees 
}) => {
  const [formData, setFormData] = useState({
    employeeId: '',
    period: new Date().toISOString().slice(0, 7), // YYYY-MM
    targets: [
      {
        type: 'leads',
        name: 'Monthly Lead Generation',
        description: 'Generate new leads for chit fund schemes',
        targetValue: 0,
        incentiveAmount: 0
      },
      {
        type: 'tasks',
        name: 'Task Completion',
        description: 'Complete assigned tasks on time',
        targetValue: 0,
        incentiveAmount: 0
      },
      {
        type: 'business',
        name: 'Lead Conversion Value',
        description: 'Convert leads to subscribers with minimum value',
        targetValue: 0,
        incentiveAmount: 0
      },
      {
        type: 'collection',
        name: 'Payment Collection',
        description: 'Collect payments from assigned customers',
        targetValue: 0,
        incentiveAmount: 0
      },
      {
        type: 'group_filling',
        name: 'Group Ticket Filling',
        description: 'Fill vacant tickets in assigned chit groups',
        targetValue: 0,
        incentiveAmount: 0
      }
    ],
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  React.useEffect(() => {
    if (editingKPI) {
      const employee = employees.find(e => e.id === editingKPI.employeeId);
      setFormData({
        employeeId: editingKPI.employeeId,
        period: editingKPI.period,
        targets: editingKPI.targets.map(t => ({
          type: t.type,
          name: t.name,
          description: t.description,
          targetValue: t.targetValue,
          incentiveAmount: t.incentiveAmount
        })),
        notes: editingKPI.notes || ''
      });
    }
  }, [editingKPI, employees]);

  const handleTargetChange = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      targets: prev.targets.map((target, i) => 
        i === index ? { ...target, [field]: value } : target
      )
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.employeeId) newErrors.employeeId = 'Please select an employee';
    if (!formData.period) newErrors.period = 'Please select a period';
    
    const hasValidTargets = formData.targets.some(t => t.targetValue > 0);
    if (!hasValidTargets) newErrors.targets = 'Please set at least one target';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const employee = employees.find(e => e.id === formData.employeeId);
    if (!employee) return;

    const kpiData: EmployeeKPI = {
      id: editingKPI?.id || `kpi_${Date.now()}`,
      employeeId: formData.employeeId,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      department: employee.department,
      branch: employee.branch,
      period: formData.period,
      targets: formData.targets
        .filter(t => t.targetValue > 0)
        .map((t, index) => ({
          id: `target_${formData.employeeId}_${index + 1}`,
          type: t.type as any,
          name: t.name,
          description: t.description,
          targetValue: t.targetValue,
          unit: (t.type === 'business' || t.type === 'collection') ? 'amount' : 'count',
          incentiveAmount: t.incentiveAmount,
          achievedValue: 0,
          achievementPercentage: 0,
          incentiveEarned: 0,
          status: 'pending',
          deadline: `${formData.period}-31`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })),
      achievements: [],
      overallPerformance: 0,
      totalIncentive: 0,
      status: 'active',
      createdAt: editingKPI?.createdAt || new Date().toISOString(),
      createdBy: editingKPI?.createdBy || 'admin@ramnirmalchits.com',
      updatedAt: new Date().toISOString(),
      updatedBy: 'admin@ramnirmalchits.com',
      notes: formData.notes
    };

    onSave(kpiData);
  };

  if (!isOpen) return null;

  const selectedEmployee = employees.find(e => e.id === formData.employeeId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-slate-800/90 backdrop-blur-xl border border-yellow-400/40 rounded-2xl shadow-2xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-slate-50">
            {editingKPI ? 'Edit Employee KPI' : 'Create Employee KPI'}
          </h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-50 hover:bg-slate-700/50 rounded-lg transition-all">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-50 mb-2">Employee *</label>
              <select
                value={formData.employeeId}
                onChange={(e) => setFormData(prev => ({ ...prev, employeeId: e.target.value }))}
                className={`w-full px-3 py-2 bg-slate-700/50 border rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm ${
                  errors.employeeId ? 'border-red-500' : 'border-yellow-400/30'
                }`}
                disabled={!!editingKPI}
              >
                <option value="">Select Employee</option>
                {employees.filter(e => e.status === 'active').map(employee => (
                  <option key={employee.id} value={employee.id}>
                    {employee.firstName} {employee.lastName} - {employee.designation}
                  </option>
                ))}
              </select>
              {errors.employeeId && <p className="mt-1 text-sm text-red-400">{errors.employeeId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-50 mb-2">Period *</label>
              <input
                type="month"
                value={formData.period}
                onChange={(e) => setFormData(prev => ({ ...prev, period: e.target.value }))}
                className={`w-full px-3 py-2 bg-slate-700/50 border rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm ${
                  errors.period ? 'border-red-500' : 'border-yellow-400/30'
                }`}
                disabled={!!editingKPI}
              />
              {errors.period && <p className="mt-1 text-sm text-red-400">{errors.period}</p>}
            </div>
          </div>

          {selectedEmployee && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Employee Information</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p>Name: <span className="font-semibold">{selectedEmployee.firstName} {selectedEmployee.lastName}</span></p>
                <p>Department: <span className="font-semibold">{selectedEmployee.department}</span></p>
                <p>Branch: <span className="font-semibold">{selectedEmployee.branch}</span></p>
                <p>Designation: <span className="font-semibold">{selectedEmployee.designation}</span></p>
              </div>
            </div>
          )}

          <div>
            <h4 className="text-lg font-semibold text-slate-50 mb-4">KPI Targets & Incentives</h4>
            <div className="space-y-4">
              {formData.targets.map((target, index) => (
                <div key={index} className="bg-slate-700/30 rounded-xl p-4 border border-yellow-400/20">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-50 mb-2">
                        {target.type === 'leads' ? '🎯 Leads Target' :
                         target.type === 'tasks' ? '✅ Tasks Target' :
                         target.type === 'business' ? '💼 Business Target' :
                         target.type === 'collection' ? '💰 Collection Target' :
                         '👥 Group Filling Target'}
                      </label>
                      <input
                        type="text"
                        value={target.name}
                        onChange={(e) => handleTargetChange(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                        placeholder="Target name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-50 mb-2">
                        Target Value {target.type === 'business' || target.type === 'collection' ? '(₹)' : '(Count)'}
                      </label>
                      <input
                        type="number"
                        value={target.targetValue}
                        onChange={(e) => handleTargetChange(index, 'targetValue', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                        placeholder="0"
                        min="0"
                        step={target.type === 'business' || target.type === 'collection' ? '1000' : '1'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-50 mb-2">Incentive Amount (₹)</label>
                      <input
                        type="number"
                        value={target.incentiveAmount}
                        onChange={(e) => handleTargetChange(index, 'incentiveAmount', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                        placeholder="0"
                        min="0"
                        step="100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-50 mb-2">Description</label>
                      <input
                        type="text"
                        value={target.description}
                        onChange={(e) => handleTargetChange(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                        placeholder="Target description"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {errors.targets && <p className="mt-2 text-sm text-red-400">{errors.targets}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-50 mb-2">Notes</label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
              placeholder="Additional notes about this KPI..."
            />
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
              {editingKPI ? 'Update KPI' : 'Create KPI'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const EmployeeKPIComponent: React.FC = () => {
  const [kpis, setKpis] = useState<EmployeeKPI[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [selectedPerformance, setSelectedPerformance] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [editingKPI, setEditingKPI] = useState<EmployeeKPI | null>(null);
  const [selectedKPI, setSelectedKPI] = useState<EmployeeKPI | null>(null);
  const [selectedTargetType, setSelectedTargetType] = useState('');
  const [selectedEmployeeForLead, setSelectedEmployeeForLead] = useState({ id: '', name: '' });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Initialize data if needed
        initializeKPIData();
        initializeEmployeesData();
        
        // Load all data
        const [kpiData, employeeData, leadData] = await Promise.all([
          getEmployeeKPIs(),
          getEmployees(),
          loadLeads()
        ]);
        
        setKpis(kpiData);
        setEmployees(employeeData);
        setLeads(leadData);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleCreateKPI = (kpiData: EmployeeKPI) => {
    const updatedKPIs = editingKPI 
      ? kpis.map(k => k.id === editingKPI.id ? kpiData : k)
      : [...kpis, kpiData];
    
    setKpis(updatedKPIs);
    saveEmployeeKPIs(updatedKPIs);
    setShowCreateModal(false);
    setEditingKPI(null);
    toast.success(editingKPI ? 'KPI updated successfully!' : 'KPI created successfully!');
  };

  const handleUpdateAchievement = (data: { value: number; description: string }) => {
    if (!selectedKPI || !selectedTargetType) return;

    const updatedKPIs = kpis.map(kpi => {
      if (kpi.id === selectedKPI.id) {
        const updatedTargets = kpi.targets.map(target => {
          if (target.type === selectedTargetType) {
            const newAchieved = target.achievedValue + data.value;
            const newPercentage = (newAchieved / target.targetValue) * 100;
            const newIncentive = newPercentage >= 50 
              ? (target.incentiveAmount * newPercentage) / 100
              : -((target.incentiveAmount * (50 - newPercentage)) / 100);

            return {
              ...target,
              achievedValue: newAchieved,
              achievementPercentage: newPercentage,
              incentiveEarned: newIncentive,
              status: newPercentage >= 100 ? 'achieved' as const : 'in_progress' as const,
              updatedAt: new Date().toISOString()
            };
          }
          return target;
        });

        // Add achievement record
        const newAchievement: KPIAchievement = {
          id: `achievement_${Date.now()}`,
          targetId: updatedTargets.find(t => t.type === selectedTargetType)?.id || '',
          value: data.value,
          description: data.description,
          achievedAt: new Date().toISOString(),
          recordedBy: 'admin@ramnirmalchits.com'
        };

        // Recalculate overall performance
        const totalPerformance = updatedTargets.reduce((sum, t) => sum + t.achievementPercentage, 0);
        const overallPerformance = totalPerformance / updatedTargets.length;
        const totalIncentive = updatedTargets.reduce((sum, t) => sum + t.incentiveEarned, 0);

        return {
          ...kpi,
          targets: updatedTargets,
          achievements: [...kpi.achievements, newAchievement],
          overallPerformance,
          totalIncentive,
          updatedAt: new Date().toISOString()
        };
      }
      return kpi;
    });

    setKpis(updatedKPIs);
    saveEmployeeKPIs(updatedKPIs);
    setShowUpdateModal(false);
    setSelectedKPI(null);
    setSelectedTargetType('');
    toast.success('Achievement updated successfully!');
  };

  const handleDeleteKPI = (kpiId: string) => {
    if (window.confirm('Are you sure you want to delete this KPI?')) {
      const updatedKPIs = kpis.filter(k => k.id !== kpiId);
      setKpis(updatedKPIs);
      saveEmployeeKPIs(updatedKPIs);
      toast.success('KPI deleted successfully!');
    }
  };

  const handleAddLead = (leadData: Lead) => {
    // Add lead to storage
    addLead(leadData);
    
    // Update local leads state
    setLeads(prev => [...prev, leadData]);
    
    // Update KPI for lead generation
    const employeeKPI = kpis.find(k => k.employeeName === leadData.assignedToEmployee);
    if (employeeKPI) {
      const updatedKPIs = kpis.map(kpi => {
        if (kpi.id === employeeKPI.id) {
          const updatedTargets = kpi.targets.map(target => {
            if (target.type === 'leads') {
              const newAchieved = target.achievedValue + 1;
              const newPercentage = (newAchieved / target.targetValue) * 100;
              const newIncentive = newPercentage >= 50 
                ? (target.incentiveAmount * newPercentage) / 100
                : -((target.incentiveAmount * (50 - newPercentage)) / 100);

              return {
                ...target,
                achievedValue: newAchieved,
                achievementPercentage: newPercentage,
                incentiveEarned: newIncentive,
                status: newPercentage >= 100 ? 'achieved' as const : 'in_progress' as const,
                updatedAt: new Date().toISOString()
              };
            }
            return target;
          });

          // Add achievement record
          const newAchievement: KPIAchievement = {
            id: `achievement_${Date.now()}`,
            targetId: updatedTargets.find(t => t.type === 'leads')?.id || '',
            value: 1,
            description: `Lead added: ${leadData.name} (${leadData.company || 'Individual'}) - ₹${leadData.value.toLocaleString()}`,
            achievedAt: new Date().toISOString(),
            recordedBy: 'system'
          };

          // Recalculate overall performance
          const totalPerformance = updatedTargets.reduce((sum, t) => sum + t.achievementPercentage, 0);
          const overallPerformance = totalPerformance / updatedTargets.length;
          const totalIncentive = updatedTargets.reduce((sum, t) => sum + t.incentiveEarned, 0);

          return {
            ...kpi,
            targets: updatedTargets,
            achievements: [...kpi.achievements, newAchievement],
            overallPerformance,
            totalIncentive,
            updatedAt: new Date().toISOString()
          };
        }
        return kpi;
      });

      setKpis(updatedKPIs);
      saveEmployeeKPIs(updatedKPIs);
    }
    
    setShowAddLeadModal(false);
    setSelectedEmployeeForLead({ id: '', name: '' });
    toast.success('Lead added successfully and KPI updated!');
  };

  const handleExportKPI = () => {
    try {
      const exportData = {
        exportDate: new Date().toISOString(),
        totalEmployees: kpis.length,
        summary: {
          totalKPIs: kpis.length,
          activeKPIs: kpis.filter(k => k.status === 'active').length,
          averagePerformance: kpis.reduce((sum, k) => sum + k.overallPerformance, 0) / kpis.length,
          totalIncentives: kpis.reduce((sum, k) => sum + k.totalIncentive, 0)
        },
        kpis: kpis.map(kpi => ({
          employeeName: kpi.employeeName,
          department: kpi.department,
          branch: kpi.branch,
          period: kpi.period,
          overallPerformance: kpi.overallPerformance,
          totalIncentive: kpi.totalIncentive,
          status: kpi.status,
          targets: kpi.targets.map(t => ({
            name: t.name,
            type: t.type,
            targetValue: t.targetValue,
            achievedValue: t.achievedValue,
            achievementPercentage: t.achievementPercentage,
            incentiveEarned: t.incentiveEarned,
            status: t.status
          }))
        }))
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `employee-kpi-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('KPI data exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export KPI data');
    }
  };

  const handleSettingsSave = (settingsData: any) => {
    setShowSettingsModal(false);
    // Settings are already saved in the modal component
  };

  // Filter KPIs
  const filteredKPIs = useMemo(() => {
    return kpis.filter(kpi => {
      const matchesSearch = !searchTerm || 
        kpi.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        kpi.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        kpi.branch.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDepartment = !selectedDepartment || kpi.department === selectedDepartment;
      const matchesPeriod = !selectedPeriod || kpi.period === selectedPeriod;
      
      const matchesPerformance = !selectedPerformance || 
        (selectedPerformance === 'excellent' && kpi.overallPerformance >= 90) ||
        (selectedPerformance === 'good' && kpi.overallPerformance >= 70 && kpi.overallPerformance < 90) ||
        (selectedPerformance === 'average' && kpi.overallPerformance >= 50 && kpi.overallPerformance < 70) ||
        (selectedPerformance === 'poor' && kpi.overallPerformance < 50);

      return matchesSearch && matchesDepartment && matchesPeriod && matchesPerformance;
    });
  }, [kpis, searchTerm, selectedDepartment, selectedPeriod, selectedPerformance]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalKPIs = kpis.length;
    const activeKPIs = kpis.filter(k => k.status === 'active').length;
    const avgPerformance = totalKPIs > 0 ? kpis.reduce((sum, k) => sum + k.overallPerformance, 0) / totalKPIs : 0;
    const totalIncentives = kpis.reduce((sum, k) => sum + k.totalIncentive, 0);
    const totalTargets = kpis.reduce((sum, k) => sum + k.targets.length, 0);
    const achievedTargets = kpis.reduce((sum, k) => sum + k.targets.filter(t => t.status === 'achieved').length, 0);
    const totalLeads = kpis.reduce((sum, k) => sum + k.targets.filter(t => t.type === 'leads').reduce((s, t) => s + t.achievedValue, 0), 0);
    const totalBusiness = kpis.reduce((sum, k) => sum + k.targets.filter(t => t.type === 'business').reduce((s, t) => s + t.achievedValue, 0), 0);
    const totalCollection = kpis.reduce((sum, k) => sum + k.targets.filter(t => t.type === 'collection').reduce((s, t) => s + t.achievedValue, 0), 0);
    const totalTasks = kpis.reduce((sum, k) => sum + k.targets.filter(t => t.type === 'tasks').reduce((s, t) => s + t.achievedValue, 0), 0);

    return {
      totalKPIs,
      activeKPIs,
      avgPerformance,
      totalIncentives,
      totalTargets,
      achievedTargets,
      totalLeads,
      totalBusiness,
      totalCollection,
      totalTasks
    };
  }, [kpis]);

  const getPerformanceColor = (performance: number) => {
    if (performance >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (performance >= 70) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (performance >= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'achieved': return 'text-green-600 bg-green-50 border-green-200';
      case 'in_progress': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'overdue': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading Employee KPIs...</p>
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
            <h1 className="text-3xl font-bold text-slate-50 mb-2">Employee KPI Dashboard</h1>
            <p className="text-slate-400">Monitor and manage employee performance indicators</p>
          </div>
          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            <button
              onClick={handleExportKPI}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-slate-50 bg-green-600 border border-transparent rounded-lg shadow-sm hover:bg-green-700 transition-all"
            >
              <Download className="h-4 w-4 mr-2" />
              Export KPI
            </button>
            <button
              onClick={() => setShowSettingsModal(true)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-slate-50 bg-purple-600 border border-transparent rounded-lg shadow-sm hover:bg-purple-700 transition-all"
            >
              <Settings className="h-4 w-4 mr-2" />
              KPI Settings
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 transition-all"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create KPI
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-xl border border-yellow-400/40 rounded-2xl p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-400">Total KPIs</p>
                <p className="text-2xl font-bold text-slate-50">{stats.totalKPIs}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl border border-yellow-400/40 rounded-2xl p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-400">Active KPIs</p>
                <p className="text-2xl font-bold text-slate-50">{stats.activeKPIs}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl border border-yellow-400/40 rounded-2xl p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-500/20 rounded-xl">
                <TrendingUp className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-400">Avg Performance</p>
                <p className="text-2xl font-bold text-slate-50">{stats.avgPerformance.toFixed(1)}%</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl border border-yellow-400/40 rounded-2xl p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <DollarSign className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-400">Total Incentives</p>
                <p className="text-2xl font-bold text-slate-50">₹{stats.totalIncentives.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl border border-yellow-400/40 rounded-2xl p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-500/20 rounded-xl">
                <Target className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-400">Target Achievement</p>
                <p className="text-2xl font-bold text-slate-50">{stats.totalTargets > 0 ? ((stats.achievedTargets / stats.totalTargets) * 100).toFixed(1) : 0}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-xl border border-yellow-400/40 rounded-2xl p-6">
            <div className="flex items-center">
              <div className="p-3 bg-cyan-500/20 rounded-xl">
                <UserPlus className="h-6 w-6 text-cyan-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-400">Total Leads</p>
                <p className="text-2xl font-bold text-slate-50">{stats.totalLeads}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl border border-yellow-400/40 rounded-2xl p-6">
            <div className="flex items-center">
              <div className="p-3 bg-emerald-500/20 rounded-xl">
                <Building className="h-6 w-6 text-emerald-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-400">Business Value</p>
                <p className="text-2xl font-bold text-slate-50">₹{stats.totalBusiness.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl border border-yellow-400/40 rounded-2xl p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-500/20 rounded-xl">
                <DollarSign className="h-6 w-6 text-orange-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-400">Collections</p>
                <p className="text-2xl font-bold text-slate-50">₹{stats.totalCollection.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl border border-yellow-400/40 rounded-2xl p-6">
            <div className="flex items-center">
              <div className="p-3 bg-pink-500/20 rounded-xl">
                <CheckSquare className="h-6 w-6 text-pink-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-400">Tasks Completed</p>
                <p className="text-2xl font-bold text-slate-50">{stats.totalTasks}</p>
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
                  placeholder="Search employees..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-50 mb-2">Department</label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
              >
                <option value="">All Departments</option>
                <option value="Sales">Sales</option>
                <option value="Marketing">Marketing</option>
                <option value="Operations">Operations</option>
                <option value="Customer Service">Customer Service</option>
                <option value="Finance">Finance</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-50 mb-2">Period</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
              >
                <option value="">All Periods</option>
                <option value="2024-01">January 2024</option>
                <option value="2024-02">February 2024</option>
                <option value="2024-03">March 2024</option>
                <option value="2024-04">April 2024</option>
                <option value="2024-05">May 2024</option>
                <option value="2024-06">June 2024</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-50 mb-2">Performance</label>
              <select
                value={selectedPerformance}
                onChange={(e) => setSelectedPerformance(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
              >
                <option value="">All Performance</option>
                <option value="excellent">Excellent (90%+)</option>
                <option value="good">Good (70-89%)</option>
                <option value="average">Average (50-69%)</option>
                <option value="poor">Poor (&lt;50%)</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedDepartment('');
                  setSelectedPeriod('');
                  setSelectedPerformance('');
                }}
                className="w-full px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700/50 border border-yellow-400/30 rounded-lg hover:bg-slate-700 transition-all backdrop-blur-sm"
              >
                <RefreshCw className="h-4 w-4 mx-auto" />
              </button>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredKPIs.map((kpi) => (
            <div key={kpi.id} className="bg-slate-800/50 backdrop-blur-xl border border-yellow-400/40 rounded-2xl p-6">
              {/* Employee Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <User className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-slate-50">{kpi.employeeName}</h3>
                    <p className="text-sm text-slate-400">{kpi.department} • {kpi.branch}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedEmployeeForLead({ id: kpi.employeeId, name: kpi.employeeName });
                      setShowAddLeadModal(true);
                    }}
                    className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700/50 rounded-lg transition-all"
                    title="Add Lead"
                  >
                    <UserPlus className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      setEditingKPI(kpi);
                      setShowCreateModal(true);
                    }}
                    className="p-2 text-slate-400 hover:text-yellow-400 hover:bg-slate-700/50 rounded-lg transition-all"
                    title="Edit KPI"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteKPI(kpi.id)}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700/50 rounded-lg transition-all"
                    title="Delete KPI"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Period & Performance */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-sm text-slate-400">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(kpi.period + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getPerformanceColor(kpi.overallPerformance)}`}>
                  {kpi.overallPerformance.toFixed(1)}% Performance
                </div>
              </div>

              {/* Targets */}
              <div className="space-y-3 mb-4">
                {kpi.targets.map((target) => (
                  <div key={target.id} className="bg-slate-700/30 rounded-lg p-3 border border-yellow-400/20">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-slate-50">
                          {target.type === 'leads' ? '🎯' :
                           target.type === 'tasks' ? '✅' :
                           target.type === 'business' ? '💼' :
                           target.type === 'collection' ? '💰' : '👥'} {target.name}
                        </div>
                        <div className={`ml-2 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(target.status)}`}>
                          {target.status.replace('_', ' ')}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedKPI(kpi);
                          setSelectedTargetType(target.type);
                          setShowUpdateModal(true);
                        }}
                        className="p-1 text-slate-400 hover:text-green-400 hover:bg-slate-600/50 rounded transition-all"
                        title="Update Achievement"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-xs text-slate-400 mb-2">
                      <div>
                        Target: {target.unit === 'amount' ? '₹' : ''}{target.targetValue.toLocaleString()}
                      </div>
                      <div>
                        Achieved: {target.unit === 'amount' ? '₹' : ''}{target.achievedValue.toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="w-full bg-slate-600/50 rounded-full h-2 mb-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${
                          target.achievementPercentage >= 100 ? 'bg-green-500' :
                          target.achievementPercentage >= 70 ? 'bg-blue-500' :
                          target.achievementPercentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(target.achievementPercentage, 100)}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">{target.achievementPercentage.toFixed(1)}% Complete</span>
                      <span className={`font-medium ${target.incentiveEarned >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {target.incentiveEarned >= 0 ? '+' : ''}₹{target.incentiveEarned.toFixed(0)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Incentive */}
              <div className="border-t border-yellow-400/30 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-50">Total Incentive</span>
                  <span className={`text-lg font-bold ${kpi.totalIncentive >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {kpi.totalIncentive >= 0 ? '+' : ''}₹{kpi.totalIncentive.toFixed(0)}
                  </span>
                </div>
                {kpi.totalIncentive < 0 && (
                  <p className="text-xs text-red-400 mt-1">
                    ⚠️ Penalty applied for underperformance
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredKPIs.length === 0 && (
          <div className="text-center py-12">
            <div className="p-4 bg-slate-700/30 rounded-full w-16 h-16 mx-auto mb-4">
              <Target className="h-8 w-8 text-slate-400 mx-auto mt-2" />
            </div>
            <h3 className="text-lg font-medium text-slate-50 mb-2">No KPIs Found</h3>
            <p className="text-slate-400 mb-4">
              {searchTerm || selectedDepartment || selectedPeriod || selectedPerformance
                ? 'No KPIs match your current filters.'
                : 'Get started by creating your first employee KPI.'}
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 transition-all"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create KPI
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateKPIModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setEditingKPI(null);
        }}
        onSave={handleCreateKPI}
        editingKPI={editingKPI}
        employees={employees}
      />

      <UpdateAchievementModal
        isOpen={showUpdateModal}
        onClose={() => {
          setShowUpdateModal(false);
          setSelectedKPI(null);
          setSelectedTargetType('');
        }}
        onSave={handleUpdateAchievement}
        kpi={selectedKPI}
        targetType={selectedTargetType}
      />

      <KPISettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        onSave={handleSettingsSave}
      />

      <AddLeadModal
        isOpen={showAddLeadModal}
        onClose={() => {
          setShowAddLeadModal(false);
          setSelectedEmployeeForLead({ id: '', name: '' });
        }}
        onSave={handleAddLead}
        employeeId={selectedEmployeeForLead.id}
        employeeName={selectedEmployeeForLead.name}
      />
    </div>
  );
};

export default EmployeeKPIComponent;