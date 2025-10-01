import React, { useState } from 'react';
import { ArrowLeft, Save, User, Building, Phone, Mail, DollarSign, Tag, MapPin, Users, Briefcase } from 'lucide-react';
import { Lead } from '../../types/crm';
import toast from 'react-hot-toast';
import { loadLeads, addLead } from '../../data/leads.mock';
import { getActiveBranches } from '../../data/branches.mock';
import { getAgentsByBranch } from '../../data/agents.mock';
import { getEmployeesByBranch } from '../../data/employees.mock';

interface NewLeadProps {
  onBack: () => void;
  onSave: (lead: Partial<Lead>) => void;
}

export const NewLead: React.FC<NewLeadProps> = ({ onBack, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    source: 'website' as Lead['source'],
    status: 'new' as Lead['status'],
    priority: 'medium' as Lead['priority'],
    value: 0,
    assignedTo: '',
    assignedToEmployee: '',
    branch: '',
    notes: '',
    tags: [] as string[]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newTag, setNewTag] = useState('');
  const [branches] = useState(() => getActiveBranches());
  const [availableAgents, setAvailableAgents] = useState<any[]>([]);
  const [availableEmployees, setAvailableEmployees] = useState<any[]>([]);

  // Update agents and employees when branch changes
  React.useEffect(() => {
    if (formData.branch) {
      const branchAgents = getAgentsByBranch(formData.branch);
      const branchEmployees = getEmployeesByBranch(formData.branch).filter(emp => emp.status === 'active');
      setAvailableAgents(branchAgents);
      setAvailableEmployees(branchEmployees);
      
      // Reset assignments if current selections are not in the new branch
      const currentAgent = branchAgents.find(a => `${a.firstName} ${a.lastName}` === formData.assignedTo);
      const currentEmployee = branchEmployees.find(e => e.firstName && e.lastName && `${e.firstName} ${e.lastName}` === formData.assignedToEmployee);
      
      if (!currentAgent) {
        setFormData(prev => ({ ...prev, assignedTo: '' }));
      }
      if (!currentEmployee) {
        setFormData(prev => ({ ...prev, assignedToEmployee: '' }));
      }
    } else {
      setAvailableAgents([]);
      setAvailableEmployees([]);
    }
  }, [formData.branch]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.branch) newErrors.branch = 'Please select a branch';
    if (!formData.assignedTo && !formData.assignedToEmployee) {
      newErrors.assignedTo = 'Please assign to either an agent or employee';
    }
    if (formData.value <= 0) newErrors.value = 'Lead value must be greater than 0';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    
    if (validateForm()) {
      console.log('Validation passed, creating lead...');
      
      const leadData = {
        ...formData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        notes: formData.notes ? [
          formData.notes,
          `Branch: ${formData.branch}`,
          formData.assignedTo ? `Assigned Agent: ${formData.assignedTo}` : '',
          formData.assignedToEmployee ? `Assigned Employee: ${formData.assignedToEmployee}` : ''
        ].filter(Boolean) : [],
        nextFollowUp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
      };
      
      console.log('Lead data to save:', leadData);
      
      // Save to localStorage
      try {
        addLead(leadData as Lead);
        console.log('Lead saved successfully');
        toast.success(`Lead "${leadData.name}" created successfully!`);
        
        // Navigate back to leads list after successful save
        setTimeout(() => {
          onSave(leadData);
        }, 1000);
      } catch (error) {
        console.error('Error saving lead:', error);
        toast.error('Failed to save lead. Please try again.');
      }
    } else {
      console.log('Validation failed:', errors);
      toast.error('Please fix the errors before saving');
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-yellow-400/30 flex-shrink-0">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 text-slate-400 hover:text-slate-50 hover:bg-slate-700/50 rounded-lg transition-all"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-50">Add New Lead</h1>
            <p className="mt-1 text-sm text-slate-400">
              Capture new lead information and assign to sales team
            </p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-none">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-8 border border-yellow-400/30">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-50 mb-2">
                    <User className="inline h-4 w-4 mr-1" />
                    Lead Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-3 py-2 bg-slate-700/50 border rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm ${
                      errors.name ? 'border-red-500' : 'border-yellow-400/30'
                    }`}
                    placeholder="Enter lead name"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-50 mb-2">
                    <Building className="inline h-4 w-4 mr-1" />
                    Company
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                    placeholder="Company name (optional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-50 mb-2">
                    <Mail className="inline h-4 w-4 mr-1" />
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-3 py-2 bg-slate-700/50 border rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm ${
                      errors.email ? 'border-red-500' : 'border-yellow-400/30'
                    }`}
                    placeholder="lead@example.com"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-50 mb-2">
                    <Phone className="inline h-4 w-4 mr-1" />
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
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
                    onChange={(e) => handleInputChange('source', e.target.value)}
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
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-50 mb-2">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    Branch *
                  </label>
                  <select
                    value={formData.branch}
                    onChange={(e) => handleInputChange('branch', e.target.value)}
                    className={`w-full px-3 py-2 bg-slate-700/50 border rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm ${
                      errors.branch ? 'border-red-500' : 'border-yellow-400/30'
                    }`}
                  >
                    <option value="">Select Branch</option>
                    {branches.map(branch => (
                      <option key={branch.id} value={branch.name}>{branch.name}</option>
                    ))}
                  </select>
                  {errors.branch && <p className="mt-1 text-sm text-red-400">{errors.branch}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-50 mb-2">
                    <Users className="inline h-4 w-4 mr-1" />
                    Assign to Agent
                  </label>
                  <select
                    value={formData.assignedTo}
                    onChange={(e) => handleInputChange('assignedTo', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                    disabled={!formData.branch}
                  >
                    <option value="">Select Agent</option>
                    {availableAgents.map(agent => (
                      <option key={agent.id} value={`${agent.firstName} ${agent.lastName}`}>
                        {agent.firstName} {agent.lastName}
                      </option>
                    ))}
                  </select>
                  {!formData.branch && (
                    <p className="mt-1 text-xs text-slate-400">Please select a branch first</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-50 mb-2">
                    <Briefcase className="inline h-4 w-4 mr-1" />
                    Assign to Employee
                  </label>
                  <select
                    value={formData.assignedToEmployee}
                    onChange={(e) => handleInputChange('assignedToEmployee', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                    disabled={!formData.branch}
                  >
                    <option value="">Select Employee</option>
                    {availableEmployees.filter(emp => emp.firstName && emp.lastName).map(employee => (
                      <option key={employee.id} value={`${employee.firstName} ${employee.lastName}`}>
                        {employee.firstName} {employee.lastName} - {employee.designation}
                      </option>
                    ))}
                  </select>
                  {!formData.branch && (
                    <p className="mt-1 text-xs text-slate-400">Please select a branch first</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-50 mb-2">
                    <DollarSign className="inline h-4 w-4 mr-1" />
                    Lead Value (₹) *
                  </label>
                  <input
                    type="number"
                    value={formData.value}
                    onChange={(e) => handleInputChange('value', parseFloat(e.target.value) || 0)}
                    className={`w-full px-3 py-2 bg-slate-700/50 border rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm ${
                      errors.value ? 'border-red-500' : 'border-yellow-400/30'
                    }`}
                    placeholder="500000"
                  />
                  {errors.value && <p className="mt-1 text-sm text-red-400">{errors.value}</p>}
                </div>
              </div>

              {/* Branch Information Summary */}
              {formData.branch && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">Branch Information</h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p>Selected Branch: <span className="font-semibold">{formData.branch}</span></p>
                    <p>Available Agents: <span className="font-semibold">{availableAgents.length}</span></p>
                    <p>Available Employees: <span className="font-semibold">{availableEmployees.length}</span></p>
                    {formData.assignedTo && (
                      <p>Assigned Agent: <span className="font-semibold text-green-700">{formData.assignedTo}</span></p>
                    )}
                    {formData.assignedToEmployee && (
                      <p>Assigned Employee: <span className="font-semibold text-purple-700">{formData.assignedToEmployee}</span></p>
                    )}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-50 mb-2">Notes</label>
                <textarea
                  rows={4}
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                  placeholder="Additional notes about the lead"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-slate-50 mb-2">
                  <Tag className="inline h-4 w-4 mr-1" />
                  Tags
                </label>
                <div className="flex space-x-2 mb-3">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                    placeholder="Add a tag"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 border border-blue-200">
                      #{tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-yellow-400/30">
              <button
                type="button"
                onClick={onBack}
                className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700/50 border border-yellow-400/30 rounded-lg hover:bg-slate-700 transition-all backdrop-blur-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 transition-all"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Lead
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};