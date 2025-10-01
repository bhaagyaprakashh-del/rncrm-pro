import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Eye, CreditCard as Edit, Trash2, Phone, Mail, Building, Calendar, DollarSign, User, Tag, Activity, FileText, Target, TrendingUp, Users, Star, CheckCircle, XCircle, AlertTriangle, Clock, Award, MoreVertical, UserPlus, ArrowRight, Download, Upload, RefreshCw, X, Save } from 'lucide-react';
import { Lead } from '../../types/crm';
import { Subscriber } from '../../types/subscribers';
import { loadLeads, updateLead, saveLeads } from '../../data/leads.mock';
import toast from 'react-hot-toast';

interface ConvertToSubscriberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConvert: (subscriberData: any) => void;
  lead: Lead | null;
}

const ConvertToSubscriberModal: React.FC<ConvertToSubscriberModalProps> = ({ 
  isOpen, 
  onClose, 
  onConvert, 
  lead 
}) => {
  const [formData, setFormData] = useState({
    membershipType: 'Individual' as 'Individual' | 'Corporate' | 'Enterprise' | 'Premium',
    membershipTier: 'Basic' as 'Basic' | 'Silver' | 'Gold' | 'Platinum',
    branch: '',
    assignedAgent: '',
    annualIncome: 0,
    occupation: '',
    creditScore: 75,
    riskProfile: 'low' as 'low' | 'medium' | 'high',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const branches = [
    'Bangalore Main', 'Bangalore South', 'Bangalore East', 'Bangalore West', 'Bangalore Central',
    'Chennai Branch', 'Hyderabad Branch', 'Mumbai Branch'
  ];

  const agents = [
    'Karthik Nair', 'Vikram Singh', 'Priya Reddy', 'Suresh Kumar', 'Anjali Sharma'
  ];

  useEffect(() => {
    if (lead) {
      setFormData(prev => ({
        ...prev,
        branch: lead.branch || '',
        assignedAgent: lead.assignedTo || '',
        membershipType: lead.company ? 'Corporate' : 'Individual',
        membershipTier: lead.value >= 1000000 ? 'Platinum' : 
                      lead.value >= 500000 ? 'Gold' : 
                      lead.value >= 200000 ? 'Silver' : 'Basic',
        notes: `Converted from lead: ${lead.name} (${lead.source})`
      }));
    }
  }, [lead]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.branch) newErrors.branch = 'Branch is required';
    if (!formData.assignedAgent) newErrors.assignedAgent = 'Agent assignment is required';
    if (formData.annualIncome <= 0) newErrors.annualIncome = 'Annual income is required';
    if (!formData.occupation.trim()) newErrors.occupation = 'Occupation is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !lead) return;

    const subscriberData: Partial<Subscriber> = {
      id: `sub_${Date.now()}`,
      subscriberId: `SUB${String(Date.now()).slice(-3)}`,
      firstName: lead.name.split(' ')[0],
      lastName: lead.name.split(' ').slice(1).join(' ') || 'Customer',
      email: lead.email,
      phone: lead.phone,
      dateOfBirth: '1990-01-01', // Default, can be updated later
      gender: 'male', // Default, can be updated later
      maritalStatus: 'single', // Default, can be updated later
      occupation: formData.occupation,
      annualIncome: formData.annualIncome,
      address: lead.company || 'Address to be updated',
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
      postalCode: '560001',
      membershipType: formData.membershipType,
      membershipTier: formData.membershipTier,
      joiningDate: new Date().toISOString().split('T')[0],
      status: 'active',
      creditScore: formData.creditScore,
      totalInvestments: lead.value,
      currentBalance: lead.value,
      totalReturns: 0,
      activeSchemes: [],
      completedSchemes: [],
      totalSchemes: 0,
      kycStatus: 'pending',
      documents: [],
      nominee: {
        name: '',
        relationship: '',
        phone: '',
        address: '',
        idProof: ''
      },
      emergencyContact: {
        name: '',
        relationship: '',
        phone: ''
      },
      assignedAgent: formData.assignedAgent,
      branch: formData.branch,
      communicationPreferences: {
        email: true,
        sms: true,
        whatsapp: true,
        phone: false,
        preferredTime: 'evening',
        language: 'English'
      },
      riskProfile: formData.riskProfile,
      riskFactors: [],
      paymentHistory: {
        onTimePayments: 0,
        latePayments: 0,
        missedPayments: 0,
        averageDelayDays: 0
      },
      tags: [...(lead.tags || []), 'converted-lead'],
      notes: formData.notes,
      loginCount: 0,
      accountLocked: false,
      createdAt: new Date().toISOString(),
      createdBy: 'system@ramnirmalchits.com',
      updatedAt: new Date().toISOString(),
      updatedBy: 'system@ramnirmalchits.com'
    };

    onConvert(subscriberData);
  };

  if (!isOpen || !lead) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-slate-800/90 backdrop-blur-xl border border-yellow-400/40 rounded-2xl shadow-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-slate-50">Convert Lead to Subscriber</h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-50 hover:bg-slate-700/50 rounded-lg transition-all">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Lead Information */}
        <div className="mb-6 p-4 bg-slate-700/30 rounded-xl border border-yellow-400/20">
          <h4 className="text-slate-50 font-medium mb-2">Converting Lead</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-400">Name:</span>
              <span className="text-slate-50 ml-2">{lead.name}</span>
            </div>
            <div>
              <span className="text-slate-400">Company:</span>
              <span className="text-slate-50 ml-2">{lead.company || 'Individual'}</span>
            </div>
            <div>
              <span className="text-slate-400">Email:</span>
              <span className="text-slate-50 ml-2">{lead.email}</span>
            </div>
            <div>
              <span className="text-slate-400">Phone:</span>
              <span className="text-slate-50 ml-2">{lead.phone}</span>
            </div>
            <div>
              <span className="text-slate-400">Lead Value:</span>
              <span className="text-green-400 ml-2 font-semibold">
                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(lead.value)}
              </span>
            </div>
            <div>
              <span className="text-slate-400">Source:</span>
              <span className="text-slate-50 ml-2 capitalize">{lead.source.replace('-', ' ')}</span>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-50 mb-2">Membership Type</label>
              <select
                value={formData.membershipType}
                onChange={(e) => setFormData(prev => ({ ...prev, membershipType: e.target.value as any }))}
                className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
              >
                <option value="Individual">Individual</option>
                <option value="Corporate">Corporate</option>
                <option value="Enterprise">Enterprise</option>
                <option value="Premium">Premium</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-50 mb-2">Membership Tier</label>
              <select
                value={formData.membershipTier}
                onChange={(e) => setFormData(prev => ({ ...prev, membershipTier: e.target.value as any }))}
                className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
              >
                <option value="Basic">Basic</option>
                <option value="Silver">Silver</option>
                <option value="Gold">Gold</option>
                <option value="Platinum">Platinum</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-50 mb-2">Branch *</label>
              <select
                value={formData.branch}
                onChange={(e) => setFormData(prev => ({ ...prev, branch: e.target.value }))}
                className={`w-full px-3 py-2 bg-slate-700/50 border rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm ${
                  errors.branch ? 'border-red-500' : 'border-yellow-400/30'
                }`}
              >
                <option value="">Select Branch</option>
                {branches.map(branch => (
                  <option key={branch} value={branch}>{branch}</option>
                ))}
              </select>
              {errors.branch && <p className="mt-1 text-sm text-red-400">{errors.branch}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-50 mb-2">Assigned Agent *</label>
              <select
                value={formData.assignedAgent}
                onChange={(e) => setFormData(prev => ({ ...prev, assignedAgent: e.target.value }))}
                className={`w-full px-3 py-2 bg-slate-700/50 border rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm ${
                  errors.assignedAgent ? 'border-red-500' : 'border-yellow-400/30'
                }`}
              >
                <option value="">Select Agent</option>
                {agents.map(agent => (
                  <option key={agent} value={agent}>{agent}</option>
                ))}
              </select>
              {errors.assignedAgent && <p className="mt-1 text-sm text-red-400">{errors.assignedAgent}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-50 mb-2">Occupation *</label>
              <input
                type="text"
                value={formData.occupation}
                onChange={(e) => setFormData(prev => ({ ...prev, occupation: e.target.value }))}
                className={`w-full px-3 py-2 bg-slate-700/50 border rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm ${
                  errors.occupation ? 'border-red-500' : 'border-yellow-400/30'
                }`}
                placeholder="Enter occupation"
              />
              {errors.occupation && <p className="mt-1 text-sm text-red-400">{errors.occupation}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-50 mb-2">Annual Income (₹) *</label>
              <input
                type="number"
                value={formData.annualIncome}
                onChange={(e) => setFormData(prev => ({ ...prev, annualIncome: parseFloat(e.target.value) || 0 }))}
                className={`w-full px-3 py-2 bg-slate-700/50 border rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm ${
                  errors.annualIncome ? 'border-red-500' : 'border-yellow-400/30'
                }`}
                placeholder="1200000"
              />
              {errors.annualIncome && <p className="mt-1 text-sm text-red-400">{errors.annualIncome}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-50 mb-2">Credit Score (0-100)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.creditScore}
                onChange={(e) => setFormData(prev => ({ ...prev, creditScore: parseInt(e.target.value) || 75 }))}
                className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                placeholder="75"
              />
              <div className="mt-2">
                <div className="w-full bg-slate-700/50 rounded-full h-2 border border-yellow-400/20">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      formData.creditScore >= 80 ? 'bg-green-500' :
                      formData.creditScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${formData.creditScore}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-50 mb-2">Risk Profile</label>
              <select
                value={formData.riskProfile}
                onChange={(e) => setFormData(prev => ({ ...prev, riskProfile: e.target.value as any }))}
                className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
              >
                <option value="low">Low Risk</option>
                <option value="medium">Medium Risk</option>
                <option value="high">High Risk</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-50 mb-2">Conversion Notes</label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
              placeholder="Additional notes about the conversion"
            />
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-green-900 mb-2">✅ Conversion Summary</h4>
            <div className="text-sm text-green-800 space-y-1">
              <p>Lead "{lead?.name}" will be converted to a {formData.membershipTier} {formData.membershipType} subscriber</p>
              <p>Initial investment value: {lead ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(lead.value) : '₹0'}</p>
              <p>Branch: {formData.branch}</p>
              <p>Assigned Agent: {formData.assignedAgent}</p>
              <p>The lead status will be automatically updated to "won"</p>
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
              className="inline-flex items-center px-6 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg shadow-sm hover:bg-green-700 transition-all"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Convert to Subscriber
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const Conversions: React.FC = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterSource, setFilterSource] = useState<string>('all');
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Load leads data on component mount
  useEffect(() => {
    console.log('Conversions: Loading leads data...');
    const loadedLeads = loadLeads();
    console.log('Conversions: Loaded leads:', loadedLeads.length);
    setLeads(loadedLeads);
  }, []);

  // Listen for storage changes (when leads are updated from kanban or other pages)
  useEffect(() => {
    const handleStorageChange = () => {
      console.log('Conversions: Storage changed, reloading leads...');
      const updatedLeads = loadLeads();
      console.log('Conversions: Updated leads count:', updatedLeads.length);
      setLeads(updatedLeads);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('leadsUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('leadsUpdated', handleStorageChange);
    };
  }, []);

  const filteredLeads = useMemo(() => leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (lead.company && lead.company.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || lead.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || lead.priority === filterPriority;
    const matchesSource = filterSource === 'all' || lead.source === filterSource;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesSource;
  }), [leads, searchTerm, filterStatus, filterPriority, filterSource]);

  const stats = useMemo(() => {
    const wonLeads = leads.filter(l => l.status === 'won');
    const lostLeads = leads.filter(l => l.status === 'lost');
    const totalAttempts = wonLeads.length + lostLeads.length;
    const conversionRate = totalAttempts > 0 ? (wonLeads.length / totalAttempts * 100) : 0;
    const pipelineValue = leads.filter(l => !['won', 'lost'].includes(l.status)).reduce((sum, l) => sum + l.value, 0);
    const wonValue = wonLeads.reduce((sum, l) => sum + l.value, 0);
    const avgDealSize = wonLeads.length > 0 ? wonValue / wonLeads.length : 0;

    return {
      total: leads.length,
      new: leads.filter(l => l.status === 'new').length,
      contacted: leads.filter(l => l.status === 'contacted').length,
      qualified: leads.filter(l => l.status === 'qualified').length,
      proposal: leads.filter(l => l.status === 'proposal').length,
      negotiation: leads.filter(l => l.status === 'negotiation').length,
      won: wonLeads.length,
      lost: lostLeads.length,
      conversionRate: conversionRate,
      pipelineValue: pipelineValue,
      wonValue: wonValue,
      avgDealSize: avgDealSize,
      highPriority: leads.filter(l => l.priority === 'high').length,
      readyToConvert: leads.filter(l => ['qualified', 'proposal', 'negotiation'].includes(l.status)).length
    };
  }, [leads]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'proposal': return 'bg-purple-100 text-purple-800';
      case 'negotiation': return 'bg-orange-100 text-orange-800';
      case 'won': return 'bg-emerald-100 text-emerald-800';
      case 'lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const handleConvertLead = (lead: Lead) => {
    setSelectedLead(lead);
    setShowConvertModal(true);
  };

  const handleConvertToSubscriber = async (subscriberData: Partial<Subscriber>) => {
    if (!selectedLead) return;

    try {
      // Save subscriber to localStorage
      const existingSubscribers = localStorage.getItem('subscribers_data');
      let subscribers = [];
      
      if (existingSubscribers) {
        try {
          subscribers = JSON.parse(existingSubscribers);
          if (!Array.isArray(subscribers)) {
            subscribers = [];
          }
        } catch (error) {
          console.error('Error parsing existing subscribers:', error);
          subscribers = [];
        }
      }
      
      subscribers.push(subscriberData);
      localStorage.setItem('subscribers_data', JSON.stringify(subscribers));
      
      // Update lead status to 'won'
      const updatedLead = {
        ...selectedLead,
        status: 'won' as Lead['status'],
        updatedAt: new Date().toISOString(),
        notes: [...selectedLead.notes, `Converted to subscriber on ${new Date().toLocaleDateString()}`]
      };
      
      // Update leads in storage
      const updatedLeads = leads.map(l => l.id === selectedLead.id ? updatedLead : l);
      setLeads(updatedLeads);
      saveLeads(updatedLeads);
      
      // Dispatch events to update other components
      window.dispatchEvent(new CustomEvent('subscribersUpdated'));
      window.dispatchEvent(new CustomEvent('leadsUpdated'));
      
      toast.success(`Successfully converted ${selectedLead.name} to subscriber!`);
      setShowConvertModal(false);
      setSelectedLead(null);
      
    } catch (error) {
      console.error('Error converting lead to subscriber:', error);
      toast.error('Failed to convert lead. Please try again.');
    }
  };

  const handleCall = (lead: Lead) => {
    if (navigator.userAgent.match(/Mobile|Android|iPhone|iPad/)) {
      window.location.href = `tel:${lead.phone}`;
    } else {
      navigator.clipboard.writeText(lead.phone).then(() => {
        toast.success(`Phone number ${lead.phone} copied to clipboard`);
      }).catch(() => {
        toast.error('Could not copy phone number');
      });
    }
    toast.success(`Call initiated to ${lead.name}`);
  };

  const handleEmail = (lead: Lead) => {
    const subject = encodeURIComponent(`Follow-up: ${lead.company || lead.name} - Chit Fund Conversion`);
    const body = encodeURIComponent(`Dear ${lead.name},

Thank you for your continued interest in our chit fund schemes. I wanted to follow up on our recent discussions and help you move forward with your investment.

Based on our conversations, I believe you're ready to join our chit fund family. I'm here to assist you with the enrollment process and answer any final questions you may have.

Would you like to schedule a call to complete your subscription?

Best regards,
${lead.assignedTo}
Ramnirmalchits Financial Services`);
    
    const mailtoLink = `mailto:${lead.email}?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
    toast.success(`Email client opened for ${lead.name}`);
  };

  const canConvert = (lead: Lead) => {
    return ['qualified', 'proposal', 'negotiation'].includes(lead.status);
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-yellow-400/30 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">Conversions & Win Analysis</h1>
          <p className="mt-1 text-sm text-slate-400">
            Track successful conversions and sales performance with lead-to-subscriber conversion
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-yellow-400/30 text-sm font-medium rounded-lg text-slate-50 bg-slate-700/50 hover:bg-slate-700 transition-all backdrop-blur-sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </button>
          <button 
            onClick={() => navigate('/leads-new')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-all"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Lead
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-none">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-14 gap-4">
          <div className="bg-slate-800/40 backdrop-blur-xl p-4 rounded-xl border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Leads</p>
                <p className="text-2xl font-bold text-slate-50">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl p-4 rounded-xl border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">New</p>
                <p className="text-2xl font-bold text-blue-400">{stats.new}</p>
              </div>
              <Star className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl p-4 rounded-xl border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Contacted</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.contacted}</p>
              </div>
              <Phone className="h-8 w-8 text-yellow-400" />
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl p-4 rounded-xl border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Qualified</p>
                <p className="text-2xl font-bold text-green-400">{stats.qualified}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl p-4 rounded-xl border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Proposal</p>
                <p className="text-2xl font-bold text-purple-400">{stats.proposal}</p>
              </div>
              <FileText className="h-8 w-8 text-purple-400" />
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl p-4 rounded-xl border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Negotiation</p>
                <p className="text-2xl font-bold text-orange-400">{stats.negotiation}</p>
              </div>
              <Target className="h-8 w-8 text-orange-400" />
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl p-4 rounded-xl border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Won</p>
                <p className="text-2xl font-bold text-emerald-400">{stats.won}</p>
              </div>
              <Award className="h-8 w-8 text-emerald-400" />
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl p-4 rounded-xl border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Lost</p>
                <p className="text-2xl font-bold text-red-400">{stats.lost}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-400" />
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl p-4 rounded-xl border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Conversion Rate</p>
                <p className="text-2xl font-bold text-green-400">{stats.conversionRate.toFixed(1)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-400" />
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl p-4 rounded-xl border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Ready to Convert</p>
                <p className="text-2xl font-bold text-purple-400">{stats.readyToConvert}</p>
              </div>
              <UserPlus className="h-8 w-8 text-purple-400" />
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl p-4 rounded-xl border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">High Priority</p>
                <p className="text-2xl font-bold text-red-400">{stats.highPriority}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl p-4 rounded-xl border border-yellow-400/30 md:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Pipeline Value</p>
                <p className="text-xl font-bold text-blue-400">{formatCurrency(stats.pipelineValue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl p-4 rounded-xl border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Won Value</p>
                <p className="text-xl font-bold text-emerald-400">{formatCurrency(stats.wonValue)}</p>
              </div>
              <Award className="h-8 w-8 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-800/40 backdrop-blur-xl rounded-xl p-4 border border-yellow-400/30">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 h-4 w-4" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg w-full text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="proposal">Proposal</option>
              <option value="negotiation">Negotiation</option>
              <option value="won">Won</option>
              <option value="lost">Lost</option>
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm"
            >
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              className="px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm"
            >
              <option value="all">All Sources</option>
              <option value="website">Website</option>
              <option value="referral">Referral</option>
              <option value="cold-call">Cold Call</option>
              <option value="social-media">Social Media</option>
              <option value="advertisement">Advertisement</option>
            </select>
            <div className="text-sm text-slate-400">
              Showing: <span className="font-semibold text-slate-50">{filteredLeads.length}</span> leads
            </div>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-yellow-400/30 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700/50 border-b border-yellow-400/20">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Lead</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Value</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Agent</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Source</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-yellow-400/20">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-700/20 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-slate-600/50 rounded-full flex items-center justify-center text-slate-50 font-medium border border-yellow-400/30">
                          {lead.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-50">{lead.name}</p>
                          <p className="text-xs text-slate-400">{lead.company || 'Individual'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm text-slate-300">{lead.email}</p>
                        <p className="text-xs text-slate-400">{lead.phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${getPriorityColor(lead.priority)}`}></div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                          {lead.status.toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-semibold text-green-400">{formatCurrency(lead.value)}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-slate-50">{lead.assignedTo}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-slate-50 capitalize">{lead.source.replace('-', ' ')}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => navigate(`/leads-360?id=${lead.id}`)}
                          className="text-blue-400 hover:text-blue-300"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleCall(lead)}
                          className="text-green-400 hover:text-green-300"
                          title="Call Lead"
                        >
                          <Phone className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEmail(lead)}
                          className="text-purple-400 hover:text-purple-300"
                          title="Send Email"
                        >
                          <Mail className="h-4 w-4" />
                        </button>
                        {canConvert(lead) && (
                          <button
                            onClick={() => handleConvertLead(lead)}
                            className="text-emerald-400 hover:text-emerald-300"
                            title="Convert to Subscriber"
                          >
                            <UserPlus className="h-4 w-4" />
                          </button>
                        )}
                        {lead.status === 'won' && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 border border-green-200">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Converted
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Conversion Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30">
            <h3 className="text-lg font-semibold text-slate-50 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Conversion Funnel
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
                <span className="text-blue-400 font-medium">New Leads</span>
                <span className="text-blue-400 font-bold">{stats.new}</span>
              </div>
              <div className="flex items-center justify-center">
                <ArrowRight className="h-4 w-4 text-slate-500" />
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                <span className="text-yellow-400 font-medium">Contacted</span>
                <span className="text-yellow-400 font-bold">{stats.contacted}</span>
              </div>
              <div className="flex items-center justify-center">
                <ArrowRight className="h-4 w-4 text-slate-500" />
              </div>
              <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                <span className="text-green-400 font-medium">Qualified</span>
                <span className="text-green-400 font-bold">{stats.qualified}</span>
              </div>
              <div className="flex items-center justify-center">
                <ArrowRight className="h-4 w-4 text-slate-500" />
              </div>
              <div className="flex items-center justify-between p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
                <span className="text-emerald-400 font-medium">Won</span>
                <span className="text-emerald-400 font-bold">{stats.won}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30">
            <h3 className="text-lg font-semibold text-slate-50 mb-4 flex items-center">
              <Award className="h-5 w-5 mr-2" />
              Win Analysis
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Conversion Rate</span>
                <span className="text-green-400 font-bold text-2xl">{stats.conversionRate.toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Average Deal Size</span>
                <span className="text-blue-400 font-semibold">{formatCurrency(stats.avgDealSize)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Total Won Value</span>
                <span className="text-emerald-400 font-semibold">{formatCurrency(stats.wonValue)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Ready to Convert</span>
                <span className="text-purple-400 font-semibold">{stats.readyToConvert} leads</span>
              </div>
            </div>
          </div>
        </div>

        {filteredLeads.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 mx-auto text-slate-500 mb-4" />
            <h3 className="text-lg font-medium text-slate-50 mb-2">No leads found</h3>
            <p className="text-sm text-slate-400">Try adjusting your search criteria or add a new lead.</p>
          </div>
        )}
      </div>

      {/* Convert to Subscriber Modal */}
      <ConvertToSubscriberModal
        isOpen={showConvertModal}
        onClose={() => {
          setShowConvertModal(false);
          setSelectedLead(null);
        }}
        onConvert={handleConvertToSubscriber}
        lead={selectedLead}
      />
    </div>
  );
};