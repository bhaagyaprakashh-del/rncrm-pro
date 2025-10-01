import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Eye, CreditCard as Edit, Phone, Mail, DollarSign, Calendar, User, MoreVertical, GripVertical } from 'lucide-react';
import { Lead } from '../../types/crm';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { UniqueIdentifier } from '@dnd-kit/core';
import { loadLeads, saveLeads, initializeLeadsData } from '../../data/leads.mock';

interface SortableLeadCardProps {
  lead: Lead;
}

const SortableLeadCard: React.FC<SortableLeadCardProps> = ({ lead }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lead.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
     {...attributes}
     {...listeners}
      className={`bg-slate-800/40 backdrop-blur-xl rounded-xl p-4 border border-yellow-400/30 border-l-4 ${getPriorityColor(lead.priority)} hover:border-yellow-400/50 transition-all cursor-pointer group ${
        isDragging ? 'ring-2 ring-white/30 cursor-grabbing shadow-2xl scale-105 z-50' : 'cursor-grab'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="text-slate-50 font-medium mb-1">{lead.name}</h4>
          <p className="text-slate-400 text-sm">{lead.company || 'Individual'}</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-500 capitalize">{lead.priority}</span>
          <GripVertical className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-all" />
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center text-sm text-slate-300">
          <Mail className="h-3 w-3 mr-2 text-slate-500" />
          <span className="truncate">{lead.email}</span>
        </div>
        <div className="flex items-center text-sm text-slate-300">
          <Phone className="h-3 w-3 mr-2 text-slate-500" />
          <span>{lead.phone}</span>
        </div>
        <div className="flex items-center text-sm text-slate-300">
          <DollarSign className="h-3 w-3 mr-2 text-slate-500" />
          <span>{formatCurrency(lead.value)}</span>
        </div>
      </div>

      <div className="flex justify-between items-center pt-3 border-t border-yellow-400/20">
        <div className="flex items-center text-xs text-slate-500">
          <User className="h-3 w-3 mr-1" />
          <span>{lead.assignedTo}</span>
        </div>
        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-all">
          <button className="p-1 text-slate-400 hover:text-blue-400 rounded">
            <Eye className="h-3 w-3" />
          </button>
          <button className="p-1 text-slate-400 hover:text-green-400 rounded">
            <Edit className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

interface KanbanColumnProps {
  title: string;
  status: string;
  leads: Lead[];
  color: string;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ title, status, leads, color }) => {

  return (
    <div 
      className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-4 border border-yellow-400/30 min-h-[600px] flex flex-col"
    >
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${color}`}></div>
          <h3 className="text-slate-50 font-semibold">{title}</h3>
          <span className="bg-slate-700/50 text-slate-300 px-2 py-1 rounded-full text-xs">
            {leads.length}
          </span>
        </div>
        <button className="p-1 text-slate-400 hover:text-slate-50 rounded">
          <Plus className="h-4 w-4" />
        </button>
      </div>
      
      <SortableContext items={leads.map(lead => lead.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3 flex-1 overflow-y-auto scrollbar-none">
          {leads.map((lead) => (
            <SortableLeadCard key={lead.id} lead={lead} />
          ))}
          {leads.length === 0 && (
            <div className="text-center py-8 text-slate-500 border-2 border-dashed border-slate-600/50 rounded-lg">
              <p className="text-sm">No leads in this stage</p>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
};

const DragOverlayCard: React.FC<{ lead: Lead | null }> = ({ lead }) => {
  if (!lead) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  return (
    <div className={`bg-slate-800/90 backdrop-blur-xl rounded-xl p-4 border border-yellow-400/50 border-l-4 ${getPriorityColor(lead.priority)} shadow-2xl transform rotate-3 scale-105`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="text-slate-50 font-medium mb-1">{lead.name}</h4>
          <p className="text-slate-400 text-sm">{lead.company || 'Individual'}</p>
        </div>
        <span className="text-xs text-slate-500 capitalize">{lead.priority}</span>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center text-sm text-slate-300">
          <Mail className="h-3 w-3 mr-2 text-slate-500" />
          <span className="truncate">{lead.email}</span>
        </div>
        <div className="flex items-center text-sm text-slate-300">
          <Phone className="h-3 w-3 mr-2 text-slate-500" />
          <span>{lead.phone}</span>
        </div>
        <div className="flex items-center text-sm text-slate-300">
          <DollarSign className="h-3 w-3 mr-2 text-slate-500" />
          <span>{formatCurrency(lead.value)}</span>
        </div>
      </div>

      <div className="flex justify-between items-center pt-3 border-t border-yellow-400/20">
        <div className="flex items-center text-xs text-slate-500">
          <User className="h-3 w-3 mr-1" />
          <span>{lead.assignedTo}</span>
        </div>
      </div>
    </div>
  );
};

export const LeadsKanban: React.FC = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { 
      activationConstraint: { distance: 3 }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Load leads from shared storage
  useEffect(() => {
    console.log('Kanban: Loading leads data...');
    initializeLeadsData();
    const loadedLeads = loadLeads();
    console.log('Kanban: Loaded leads:', loadedLeads.length);
    setLeads(loadedLeads);
  }, []);

  // Listen for storage changes (when new leads are added)
  useEffect(() => {
    const handleStorageChange = () => {
      console.log('Kanban: Storage changed, reloading leads...');
      const updatedLeads = loadLeads();
      console.log('Kanban: Updated leads count:', updatedLeads.length);
      setLeads(updatedLeads);
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events from the same tab
    window.addEventListener('leadsUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('leadsUpdated', handleStorageChange);
    };
  }, []);

  const columns = [
    { title: 'New Leads', status: 'new', color: 'bg-blue-500' },
    { title: 'Contacted', status: 'contacted', color: 'bg-yellow-500' },
    { title: 'Qualified', status: 'qualified', color: 'bg-green-500' },
    { title: 'Proposal', status: 'proposal', color: 'bg-purple-500' },
    { title: 'Negotiation', status: 'negotiation', color: 'bg-orange-500' },
    { title: 'Won', status: 'won', color: 'bg-emerald-500' },
    { title: 'Lost', status: 'lost', color: 'bg-red-500' }
  ];

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (lead.company && lead.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getLeadsByStatus = (status: string) => {
    return filteredLeads.filter(lead => lead.status === status);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id;

    const activeLead = leads.find(lead => lead.id === activeId);
    if (!activeLead) return;

    // Find which column the lead was dropped in
    const overLead = leads.find(lead => lead.id === over.id);
    const targetStatus = overLead ? overLead.status : activeLead.status;

    // Only update if the status actually changes
    if (activeLead.status === targetStatus) return;

    const updatedLeads = leads.map(lead => 
        lead.id === activeId 
          ? { 
              ...lead, 
              status: targetStatus as Lead['status'],
              updatedAt: new Date().toISOString()
            }
          : lead
    );
    
    setLeads(updatedLeads);
    saveLeads(updatedLeads);
  };

  const activeLead = activeId ? leads.find(lead => lead.id === activeId) : null;

  const stats = {
    total: leads.length,
    new: getLeadsByStatus('new').length,
    contacted: getLeadsByStatus('contacted').length,
    qualified: getLeadsByStatus('qualified').length,
    proposal: getLeadsByStatus('proposal').length,
    negotiation: getLeadsByStatus('negotiation').length,
    won: getLeadsByStatus('won').length,
    lost: getLeadsByStatus('lost').length,
    totalValue: leads.reduce((sum, lead) => sum + lead.value, 0)
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleAddLead = () => {
    navigate('/leads-new');
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-yellow-400/30 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">Leads Pipeline (Kanban)</h1>
          <p className="mt-1 text-sm text-slate-400">
            Visual pipeline management with drag-and-drop
          </p>
        </div>
        <div className="flex space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 h-4 w-4" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm w-64"
            />
          </div>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-all">
            <Plus className="h-4 w-4 mr-2" />
            Add Lead
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="p-4 border-b border-yellow-400/30 bg-slate-800/40 backdrop-blur-xl flex-shrink-0">
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4 text-center">
          <div>
            <p className="text-slate-400 text-xs">Total</p>
            <p className="text-slate-50 font-bold">{stats.total}</p>
          </div>
          <div>
            <p className="text-blue-400 text-xs">New</p>
            <p className="text-blue-400 font-bold">{stats.new}</p>
          </div>
          <div>
            <p className="text-yellow-400 text-xs">Contacted</p>
            <p className="text-yellow-400 font-bold">{stats.contacted}</p>
          </div>
          <div>
            <p className="text-green-400 text-xs">Qualified</p>
            <p className="text-green-400 font-bold">{stats.qualified}</p>
          </div>
          <div>
            <p className="text-purple-400 text-xs">Proposal</p>
            <p className="text-purple-400 font-bold">{stats.proposal}</p>
          </div>
          <div>
            <p className="text-orange-400 text-xs">Negotiation</p>
            <p className="text-orange-400 font-bold">{stats.negotiation}</p>
          </div>
          <div>
            <p className="text-emerald-400 text-xs">Won</p>
            <p className="text-emerald-400 font-bold">{stats.won}</p>
          </div>
          <div>
            <p className="text-red-400 text-xs">Lost</p>
            <p className="text-red-400 font-bold">{stats.lost}</p>
          </div>
        </div>
        <div className="mt-2 text-center">
          <p className="text-slate-400 text-sm">
            Total Pipeline Value: <span className="text-green-400 font-semibold">{formatCurrency(stats.totalValue)}</span>
          </p>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto p-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex space-x-4 min-w-max pb-4">
            {columns.map((column) => {
              const columnLeads = getLeadsByStatus(column.status);
              return (
                <div key={column.status} className="w-80 flex-shrink-0">
                  <SortableContext items={columnLeads.map(lead => lead.id)} strategy={verticalListSortingStrategy}>
                  <KanbanColumn
                    title={column.title}
                    status={column.status}
                    leads={columnLeads}
                    color={column.color}
                  />
                  </SortableContext>
                </div>
              );
            })}
          </div>
          
          <DragOverlay>
            <DragOverlayCard lead={activeLead} />
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};