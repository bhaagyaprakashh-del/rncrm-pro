import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Filter, Calendar, Clock, User, Tag, AlertTriangle, Star, MoreVertical, CreditCard as Edit, Trash2, Eye, MessageSquare, Paperclip, CheckSquare, Settings, Users, Target, TrendingUp, CheckCircle, XCircle, Mail, Phone, MessageCircle, Globe, X, Save, Send } from 'lucide-react';
import { Ticket, TicketResponse } from '../../types/tasks';
import { loadTickets, saveTickets, addTicket, updateTicket } from '../../data/tasks.mock';
import { getEmployees } from '../../data/employees.mock';
import { Employee } from '../../types/hrms';
import toast from 'react-hot-toast';

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (ticket: Ticket) => void;
  employees: Employee[];
}

interface TicketDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket | null;
  onUpdate: (ticket: Ticket) => void;
  employees: Employee[];
}

const CreateTicketModal: React.FC<CreateTicketModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  employees 
}) => {
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    category: 'general' as Ticket['category'],
    priority: 'medium' as Ticket['priority'],
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    assignedTo: '',
    department: 'Customer Service',
    source: 'email' as Ticket['source']
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.customerName.trim()) newErrors.customerName = 'Customer name is required';
    if (!formData.customerEmail.trim()) newErrors.customerEmail = 'Customer email is required';
    if (!formData.assignedTo) newErrors.assignedTo = 'Please assign to someone';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const ticketNumber = `TKT-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
    
    const ticketData: Ticket = {
      id: `ticket_${Date.now()}`,
      ticketNumber,
      subject: formData.subject,
      description: formData.description,
      category: formData.category,
      priority: formData.priority,
      status: 'open',
      customerId: `cust_${Date.now()}`,
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      customerPhone: formData.customerPhone,
      assignedTo: formData.assignedTo,
      assignedBy: 'System',
      department: formData.department,
      slaLevel: formData.priority === 'high' || formData.priority === 'critical' ? 'priority' : 'standard',
      slaDeadline: new Date(Date.now() + (formData.priority === 'high' || formData.priority === 'critical' ? 4 : 24) * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      responses: [],
      internalNotes: [],
      tags: [formData.category, formData.source],
      source: formData.source
    };

    onSave(ticketData);
    
    // Reset form
    setFormData({
      subject: '',
      description: '',
      category: 'general',
      priority: 'medium',
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      assignedTo: '',
      department: 'Customer Service',
      source: 'email'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-slate-800/90 backdrop-blur-xl border border-yellow-400/40 rounded-2xl shadow-2xl p-6 w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-slate-50">Create New Ticket</h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-50 hover:bg-slate-700/50 rounded-lg transition-all">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-50 mb-2">Subject *</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                className={`w-full px-3 py-2 bg-slate-700/50 border rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm ${
                  errors.subject ? 'border-red-500' : 'border-yellow-400/30'
                }`}
                placeholder="Brief description of the issue"
              />
              {errors.subject && <p className="mt-1 text-sm text-red-400">{errors.subject}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-50 mb-2">Description *</label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className={`w-full px-3 py-2 bg-slate-700/50 border rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm ${
                  errors.description ? 'border-red-500' : 'border-yellow-400/30'
                }`}
                placeholder="Detailed description of the issue or request"
              />
              {errors.description && <p className="mt-1 text-sm text-red-400">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-50 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as Ticket['category'] }))}
                className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
              >
                <option value="general">🔍 General Inquiry</option>
                <option value="technical">⚙️ Technical Issue</option>
                <option value="billing">💰 Billing</option>
                <option value="complaint">⚠️ Complaint</option>
                <option value="feature-request">💡 Feature Request</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-50 mb-2">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as Ticket['priority'] }))}
                className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
              >
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🟠 High</option>
                <option value="critical">🔴 Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-50 mb-2">Customer Name *</label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                className={`w-full px-3 py-2 bg-slate-700/50 border rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm ${
                  errors.customerName ? 'border-red-500' : 'border-yellow-400/30'
                }`}
                placeholder="Customer full name"
              />
              {errors.customerName && <p className="mt-1 text-sm text-red-400">{errors.customerName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-50 mb-2">Customer Email *</label>
              <input
                type="email"
                value={formData.customerEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
                className={`w-full px-3 py-2 bg-slate-700/50 border rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm ${
                  errors.customerEmail ? 'border-red-500' : 'border-yellow-400/30'
                }`}
                placeholder="customer@example.com"
              />
              {errors.customerEmail && <p className="mt-1 text-sm text-red-400">{errors.customerEmail}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-50 mb-2">Customer Phone</label>
              <input
                type="tel"
                value={formData.customerPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                placeholder="+91 98765 43210"
              />
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
              <label className="block text-sm font-medium text-slate-50 mb-2">Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
              >
                <option value="Customer Service">Customer Service</option>
                <option value="Technical Support">Technical Support</option>
                <option value="Sales">Sales</option>
                <option value="Billing">Billing</option>
                <option value="Management">Management</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-50 mb-2">Source</label>
              <select
                value={formData.source}
                onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value as Ticket['source'] }))}
                className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
              >
                <option value="email">📧 Email</option>
                <option value="phone">📞 Phone</option>
                <option value="chat">💬 Chat</option>
                <option value="portal">🌐 Portal</option>
                <option value="social">📱 Social Media</option>
              </select>
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
              Create Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const TicketDetailsModal: React.FC<TicketDetailsModalProps> = ({ 
  isOpen, 
  onClose, 
  ticket, 
  onUpdate,
  employees 
}) => {
  const [newResponse, setNewResponse] = useState('');
  const [newNote, setNewNote] = useState('');
  const [activeTab, setActiveTab] = useState<'responses' | 'notes'>('responses');

  const handleAddResponse = () => {
    if (!ticket || !newResponse.trim()) return;

    const response: TicketResponse = {
      id: `resp_${Date.now()}`,
      ticketId: ticket.id,
      message: newResponse,
      isCustomerResponse: false,
      createdBy: 'Current User', // In real app, get from auth
      createdAt: new Date().toISOString(),
      attachments: [],
      isPublic: true
    };

    const updatedTicket: Ticket = {
      ...ticket,
      responses: [...ticket.responses, response],
      status: 'in-progress',
      updatedAt: new Date().toISOString()
    };

    onUpdate(updatedTicket);
    setNewResponse('');
    toast.success('Response added successfully!');
  };

  const handleStatusChange = (newStatus: Ticket['status']) => {
    if (!ticket) return;

    const updatedTicket: Ticket = {
      ...ticket,
      status: newStatus,
      updatedAt: new Date().toISOString(),
      resolvedAt: newStatus === 'resolved' ? new Date().toISOString() : ticket.resolvedAt
    };

    onUpdate(updatedTicket);
    toast.success(`Ticket ${newStatus}`);
  };

  if (!isOpen || !ticket) return null;

  const getStatusColor = (status: Ticket['status']) => {
    switch (status) {
      case 'open': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'in-progress': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'pending': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'resolved': return 'text-green-600 bg-green-50 border-green-200';
      case 'closed': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityColor = (priority: Ticket['priority']) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const isOverdue = (slaDeadline: string, status: Ticket['status']) => {
    return new Date(slaDeadline) < new Date() && status !== 'resolved' && status !== 'closed';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-slate-800/90 backdrop-blur-xl border border-yellow-400/40 rounded-2xl shadow-2xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-slate-50">{ticket.ticketNumber}</h3>
            <p className="text-slate-400">{ticket.subject}</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-50 hover:bg-slate-700/50 rounded-lg transition-all">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Ticket Header */}
        <div className="bg-slate-700/30 rounded-xl p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-sm text-slate-400">Status</p>
              <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(ticket.status)}`}>
                {ticket.status.replace('-', ' ')}
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-400">Priority</p>
              <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(ticket.priority)}`}>
                {ticket.priority}
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-400">SLA Deadline</p>
              <p className={`text-sm font-medium ${isOverdue(ticket.slaDeadline, ticket.status) ? 'text-red-400' : 'text-slate-50'}`}>
                {new Date(ticket.slaDeadline).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-400">Customer</p>
              <p className="text-slate-50 font-medium">{ticket.customerName}</p>
              <p className="text-slate-400 text-sm">{ticket.customerEmail}</p>
              {ticket.customerPhone && <p className="text-slate-400 text-sm">{ticket.customerPhone}</p>}
            </div>
            <div>
              <p className="text-sm text-slate-400">Assigned To</p>
              <p className="text-slate-50 font-medium">{ticket.assignedTo}</p>
              <p className="text-slate-400 text-sm">{ticket.department}</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-slate-50 mb-2">Description</h4>
          <div className="bg-slate-700/30 rounded-lg p-4">
            <p className="text-slate-300">{ticket.description}</p>
          </div>
        </div>

        {/* Status Actions */}
        <div className="flex flex-wrap gap-2 mb-6">
          {ticket.status === 'open' && (
            <button
              onClick={() => handleStatusChange('in-progress')}
              className="px-3 py-1 text-sm bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-all"
            >
              Start Working
            </button>
          )}
          {ticket.status === 'in-progress' && (
            <>
              <button
                onClick={() => handleStatusChange('pending')}
                className="px-3 py-1 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
              >
                Mark Pending
              </button>
              <button
                onClick={() => handleStatusChange('resolved')}
                className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
              >
                Resolve
              </button>
            </>
          )}
          {ticket.status === 'pending' && (
            <button
              onClick={() => handleStatusChange('in-progress')}
              className="px-3 py-1 text-sm bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-all"
            >
              Resume
            </button>
          )}
          {ticket.status === 'resolved' && (
            <button
              onClick={() => handleStatusChange('closed')}
              className="px-3 py-1 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all"
            >
              Close Ticket
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="border-b border-yellow-400/30 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('responses')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'responses'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300'
              }`}
            >
              Responses ({ticket.responses.length})
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'notes'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300'
              }`}
            >
              Internal Notes ({ticket.internalNotes.length})
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'responses' && (
          <div className="space-y-4 mb-6">
            {ticket.responses.map((response) => (
              <div key={response.id} className="bg-slate-700/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {response.createdBy.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-slate-50 font-medium">{response.createdBy}</p>
                      <p className="text-slate-400 text-xs">{new Date(response.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    response.isCustomerResponse 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {response.isCustomerResponse ? 'Customer' : 'Agent'}
                  </div>
                </div>
                <p className="text-slate-300">{response.message}</p>
              </div>
            ))}

            {/* Add Response */}
            <div className="bg-slate-700/30 rounded-lg p-4">
              <textarea
                rows={3}
                value={newResponse}
                onChange={(e) => setNewResponse(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                placeholder="Type your response..."
              />
              <div className="flex justify-end mt-3">
                <button
                  onClick={handleAddResponse}
                  disabled={!newResponse.trim()}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Response
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="space-y-4 mb-6">
            {ticket.internalNotes.map((note) => (
              <div key={note.id} className="bg-slate-700/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {note.createdBy.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-slate-50 font-medium">{note.createdBy}</p>
                      <p className="text-slate-400 text-xs">{new Date(note.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Internal
                  </div>
                </div>
                <p className="text-slate-300">{note.note}</p>
              </div>
            ))}

            {/* Add Note */}
            <div className="bg-slate-700/30 rounded-lg p-4">
              <textarea
                rows={3}
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                placeholder="Add internal note..."
              />
              <div className="flex justify-end mt-3">
                <button
                  onClick={() => {
                    if (!newNote.trim()) return;
                    // Add note logic here
                    setNewNote('');
                    toast.success('Note added successfully!');
                  }}
                  disabled={!newNote.trim()}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-lg shadow-sm hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Add Note
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const Tickets: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedAssignee, setSelectedAssignee] = useState('');
  const [viewMode, setViewMode] = useState<'inbox' | 'my'>('inbox');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  
  // Mock current user - in real app, get from auth context
  const currentUser = 'Karthik Nair';

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [ticketsData, employeesData] = await Promise.all([
          loadTickets(),
          getEmployees()
        ]);
        setTickets(ticketsData);
        setEmployees(employeesData);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load tickets');
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Listen for ticket updates
    const handleTicketsUpdate = () => {
      setTickets(loadTickets());
    };

    window.addEventListener('ticketsUpdated', handleTicketsUpdate);
    return () => window.removeEventListener('ticketsUpdated', handleTicketsUpdate);
  }, []);

  const handleCreateTicket = (ticketData: Ticket) => {
    addTicket(ticketData);
    setTickets(prev => [...prev, ticketData]);
    setShowCreateModal(false);
    toast.success('Ticket created successfully!');
  };

  const handleUpdateTicket = (updatedTicket: Ticket) => {
    updateTicket(updatedTicket);
    setTickets(prev => prev.map(t => t.id === updatedTicket.id ? updatedTicket : t));
    setSelectedTicket(updatedTicket);
  };

  const handleViewTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setShowDetailsModal(true);
  };

  // Filter tickets based on view mode and filters
  const filteredTickets = useMemo(() => {
    let filtered = tickets;

    // Filter by view mode
    if (viewMode === 'my') {
      filtered = filtered.filter(ticket => ticket.assignedTo === currentUser);
    }

    // Apply search and filters
    filtered = filtered.filter(ticket => {
      const matchesSearch = !searchTerm || 
        ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = !selectedStatus || ticket.status === selectedStatus;
      const matchesPriority = !selectedPriority || ticket.priority === selectedPriority;
      const matchesCategory = !selectedCategory || ticket.category === selectedCategory;
      const matchesAssignee = !selectedAssignee || ticket.assignedTo === selectedAssignee;

      return matchesSearch && matchesStatus && matchesPriority && matchesCategory && matchesAssignee;
    });

    return filtered.sort((a, b) => {
      // Sort by priority first, then by creation date
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [tickets, viewMode, currentUser, searchTerm, selectedStatus, selectedPriority, selectedCategory, selectedAssignee]);

  // Calculate statistics
  const stats = useMemo(() => {
    const myTickets = tickets.filter(ticket => ticket.assignedTo === currentUser);
    const allTickets = tickets;
    
    const currentTickets = viewMode === 'my' ? myTickets : allTickets;
    
    return {
      total: currentTickets.length,
      open: currentTickets.filter(t => t.status === 'open').length,
      inProgress: currentTickets.filter(t => t.status === 'in-progress').length,
      resolved: currentTickets.filter(t => t.status === 'resolved').length,
      overdue: currentTickets.filter(t => new Date(t.slaDeadline) < new Date() && t.status !== 'resolved' && t.status !== 'closed').length
    };
  }, [tickets, viewMode, currentUser]);

  const getPriorityColor = (priority: Ticket['priority']) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: Ticket['status']) => {
    switch (status) {
      case 'open': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'in-progress': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'pending': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'resolved': return 'text-green-600 bg-green-50 border-green-200';
      case 'closed': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getCategoryIcon = (category: Ticket['category']) => {
    switch (category) {
      case 'general': return '🔍';
      case 'technical': return '⚙️';
      case 'billing': return '💰';
      case 'complaint': return '⚠️';
      case 'feature-request': return '💡';
      default: return '📋';
    }
  };

  const getSourceIcon = (source: Ticket['source']) => {
    switch (source) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      case 'chat': return <MessageCircle className="h-4 w-4" />;
      case 'portal': return <Globe className="h-4 w-4" />;
      case 'social': return <MessageSquare className="h-4 w-4" />;
      default: return <Mail className="h-4 w-4" />;
    }
  };

  const isOverdue = (slaDeadline: string, status: Ticket['status']) => {
    return new Date(slaDeadline) < new Date() && status !== 'resolved' && status !== 'closed';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading tickets...</p>
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
              {viewMode === 'inbox' ? 'Ticket Inbox' : 'My Tickets'}
            </h1>
            <p className="text-slate-400">
              {viewMode === 'inbox' ? 'Manage all customer support tickets' : 'Your assigned tickets'}
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            <div className="flex bg-slate-700/50 rounded-lg p-1">
              <button
                onClick={() => setViewMode('inbox')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  viewMode === 'inbox'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-slate-50'
                }`}
              >
                Inbox
              </button>
              <button
                onClick={() => setViewMode('my')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  viewMode === 'my'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-slate-50'
                }`}
              >
                My Tickets
              </button>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 transition-all"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Ticket
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
                <p className="text-sm font-medium text-slate-400">Total Tickets</p>
                <p className="text-2xl font-bold text-slate-50">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl border border-yellow-400/40 rounded-2xl p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <CheckCircle className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-400">Open</p>
                <p className="text-2xl font-bold text-slate-50">{stats.open}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl border border-yellow-400/40 rounded-2xl p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-500/20 rounded-xl">
                <TrendingUp className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-400">In Progress</p>
                <p className="text-2xl font-bold text-slate-50">{stats.inProgress}</p>
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
                <p className="text-2xl font-bold text-slate-50">{stats.resolved}</p>
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
        </div>

        {/* Filters */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-yellow-400/40 rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-50 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                  placeholder="Search tickets..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-50 mb-2">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
              >
                <option value="">All Status</option>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
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
              <label className="block text-sm font-medium text-slate-50 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
              >
                <option value="">All Categories</option>
                <option value="general">General</option>
                <option value="technical">Technical</option>
                <option value="billing">Billing</option>
                <option value="complaint">Complaint</option>
                <option value="feature-request">Feature Request</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-50 mb-2">Assignee</label>
              <select
                value={selectedAssignee}
                onChange={(e) => setSelectedAssignee(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
              >
                <option value="">All Assignees</option>
                {Array.from(new Set(tickets.map(t => t.assignedTo))).map(assignee => (
                  <option key={assignee} value={assignee}>{assignee}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedStatus('');
                  setSelectedPriority('');
                  setSelectedCategory('');
                  setSelectedAssignee('');
                }}
                className="w-full px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700/50 border border-yellow-400/30 rounded-lg hover:bg-slate-700 transition-all backdrop-blur-sm"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Tickets List */}
        <div className="space-y-4">
          {filteredTickets.map((ticket) => (
            <div key={ticket.id} className="bg-slate-800/50 backdrop-blur-xl border border-yellow-400/40 rounded-2xl p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-lg">{getCategoryIcon(ticket.category)}</span>
                    <h3 className="text-lg font-semibold text-slate-50">{ticket.subject}</h3>
                    <div className="text-slate-400 text-sm">#{ticket.ticketNumber}</div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(ticket.status)}`}>
                      {ticket.status.replace('-', ' ')}
                    </div>
                    {isOverdue(ticket.slaDeadline, ticket.status) && (
                      <div className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                        Overdue
                      </div>
                    )}
                  </div>
                  
                  <p className="text-slate-400 mb-4 line-clamp-2">{ticket.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-slate-400 mb-4">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Customer: <span className="text-slate-50 ml-1">{ticket.customerName}</span>
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Assigned: <span className="text-slate-50 ml-1">{ticket.assignedTo}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Created: <span className="text-slate-50 ml-1">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      SLA: <span className={`ml-1 ${isOverdue(ticket.slaDeadline, ticket.status) ? 'text-red-400' : 'text-slate-50'}`}>
                        {new Date(ticket.slaDeadline).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-slate-400">
                    <div className="flex items-center">
                      {getSourceIcon(ticket.source)}
                      <span className="ml-1">{ticket.source}</span>
                    </div>
                    {ticket.responses.length > 0 && (
                      <div className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        {ticket.responses.length} responses
                      </div>
                    )}
                    <div className="flex items-center">
                      <Tag className="h-4 w-4 mr-1" />
                      {ticket.department}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleViewTicket(ticket)}
                    className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700/50 rounded-lg transition-all"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    className="p-2 text-slate-400 hover:text-yellow-400 hover:bg-slate-700/50 rounded-lg transition-all"
                    title="Edit Ticket"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    className="p-2 text-slate-400 hover:text-slate-50 hover:bg-slate-700/50 rounded-lg transition-all"
                    title="More Options"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTickets.length === 0 && (
          <div className="text-center py-12">
            <div className="p-4 bg-slate-700/30 rounded-full w-16 h-16 mx-auto mb-4">
              <Target className="h-8 w-8 text-slate-400 mx-auto mt-2" />
            </div>
            <h3 className="text-lg font-medium text-slate-50 mb-2">No Tickets Found</h3>
            <p className="text-slate-400 mb-4">
              {searchTerm || selectedStatus || selectedPriority || selectedCategory || selectedAssignee
                ? 'No tickets match your current filters.'
                : `No ${viewMode === 'my' ? 'assigned' : ''} tickets found.`}
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 transition-all"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Ticket
            </button>
          </div>
        )}
      </div>

      {/* Create Ticket Modal */}
      <CreateTicketModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreateTicket}
        employees={employees}
      />

      {/* Ticket Details Modal */}
      <TicketDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedTicket(null);
        }}
        ticket={selectedTicket}
        onUpdate={handleUpdateTicket}
        employees={employees}
      />
    </div>
  );
};