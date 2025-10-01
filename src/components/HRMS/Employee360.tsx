import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, CreditCard as Edit, Mail, Phone, MapPin, Calendar, DollarSign, User, CreditCard, FileText, Clock, Award, Target, TrendingUp, Users, CheckCircle, AlertTriangle, Download, Upload, Star, Briefcase, Shield, Building, Activity, Eye, Send, MessageSquare, Save, X, Key, Lock, EyeOff, Search, Filter, MoreVertical, Trash2, Ambulance as Cancel } from 'lucide-react';
import { Employee } from '../../types/hrms';
import { getEmployees, saveEmployees, updateEmployee, deleteEmployee, initializeEmployeesData } from '../../data/employees.mock';
import { getBranches, initializeBranchesData } from '../../data/branches.mock';
import { UserCategory } from '../../data/users.mock';
import toast from 'react-hot-toast';

interface Employee360Props {
  employeeId: string;
  onBack: () => void;
}

interface EmployeeActivity {
  id: string;
  employeeId: string;
  type: 'profile_update' | 'salary_change' | 'promotion' | 'training' | 'leave' | 'attendance' | 'document_upload' | 'performance_review';
  title: string;
  description: string;
  timestamp: string;
  performedBy: string;
  metadata?: any;
}

const generateActivitiesForEmployee = (employee: Employee): EmployeeActivity[] => {
  const activities: EmployeeActivity[] = [];
  const baseDate = new Date(employee.createdAt);
  
  // Initial joining activity
  activities.push({
    id: `act_${employee.id}_1`,
    employeeId: employee.id,
    type: 'profile_update',
    title: 'Employee Joined',
    description: `${employee.firstName} ${employee.lastName} joined as ${employee.designation} in ${employee.department}`,
    timestamp: employee.createdAt,
    performedBy: employee.createdBy
  });

  // Confirmation activity (if confirmed)
  if (employee.confirmationDate) {
    activities.push({
      id: `act_${employee.id}_2`,
      employeeId: employee.id,
      type: 'profile_update',
      title: 'Probation Completed',
      description: `Successfully completed probation period and confirmed as permanent employee`,
      timestamp: employee.confirmationDate,
      performedBy: employee.reportingManager || 'HR Team'
    });
  }

  // Recent profile update
  if (employee.updatedAt !== employee.createdAt) {
    activities.push({
      id: `act_${employee.id}_3`,
      employeeId: employee.id,
      type: 'profile_update',
      title: 'Profile Updated',
      description: `Employee profile information was updated`,
      timestamp: employee.updatedAt,
      performedBy: employee.updatedBy
    });
  }

  // Mock training activity
  const trainingDate = new Date(baseDate.getTime() + 90 * 24 * 60 * 60 * 1000);
  activities.push({
    id: `act_${employee.id}_4`,
    employeeId: employee.id,
    type: 'training',
    title: 'Training Completed',
    description: `Completed orientation and job-specific training programs`,
    timestamp: trainingDate.toISOString(),
    performedBy: 'Training Team'
  });

  return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

const EmployeeTable: React.FC<{ 
  employees: Employee[]; 
  onEmployeeSelect: (employeeId: string) => void;
  selectedEmployeeId?: string;
}> = ({ employees, onEmployeeSelect, selectedEmployeeId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || employee.status === filterStatus;
    const matchesDepartment = filterDepartment === 'all' || employee.department === filterDepartment;
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'terminated': return 'bg-red-100 text-red-800';
      case 'on-leave': return 'bg-yellow-100 text-yellow-800';
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

  const uniqueDepartments = [...new Set(employees.map(e => e.department).filter(Boolean))];

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-slate-800/40 backdrop-blur-xl rounded-xl p-4 border border-yellow-400/30">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 h-4 w-4" />
            <input
              type="text"
              placeholder="Search employees..."
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
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="terminated">Terminated</option>
            <option value="on-leave">On Leave</option>
          </select>
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm"
          >
            <option value="all">All Departments</option>
            {uniqueDepartments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          <div className="text-sm text-slate-400 flex items-center">
            Showing: <span className="font-semibold ml-1 text-slate-50">{filteredEmployees.length}</span> employees
          </div>
        </div>
      </div>

      {/* Employees Table */}
      <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-yellow-400/30 overflow-hidden">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full">
            <thead className="bg-slate-700/50 border-b border-yellow-400/20 sticky top-0">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Department</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Salary</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-yellow-400/20">
              {filteredEmployees.map((employee) => (
                <tr 
                  key={employee.id} 
                  className={`hover:bg-slate-700/20 transition-colors cursor-pointer ${
                    selectedEmployeeId === employee.id ? 'bg-blue-500/10 border-l-4 border-l-blue-500' : ''
                  }`}
                  onClick={() => onEmployeeSelect(employee.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-slate-600/50 rounded-full flex items-center justify-center text-slate-50 font-medium border border-yellow-400/30">
                        {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-50">{employee.firstName} {employee.lastName}</p>
                        <p className="text-xs text-slate-400">{employee.employeeId} • {employee.designation}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-slate-50">{employee.department}</p>
                      <p className="text-xs text-slate-400">{employee.branch}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm text-slate-300">{employee.email}</p>
                      <p className="text-xs text-slate-400">{employee.phone}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-semibold text-green-400">{formatCurrency(employee.basicSalary)}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
                      {employee.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEmployeeSelect(employee.id);
                        }}
                        className="text-blue-400 hover:text-blue-300"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
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

const ActivityTimeline: React.FC<{ activities: EmployeeActivity[] }> = ({ activities }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'profile_update': return User;
      case 'salary_change': return DollarSign;
      case 'promotion': return TrendingUp;
      case 'training': return Award;
      case 'leave': return Calendar;
      case 'attendance': return Clock;
      case 'document_upload': return FileText;
      case 'performance_review': return Star;
      default: return Activity;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'profile_update': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'salary_change': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'promotion': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'training': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'leave': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'attendance': return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
      case 'document_upload': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'performance_review': return 'bg-pink-500/20 text-pink-400 border-pink-500/30';
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

export const Employee360: React.FC<Employee360Props> = ({ employeeId, onBack }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [activeTab, setActiveTab] = useState('table');
  const [activities, setActivities] = useState<EmployeeActivity[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<Employee>>({});
  const [branches] = useState(() => {
    initializeBranchesData();
    return getBranches().filter(b => b.status === 'active');
  });

  // Load employees data on component mount
  useEffect(() => {
    console.log('Employee360: Loading employees data...');
    initializeEmployeesData();
    const loadedEmployees = getEmployees();
    console.log('Employee360: Loaded employees:', loadedEmployees.length);
    setEmployees(loadedEmployees);
    
    // Get employee ID from URL params or props
    const urlEmployeeId = searchParams.get('id') || employeeId;
    const urlEmployeeName = searchParams.get('name');
    
    if (urlEmployeeId) {
      const foundEmployee = loadedEmployees.find(e => e.id === urlEmployeeId);
      if (foundEmployee) {
        setSelectedEmployee(foundEmployee);
        setSelectedEmployeeId(foundEmployee.id);
        setActivities(generateActivitiesForEmployee(foundEmployee));
        setActiveTab('overview');
      }
    } else if (urlEmployeeName) {
      const foundEmployee = loadedEmployees.find(e => 
        `${e.firstName} ${e.lastName}` === decodeURIComponent(urlEmployeeName)
      );
      if (foundEmployee) {
        setSelectedEmployee(foundEmployee);
        setSelectedEmployeeId(foundEmployee.id);
        setActivities(generateActivitiesForEmployee(foundEmployee));
        setActiveTab('overview');
      }
    }
  }, [employeeId, searchParams]);

  // Listen for storage changes
  useEffect(() => {
    const handleStorageChange = () => {
      console.log('Employee360: Storage changed, reloading employees...');
      const updatedEmployees = getEmployees();
      console.log('Employee360: Updated employees count:', updatedEmployees.length);
      setEmployees(updatedEmployees);
      
      if (selectedEmployeeId) {
        const updatedEmployee = updatedEmployees.find(e => e.id === selectedEmployeeId);
        if (updatedEmployee) {
          setSelectedEmployee(updatedEmployee);
          setEditFormData(updatedEmployee);
          setActivities(generateActivitiesForEmployee(updatedEmployee));
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('employeesUpdated', handleStorageChange);
    window.addEventListener('employeeDataChanged', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('employeesUpdated', handleStorageChange);
      window.removeEventListener('employeeDataChanged', handleStorageChange);
    };
  }, [selectedEmployeeId]);

  const handleEmployeeSelect = (newEmployeeId: string) => {
    const employee = employees.find(e => e.id === newEmployeeId);
    if (employee) {
      setSelectedEmployee(employee);
      setSelectedEmployeeId(newEmployeeId);
      setActivities(generateActivitiesForEmployee(employee));
      setActiveTab('overview');
      
      // Update URL
      navigate(`/hrms-employee-360?id=${newEmployeeId}&name=${encodeURIComponent(employee.firstName + ' ' + employee.lastName)}`);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateTenure = (joiningDate: string) => {
    const joining = new Date(joiningDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - joining.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    
    if (years > 0) {
      return `${years} years ${months} months`;
    }
    return `${months} months`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'terminated': return 'bg-red-100 text-red-800 border-red-200';
      case 'on-leave': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const tabs = [
    { id: 'table', name: 'All Employees', icon: Users },
    { id: 'overview', name: 'Overview', icon: Eye },
    { id: 'activity', name: 'Activity', icon: Activity },
    { id: 'documents', name: 'Documents', icon: FileText }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'table':
        return (
          <EmployeeTable 
            employees={employees} 
            onEmployeeSelect={handleEmployeeSelect}
            selectedEmployeeId={selectedEmployeeId}
          />
        );

      case 'overview':
        if (!selectedEmployee) {
          return (
            <div className="text-center py-12">
              <User className="h-12 w-12 mx-auto text-slate-500 mb-4" />
              <h3 className="text-lg font-medium text-slate-50 mb-2">No Employee Selected</h3>
              <p className="text-sm text-slate-400">Select an employee from the table to view details.</p>
            </div>
          );
        }

        const grossSalary = selectedEmployee.basicSalary + 
          selectedEmployee.allowances.hra + 
          selectedEmployee.allowances.transport + 
          selectedEmployee.allowances.medical + 
          selectedEmployee.allowances.special;

        const totalDeductions = selectedEmployee.deductions.pf + 
          selectedEmployee.deductions.esi + 
          selectedEmployee.deductions.tax + 
          selectedEmployee.deductions.other;

        const netSalary = grossSalary - totalDeductions;

        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30">
              <h3 className="text-lg font-semibold text-slate-50 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Personal Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Employee ID</span>
                  <span className="text-slate-50 font-medium">{selectedEmployee.employeeId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Date of Birth</span>
                  <span className="text-slate-50">{new Date(selectedEmployee.dateOfBirth).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Gender</span>
                  <span className="text-slate-50 capitalize">{selectedEmployee.gender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Marital Status</span>
                  <span className="text-slate-50 capitalize">{selectedEmployee.maritalStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Blood Group</span>
                  <span className="text-slate-50">{selectedEmployee.bloodGroup || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30">
              <h3 className="text-lg font-semibold text-slate-50 mb-4 flex items-center">
                <Briefcase className="h-5 w-5 mr-2" />
                Professional Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Designation</span>
                  <span className="text-slate-50 font-medium">{selectedEmployee.designation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Department</span>
                  <span className="text-slate-50">{selectedEmployee.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Branch</span>
                  <span className="text-slate-50">{selectedEmployee.branch}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Employment Type</span>
                  <span className="text-slate-50 capitalize">{selectedEmployee.employmentType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Reporting Manager</span>
                  <span className="text-slate-50">{selectedEmployee.reportingManager || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Tenure</span>
                  <span className="text-slate-50">{calculateTenure(selectedEmployee.joiningDate)}</span>
                </div>
              </div>
            </div>

            {/* Salary Information */}
            <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30">
              <h3 className="text-lg font-semibold text-slate-50 mb-4 flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Salary Breakdown
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Basic Salary</span>
                  <span className="text-slate-50 font-medium">{formatCurrency(selectedEmployee.basicSalary)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">HRA</span>
                  <span className="text-green-400">{formatCurrency(selectedEmployee.allowances.hra)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Transport</span>
                  <span className="text-green-400">{formatCurrency(selectedEmployee.allowances.transport)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Medical</span>
                  <span className="text-green-400">{formatCurrency(selectedEmployee.allowances.medical)}</span>
                </div>
                <div className="flex justify-between border-t border-yellow-400/20 pt-2">
                  <span className="text-slate-400 font-medium">Gross Salary</span>
                  <span className="text-blue-400 font-semibold">{formatCurrency(grossSalary)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Deductions</span>
                  <span className="text-red-400">{formatCurrency(totalDeductions)}</span>
                </div>
                <div className="flex justify-between border-t border-yellow-400/20 pt-2">
                  <span className="text-slate-400 font-medium">Net Salary</span>
                  <span className="text-green-400 font-bold">{formatCurrency(netSalary)}</span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30">
              <h3 className="text-lg font-semibold text-slate-50 mb-4 flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                Contact Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-50">{selectedEmployee.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-50">{selectedEmployee.phone}</span>
                </div>
                {selectedEmployee.alternatePhone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-50">{selectedEmployee.alternatePhone}</span>
                  </div>
                )}
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-50">{selectedEmployee.address}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Building className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-50">{selectedEmployee.city}, {selectedEmployee.state}</span>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30">
              <h3 className="text-lg font-semibold text-slate-50 mb-4 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Emergency Contact
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Name</span>
                  <span className="text-slate-50">{selectedEmployee.emergencyContact.name || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Relationship</span>
                  <span className="text-slate-50 capitalize">{selectedEmployee.emergencyContact.relationship || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Phone</span>
                  <span className="text-slate-50">{selectedEmployee.emergencyContact.phone || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Skills & Qualifications */}
            <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30">
              <h3 className="text-lg font-semibold text-slate-50 mb-4 flex items-center">
                <Star className="h-5 w-5 mr-2" />
                Skills & Qualifications
              </h3>
              <div className="space-y-4">
                {selectedEmployee.skills.length > 0 && (
                  <div>
                    <p className="text-sm text-slate-400 mb-2">Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedEmployee.skills.map((skill, index) => (
                        <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 border border-blue-200">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedEmployee.qualifications.length > 0 && (
                  <div>
                    <p className="text-sm text-slate-400 mb-2">Education:</p>
                    <div className="space-y-2">
                      {selectedEmployee.qualifications.map((qual, index) => (
                        <div key={index} className="p-3 bg-slate-700/30 rounded-lg border border-yellow-400/20">
                          <p className="text-slate-50 font-medium">{qual.degree}</p>
                          <p className="text-slate-400 text-sm">{qual.institution} • {qual.year}</p>
                          {qual.percentage && (
                            <p className="text-slate-400 text-sm">Score: {qual.percentage}%</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'activity':
        if (!selectedEmployee) {
          return (
            <div className="text-center py-12">
              <Activity className="h-12 w-12 mx-auto text-slate-500 mb-4" />
              <h3 className="text-lg font-medium text-slate-50 mb-2">No Employee Selected</h3>
              <p className="text-sm text-slate-400">Select an employee from the table to view activity timeline.</p>
            </div>
          );
        }

        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-slate-50">Activity Timeline for {selectedEmployee.firstName} {selectedEmployee.lastName}</h3>
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

      case 'documents':
        if (!selectedEmployee) {
          return (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-slate-500 mb-4" />
              <h3 className="text-lg font-medium text-slate-50 mb-2">No Employee Selected</h3>
              <p className="text-sm text-slate-400">Select an employee from the table to view documents.</p>
            </div>
          );
        }

        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-slate-50">Documents for {selectedEmployee.firstName} {selectedEmployee.lastName}</h3>
              <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </button>
            </div>
            <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(selectedEmployee.documents).map(([type, url]) => {
                  if (!url) return null;
                  return (
                    <div key={type} className="p-4 bg-slate-700/30 rounded-xl border border-yellow-400/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-slate-50 font-medium capitalize">{type.replace(/([A-Z])/g, ' $1').trim()}</p>
                          <p className="text-slate-400 text-sm">Uploaded</p>
                        </div>
                        <div className="flex space-x-2">
                          <button className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-all">
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {Object.values(selectedEmployee.documents).every(doc => !doc) && (
                  <div className="col-span-2 text-center py-12">
                    <FileText className="h-12 w-12 mx-auto text-slate-500 mb-4" />
                    <h3 className="text-lg font-medium text-slate-50 mb-2">No Documents Uploaded</h3>
                    <p className="text-sm text-slate-400 mb-4">Upload employee documents to get started.</p>
                    <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload First Document
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="flex-shrink-0 bg-slate-800/40 backdrop-blur-xl border-b border-yellow-400/30 p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="p-2 text-slate-400 hover:text-slate-50 hover:bg-slate-700/50 rounded-lg transition-all"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center space-x-4">
            {selectedEmployee && (
              <>
                <div className="h-16 w-16 bg-slate-600/50 rounded-full flex items-center justify-center text-slate-50 font-bold text-xl border border-yellow-400/30">
                  {selectedEmployee.firstName.charAt(0)}{selectedEmployee.lastName.charAt(0)}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-50">{selectedEmployee.firstName} {selectedEmployee.lastName}</h1>
                  <p className="text-slate-400">{selectedEmployee.designation} • {selectedEmployee.department}</p>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedEmployee.status)}`}>
                      {selectedEmployee.status.toUpperCase()}
                    </span>
                    <span className="text-slate-500 text-sm">
                      {selectedEmployee.employeeId} • {selectedEmployee.branch}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        {selectedEmployee && (
          <div className="flex space-x-3">
            <button className="inline-flex items-center px-4 py-2 border border-yellow-400/30 text-sm font-medium rounded-lg text-slate-50 bg-slate-700/50 hover:bg-slate-700 transition-all backdrop-blur-sm">
              <Phone className="h-4 w-4 mr-2" />
              Call
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-yellow-400/30 text-sm font-medium rounded-lg text-slate-50 bg-slate-700/50 hover:bg-slate-700 transition-all backdrop-blur-sm">
              <Mail className="h-4 w-4 mr-2" />
              Email
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-all">
              <Edit className="h-4 w-4 mr-2" />
              Edit Employee
            </button>
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
                    {employees.length}
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
    </div>
  );
};