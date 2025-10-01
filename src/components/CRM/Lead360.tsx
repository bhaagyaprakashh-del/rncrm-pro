import React, { useState, useEffect } from 'react';
import { ArrowLeft, CreditCard as Edit, Mail, Phone, Building, Calendar, DollarSign, User, Tag, Activity, FileText, Eye, Search, Filter, MoreVertical, Star, CheckCircle, XCircle, AlertTriangle, Clock, Target, TrendingUp, X, Save } from 'lucide-react';
import { Lead } from '../../types/crm';
import { loadLeads, updateLead } from '../../data/leads.mock';
import toast from 'react-hot-toast';

interface Lead360Props {
  leadId: string;
  onBack: () => void;
}

interface LeadActivity {
  id: string;
  leadId: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'status_change' | 'follow_up' | 'proposal_sent' | 'payment_received';
  title: string;
  description: string;
  timestamp: string;
  performedBy: string;
  metadata?: any;
}

const generateActivitiesForLead = (lead: Lead): LeadActivity[] => {
  const activities: LeadActivity[] = [];
  const baseDate = new Date(lead.createdAt);
  
  // Initial contact activity
  activities.push({
    id: `act_${lead.id}_1`,
    leadId: lead.id,
    type: 'note',
    title: 'Lead Created',
    description: `New lead created from ${lead.source}`,
    timestamp: lead.createdAt,
    performedBy: lead.assignedTo || 'System'
  });

  // Add activities based on lead status progression
  let currentDate = new Date(baseDate.getTime() + 24 * 60 * 60 * 1000); // Next day

  if (['contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'].includes(lead.status)) {
    activities.push({
      id: `act_${lead.id}_2`,
      leadId: lead.id,
      type: 'call',
      title: 'Initial Contact Made',
      description: `First contact established with ${lead.name}. Discussed chit fund requirements.`,
      timestamp: currentDate.toISOString(),
      performedBy: lead.assignedTo || 'Sales Agent'
    });
    currentDate = new Date(currentDate.getTime() + 2 * 24 * 60 * 60 * 1000);
  }

  if (['qualified', 'proposal', 'negotiation', 'won', 'lost'].includes(lead.status)) {
    activities.push({
      id: `act_${lead.id}_3`,
      leadId: lead.id,
      type: 'meeting',
      title: 'Qualification Meeting',
      description: `Conducted detailed needs assessment. Budget confirmed at ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(lead.value)}.`,
      timestamp: currentDate.toISOString(),
      performedBy: lead.assignedTo || 'Sales Agent'
    });
    currentDate = new Date(currentDate.getTime() + 3 * 24 * 60 * 60 * 1000);
  }

  if (['proposal', 'negotiation', 'won', 'lost'].includes(lead.status)) {
    activities.push({
      id: `act_${lead.id}_4`,
      leadId: lead.id,
      type: 'proposal_sent',
      title: 'Proposal Sent',
      description: `Detailed chit fund proposal sent via email. Includes scheme options and terms.`,
      timestamp: currentDate.toISOString(),
      performedBy: lead.assignedTo || 'Sales Agent'
    });
    currentDate = new Date(currentDate.getTime() + 5 * 24 * 60 * 60 * 1000);
  }

  if (['negotiation', 'won', 'lost'].includes(lead.status)) {
    activities.push({
      id: `act_${lead.id}_5`,
      leadId: lead.id,
      type: 'follow_up',
      title: 'Proposal Follow-up',
      description: `Follow-up call to discuss proposal. ${lead.status === 'negotiation' ? 'Price negotiations ongoing.' : lead.status === 'won' ? 'Terms accepted.' : 'Concerns raised about terms.'}`,
      timestamp: currentDate.toISOString(),
      performedBy: lead.assignedTo || 'Sales Agent'
    });
    currentDate = new Date(currentDate.getTime() + 2 * 24 * 60 * 60 * 1000);
  }

  if (lead.status === 'won') {
    activities.push({
      id: `act_${lead.id}_6`,
      leadId: lead.id,
      type: 'status_change',
      title: 'Deal Won! 🎉',
      description: `Successfully closed the deal. Customer enrolled in chit scheme. Documentation completed.`,
      timestamp: lead.updatedAt,
      performedBy: lead.assignedTo || 'Sales Agent',
      metadata: { previousStatus: 'negotiation', newStatus: 'won' }
    });
  } else if (lead.status === 'lost') {
    activities.push({
      id: `act_${lead.id}_6`,
      leadId: lead.id,
      type: 'status_change',
      title: 'Deal Lost',
      description: `Deal closed as lost. Customer decided to go with competitor or postpone investment.`,
      timestamp: lead.updatedAt,
      performedBy: lead.assignedTo || 'Sales Agent',
      metadata: { previousStatus: 'negotiation', newStatus: 'lost' }
    });
  }

  // Add some notes from the lead's notes array as activities
  lead.notes.forEach((note, index) => {
    if (index < 3) { // Limit to first 3 notes
      activities.push({
        id: `act_${lead.id}_note_${index}`,
        leadId: lead.id,
        type: 'note',
        title: 'Note Added',
        description: note,
        timestamp: new Date(currentDate.getTime() + index * 24 * 60 * 60 * 1000).toISOString(),
        performedBy: lead.assignedTo || 'Sales Agent'
      });
    }
  });

  return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

const LeadsTable: React.FC<{ 
  leads: Lead[]; 
  onLeadSelect: (leadId: string) => void;
  selectedLeadId?: string;
}> = ({ leads, onLeadSelect, selectedLeadId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (lead.company && lead.company.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || lead.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || lead.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-slate-800/40 backdrop-blur-xl rounded-xl p-4 border border-yellow-400/30">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
          <div className="text-sm text-slate-400 flex items-center">
            Showing: <span className="font-semibold ml-1 text-slate-50">{filteredLeads.length}</span> leads
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-yellow-400/30 overflow-hidden">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full">
            <thead className="bg-slate-700/50 border-b border-yellow-400/20 sticky top-0">
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
                <tr 
                  key={lead.id} 
                  className={`hover:bg-slate-700/20 transition-colors cursor-pointer ${
                    selectedLeadId === lead.id ? 'bg-blue-500/10 border-l-4 border-l-blue-500' : ''
                  }`}
                  onClick={() => onLeadSelect(lead.id)}
                >
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
                        onClick={(e) => {
                          e.stopPropagation();
                          onLeadSelect(lead.id);
                        }}
                        className="text-blue-400 hover:text-blue-300"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCall(lead);
                        }}
                        className="text-green-400 hover:text-green-300"
                        title="Call Lead"
                      >
                        <Phone className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEmail(lead);
                        }}
                        className="text-purple-400 hover:text-purple-300"
                        title="Send Email"
                      >
                        <Mail className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ActivityTimeline: React.FC<{ activities: LeadActivity[] }> = ({ activities }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'call': return Phone;
      case 'email': return Mail;
      case 'meeting': return Building;
      case 'note': return FileText;
      case 'status_change': return Target;
      case 'follow_up': return Clock;
      case 'proposal_sent': return FileText;
      case 'payment_received': return DollarSign;
      default: return Activity;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'call': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'email': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'meeting': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'note': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'status_change': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'follow_up': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'proposal_sent': return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
      case 'payment_received': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => {
        const Icon = getActivityIcon(activity.type);
        return (
          <div key={activity.id} className="flex items-start space-x-4">
            <div className={`p-3 rounded-xl border ${getActivityColor(activity.type)} flex-shrink-0`}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-slate-50 font-medium">{activity.title}</h4>
                <span className="text-xs text-slate-400">
                  {new Date(activity.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="text-slate-300 text-sm mb-2">{activity.description}</p>
              <div className="flex items-center space-x-4 text-xs text-slate-500">
                <span>By {activity.performedBy}</span>
                <span className="capitalize">{activity.type.replace('_', ' ')}</span>
              </div>
            </div>
            {index < activities.length - 1 && (
              <div className="absolute left-6 mt-16 w-0.5 h-8 bg-yellow-400/20"></div>
            )}
          </div>
        );
      })}
    </div>
  );
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
  const subject = encodeURIComponent(`Follow-up: ${lead.company || lead.name} - Chit Fund Inquiry`);
  const body = encodeURIComponent(`Dear ${lead.name},

Thank you for your interest in our chit fund schemes. I wanted to follow up on our previous conversation and provide you with additional information.

Based on your requirements, I believe our premium chit schemes would be an excellent fit for your investment goals.

I would be happy to schedule a detailed discussion at your convenience.

Best regards,
${lead.assignedTo}
Ramnirmalchits Financial Services`);
  
  const mailtoLink = `mailto:${lead.email}?subject=${subject}&body=${body}`;
  window.location.href = mailtoLink;
  toast.success(`Email client opened for ${lead.name}`);
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'bg-red-500';
    case 'medium': return 'bg-yellow-500';
    case 'low': return 'bg-green-500';
    default: return 'bg-gray-500';
  }
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

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const Lead360: React.FC<Lead360Props> = ({ leadId, onBack }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedLeadId, setSelectedLeadId] = useState<string>(leadId);
  const [activeTab, setActiveTab] = useState('table');
  const [isEditing, setIsEditing] = useState(false);
  const [activities, setActivities] = useState<LeadActivity[]>([]);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);

  // Load leads data on component mount
  useEffect(() => {
    const loadedLeads = loadLeads();
    setLeads(loadedLeads);
    
    // Find the specific lead or use the first one
    const foundLead = loadedLeads.find(l => l.id === leadId) || loadedLeads[0];
    if (foundLead) {
      setSelectedLead(foundLead);
      setSelectedLeadId(foundLead.id);
      setActivities(generateActivitiesForLead(foundLead));
    }
  }, [leadId]);

  // Listen for storage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedLeads = loadLeads();
      setLeads(updatedLeads);
      
      if (selectedLeadId) {
        const updatedLead = updatedLeads.find(l => l.id === selectedLeadId);
        if (updatedLead) {
          setSelectedLead(updatedLead);
          setActivities(generateActivitiesForLead(updatedLead));
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('leadsUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('leadsUpdated', handleStorageChange);
    };
  }, [selectedLeadId]);

  const handleLeadSelect = (newLeadId: string) => {
    const lead = leads.find(l => l.id === newLeadId);
    if (lead) {
      setSelectedLead(lead);
      setSelectedLeadId(newLeadId);
      setActivities(generateActivitiesForLead(lead));
      setActiveTab('overview');
    }
  };

  const handleEditLead = () => {
    setIsEditing(true);
    toast.success('Edit mode enabled');
  };

  const handleSaveEdit = () => {
    setIsEditing(false);
    toast.success('Lead updated successfully');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    toast('Edit cancelled');
  };

  const handleAddNote = () => {
    console.log('Opening add note modal');
    setShowAddNoteModal(true);
    setNewNote('');
  };

  const handleSaveNote = async () => {
    if (!newNote.trim()) {
      toast.error('Please enter a note');
      return;
    }

    if (!selectedLead) {
      toast.error('No lead selected');
      return;
    }

    setIsSavingNote(true);
    console.log('Saving note:', newNote);

    try {
      // Update the lead with the new note
      const updatedLead = {
        ...selectedLead,
        notes: [...selectedLead.notes, newNote.trim()],
        updatedAt: new Date().toISOString()
      };

      // Save to storage
      updateLead(updatedLead);
      
      // Update local state
      setSelectedLead(updatedLead);
      setLeads(prev => prev.map(l => l.id === updatedLead.id ? updatedLead : l));
      
      // Generate new activity for the note
      const newActivity: LeadActivity = {
        id: `act_${selectedLead.id}_note_${Date.now()}`,
        leadId: selectedLead.id,
        type: 'note',
        title: 'Note Added',
        description: newNote.trim(),
        timestamp: new Date().toISOString(),
        performedBy: selectedLead.assignedTo || 'Current User'
      };
      
      setActivities(prev => [newActivity, ...prev]);
      
      // Close modal and reset form
      setShowAddNoteModal(false);
      setNewNote('');
      
      toast.success('Note added successfully!');
      console.log('Note saved successfully');
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error('Failed to save note. Please try again.');
    } finally {
      setIsSavingNote(false);
    }
  };

  const handleCancelNote = () => {
    setShowAddNoteModal(false);
    setNewNote('');
  };

  const tabs = [
    { id: 'table', name: 'All Leads', icon: User },
    { id: 'overview', name: 'Overview', icon: Eye },
    { id: 'activity', name: 'Activity', icon: Activity },
    { id: 'notes', name: 'Notes', icon: FileText }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'table':
        return (
          <LeadsTable 
            leads={leads} 
            onLeadSelect={handleLeadSelect}
            selectedLeadId={selectedLeadId}
          />
        );

      case 'overview':
        if (!selectedLead) {
          return (
            <div className="text-center py-12">
              <User className="h-12 w-12 mx-auto text-slate-500 mb-4" />
              <h3 className="text-lg font-medium text-slate-50 mb-2">No Lead Selected</h3>
              <p className="text-sm text-slate-400">Select a lead from the table to view details.</p>
            </div>
          );
        }

        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30">
              <h3 className="text-lg font-semibold text-slate-50 mb-4">Lead Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Lead Name</span>
                  <span className="text-slate-50 font-medium">{selectedLead.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Company</span>
                  <span className="text-slate-50">{selectedLead.company || 'Individual'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Source</span>
                  <span className="text-slate-50 capitalize">{selectedLead.source.replace('-', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Lead Value</span>
                  <span className="text-green-400 font-semibold">{formatCurrency(selectedLead.value)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Assigned To</span>
                  <span className="text-slate-50">{selectedLead.assignedTo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Priority</span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${getPriorityColor(selectedLead.priority)}`}></div>
                    <span className="text-slate-50 capitalize">{selectedLead.priority}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30">
              <h3 className="text-lg font-semibold text-slate-50 mb-4">Contact Details</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-50">{selectedLead.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-50">{selectedLead.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-50">Created: {new Date(selectedLead.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-50">Updated: {new Date(selectedLead.updatedAt).toLocaleDateString()}</span>
                </div>
                {selectedLead.nextFollowUp && (
                  <div className="flex items-center space-x-3">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <span className="text-yellow-400">Next Follow-up: {new Date(selectedLead.nextFollowUp).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            {selectedLead.tags.length > 0 && (
              <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30 lg:col-span-2">
                <h3 className="text-lg font-semibold text-slate-50 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedLead.tags.map((tag, index) => (
                    <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 border border-blue-200">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'activity':
        if (!selectedLead) {
          return (
            <div className="text-center py-12">
              <Activity className="h-12 w-12 mx-auto text-slate-500 mb-4" />
              <h3 className="text-lg font-medium text-slate-50 mb-2">No Lead Selected</h3>
              <p className="text-sm text-slate-400">Select a lead from the table to view activity timeline.</p>
            </div>
          );
        }

        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-slate-50">Activity Timeline for {selectedLead.name}</h3>
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Activity className="h-4 w-4 mr-2" />
                Add Activity
              </button>
            </div>
            <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30">
              <ActivityTimeline activities={activities} />
            </div>
          </div>
        );

      case 'notes':
        if (!selectedLead) {
          return (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-slate-500 mb-4" />
              <h3 className="text-lg font-medium text-slate-50 mb-2">No Lead Selected</h3>
              <p className="text-sm text-slate-400">Select a lead from the table to view notes.</p>
            </div>
          );
        }

        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-slate-50">Notes for {selectedLead.name}</h3>
              <button 
                onClick={handleAddNote}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <FileText className="h-4 w-4 mr-2" />
                Add Note
              </button>
            </div>
            <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30">
              {selectedLead.notes.length > 0 ? (
                <div className="space-y-4">
                  {selectedLead.notes.map((note, index) => (
                    <div key={index} className="p-4 bg-slate-700/30 rounded-xl border border-yellow-400/20">
                      <p className="text-slate-50 mb-2">{note}</p>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>By {selectedLead.assignedTo}</span>
                        <span>{new Date(selectedLead.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto text-slate-500 mb-4" />
                  <h3 className="text-lg font-medium text-slate-50 mb-2">No Notes Yet</h3>
                  <p className="text-sm text-slate-400 mb-4">Add your first note to track important information about this lead.</p>
                  <button 
                    onClick={handleAddNote}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Add First Note
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
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
          <div className="flex items-center space-x-4">
            {selectedLead && (
              <>
                <div className="h-16 w-16 bg-slate-600/50 rounded-full flex items-center justify-center text-slate-50 font-bold text-xl border border-yellow-400/30">
                  {selectedLead.name.charAt(0)}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-50">{selectedLead.name}</h1>
                  <p className="text-slate-400">{selectedLead.company || 'Individual Lead'}</p>
                  <div className="flex items-center space-x-3 mt-1">
                    <div className={`w-3 h-3 rounded-full ${getPriorityColor(selectedLead.priority)}`}></div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedLead.status)}`}>
                      {selectedLead.status.toUpperCase()}
                    </span>
                    <span className="text-slate-500 text-sm">
                      Value: {formatCurrency(selectedLead.value)}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        {selectedLead && (
          <div className="flex space-x-3">
            <button 
              onClick={() => handleCall(selectedLead)}
              className="inline-flex items-center px-4 py-2 border border-yellow-400/30 text-sm font-medium rounded-lg text-slate-50 bg-slate-700/50 hover:bg-slate-700 transition-all backdrop-blur-sm">
              <Phone className="h-4 w-4 mr-2" />
              Call
            </button>
            <button 
              onClick={() => handleEmail(selectedLead)}
              className="inline-flex items-center px-4 py-2 border border-yellow-400/30 text-sm font-medium rounded-lg text-slate-50 bg-slate-700/50 hover:bg-slate-700 transition-all backdrop-blur-sm">
              <Mail className="h-4 w-4 mr-2" />
              Email
            </button>
            {isEditing ? (
              <div className="flex space-x-2">
                <button 
                  onClick={handleSaveEdit}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 transition-all"
                >
                  Save Changes
                </button>
                <button 
                  onClick={handleCancelEdit}
                  className="inline-flex items-center px-4 py-2 border border-yellow-400/30 text-sm font-medium rounded-lg text-slate-50 bg-slate-700/50 hover:bg-slate-700 transition-all backdrop-blur-sm"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button 
                onClick={handleEditLead}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-all"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Lead
              </button>
            )}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-yellow-400/30 bg-slate-800/40 backdrop-blur-xl flex-shrink-0">
        <nav className="flex space-x-4 px-4 overflow-x-auto" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300'
                } whitespace-nowrap py-3 px-2 border-b-2 font-medium text-sm flex items-center transition-all`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.name}
                {tab.id === 'table' && (
                  <span className="ml-2 bg-slate-700/50 text-slate-300 px-2 py-1 rounded-full text-xs">
                    {leads.length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-none">
        {renderTabContent()}
      </div>

      {/* Add Note Modal */}
      {showAddNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleCancelNote}
          ></div>
          
          {/* Modal */}
          <div className="relative bg-slate-800/90 backdrop-blur-xl border border-yellow-400/40 rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-50">Add Note</h3>
              <button
                onClick={handleCancelNote}
                className="p-2 text-slate-400 hover:text-slate-50 hover:bg-slate-700/50 rounded-lg transition-all"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-50 mb-2">
                  Note for {selectedLead?.name}
                </label>
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm resize-none"
                  placeholder="Enter your note here..."
                  disabled={isSavingNote}
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleCancelNote}
                  disabled={isSavingNote}
                  className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700/50 border border-yellow-400/30 rounded-lg hover:bg-slate-700 transition-all disabled:opacity-50 backdrop-blur-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNote}
                  disabled={isSavingNote || !newNote.trim()}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg shadow-sm hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSavingNote ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Note
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};