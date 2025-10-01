import React, { useState } from 'react';
import { ArrowLeft, Save, Upload, X, Plus, User, Briefcase, Shield, Phone, MapPin, Key, Lock, Eye, EyeOff } from 'lucide-react';
import { Employee } from '../../types/hrms';
import { getBranches, initializeBranchesData } from '../../data/branches.mock';
import { mockUsers, UserCategory } from '../../data/users.mock';
import toast from 'react-hot-toast';

interface NewEmployeeProps {
  onBack: () => void;
  onSave: (employee: Partial<Employee>) => void;
}

export const NewEmployee: React.FC<NewEmployeeProps> = ({ onBack, onSave }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Employee>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    alternatePhone: '',
    dateOfBirth: '',
    gender: 'male',
    maritalStatus: 'single',
    bloodGroup: '',
    address: '',
    city: '',
    state: '',
    country: 'India',
    postalCode: '',
    designation: '',
    department: '',
    branch: '',
    joiningDate: new Date().toISOString().split('T')[0],
    probationPeriod: 6,
    employmentType: 'permanent',
    workLocation: 'office',
    reportingManager: '',
    teamMembers: [],
    basicSalary: 0,
    allowances: {
      hra: 0,
      transport: 0,
      medical: 0,
      special: 0
    },
    deductions: {
      pf: 0,
      esi: 0,
      tax: 0,
      other: 0
    },
    bankAccount: {
      accountNumber: '',
      bankName: '',
      ifscCode: '',
      accountHolderName: ''
    },
    documents: {},
    skills: [],
    qualifications: [],
    experience: [],
    status: 'active',
    emergencyContact: {
      name: '',
      relationship: '',
      phone: ''
    },
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [branches] = useState(() => {
    initializeBranchesData();
    return getBranches().filter(b => b.status === 'active');
  });
  const [createUserAccount, setCreateUserAccount] = useState(true);
  const [userAccountData, setUserAccountData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    role: 'Employee' as UserCategory,
    permissions: [] as string[]
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const steps = [
    { id: 1, name: 'Personal Info', icon: User },
    { id: 2, name: 'Professional', icon: Briefcase },
    { id: 3, name: 'User Credentials', icon: Key },
    { id: 4, name: 'Compensation', icon: Shield },
    { id: 5, name: 'Emergency Contact', icon: Phone }
  ];

  const departments = [
    'Executive', 'Operations', 'Sales & Marketing', 'Finance & Accounts', 
    'Human Resources', 'Information Technology', 'Customer Service'
  ];

  const managers = [
    'Prakashh Admin', 'Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sunita Reddy'
  ];

  const rolePermissions = {
    'Admin': ['dashboard.view', 'employees.view', 'employees.create', 'employees.edit', 'reports.view', 'settings.view'],
    'Employee': ['dashboard.view', 'employees.view', 'reports.view'],
    'Agents': ['dashboard.view', 'leads.view', 'leads.create'],
    'Subscribers': ['dashboard.view', 'profile.view']
  };

  const handleInputChange = (field: keyof Employee, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleNestedChange = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof Employee],
        [field]: value
      }
    }));
  };

  const handleUserAccountChange = (field: string, value: any) => {
    setUserAccountData(prev => ({ ...prev, [field]: value }));
  };

  const generateUsername = () => {
    if (formData.firstName && formData.lastName) {
      const username = `${formData.firstName.toLowerCase()}.${formData.lastName.toLowerCase()}`;
      setUserAccountData(prev => ({ ...prev, username }));
    }
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setUserAccountData(prev => ({ ...prev, password, confirmPassword: password }));
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.firstName?.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName?.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email?.trim()) newErrors.email = 'Email is required';
        if (!formData.phone?.trim()) newErrors.phone = 'Phone is required';
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
        break;
      case 2:
        if (!formData.designation?.trim()) newErrors.designation = 'Designation is required';
        if (!formData.department?.trim()) newErrors.department = 'Department is required';
        if (!formData.branch?.trim()) newErrors.branch = 'Branch is required';
        if (!formData.joiningDate) newErrors.joiningDate = 'Joining date is required';
        break;
      case 3:
        if (!userAccountData.username.trim()) newErrors.username = 'Username is required';
        if (!userAccountData.password.trim()) newErrors.password = 'Password is required';
        if (userAccountData.password !== userAccountData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }
        break;
      case 4:
        if (!formData.basicSalary || formData.basicSalary <= 0) newErrors.basicSalary = 'Basic salary is required';
        break;
      case 5:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    console.log('NewEmployee: handleSubmit called');
    console.log('NewEmployee: Current step:', currentStep);
    console.log('NewEmployee: Form data:', formData);
    console.log('NewEmployee: User account data:', userAccountData);
    
    if (validateStep(currentStep)) {
      console.log('NewEmployee: Validation passed, proceeding with creation...');
      createEmployee();
    } else {
      console.log('NewEmployee: Validation failed:', errors);
      toast.error('Please fix the validation errors before proceeding');
    }
  };

  const createEmployee = async () => {
    console.log('NewEmployee: Starting employee creation process...');
    
    // Final validation
    if (!formData.firstName?.trim() || !formData.lastName?.trim()) {
      toast.error('First name and last name are required');
      return;
    }
    
    if (!formData.email?.trim() || !formData.phone?.trim()) {
      toast.error('Email and phone are required');
      return;
    }
    
    if (!userAccountData.username?.trim() || !userAccountData.password?.trim()) {
      toast.error('Username and password are required');
      return;
    }
    
    try {
      // Create employee data
      const employeeData: Employee = {
        id: `emp_${Date.now()}`,
        employeeId: `EMP${String(Date.now()).slice(-3)}`,
        firstName: formData.firstName!,
        lastName: formData.lastName!,
        email: formData.email!,
        phone: formData.phone!,
        alternatePhone: formData.alternatePhone,
        dateOfBirth: formData.dateOfBirth!,
        gender: formData.gender!,
        maritalStatus: formData.maritalStatus!,
        bloodGroup: formData.bloodGroup,
        address: formData.address!,
        city: formData.city!,
        state: formData.state!,
        country: formData.country!,
        postalCode: formData.postalCode!,
        designation: formData.designation!,
        department: formData.department!,
        branch: formData.branch!,
        branchId: branches.find(b => b.name === formData.branch)?.id,
        joiningDate: formData.joiningDate!,
        confirmationDate: formData.confirmationDate,
        probationPeriod: formData.probationPeriod!,
        employmentType: formData.employmentType!,
        workLocation: formData.workLocation!,
        reportingManager: formData.reportingManager,
        teamMembers: formData.teamMembers!,
        basicSalary: formData.basicSalary!,
        allowances: formData.allowances!,
        deductions: formData.deductions!,
        bankAccount: formData.bankAccount!,
        documents: formData.documents!,
        skills: formData.skills!,
        qualifications: formData.qualifications!,
        experience: formData.experience!,
        status: formData.status!,
        userId: formData.userId,
        lastWorkingDay: formData.lastWorkingDay,
        terminationReason: formData.terminationReason,
        emergencyContact: formData.emergencyContact!,
        createdAt: new Date().toISOString(),
        createdBy: 'hr@ramnirmalchits.com',
        updatedAt: new Date().toISOString(),
        updatedBy: 'hr@ramnirmalchits.com',
        notes: formData.notes!
      };
      
      console.log('NewEmployee: Employee data created:', employeeData);
      
      // Get existing employees from localStorage
      const existingEmployeesJson = localStorage.getItem('employees_data');
      let existingEmployees: Employee[] = [];
      
      if (existingEmployeesJson) {
        try {
          existingEmployees = JSON.parse(existingEmployeesJson);
          if (!Array.isArray(existingEmployees)) {
            existingEmployees = [];
          }
        } catch (error) {
          console.error('Error parsing existing employees:', error);
          existingEmployees = [];
        }
      }
      
      console.log('NewEmployee: Existing employees count:', existingEmployees.length);
      
      // Add new employee
      const updatedEmployees = [...existingEmployees, employeeData];
      console.log('NewEmployee: Updated employees count:', updatedEmployees.length);
      
      // Save to localStorage
      localStorage.setItem('employees_data', JSON.stringify(updatedEmployees));
      console.log('NewEmployee: Saved to localStorage');
      
      // Create user account
      const userData = {
        id: `user_${Date.now()}`,
        name: `${employeeData.firstName} ${employeeData.lastName}`,
        email: employeeData.email,
        phone: employeeData.phone,
        category: userAccountData.role,
        role: employeeData.designation,
        status: 'Active',
        department: employeeData.department,
        branch: employeeData.branch,
        joiningDate: employeeData.joiningDate,
        lastLogin: null,
        username: userAccountData.username,
        password: userAccountData.password,
        permissions: rolePermissions[userAccountData.role] || [],
        employeeId: employeeData.employeeId
      };
      
      console.log('NewEmployee: User data created:', userData);
      
      // Save user account
      const existingUsersJson = localStorage.getItem('users_data');
      let existingUsers = [];
      
      if (existingUsersJson) {
        try {
          existingUsers = JSON.parse(existingUsersJson);
          if (!Array.isArray(existingUsers)) {
            existingUsers = [];
          }
        } catch (error) {
          console.error('Error parsing existing users:', error);
          existingUsers = [];
        }
      }
      
      const updatedUsers = [...existingUsers, userData];
      localStorage.setItem('users_data', JSON.stringify(updatedUsers));
      console.log('NewEmployee: User account saved');
      
      // Dispatch events to update all pages
      window.dispatchEvent(new CustomEvent('employeesUpdated'));
      window.dispatchEvent(new CustomEvent('employeeDataChanged'));
      window.dispatchEvent(new CustomEvent('usersUpdated'));
      window.dispatchEvent(new CustomEvent('storage'));
      console.log('NewEmployee: Events dispatched');
      
      // Show success message
      toast.success(`Employee "${employeeData.firstName} ${employeeData.lastName}" and user account created successfully!`);
      
      // Navigate back after short delay
      setTimeout(() => {
        console.log('NewEmployee: Navigating back to directory');
        onSave(employeeData);
      }, 1500);
      
    } catch (error) {
      console.error('NewEmployee: Error creating employee:', error);
      toast.error('Failed to create employee. Please try again.');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-50 mb-2">First Name *</label>
                <input
                  type="text"
                  value={formData.firstName || ''}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={`w-full px-3 py-2 bg-slate-700/50 border rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm ${
                    errors.firstName ? 'border-red-500' : 'border-yellow-400/30'
                  }`}
                  placeholder="Enter first name"
                />
                {errors.firstName && <p className="mt-1 text-sm text-red-400">{errors.firstName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-50 mb-2">Last Name *</label>
                <input
                  type="text"
                  value={formData.lastName || ''}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={`w-full px-3 py-2 bg-slate-700/50 border rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm ${
                    errors.lastName ? 'border-red-500' : 'border-yellow-400/30'
                  }`}
                  placeholder="Enter last name"
                />
                {errors.lastName && <p className="mt-1 text-sm text-red-400">{errors.lastName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-50 mb-2">Email *</label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-3 py-2 bg-slate-700/50 border rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm ${
                    errors.email ? 'border-red-500' : 'border-yellow-400/30'
                  }`}
                  placeholder="employee@ramnirmalchits.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-50 mb-2">Phone *</label>
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full px-3 py-2 bg-slate-700/50 border rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm ${
                    errors.phone ? 'border-red-500' : 'border-yellow-400/30'
                  }`}
                  placeholder="+91 98765 43210"
                />
                {errors.phone && <p className="mt-1 text-sm text-red-400">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-50 mb-2">Date of Birth *</label>
                <input
                  type="date"
                  value={formData.dateOfBirth || ''}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className={`w-full px-3 py-2 bg-slate-700/50 border rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm ${
                    errors.dateOfBirth ? 'border-red-500' : 'border-yellow-400/30'
                  }`}
                />
                {errors.dateOfBirth && <p className="mt-1 text-sm text-red-400">{errors.dateOfBirth}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-50 mb-2">Gender</label>
                <select
                  value={formData.gender || 'male'}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-50 mb-2">Address</label>
              <textarea
                rows={3}
                value={formData.address || ''}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                placeholder="Enter complete address"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-50 mb-2">Designation *</label>
                <input
                  type="text"
                  value={formData.designation || ''}
                  onChange={(e) => handleInputChange('designation', e.target.value)}
                  className={`w-full px-3 py-2 bg-slate-700/50 border rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm ${
                    errors.designation ? 'border-red-500' : 'border-yellow-400/30'
                  }`}
                  placeholder="Enter designation"
                />
                {errors.designation && <p className="mt-1 text-sm text-red-400">{errors.designation}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-50 mb-2">Department *</label>
                <select
                  value={formData.department || ''}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  className={`w-full px-3 py-2 bg-slate-700/50 border rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm ${
                    errors.department ? 'border-red-500' : 'border-yellow-400/30'
                  }`}
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                {errors.department && <p className="mt-1 text-sm text-red-400">{errors.department}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-50 mb-2">Branch *</label>
                <select
                  value={formData.branch || ''}
                  onChange={(e) => handleInputChange('branch', e.target.value)}
                  className={`w-full px-3 py-2 bg-slate-700/50 border rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm ${
                    errors.branch ? 'border-red-500' : 'border-yellow-400/30'
                  }`}
                >
                  <option value="">Select Branch</option>
                  {branches.map(branch => (
                    <option key={branch.id} value={branch.name}>
                      {branch.name} - {branch.city}
                    </option>
                  ))}
                </select>
                {errors.branch && <p className="mt-1 text-sm text-red-400">{errors.branch}</p>}
                {formData.branch && (
                  <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                    <p className="text-blue-800">
                      Selected: <span className="font-semibold">{formData.branch}</span>
                    </p>
                    {(() => {
                      const selectedBranch = branches.find(b => b.name === formData.branch);
                      return selectedBranch ? (
                        <p className="text-blue-600 text-xs">
                          Manager: {selectedBranch.manager} • {selectedBranch.employeeCount} employees
                        </p>
                      ) : null;
                    })()}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-50 mb-2">Joining Date *</label>
                <input
                  type="date"
                  value={formData.joiningDate || ''}
                  onChange={(e) => handleInputChange('joiningDate', e.target.value)}
                  className={`w-full px-3 py-2 bg-slate-700/50 border rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm ${
                    errors.joiningDate ? 'border-red-500' : 'border-yellow-400/30'
                  }`}
                />
                {errors.joiningDate && <p className="mt-1 text-sm text-red-400">{errors.joiningDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-50 mb-2">Employment Type</label>
                <select
                  value={formData.employmentType || 'permanent'}
                  onChange={(e) => handleInputChange('employmentType', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                >
                  <option value="permanent">Permanent</option>
                  <option value="contract">Contract</option>
                  <option value="intern">Intern</option>
                  <option value="consultant">Consultant</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-50 mb-2">Reporting Manager</label>
                <select
                  value={formData.reportingManager || ''}
                  onChange={(e) => handleInputChange('reportingManager', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                >
                  <option value="">Select Manager</option>
                  {managers.map(manager => (
                    <option key={manager} value={manager}>{manager}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {/* User Account Creation */}
            <div className="bg-slate-700/30 rounded-xl p-6 border border-yellow-400/20">
              <h3 className="text-lg font-semibold text-slate-50 mb-4 flex items-center">
                <Key className="h-5 w-5 mr-2" />
                User Account Credentials *
              </h3>
              <p className="text-slate-400 text-sm mb-6">
                Create login credentials for this employee to access the system (Required)
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-50 mb-2">Username *</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={userAccountData.username}
                      onChange={(e) => handleUserAccountChange('username', e.target.value)}
                      className={`flex-1 px-3 py-2 bg-slate-700/50 border rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm ${
                        errors.username ? 'border-red-500' : 'border-yellow-400/30'
                      }`}
                      placeholder="username"
                    />
                    <button
                      type="button"
                      onClick={generateUsername}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Generate
                    </button>
                  </div>
                  {errors.username && <p className="mt-1 text-sm text-red-400">{errors.username}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-50 mb-2">User Role</label>
                  <select
                    value={userAccountData.role}
                    onChange={(e) => {
                      const role = e.target.value as UserCategory;
                      handleUserAccountChange('role', role);
                      handleUserAccountChange('permissions', rolePermissions[role] || []);
                    }}
                    className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Employee">Employee</option>
                    <option value="Agents">Agent</option>
                    <option value="Subscribers">Subscriber</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-50 mb-2">Password *</label>
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={userAccountData.password}
                        onChange={(e) => handleUserAccountChange('password', e.target.value)}
                        className={`w-full px-3 py-2 pr-10 bg-slate-700/50 border rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm ${
                          errors.password ? 'border-red-500' : 'border-yellow-400/30'
                        }`}
                        placeholder="Password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={generatePassword}
                      className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      Generate
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-50 mb-2">Confirm Password *</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={userAccountData.confirmPassword}
                      onChange={(e) => handleUserAccountChange('confirmPassword', e.target.value)}
                      className={`w-full px-3 py-2 pr-10 bg-slate-700/50 border rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm ${
                        errors.confirmPassword ? 'border-red-500' : 'border-yellow-400/30'
                      }`}
                      placeholder="Confirm password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>}
                </div>
              </div>

              {/* Permissions Preview */}
              <div className="mt-4 p-4 bg-slate-800/50 rounded-lg border border-yellow-400/20">
                <h4 className="text-sm font-medium text-slate-50 mb-2">Assigned Permissions</h4>
                <p className="text-xs text-slate-400 mb-3">
                  The following permissions will be automatically assigned based on the selected role:
                </p>
                <div className="flex flex-wrap gap-2">
                  {rolePermissions[userAccountData.role]?.map((permission, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 border border-blue-200">
                      {permission.replace('.', ' ').replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-50 mb-2">Basic Salary (₹) *</label>
                <input
                  type="number"
                  value={formData.basicSalary || ''}
                  onChange={(e) => handleInputChange('basicSalary', parseFloat(e.target.value) || 0)}
                  className={`w-full px-3 py-2 bg-slate-700/50 border rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm ${
                    errors.basicSalary ? 'border-red-500' : 'border-yellow-400/30'
                  }`}
                  placeholder="50000"
                />
                {errors.basicSalary && <p className="mt-1 text-sm text-red-400">{errors.basicSalary}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-50 mb-2">HRA (₹)</label>
                <input
                  type="number"
                  value={formData.allowances?.hra || ''}
                  onChange={(e) => handleNestedChange('allowances', 'hra', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                  placeholder="15000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-50 mb-2">Transport Allowance (₹)</label>
                <input
                  type="number"
                  value={formData.allowances?.transport || ''}
                  onChange={(e) => handleNestedChange('allowances', 'transport', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                  placeholder="5000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-50 mb-2">Medical Allowance (₹)</label>
                <input
                  type="number"
                  value={formData.allowances?.medical || ''}
                  onChange={(e) => handleNestedChange('allowances', 'medical', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                  placeholder="2500"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-50 mb-4">Bank Account Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-50 mb-2">Account Number</label>
                  <input
                    type="text"
                    value={formData.bankAccount?.accountNumber || ''}
                    onChange={(e) => handleNestedChange('bankAccount', 'accountNumber', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                    placeholder="1234567890"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-50 mb-2">Bank Name</label>
                  <input
                    type="text"
                    value={formData.bankAccount?.bankName || ''}
                    onChange={(e) => handleNestedChange('bankAccount', 'bankName', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                    placeholder="HDFC Bank"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-50 mb-2">IFSC Code</label>
                  <input
                    type="text"
                    value={formData.bankAccount?.ifscCode || ''}
                    onChange={(e) => handleNestedChange('bankAccount', 'ifscCode', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                    placeholder="HDFC0001234"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-50 mb-2">Account Holder Name</label>
                  <input
                    type="text"
                    value={formData.bankAccount?.accountHolderName || ''}
                    onChange={(e) => handleNestedChange('bankAccount', 'accountHolderName', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                    placeholder="Employee Name"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-50 mb-4">Emergency Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-50 mb-2">Contact Name</label>
                  <input
                    type="text"
                    value={formData.emergencyContact?.name || ''}
                    onChange={(e) => handleNestedChange('emergencyContact', 'name', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                    placeholder="Emergency contact name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-50 mb-2">Relationship</label>
                  <select
                    value={formData.emergencyContact?.relationship || ''}
                    onChange={(e) => handleNestedChange('emergencyContact', 'relationship', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                  >
                    <option value="">Select Relationship</option>
                    <option value="spouse">Spouse</option>
                    <option value="parent">Parent</option>
                    <option value="sibling">Sibling</option>
                    <option value="friend">Friend</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-50 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.emergencyContact?.phone || ''}
                    onChange={(e) => handleNestedChange('emergencyContact', 'phone', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-50 mb-2">Additional Notes</label>
              <textarea
                rows={4}
                value={formData.notes || ''}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                placeholder="Any additional notes about the employee"
              />
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
          <div>
            <h1 className="text-2xl font-bold text-slate-50">Add New Employee</h1>
            <p className="mt-1 text-sm text-slate-400">
              Step {currentStep} of 5: {steps.find(s => s.id === currentStep)?.name}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="p-4 border-b border-yellow-400/30 bg-slate-800/40 backdrop-blur-xl flex-shrink-0">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                  isActive ? 'bg-blue-500 border-blue-500 text-white' :
                  isCompleted ? 'bg-green-500 border-green-500 text-white' :
                  'bg-slate-700/50 border-yellow-400/30 text-slate-400'
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    isActive ? 'text-blue-400' :
                    isCompleted ? 'text-green-400' : 'text-slate-400'
                  }`}>
                    {step.name}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    isCompleted ? 'bg-green-500' : 'bg-slate-600'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-none">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-8 border border-yellow-400/30">
            {renderStepContent()}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="p-4 border-t border-yellow-400/30 bg-slate-800/40 backdrop-blur-xl flex justify-between flex-shrink-0">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700/50 border border-yellow-400/30 rounded-lg hover:bg-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
        >
          Previous
        </button>
        
        <div className="flex space-x-3">
          <button
            onClick={onBack}
            className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700/50 border border-yellow-400/30 rounded-lg hover:bg-slate-700 transition-all backdrop-blur-sm"
          >
            Cancel
          </button>
          
          {currentStep === steps.length ? (
            <button
              onClick={handleSubmit}
              className="inline-flex items-center px-6 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg shadow-sm hover:bg-green-700 transition-all"
            >
              <Save className="h-4 w-4 mr-2" />
              Create Employee & User Account
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 transition-all"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};