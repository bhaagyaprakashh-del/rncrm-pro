import { Employee } from '../types/hrms';

export const mockEmployees: Employee[] = [
  {
    id: 'emp_1',
    employeeId: 'EMP001',
    firstName: 'Priya',
    lastName: 'Sharma',
    email: 'priya.sharma@ramnirmalchits.com',
    phone: '+91 98765 43215',
    alternatePhone: '+91 98765 43216',
    dateOfBirth: '1990-05-15',
    gender: 'female',
    maritalStatus: 'single',
    bloodGroup: 'O+',
    address: '123 MG Road, Bangalore',
    city: 'Bangalore',
    state: 'Karnataka',
    country: 'India',
    postalCode: '560001',
    designation: 'Senior Sales Executive',
    department: 'Sales & Marketing',
    branch: 'Bangalore Main',
    branchId: 'branch_1',
    joiningDate: '2021-06-01',
    confirmationDate: '2021-12-01',
    probationPeriod: 6,
    employmentType: 'permanent',
    workLocation: 'office',
    reportingManager: 'Rajesh Kumar',
    teamMembers: [],
    basicSalary: 75000,
    allowances: {
      hra: 22500,
      transport: 5000,
      medical: 2500,
      special: 5000
    },
    deductions: {
      pf: 9000,
      esi: 562,
      tax: 8500,
      other: 0
    },
    bankAccount: {
      accountNumber: '1234567890',
      bankName: 'HDFC Bank',
      ifscCode: 'HDFC0001234',
      accountHolderName: 'Priya Sharma'
    },
    documents: {
      resume: '/documents/priya-resume.pdf',
      idProof: '/documents/priya-aadhaar.pdf',
      addressProof: '/documents/priya-utility.pdf',
      educationCertificates: ['/documents/priya-degree.pdf'],
      photo: '/documents/priya-photo.jpg'
    },
    skills: ['Sales', 'Customer Relations', 'Lead Generation', 'CRM'],
    qualifications: [
      {
        degree: 'MBA Marketing',
        institution: 'Bangalore University',
        year: '2020',
        percentage: 85
      }
    ],
    experience: [
      {
        company: 'Previous Sales Corp',
        designation: 'Sales Executive',
        duration: '2 years',
        responsibilities: 'Lead generation and customer acquisition'
      }
    ],
    status: 'active',
    emergencyContact: {
      name: 'Ramesh Sharma',
      relationship: 'Father',
      phone: '+91 98765 43217'
    },
    createdAt: '2021-06-01',
    createdBy: 'hr@ramnirmalchits.com',
    updatedAt: '2024-03-15',
    updatedBy: 'priya.sharma@ramnirmalchits.com',
    notes: 'Top performing sales executive with excellent customer relationships'
  },
  {
    id: 'emp_2',
    employeeId: 'EMP002',
    firstName: 'Karthik',
    lastName: 'Nair',
    email: 'karthik.nair@ramnirmalchits.com',
    phone: '+91 98765 43221',
    dateOfBirth: '1988-03-22',
    gender: 'male',
    maritalStatus: 'married',
    bloodGroup: 'A+',
    address: '456 Jayanagar, Bangalore',
    city: 'Bangalore',
    state: 'Karnataka',
    country: 'India',
    postalCode: '560041',
    designation: 'Chit Fund Manager',
    department: 'Operations',
    branch: 'Bangalore South',
    branchId: 'branch_2',
    joiningDate: '2020-08-15',
    confirmationDate: '2021-02-15',
    probationPeriod: 6,
    employmentType: 'permanent',
    workLocation: 'office',
    reportingManager: 'Rajesh Kumar',
    teamMembers: ['emp_3', 'emp_4'],
    basicSalary: 85000,
    allowances: {
      hra: 25500,
      transport: 6000,
      medical: 3000,
      special: 7000
    },
    deductions: {
      pf: 10200,
      esi: 637,
      tax: 12000,
      other: 0
    },
    bankAccount: {
      accountNumber: '2345678901',
      bankName: 'SBI',
      ifscCode: 'SBIN0001234',
      accountHolderName: 'Karthik Nair'
    },
    documents: {
      resume: '/documents/karthik-resume.pdf',
      idProof: '/documents/karthik-pan.pdf',
      addressProof: '/documents/karthik-lease.pdf',
      educationCertificates: ['/documents/karthik-mba.pdf'],
      photo: '/documents/karthik-photo.jpg'
    },
    skills: ['Operations Management', 'Chit Fund Operations', 'Team Leadership', 'Customer Service'],
    qualifications: [
      {
        degree: 'MBA Finance',
        institution: 'IIM Bangalore',
        year: '2019',
        percentage: 88
      }
    ],
    experience: [
      {
        company: 'Financial Services Ltd',
        designation: 'Operations Executive',
        duration: '3 years',
        responsibilities: 'Financial operations and customer management'
      }
    ],
    status: 'active',
    emergencyContact: {
      name: 'Meera Nair',
      relationship: 'Spouse',
      phone: '+91 98765 43222'
    },
    createdAt: '2020-08-15',
    createdBy: 'hr@ramnirmalchits.com',
    updatedAt: '2024-03-14',
    updatedBy: 'karthik.nair@ramnirmalchits.com',
    notes: 'Experienced operations manager with strong leadership skills'
  },
  {
    id: 'emp_3',
    employeeId: 'EMP003',
    firstName: 'Neha',
    lastName: 'Singh',
    email: 'neha.singh@ramnirmalchits.com',
    phone: '+91 98765 43222',
    dateOfBirth: '1992-07-08',
    gender: 'female',
    maritalStatus: 'single',
    bloodGroup: 'B+',
    address: '789 Electronic City, Bangalore',
    city: 'Bangalore',
    state: 'Karnataka',
    country: 'India',
    postalCode: '560100',
    designation: 'Customer Service Executive',
    department: 'Customer Service',
    branch: 'Bangalore East',
    branchId: 'branch_3',
    joiningDate: '2022-08-20',
    confirmationDate: '2023-02-20',
    probationPeriod: 6,
    employmentType: 'permanent',
    workLocation: 'office',
    reportingManager: 'Vikram Singh',
    teamMembers: [],
    basicSalary: 45000,
    allowances: {
      hra: 13500,
      transport: 3000,
      medical: 1500,
      special: 2000
    },
    deductions: {
      pf: 5400,
      esi: 337,
      tax: 3500,
      other: 0
    },
    bankAccount: {
      accountNumber: '3456789012',
      bankName: 'ICICI Bank',
      ifscCode: 'ICIC0001234',
      accountHolderName: 'Neha Singh'
    },
    documents: {
      resume: '/documents/neha-resume.pdf',
      idProof: '/documents/neha-aadhaar.pdf',
      addressProof: '/documents/neha-utility.pdf',
      educationCertificates: ['/documents/neha-bcom.pdf'],
      photo: '/documents/neha-photo.jpg'
    },
    skills: ['Customer Service', 'Communication', 'Problem Solving', 'CRM'],
    qualifications: [
      {
        degree: 'B.Com',
        institution: 'Bangalore University',
        year: '2021',
        percentage: 82
      }
    ],
    experience: [
      {
        company: 'Customer Care Solutions',
        designation: 'Customer Support Executive',
        duration: '1 year',
        responsibilities: 'Customer query resolution and support'
      }
    ],
    status: 'active',
    emergencyContact: {
      name: 'Rajesh Singh',
      relationship: 'Father',
      phone: '+91 98765 43233'
    },
    createdAt: '2022-08-20',
    createdBy: 'vikram.singh@ramnirmalchits.com',
    updatedAt: '2024-03-13',
    updatedBy: 'neha.singh@ramnirmalchits.com',
    notes: 'Dedicated customer service executive with excellent communication skills'
  },
  {
    id: 'emp_4',
    employeeId: 'EMP004',
    firstName: 'Rohit',
    lastName: 'Gupta',
    email: 'rohit.gupta@ramnirmalchits.com',
    phone: '+91 98765 43223',
    dateOfBirth: '1989-11-12',
    gender: 'male',
    maritalStatus: 'married',
    bloodGroup: 'AB+',
    address: '234 Banjara Hills, Hyderabad',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    postalCode: '500034',
    designation: 'Operations Executive',
    department: 'Operations',
    branch: 'Hyderabad Branch',
    branchId: 'branch_6',
    joiningDate: '2021-11-15',
    confirmationDate: '2022-05-15',
    probationPeriod: 6,
    employmentType: 'permanent',
    workLocation: 'office',
    reportingManager: 'Anjali Sharma',
    teamMembers: [],
    basicSalary: 55000,
    allowances: {
      hra: 16500,
      transport: 4000,
      medical: 2000,
      special: 3000
    },
    deductions: {
      pf: 6600,
      esi: 412,
      tax: 5000,
      other: 0
    },
    bankAccount: {
      accountNumber: '4567890123',
      bankName: 'Axis Bank',
      ifscCode: 'UTIB0001234',
      accountHolderName: 'Rohit Gupta'
    },
    documents: {
      resume: '/documents/rohit-resume.pdf',
      idProof: '/documents/rohit-pan.pdf',
      addressProof: '/documents/rohit-lease.pdf',
      educationCertificates: ['/documents/rohit-btech.pdf'],
      photo: '/documents/rohit-photo.jpg'
    },
    skills: ['Operations', 'Process Management', 'Data Analysis', 'Team Coordination'],
    qualifications: [
      {
        degree: 'B.Tech',
        institution: 'JNTU Hyderabad',
        year: '2020',
        percentage: 75
      }
    ],
    experience: [
      {
        company: 'Operations Solutions Pvt Ltd',
        designation: 'Junior Operations Executive',
        duration: '1.5 years',
        responsibilities: 'Process optimization and data management'
      }
    ],
    status: 'inactive',
    lastWorkingDay: '2024-02-28',
    terminationReason: 'Resigned for higher studies',
    emergencyContact: {
      name: 'Kavita Gupta',
      relationship: 'Spouse',
      phone: '+91 98765 43234'
    },
    createdAt: '2021-11-15',
    createdBy: 'anjali.sharma@ramnirmalchits.com',
    updatedAt: '2024-02-28',
    updatedBy: 'hr@ramnirmalchits.com',
    notes: 'Former operations executive, left for higher studies'
  }
];

const sampleEmployees = mockEmployees;

export const getEmployees = (): Employee[] => {
  const saved = localStorage.getItem('employees_data');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      const validEmployees = Array.isArray(parsed) ? parsed.filter(emp => emp && emp.id) : [];
      return [...sampleEmployees, ...validEmployees];
    } catch (error) {
      console.error('Failed to load employees:', error);
      return sampleEmployees;
    }
  }
  console.log('getEmployees: No localStorage data, using sample employees');
  return sampleEmployees;
};

export const getActiveEmployees = (): Employee[] => {
  return getEmployees().filter(employee => employee.status === 'active');
};

export const getEmployeesByBranch = (branchName: string): Employee[] => {
  return getActiveEmployees().filter(employee => employee.branch === branchName);
};

export const getEmployeesByBranchId = (branchId: string): Employee[] => {
  return getActiveEmployees().filter(employee => employee.branchId === branchId);
};

export const getEmployeeById = (id: string): Employee | undefined => {
  return getEmployees().find(employee => employee.id === id);
};

export const saveEmployees = (employees: Employee[]) => {
  try {
    console.log('saveEmployees: Saving employees to localStorage:', employees.length);
    console.log('saveEmployees: Employee names being saved:', employees.map(e => `${e.firstName} ${e.lastName}`));
    localStorage.setItem('employees_data', JSON.stringify(employees));
    console.log('saveEmployees: Successfully saved to localStorage');
    window.dispatchEvent(new CustomEvent('employeesUpdated'));
    window.dispatchEvent(new CustomEvent('employeeDataChanged'));
    console.log('saveEmployees: Events dispatched');
  } catch (error) {
    console.error('Failed to save employees:', error);
  }
};

export const initializeEmployeesData = () => {
  try {
    const saved = localStorage.getItem('employees_data');
    console.log('getEmployees: Loading employees from localStorage...');
    if (saved && saved !== '[]') {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        console.log('getEmployees: Found employees in localStorage:', parsed.length);
        console.log('getEmployees: Employee names from localStorage:', parsed.map(e => `${e.firstName} ${e.lastName}`));
        return parsed;
      } else {
        console.log('getEmployees: No valid employees in localStorage, using sample data');
        return sampleEmployees;
      }
    }
    if (!saved || saved === '[]') {
      console.log('initializeEmployeesData: No data found, initializing with sample employees');
      localStorage.setItem('employees_data', JSON.stringify(sampleEmployees));
    } else {
      console.log('initializeEmployeesData: Data exists in localStorage');
      try {
        const parsed = JSON.parse(saved);
        console.log('initializeEmployeesData: Parsed employees count:', parsed.length);
      } catch (error) {
        console.error('initializeEmployeesData: Error parsing existing data, reinitializing');
        localStorage.setItem('employees_data', JSON.stringify(sampleEmployees));
      }
    }
  } catch (error) {
    console.error('Error initializing employees data:', error);
    localStorage.setItem('employees_data', JSON.stringify(sampleEmployees));
  }
};

export const addEmployee = (employee: Employee) => {
  try {
    console.log('addEmployee: Adding new employee:', `${employee.firstName} ${employee.lastName}`);
    
    // Get current employees from localStorage only (to avoid sample duplication)
    const saved = localStorage.getItem('employees_data');
    let existingEmployees: Employee[] = [];
    
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        existingEmployees = Array.isArray(parsed) ? parsed : [];
      } catch (error) {
        console.error('addEmployee: Error parsing existing data:', error);
        existingEmployees = [];
      }
    }
    
    console.log('addEmployee: Existing employees in storage:', existingEmployees.length);
    
    // Add new employee
    const updatedEmployees = [...existingEmployees, employee];
    console.log('addEmployee: Total employees after addition:', updatedEmployees.length);
    
    // Save directly to localStorage
    localStorage.setItem('employees_data', JSON.stringify(updatedEmployees));
    console.log('addEmployee: Saved to localStorage successfully');
    
    // Dispatch events
    window.dispatchEvent(new CustomEvent('employeesUpdated'));
    window.dispatchEvent(new CustomEvent('employeeDataChanged'));
    window.dispatchEvent(new CustomEvent('storage'));
    console.log('addEmployee: Events dispatched');
    
    // Return the updated employees list
    console.log('addEmployee: Returning updated employees:', updatedEmployees.length);
    return updatedEmployees;
  } catch (error) {
    console.error('Failed to add employee:', error);
    throw error;
  }
};

export const updateEmployee = (updatedEmployee: Employee) => {
  try {
    const existingEmployees = getEmployees();
    const updatedEmployees = existingEmployees.map(emp => 
      emp.id === updatedEmployee.id ? updatedEmployee : emp
    );
    saveEmployees(updatedEmployees);
    return updatedEmployees;
  } catch (error) {
    console.error('Failed to update employee:', error);
    throw error;
  }
};

export const deleteEmployee = (employeeId: string) => {
  try {
    const existingEmployees = getEmployees();
    const updatedEmployees = existingEmployees.filter(emp => emp.id !== employeeId);
    saveEmployees(updatedEmployees);
    return updatedEmployees;
  } catch (error) {
    console.error('Failed to delete employee:', error);
    throw error;
  }
};