import { Task, Ticket, TaskBoard, SLAPolicy } from '../types/tasks';
import { getEmployees } from './employees.mock';

export const TASKS_STORAGE_KEY = 'tasks_data';
export const TICKETS_STORAGE_KEY = 'tickets_data';
export const TASK_BOARDS_STORAGE_KEY = 'task_boards_data';
export const SLA_POLICIES_STORAGE_KEY = 'sla_policies_data';

// Generate sample tasks with employee integration
const generateSampleTasks = (): Task[] => {
  const employees = getEmployees();
  const activeEmployees = employees.filter(e => e.status === 'active');
  
  if (activeEmployees.length === 0) {
    return [];
  }

  return [
    {
      id: '1',
      title: 'Follow up with TechCorp Solutions',
      description: 'Call to discuss premium chit scheme proposal and answer any questions about terms and conditions',
      type: 'call',
      priority: 'high',
      status: 'todo',
      assignedTo: activeEmployees[0] ? `${activeEmployees[0].firstName} ${activeEmployees[0].lastName}` : 'Priya Sharma',
      assignedBy: 'Rajesh Kumar',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedHours: 1,
      leadId: 'lead_001',
      tags: ['sales', 'follow-up', 'high-value'],
      attachments: [],
      comments: [],
      subtasks: [
        {
          id: 'sub_1',
          title: 'Prepare call agenda',
          completed: true,
          createdAt: new Date().toISOString()
        },
        {
          id: 'sub_2',
          title: 'Review previous meeting notes',
          completed: true,
          createdAt: new Date().toISOString()
        },
        {
          id: 'sub_3',
          title: 'Prepare pricing options',
          completed: false,
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      watchers: ['Rajesh Kumar'],
      collaborators: [],
      progressPercentage: 75
    },
    {
      id: '2',
      title: 'Prepare monthly sales report',
      description: 'Compile sales data and create comprehensive monthly performance report for management review',
      type: 'documentation',
      priority: 'medium',
      status: 'in-progress',
      assignedTo: activeEmployees[0] ? `${activeEmployees[0].firstName} ${activeEmployees[0].lastName}` : 'Priya Sharma',
      assignedBy: 'Rajesh Kumar',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedHours: 4,
      actualHours: 2,
      tags: ['reporting', 'monthly', 'sales'],
      attachments: [
        {
          id: 'att_1',
          name: 'sales-data-march.xlsx',
          url: '/files/sales-data-march.xlsx',
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          size: 245760,
          uploadedBy: activeEmployees[0] ? `${activeEmployees[0].firstName} ${activeEmployees[0].lastName}` : 'Priya Sharma',
          uploadedAt: new Date().toISOString()
        }
      ],
      comments: [
        {
          id: 'comment_1',
          taskId: '2',
          message: 'Started working on the data compilation. Should have the draft ready by tomorrow.',
          createdBy: activeEmployees[0] ? `${activeEmployees[0].firstName} ${activeEmployees[0].lastName}` : 'Priya Sharma',
          createdAt: new Date().toISOString(),
          isInternal: false,
          mentions: ['Rajesh Kumar']
        }
      ],
      subtasks: [
        {
          id: 'sub_4',
          title: 'Collect sales data from all agents',
          completed: true,
          createdAt: new Date().toISOString()
        },
        {
          id: 'sub_5',
          title: 'Analyze conversion rates',
          completed: true,
          createdAt: new Date().toISOString()
        },
        {
          id: 'sub_6',
          title: 'Create charts and visualizations',
          completed: false,
          assignedTo: activeEmployees[0] ? `${activeEmployees[0].firstName} ${activeEmployees[0].lastName}` : 'Priya Sharma',
          dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      startedAt: new Date().toISOString(),
      watchers: ['Rajesh Kumar', activeEmployees[1] ? `${activeEmployees[1].firstName} ${activeEmployees[1].lastName}` : 'Karthik Nair'],
      collaborators: [activeEmployees[1] ? `${activeEmployees[1].firstName} ${activeEmployees[1].lastName}` : 'Karthik Nair'],
      progressPercentage: 60
    },
    {
      id: '3',
      title: 'Customer onboarding - Sunita Reddy',
      description: 'Complete KYC verification and scheme enrollment for new customer',
      type: 'other',
      priority: 'medium',
      status: 'review',
      assignedTo: activeEmployees[1] ? `${activeEmployees[1].firstName} ${activeEmployees[1].lastName}` : 'Karthik Nair',
      assignedBy: activeEmployees[0] ? `${activeEmployees[0].firstName} ${activeEmployees[0].lastName}` : 'Priya Sharma',
      dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedHours: 2,
      customerId: 'cust_002',
      tags: ['onboarding', 'kyc', 'new-customer'],
      attachments: [],
      comments: [],
      subtasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      watchers: [activeEmployees[0] ? `${activeEmployees[0].firstName} ${activeEmployees[0].lastName}` : 'Priya Sharma'],
      collaborators: [],
      progressPercentage: 80
    }
  ];
};

// Generate sample tickets with employee integration
const generateSampleTickets = (): Ticket[] => {
  const employees = getEmployees();
  const activeEmployees = employees.filter(e => e.status === 'active');
  
  if (activeEmployees.length === 0) {
    return [];
  }

  return [
    {
      id: '1',
      ticketNumber: 'TKT-2024-001',
      subject: 'Payment not reflecting in account',
      description: 'Customer made payment 3 days ago but it is not showing in their account balance',
      category: 'billing',
      priority: 'high',
      status: 'open',
      customerId: 'cust_001',
      customerName: 'Rajesh Gupta',
      customerEmail: 'rajesh@techcorp.com',
      customerPhone: '+91 98765 43210',
      assignedTo: activeEmployees[1] ? `${activeEmployees[1].firstName} ${activeEmployees[1].lastName}` : 'Karthik Nair',
      assignedBy: 'System',
      department: 'Customer Service',
      slaLevel: 'priority',
      slaDeadline: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      updatedAt: new Date().toISOString(),
      responses: [
        {
          id: 'resp_1',
          ticketId: '1',
          message: 'Thank you for contacting us. We are investigating the payment issue and will update you within 2 hours.',
          isCustomerResponse: false,
          createdBy: activeEmployees[1] ? `${activeEmployees[1].firstName} ${activeEmployees[1].lastName}` : 'Karthik Nair',
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          attachments: [],
          isPublic: true
        }
      ],
      internalNotes: [
        {
          id: 'note_1',
          ticketId: '1',
          note: 'Checked payment gateway logs. Payment was successful but there seems to be a sync issue.',
          createdBy: activeEmployees[1] ? `${activeEmployees[1].firstName} ${activeEmployees[1].lastName}` : 'Karthik Nair',
          createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          isPrivate: true
        }
      ],
      tags: ['payment', 'urgent', 'sync-issue'],
      source: 'email'
    },
    {
      id: '2',
      ticketNumber: 'TKT-2024-002',
      subject: 'Request for chit scheme information',
      description: 'New customer wants detailed information about available chit schemes and eligibility criteria',
      category: 'general',
      priority: 'medium',
      status: 'in-progress',
      customerId: 'cust_002',
      customerName: 'Sunita Reddy',
      customerEmail: 'sunita@gmail.com',
      customerPhone: '+91 98765 43211',
      assignedTo: activeEmployees[0] ? `${activeEmployees[0].firstName} ${activeEmployees[0].lastName}` : 'Priya Sharma',
      assignedBy: 'System',
      department: 'Sales',
      slaLevel: 'standard',
      slaDeadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
      updatedAt: new Date().toISOString(),
      responses: [
        {
          id: 'resp_2',
          ticketId: '2',
          message: 'Thank you for your interest! I have sent you detailed information about our chit schemes. Please let me know if you have any questions.',
          isCustomerResponse: false,
          createdBy: activeEmployees[0] ? `${activeEmployees[0].firstName} ${activeEmployees[0].lastName}` : 'Priya Sharma',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          attachments: ['scheme-brochure.pdf'],
          isPublic: true
        }
      ],
      internalNotes: [],
      tags: ['inquiry', 'new-customer', 'schemes'],
      source: 'phone'
    }
  ];
};

// Sample task boards
const sampleTaskBoards: TaskBoard[] = [
  {
    id: 'board_1',
    name: 'Sales Team Board',
    description: 'Task management for sales team activities',
    columns: [
      { id: 'col_1', name: 'To Do', status: 'todo', order: 1, color: '#3b82f6', isCompleted: false },
      { id: 'col_2', name: 'In Progress', status: 'in-progress', order: 2, color: '#f59e0b', isCompleted: false },
      { id: 'col_3', name: 'Review', status: 'review', order: 3, color: '#8b5cf6', isCompleted: false },
      { id: 'col_4', name: 'Completed', status: 'completed', order: 4, color: '#10b981', isCompleted: true }
    ],
    members: ['Priya Sharma', 'Vikram Singh', 'Rajesh Kumar'],
    isDefault: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Sample SLA policies
const sampleSLAPolicies: SLAPolicy[] = [
  {
    id: 'sla_1',
    name: 'Standard Support SLA',
    description: 'Standard service level agreement for general support tickets',
    level: 'standard',
    firstResponseTime: 240, // 4 hours
    resolutionTime: 1440, // 24 hours
    escalationTime: 480, // 8 hours
    priority: ['low', 'medium'],
    category: ['general', 'technical'],
    customerType: ['individual'],
    businessHours: {
      start: '09:00',
      end: '18:00',
      timezone: 'Asia/Kolkata',
      workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
    },
    escalationRules: [
      {
        id: 'rule_1',
        condition: 'response_time_exceeded',
        action: 'escalate_to_manager',
        escalateTo: 'Rajesh Kumar',
        notifyUsers: ['Rajesh Kumar'],
        delayMinutes: 480
      }
    ],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'sla_2',
    name: 'Priority Support SLA',
    description: 'Priority service level agreement for high-value customers',
    level: 'priority',
    firstResponseTime: 60, // 1 hour
    resolutionTime: 480, // 8 hours
    escalationTime: 120, // 2 hours
    priority: ['high', 'critical'],
    category: ['billing', 'complaint'],
    customerType: ['corporate', 'premium'],
    businessHours: {
      start: '08:00',
      end: '20:00',
      timezone: 'Asia/Kolkata',
      workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    },
    escalationRules: [
      {
        id: 'rule_2',
        condition: 'high_priority_ticket',
        action: 'immediate_escalation',
        escalateTo: 'Rajesh Kumar',
        notifyUsers: ['Rajesh Kumar', 'Support Manager'],
        delayMinutes: 0
      }
    ],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Storage functions for tasks
export const loadTasks = (): Task[] => {
  try {
    const saved = localStorage.getItem(TASKS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : generateSampleTasks();
    }
    return generateSampleTasks();
  } catch (error) {
    console.error('Failed to load tasks:', error);
    return generateSampleTasks();
  }
};

export const saveTasks = (tasks: Task[]) => {
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    window.dispatchEvent(new CustomEvent('tasksUpdated'));
  } catch (error) {
    console.error('Failed to save tasks:', error);
  }
};

export const addTask = (task: Task) => {
  const existingTasks = loadTasks();
  const updatedTasks = [...existingTasks, task];
  saveTasks(updatedTasks);
  return updatedTasks;
};

export const updateTask = (updatedTask: Task) => {
  const existingTasks = loadTasks();
  const updatedTasks = existingTasks.map(task => 
    task.id === updatedTask.id ? updatedTask : task
  );
  saveTasks(updatedTasks);
  return updatedTasks;
};

export const deleteTask = (taskId: string) => {
  const existingTasks = loadTasks();
  const updatedTasks = existingTasks.filter(task => task.id !== taskId);
  saveTasks(updatedTasks);
  return updatedTasks;
};

// Storage functions for tickets
export const loadTickets = (): Ticket[] => {
  try {
    const saved = localStorage.getItem(TICKETS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : generateSampleTickets();
    }
    return generateSampleTickets();
  } catch (error) {
    console.error('Failed to load tickets:', error);
    return generateSampleTickets();
  }
};

export const saveTickets = (tickets: Ticket[]) => {
  try {
    localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(tickets));
    window.dispatchEvent(new CustomEvent('ticketsUpdated'));
  } catch (error) {
    console.error('Failed to save tickets:', error);
  }
};

export const addTicket = (ticket: Ticket) => {
  const existingTickets = loadTickets();
  const updatedTickets = [...existingTickets, ticket];
  saveTickets(updatedTickets);
  return updatedTickets;
};

export const updateTicket = (updatedTicket: Ticket) => {
  const existingTickets = loadTickets();
  const updatedTickets = existingTickets.map(ticket => 
    ticket.id === updatedTicket.id ? updatedTicket : ticket
  );
  saveTickets(updatedTickets);
  return updatedTickets;
};

// Storage functions for task boards
export const loadTaskBoards = (): TaskBoard[] => {
  try {
    const saved = localStorage.getItem(TASK_BOARDS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : sampleTaskBoards;
    }
    return sampleTaskBoards;
  } catch (error) {
    console.error('Failed to load task boards:', error);
    return sampleTaskBoards;
  }
};

export const saveTaskBoards = (boards: TaskBoard[]) => {
  try {
    localStorage.setItem(TASK_BOARDS_STORAGE_KEY, JSON.stringify(boards));
  } catch (error) {
    console.error('Failed to save task boards:', error);
  }
};

// Storage functions for SLA policies
export const loadSLAPolicies = (): SLAPolicy[] => {
  try {
    const saved = localStorage.getItem(SLA_POLICIES_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : sampleSLAPolicies;
    }
    return sampleSLAPolicies;
  } catch (error) {
    console.error('Failed to load SLA policies:', error);
    return sampleSLAPolicies;
  }
};

export const saveSLAPolicies = (policies: SLAPolicy[]) => {
  try {
    localStorage.setItem(SLA_POLICIES_STORAGE_KEY, JSON.stringify(policies));
  } catch (error) {
    console.error('Failed to save SLA policies:', error);
  }
};

// Initialize data
export const initializeTasksData = () => {
  if (!localStorage.getItem(TASKS_STORAGE_KEY)) {
    saveTasks(generateSampleTasks());
  }
  if (!localStorage.getItem(TICKETS_STORAGE_KEY)) {
    saveTickets(generateSampleTickets());
  }
  if (!localStorage.getItem(TASK_BOARDS_STORAGE_KEY)) {
    saveTaskBoards(sampleTaskBoards);
  }
  if (!localStorage.getItem(SLA_POLICIES_STORAGE_KEY)) {
    saveSLAPolicies(sampleSLAPolicies);
  }
};