export interface Branch {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  manager: string;
  employeeCount: number;
  agentCount: number;
  status: 'active' | 'inactive';
  type: 'head_office' | 'branch' | 'sub_branch';
  createdAt: string;
  updatedAt: string;
}

export const mockBranches: Branch[] = [
  {
    id: 'branch_1',
    name: 'Bangalore Main',
    code: 'BLR-MAIN',
    address: '123 MG Road, Central Business District',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560001',
    phone: '+91 80 2234 5678',
    email: 'bangalore.main@ramnirmalchits.com',
    manager: 'Rajesh Kumar',
    employeeCount: 25,
    agentCount: 8,
    status: 'active',
    type: 'head_office',
    createdAt: '2020-01-01',
    updatedAt: '2024-03-15'
  },
  {
    id: 'branch_2',
    name: 'Bangalore South',
    code: 'BLR-SOUTH',
    address: '456 Jayanagar 4th Block',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560041',
    phone: '+91 80 2634 7890',
    email: 'bangalore.south@ramnirmalchits.com',
    manager: 'Karthik Nair',
    employeeCount: 15,
    agentCount: 5,
    status: 'active',
    type: 'branch',
    createdAt: '2020-06-15',
    updatedAt: '2024-03-14'
  },
  {
    id: 'branch_3',
    name: 'Bangalore East',
    code: 'BLR-EAST',
    address: '789 Whitefield Main Road',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560066',
    phone: '+91 80 2845 1234',
    email: 'bangalore.east@ramnirmalchits.com',
    manager: 'Vikram Singh',
    employeeCount: 12,
    agentCount: 6,
    status: 'active',
    type: 'branch',
    createdAt: '2021-03-01',
    updatedAt: '2024-03-13'
  },
  {
    id: 'branch_4',
    name: 'Bangalore West',
    code: 'BLR-WEST',
    address: '321 Rajajinagar 2nd Block',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560010',
    phone: '+91 80 2345 6789',
    email: 'bangalore.west@ramnirmalchits.com',
    manager: 'Suresh Kumar',
    employeeCount: 10,
    agentCount: 4,
    status: 'active',
    type: 'branch',
    createdAt: '2021-08-20',
    updatedAt: '2024-03-12'
  },
  {
    id: 'branch_5',
    name: 'Chennai Branch',
    code: 'CHN-MAIN',
    address: '567 Anna Salai, T. Nagar',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600017',
    phone: '+91 44 2456 7890',
    email: 'chennai@ramnirmalchits.com',
    manager: 'Priya Reddy',
    employeeCount: 18,
    agentCount: 7,
    status: 'active',
    type: 'branch',
    createdAt: '2020-12-10',
    updatedAt: '2024-03-11'
  },
  {
    id: 'branch_6',
    name: 'Hyderabad Branch',
    code: 'HYD-MAIN',
    address: '890 Banjara Hills Road No. 12',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500034',
    phone: '+91 40 2567 8901',
    email: 'hyderabad@ramnirmalchits.com',
    manager: 'Anjali Sharma',
    employeeCount: 14,
    agentCount: 5,
    status: 'active',
    type: 'branch',
    createdAt: '2021-05-15',
    updatedAt: '2024-03-10'
  },
  {
    id: 'branch_7',
    name: 'Mumbai Branch',
    code: 'MUM-MAIN',
    address: '234 Andheri West, Link Road',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400058',
    phone: '+91 22 2678 9012',
    email: 'mumbai@ramnirmalchits.com',
    manager: 'Amit Patel',
    employeeCount: 20,
    agentCount: 8,
    status: 'active',
    type: 'branch',
    createdAt: '2022-01-20',
    updatedAt: '2024-03-09'
  },
  {
    id: 'branch_8',
    name: 'Bangalore Central',
    code: 'BLR-CENTRAL',
    address: '678 Commercial Street',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560001',
    phone: '+91 80 2789 0123',
    email: 'bangalore.central@ramnirmalchits.com',
    manager: 'Sunita Reddy',
    employeeCount: 8,
    agentCount: 3,
    status: 'inactive',
    type: 'sub_branch',
    createdAt: '2022-06-01',
    updatedAt: '2024-03-08'
  }
];

export const getBranches = (): Branch[] => {
  const saved = localStorage.getItem('branches_data');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : mockBranches;
    } catch (error) {
      console.error('Failed to load branches:', error);
      return mockBranches;
    }
  }
  return mockBranches;
};

export const getActiveBranches = (): Branch[] => {
  return getBranches().filter(branch => branch.status === 'active');
};

export const getBranchById = (id: string): Branch | undefined => {
  return getBranches().find(branch => branch.id === id);
};

export const getBranchByName = (name: string): Branch | undefined => {
  return getBranches().find(branch => branch.name === name);
};

export const saveBranches = (branches: Branch[]) => {
  try {
    localStorage.setItem('branches_data', JSON.stringify(branches));
    window.dispatchEvent(new CustomEvent('branchesUpdated'));
  } catch (error) {
    console.error('Failed to save branches:', error);
  }
};

export const initializeBranchesData = () => {
  try {
    const existingBranches = getBranches();
    if (existingBranches.length === 0) {
      saveBranches(mockBranches);
    }
  } catch (error) {
    console.error('Error initializing branches data:', error);
    saveBranches(mockBranches);
  }
};