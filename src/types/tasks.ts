export interface Task {
  id: string;
  title: string;
  description: string;
  type: 'call' | 'meeting' | 'email' | 'documentation' | 'other';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'todo' | 'in-progress' | 'review' | 'completed' | 'cancelled';
  assignedTo: string;
  assignedBy: string;
  dueDate: string;
  estimatedHours?: number;
  actualHours?: number;
  leadId?: string;
  customerId?: string;
  tags: string[];
  attachments: TaskAttachment[];
  comments: TaskComment[];
  subtasks: Subtask[];
  createdAt: string;
  updatedAt: string;
  startedAt?: string;
  completedAt?: string;
  watchers: string[];
  collaborators: string[];
  progressPercentage: number;
}

export interface TaskAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedBy: string;
  uploadedAt: string;
}

export interface TaskComment {
  id: string;
  taskId: string;
  message: string;
  createdBy: string;
  createdAt: string;
  isInternal: boolean;
  mentions: string[];
  attachments?: string[];
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  assignedTo?: string;
  dueDate?: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  ticketNumber: string;
  subject: string;
  description: string;
  category: 'general' | 'technical' | 'billing' | 'complaint' | 'feature-request';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'pending' | 'resolved' | 'closed';
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  assignedTo: string;
  assignedBy: string;
  department: string;
  slaLevel: 'standard' | 'priority' | 'premium';
  slaDeadline: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  responses: TicketResponse[];
  internalNotes: TicketNote[];
  tags: string[];
  source: 'email' | 'phone' | 'chat' | 'portal' | 'social';
}

export interface TicketResponse {
  id: string;
  ticketId: string;
  message: string;
  isCustomerResponse: boolean;
  createdBy: string;
  createdAt: string;
  attachments: string[];
  isPublic: boolean;
}

export interface TicketNote {
  id: string;
  ticketId: string;
  note: string;
  createdBy: string;
  createdAt: string;
  isPrivate: boolean;
}

export interface TaskBoard {
  id: string;
  name: string;
  description: string;
  columns: TaskColumn[];
  members: string[];
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TaskColumn {
  id: string;
  name: string;
  status: Task['status'];
  order: number;
  color: string;
  isCompleted: boolean;
}

export interface SLAPolicy {
  id: string;
  name: string;
  description: string;
  level: 'standard' | 'priority' | 'premium';
  firstResponseTime: number; // minutes
  resolutionTime: number; // minutes
  escalationTime: number; // minutes
  priority: string[];
  category: string[];
  customerType: string[];
  businessHours: {
    start: string;
    end: string;
    timezone: string;
    workingDays: string[];
  };
  escalationRules: EscalationRule[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EscalationRule {
  id: string;
  condition: string;
  action: string;
  escalateTo: string;
  notifyUsers: string[];
  delayMinutes: number;
}

export interface TaskReport {
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  tasksByPriority: Record<string, number>;
  tasksByStatus: Record<string, number>;
  tasksByAssignee: Record<string, number>;
  averageCompletionTime: number;
  productivityScore: number;
}

export interface TicketReport {
  totalTickets: number;
  resolvedTickets: number;
  overdueTickets: number;
  ticketsByCategory: Record<string, number>;
  ticketsByPriority: Record<string, number>;
  ticketsByStatus: Record<string, number>;
  averageResolutionTime: number;
  slaCompliance: number;
  customerSatisfaction: number;
}