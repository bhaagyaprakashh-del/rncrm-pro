import { Lead } from '../types/crm';

export const LEADS_STORAGE_KEY = 'leads_data';

export const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'Rajesh Gupta',
    email: 'rajesh.gupta@techcorp.com',
    phone: '+91 98765 43210',
    company: 'TechCorp Solutions Pvt Ltd',
    source: 'website',
    status: 'qualified',
    priority: 'high',
    value: 500000,
    assignedTo: 'Priya Sharma',
    createdAt: '2024-03-10T10:30:00',
    updatedAt: '2024-03-15T14:20:00',
    notes: [
      'Initial contact made via website form',
      'Interested in premium chit schemes for 50+ employees',
      'Budget confirmed at ₹5L for employee benefits program',
      'Decision maker: CEO Rajesh Gupta',
      'Next meeting scheduled for proposal presentation',
      'Company has strong financials and growth trajectory'
    ],
    tags: ['corporate', 'high-value', 'premium', 'employee-benefits', 'tech-company'],
    nextFollowUp: '2024-03-18T10:00:00'
  },
  {
    id: '2',
    name: 'Sunita Reddy',
    email: 'sunita.reddy@gmail.com',
    phone: '+91 98765 43211',
    source: 'referral',
    status: 'contacted',
    priority: 'medium',
    value: 250000,
    assignedTo: 'Karthik Nair',
    createdAt: '2024-03-12T15:45:00',
    updatedAt: '2024-03-14T11:30:00',
    notes: [
      'Referred by existing customer Anita Desai',
      'Interested in silver monthly chit scheme',
      'Looking for 12-month investment option',
      'Prefers monthly installments of ₹20,000',
      'Good credit history and stable income'
    ],
    tags: ['referral', 'silver-scheme', 'individual', 'stable-income'],
    nextFollowUp: '2024-03-17T14:00:00'
  },
  {
    id: '3',
    name: 'Amit Patel',
    email: 'amit@startupinc.com',
    phone: '+91 98765 43212',
    company: 'StartupInc Technologies',
    source: 'cold-call',
    status: 'new',
    priority: 'low',
    value: 100000,
    assignedTo: 'Vikram Singh',
    createdAt: '2024-03-14T09:15:00',
    updatedAt: '2024-03-14T09:15:00',
    notes: [
      'Cold call made to startup founder',
      'Early-stage startup, limited budget',
      'Interested in basic chit schemes',
      'Needs more information about minimum investment',
      'Follow-up scheduled for next week'
    ],
    tags: ['startup', 'tech', 'basic-scheme', 'budget-conscious'],
    nextFollowUp: '2024-03-16T16:00:00'
  },
  {
    id: '4',
    name: 'Dr. Kavitha Sharma',
    email: 'kavitha@healthcareclinic.com',
    phone: '+91 98765 43213',
    company: 'Healthcare Clinic Pvt Ltd',
    source: 'advertisement',
    status: 'proposal',
    priority: 'high',
    value: 750000,
    assignedTo: 'Priya Sharma',
    createdAt: '2024-03-08T11:20:00',
    updatedAt: '2024-03-13T16:45:00',
    notes: [
      'Responded to newspaper advertisement',
      'Owns a chain of 3 healthcare clinics',
      'Proposal sent for premium gold chit scheme',
      'Interested in tax-saving investment options',
      'Awaiting feedback on proposal terms',
      'Strong financial background in healthcare sector'
    ],
    tags: ['healthcare', 'premium', 'tax-saving', 'clinic-owner', 'advertisement'],
    nextFollowUp: '2024-03-19T10:00:00'
  },
  {
    id: '5',
    name: 'Ravi Kumar',
    email: 'ravi@retailchain.com',
    phone: '+91 98765 43214',
    company: 'Retail Chain Co',
    source: 'website',
    status: 'negotiation',
    priority: 'high',
    value: 1200000,
    assignedTo: 'Vikram Singh',
    createdAt: '2024-03-05T14:30:00',
    updatedAt: '2024-03-14T12:15:00',
    notes: [
      'Large retail chain with 15+ stores',
      'In final negotiations for corporate chit scheme',
      'Price discussion ongoing for bulk enrollment',
      'Wants customized payment schedule',
      'Decision expected by month-end',
      'High-value prospect with expansion plans'
    ],
    tags: ['retail', 'enterprise', 'high-value', 'bulk-enrollment', 'negotiation'],
    nextFollowUp: '2024-03-17T15:00:00'
  },
  {
    id: '6',
    name: 'Meera Nair',
    email: 'meera@successstory.com',
    phone: '+91 98765 43215',
    company: 'Success Story Inc',
    source: 'referral',
    status: 'won',
    priority: 'high',
    value: 800000,
    assignedTo: 'Priya Sharma',
    createdAt: '2024-02-28T10:00:00',
    updatedAt: '2024-03-12T17:30:00',
    notes: [
      'Referred by existing premium customer',
      'Deal closed successfully after 2 weeks',
      'Enrolled in premium platinum chit scheme',
      'Payment received and documentation completed',
      'Expressed interest in additional schemes',
      'Potential for upselling in future'
    ],
    tags: ['won-deal', 'referral', 'premium', 'platinum', 'upsell-potential'],
    nextFollowUp: '2024-04-12T10:00:00'
  },
  {
    id: '7',
    name: 'Suresh Reddy',
    email: 'suresh@failedventure.com',
    phone: '+91 98765 43216',
    company: 'Failed Venture Pvt Ltd',
    source: 'cold-call',
    status: 'lost',
    priority: 'low',
    value: 650000,
    assignedTo: 'Karthik Nair',
    createdAt: '2024-03-11T14:20:00',
    updatedAt: '2024-03-13T12:30:00',
    notes: [
      'Initial interest shown during cold call',
      'Budget constraints due to business challenges',
      'Went with competitor offering lower rates',
      'Company facing financial difficulties',
      'Not a good fit for our premium schemes',
      'Follow-up scheduled for Q3 when situation improves'
    ],
    tags: ['lost-deal', 'competitor', 'budget-constraints', 'financial-difficulties'],
    nextFollowUp: '2024-06-01T10:00:00'
  },
  {
    id: '8',
    name: 'Dr. Priya Menon',
    email: 'priya@healthcaresolutions.com',
    phone: '+91 98765 43217',
    company: 'Healthcare Solutions Pvt Ltd',
    source: 'referral',
    status: 'qualified',
    priority: 'medium',
    value: 480000,
    assignedTo: 'Vikram Singh',
    createdAt: '2024-03-09T13:45:00',
    updatedAt: '2024-03-13T16:30:00',
    notes: [
      'Referred by Dr. Kavitha Sharma',
      'Qualified lead with verified income',
      'Interested in employee benefit schemes',
      'Needs proposal for 25 employees',
      'Good credit score and financial stability',
      'Ready to proceed with documentation'
    ],
    tags: ['healthcare', 'employee-benefits', 'qualified', 'stable-income', 'referral'],
    nextFollowUp: '2024-03-18T14:00:00'
  },
  {
    id: '9',
    name: 'Arjun Krishnan',
    email: 'arjun@digitalinnovations.com',
    phone: '+91 98765 43218',
    company: 'Digital Innovations Pvt Ltd',
    source: 'website',
    status: 'new',
    priority: 'high',
    value: 850000,
    assignedTo: 'Priya Sharma',
    createdAt: '2024-03-15T09:30:00',
    updatedAt: '2024-03-15T09:30:00',
    notes: [
      'Website inquiry received this morning',
      'Digital marketing company with 40+ employees',
      'Interested in corporate chit schemes',
      'Looking for flexible payment options',
      'High growth potential and strong financials',
      'Urgent requirement for employee investment plans'
    ],
    tags: ['website-lead', 'corporate', 'digital-marketing', 'urgent', 'high-growth'],
    nextFollowUp: '2024-03-16T10:00:00'
  },
  {
    id: '10',
    name: 'Lakshmi Iyer',
    email: 'lakshmi@smallbiz.com',
    phone: '+91 98765 43219',
    company: 'Small Business Enterprises',
    source: 'referral',
    status: 'contacted',
    priority: 'low',
    value: 120000,
    assignedTo: 'Karthik Nair',
    createdAt: '2024-03-13T16:00:00',
    updatedAt: '2024-03-15T10:45:00',
    notes: [
      'Small business owner with 8 employees',
      'Interested in basic monthly chit schemes',
      'Limited budget but consistent income',
      'Prefers simple and transparent terms',
      'Good payment history with other financial institutions'
    ],
    tags: ['small-business', 'basic-scheme', 'limited-budget', 'transparent-terms'],
    nextFollowUp: '2024-03-18T14:30:00'
  },
  {
    id: '11',
    name: 'Venkat Rao',
    email: 'venkat@premiumgroup.com',
    phone: '+91 98765 43220',
    company: 'Premium Investors Group',
    source: 'website',
    status: 'proposal',
    priority: 'high',
    value: 1100000,
    assignedTo: 'Priya Sharma',
    createdAt: '2024-03-04T11:15:00',
    updatedAt: '2024-03-12T13:50:00',
    notes: [
      'High-value investor group with multiple HNI clients',
      'Proposal under review by investment committee',
      'Interested in customized chit schemes',
      'Requires detailed ROI analysis',
      'Strong track record in financial investments',
      'Potential for long-term partnership'
    ],
    tags: ['premium', 'investor-group', 'hni-clients', 'customized', 'long-term'],
    nextFollowUp: '2024-03-17T11:00:00'
  },
  {
    id: '12',
    name: 'Prof. Ramesh Kumar',
    email: 'ramesh@educationinstitute.org',
    phone: '+91 98765 43221',
    company: 'Education Institute',
    source: 'website',
    status: 'negotiation',
    priority: 'medium',
    value: 420000,
    assignedTo: 'Karthik Nair',
    createdAt: '2024-03-06T15:45:00',
    updatedAt: '2024-03-13T14:10:00',
    notes: [
      'Educational institute with 200+ staff',
      'Negotiating payment terms for staff welfare scheme',
      'Discussing educational pricing and discounts',
      'Requires approval from board of trustees',
      'Good reputation and stable institution',
      'Potential for annual renewals'
    ],
    tags: ['education', 'staff-welfare', 'institutional', 'board-approval', 'annual-renewal'],
    nextFollowUp: '2024-03-17T16:00:00'
  },
  {
    id: '13',
    name: 'Anand Krishnamurthy',
    email: 'anand@consultingfirm.com',
    phone: '+91 98765 43222',
    company: 'Consulting Firm Ltd',
    source: 'advertisement',
    status: 'won',
    priority: 'medium',
    value: 560000,
    assignedTo: 'Vikram Singh',
    createdAt: '2024-02-25T14:20:00',
    updatedAt: '2024-03-10T12:45:00',
    notes: [
      'Responded to LinkedIn advertisement',
      'Successful closure within 2 weeks',
      'Quick decision-making process',
      'Enrolled in gold tier chit scheme',
      'Payment completed and scheme activated',
      'Satisfied with service quality'
    ],
    tags: ['consulting', 'won-deal', 'linkedin', 'quick-decision', 'gold-tier'],
    nextFollowUp: '2024-05-10T10:00:00'
  },
  {
    id: '14',
    name: 'Sanjay Mehta',
    email: 'sanjay@budgetcorp.com',
    phone: '+91 98765 43223',
    company: 'Budget Constraints Corp',
    source: 'cold-call',
    status: 'lost',
    priority: 'low',
    value: 280000,
    assignedTo: 'Karthik Nair',
    createdAt: '2024-02-20T09:00:00',
    updatedAt: '2024-03-05T14:20:00',
    notes: [
      'Initial interest during cold call',
      'Budget constraints due to market conditions',
      'Decided to postpone investment plans',
      'Company restructuring affecting decisions',
      'Potential opportunity in 6 months',
      'Maintain relationship for future prospects'
    ],
    tags: ['lost-deal', 'budget-issue', 'postponed', 'restructuring', 'future-prospect'],
    nextFollowUp: '2024-06-01T10:00:00'
  },
  {
    id: '15',
    name: 'Neha Agarwal',
    email: 'neha@techstartup.com',
    phone: '+91 98765 43224',
    company: 'Tech Startup Hub',
    source: 'social-media',
    status: 'new',
    priority: 'medium',
    value: 320000,
    assignedTo: 'Vikram Singh',
    createdAt: '2024-03-15T11:15:00',
    updatedAt: '2024-03-15T11:15:00',
    notes: [
      'Inquiry received via Instagram business profile',
      'Young entrepreneur with tech startup',
      'Interested in startup-friendly investment packages',
      'Needs flexible payment terms',
      'Good social media presence and engagement'
    ],
    tags: ['social-media', 'startup', 'entrepreneur', 'flexible-terms', 'instagram'],
    nextFollowUp: '2024-03-17T14:00:00'
  },
  {
    id: '16',
    name: 'Deepak Joshi',
    email: 'deepak@manufacturingltd.com',
    phone: '+91 98765 43225',
    company: 'Manufacturing Ltd',
    source: 'website',
    status: 'contacted',
    priority: 'high',
    value: 950000,
    assignedTo: 'Priya Sharma',
    createdAt: '2024-03-11T10:30:00',
    updatedAt: '2024-03-14T15:20:00',
    notes: [
      'Large manufacturing company with 100+ employees',
      'Initial contact made via website form',
      'Interested in employee welfare schemes',
      'Strong financial position and growth',
      'Requires detailed proposal with ROI analysis',
      'Decision timeline: 2-3 weeks'
    ],
    tags: ['manufacturing', 'large-company', 'employee-welfare', 'roi-analysis', 'website'],
    nextFollowUp: '2024-03-18T11:00:00'
  },
  {
    id: '17',
    name: 'Pooja Reddy',
    email: 'pooja@retailsolutions.com',
    phone: '+91 98765 43226',
    company: 'Retail Solutions Pvt Ltd',
    source: 'referral',
    status: 'qualified',
    priority: 'medium',
    value: 380000,
    assignedTo: 'Karthik Nair',
    createdAt: '2024-03-07T14:45:00',
    updatedAt: '2024-03-12T16:30:00',
    notes: [
      'Referred by business partner',
      'Retail business with seasonal cash flow',
      'Qualified based on financial documents',
      'Interested in flexible chit schemes',
      'Good business reputation in local market',
      'Prefers quarterly payment options'
    ],
    tags: ['retail', 'seasonal-business', 'qualified', 'flexible-schemes', 'quarterly-payments'],
    nextFollowUp: '2024-03-19T15:00:00'
  },
  {
    id: '18',
    name: 'Arun Krishnan',
    email: 'arun@itservices.com',
    phone: '+91 98765 43227',
    company: 'IT Services Global',
    source: 'advertisement',
    status: 'proposal',
    priority: 'high',
    value: 720000,
    assignedTo: 'Vikram Singh',
    createdAt: '2024-03-03T12:00:00',
    updatedAt: '2024-03-11T14:45:00',
    notes: [
      'IT services company with global clients',
      'Proposal sent for corporate platinum scheme',
      'Interested in employee investment programs',
      'Strong financial metrics and growth',
      'Comparing with other investment options',
      'Decision expected within 10 days'
    ],
    tags: ['it-services', 'global', 'platinum', 'employee-investment', 'comparison'],
    nextFollowUp: '2024-03-18T13:00:00'
  },
  {
    id: '19',
    name: 'Kavya Srinivasan',
    email: 'kavya@consultingpro.com',
    phone: '+91 98765 43228',
    company: 'Consulting Pro Services',
    source: 'cold-call',
    status: 'contacted',
    priority: 'low',
    value: 180000,
    assignedTo: 'Karthik Nair',
    createdAt: '2024-03-12T11:30:00',
    updatedAt: '2024-03-15T09:45:00',
    notes: [
      'Small consulting firm with 12 employees',
      'Initial contact made via cold call',
      'Interested in basic employee schemes',
      'Limited budget but steady income',
      'Needs more information about benefits',
      'Prefers simple documentation process'
    ],
    tags: ['consulting', 'small-firm', 'basic-scheme', 'simple-process', 'cold-call'],
    nextFollowUp: '2024-03-19T16:00:00'
  },
  {
    id: '20',
    name: 'Ramesh Gupta',
    email: 'ramesh@tradingcompany.com',
    phone: '+91 98765 43229',
    company: 'Trading Company Ltd',
    source: 'website',
    status: 'new',
    priority: 'medium',
    value: 450000,
    assignedTo: 'Priya Sharma',
    createdAt: '2024-03-15T16:20:00',
    updatedAt: '2024-03-15T16:20:00',
    notes: [
      'Recent website inquiry about investment options',
      'Trading company with fluctuating income',
      'Interested in flexible chit schemes',
      'Needs schemes that accommodate business cycles',
      'Good business track record over 10 years',
      'Initial call scheduled for tomorrow'
    ],
    tags: ['trading', 'flexible-schemes', 'business-cycles', 'website', 'experienced'],
    nextFollowUp: '2024-03-16T14:00:00'
  }
];

// Storage utilities
export const loadLeads = (): Lead[] => {
  try {
    const saved = localStorage.getItem(LEADS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : mockLeads;
    }
    return mockLeads;
  } catch (error) {
    console.error('Failed to load leads:', error);
    return mockLeads;
  }
};

export const saveLeads = (leads: Lead[]) => {
  try {
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
    // Trigger custom event to notify other components
    window.dispatchEvent(new CustomEvent('leadsUpdated'));
  } catch (error) {
    console.error('Failed to save leads:', error);
  }
};

export const addLead = (lead: Lead) => {
  const existingLeads = loadLeads();
  const updatedLeads = [...existingLeads, lead];
  console.log('Adding lead to storage:', lead);
  console.log('Updated leads array:', updatedLeads);
  saveLeads(updatedLeads);
  return updatedLeads;
};

export const updateLead = (updatedLead: Lead) => {
  const existingLeads = loadLeads();
  const updatedLeads = existingLeads.map(lead => 
    lead.id === updatedLead.id ? updatedLead : lead
  );
  saveLeads(updatedLeads);
  return updatedLeads;
};

export const deleteLead = (leadId: string) => {
  const existingLeads = loadLeads();
  const updatedLeads = existingLeads.filter(lead => lead.id !== leadId);
  saveLeads(updatedLeads);
  return updatedLeads;
};

// Initialize sample data if none exists
export const initializeLeadsData = () => {
  try {
    const existingLeads = loadLeads();
    console.log('Existing leads count:', existingLeads.length);
    if (existingLeads.length === 0) {
      console.log('No existing leads found, initializing with mock data');
      saveLeads(mockLeads);
    }
  } catch (error) {
    console.error('Error initializing leads data:', error);
    saveLeads(mockLeads);
  }
};