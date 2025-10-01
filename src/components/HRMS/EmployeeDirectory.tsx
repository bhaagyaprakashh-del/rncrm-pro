import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, CreditCard as Edit, Trash2, Eye, Mail, Phone, MapPin, Calendar, DollarSign, Users, Star, CheckCircle, XCircle, AlertTriangle, Clock, Award, Target, TrendingUp, Filter, Download, Upload, MoreVertical, User, Building, CreditCard, Shield, Flag, Zap, Crown, Briefcase } from 'lucide-react';
import { Employee } from '../../types/hrms';
import toast from 'react-hot-toast';
import { getEmployees, saveEmployees, initializeEmployeesData } from '../../data/employees.mock';


const EmployeeCard: React.FC<{ 
  employee: Employee; 
  onView: (employee: Employee) => void;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
  onToggleStatus: (employee: Employee) => void;
}> = React.memo(({ employee, onView, onEdit, onDelete, onToggleStatus }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'terminated': return 'bg-red-100 text-red-800 border-red-200';
      case 'on-leave': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEmploymentTypeColor = (type: string) => {
    switch (type) {
      case 'permanent': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'contract': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'intern': return 'bg-green-100 text-green-800 border-green-200';
      case 'consultant': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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
      return `${years}y ${months}m`;
    }
    return `${months}m`;
  };

  const grossSalary = employee.basicSalary + 
    employee.allowances.hra + 
    employee.allowances.transport + 
    employee.allowances.medical + 
    employee.allowances.special;

  return (
    <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30 hover:border-yellow-400/50 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 bg-slate-600/50 rounded-full flex items-center justify-center text-slate-50 font-semibold text-lg border border-yellow-400/30">
            {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-50">{employee.firstName} {employee.lastName}</h3>
            <p className="text-sm text-slate-400">{employee.designation}</p>
            <p className="text-xs text-slate-500">{employee.employeeId}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getEmploymentTypeColor(employee.employmentType)}`}>
            {employee.employmentType.toUpperCase()}
          </span>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(employee.status)}`}>
            {employee.status.toUpperCase()}
          </span>
          <button className="p-2 text-slate-400 hover:text-slate-50 hover:bg-slate-700/50 rounded-lg transition-all">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-slate-300">
          <Mail className="h-4 w-4 mr-2 text-slate-500" />
          <span className="truncate">{employee.email}</span>
        </div>
        <div className="flex items-center text-sm text-slate-300">
          <Phone className="h-4 w-4 mr-2 text-slate-500" />
          <span>{employee.phone}</span>
        </div>
        <div className="flex items-center text-sm text-slate-300">
          <Building className="h-4 w-4 mr-2 text-slate-500" />
          <span>{employee.department} • {employee.branch}</span>
        </div>
        <div className="flex items-center text-sm text-slate-300">
          <User className="h-4 w-4 mr-2 text-slate-500" />
          <span>Reports to: {employee.reportingManager}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 pt-4 border-t border-yellow-400/20">
        <div>
          <p className="text-xs text-slate-500">Basic Salary</p>
          <p className="text-lg font-semibold text-green-400">{formatCurrency(employee.basicSalary)}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Gross Salary</p>
          <p className="text-lg font-semibold text-blue-400">{formatCurrency(grossSalary)}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Department</p>
          <p className="text-lg font-semibold text-purple-400">{employee.department}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Tenure</p>
          <p className="text-lg font-semibold text-orange-400">{calculateTenure(employee.joiningDate)}</p>
        </div>
      </div>

      {/* Skills Preview */}
      {employee.skills.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-slate-500 mb-2">Skills:</p>
          <div className="flex flex-wrap gap-1">
            {employee.skills.slice(0, 3).map((skill, index) => (
              <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 border border-blue-200">
                {skill}
              </span>
            ))}
            {employee.skills.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-slate-100 text-slate-800 border border-slate-200">
                +{employee.skills.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center pt-4 border-t border-yellow-400/20">
        <div className="flex items-center text-xs text-slate-500">
          <Calendar className="h-3 w-3 mr-1" />
          <span>Joined {new Date(employee.joiningDate).toLocaleDateString()}</span>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => onView(employee)}
            className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
            title="View Employee Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button 
            onClick={() => onEdit(employee)}
            className="p-2 text-slate-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-all"
            title="Edit Employee"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button 
            onClick={() => onToggleStatus(employee)}
            className={`p-2 text-slate-400 hover:bg-opacity-10 rounded-lg transition-all ${
              employee.status === 'active' 
                ? 'hover:text-yellow-400 hover:bg-yellow-500/10' 
                : 'hover:text-green-400 hover:bg-green-500/10'
            }`}
            title={employee.status === 'active' ? 'Deactivate Employee' : 'Activate Employee'}
          >
            {employee.status === 'active' ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
          </button>
          <button 
            onClick={() => onDelete(employee)}
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
            title="Delete Employee"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
});

export const EmployeeDirectory: React.FC = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>(() => {
    console.log('EmployeeDirectory: Initial load from localStorage...');
    initializeEmployeesData();
    const loadedEmployees = getEmployees();
    console.log('EmployeeDirectory: Initial employees loaded:', loadedEmployees.length);
    return loadedEmployees;
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [filterEmploymentType, setFilterEmploymentType] = useState<string>('all');

  // Listen for employee updates
  React.useEffect(() => {
    const handleEmployeeUpdate = () => {
      console.log('EmployeeDirectory: Storage changed, reloading employees...');
      const updatedEmployees = getEmployees();
      console.log('EmployeeDirectory: Updated employees count:', updatedEmployees.length);
      console.log('EmployeeDirectory: Employee names:', updatedEmployees.map(e => `${e.firstName} ${e.lastName}`));
      setEmployees(updatedEmployees);
    };

    window.addEventListener('storage', handleEmployeeUpdate);
    window.addEventListener('employeesUpdated', handleEmployeeUpdate);
    
    // Also listen for custom events from the same tab
    const handleCustomUpdate = () => {
      console.log('EmployeeDirectory: Custom event triggered, reloading...');
      const updatedEmployees = getEmployees();
      console.log('EmployeeDirectory: Custom update - employees count:', updatedEmployees.length);
      console.log('EmployeeDirectory: Custom update - employee names:', updatedEmployees.map(e => `${e.firstName} ${e.lastName}`));
      setEmployees(updatedEmployees);
    };
    
    window.addEventListener('employeeDataChanged', handleCustomUpdate);
    
    // Force refresh on mount to catch any missed updates
    const currentEmployees = getEmployees();
    if (currentEmployees.length !== employees.length) {
      console.log('EmployeeDirectory: Detected data mismatch, forcing refresh...');
      setEmployees(currentEmployees);
    }
    
    return () => {
      window.removeEventListener('storage', handleEmployeeUpdate);
      window.removeEventListener('employeesUpdated', handleEmployeeUpdate);
      window.removeEventListener('employeeDataChanged', handleCustomUpdate);
    };
  }, [employees.length]);

  // Debug: Log current employees on every render
  React.useEffect(() => {
    console.log('EmployeeDirectory: Current employees in state:', employees.length);
    console.log('EmployeeDirectory: Employee names in state:', employees.map(e => `${e.firstName} ${e.lastName}`));
    
    // Also check localStorage directly
    const storageEmployees = getEmployees();
    console.log('EmployeeDirectory: Employees in localStorage:', storageEmployees.length);
    console.log('EmployeeDirectory: Employee names in localStorage:', storageEmployees.map(e => `${e.firstName} ${e.lastName}`));
  });

  // Force refresh button for debugging
  const handleForceRefresh = () => {
    console.log('EmployeeDirectory: Force refresh triggered...');
    const freshEmployees = getEmployees();
    console.log('EmployeeDirectory: Fresh employees loaded:', freshEmployees.length);
    console.log('EmployeeDirectory: Fresh employee names:', freshEmployees.map(e => `${e.firstName} ${e.lastName}`));
    setEmployees(freshEmployees);
    toast.success(`Refreshed: ${freshEmployees.length} employees loaded`);
  };
  
  // Manual refresh function to check localStorage directly
  const handleCheckStorage = () => {
    const saved = localStorage.getItem('employees_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        console.log('EmployeeDirectory: Direct localStorage check:', parsed.length);
        console.log('EmployeeDirectory: Direct localStorage names:', parsed.map((e: any) => `${e.firstName} ${e.lastName}`));
        toast.success(`Storage check: ${parsed.length} employees in localStorage`);
      } catch (error) {
        toast.error('Error reading localStorage');
      }
    } else {
      toast.error('No employee data in localStorage');
    }
  };

  const filteredEmployees = useMemo(() => employees.filter(employee => {
    const matchesSearch = employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || employee.status === filterStatus;
    const matchesDepartment = filterDepartment === 'all' || employee.department === filterDepartment;
    const matchesEmploymentType = filterEmploymentType === 'all' || employee.employmentType === filterEmploymentType;
    
    return matchesSearch && matchesStatus && matchesDepartment && matchesEmploymentType;
  }), [employees, searchTerm, filterStatus, filterDepartment, filterEmploymentType]);

  const stats = useMemo(() => ({
    total: employees.length,
    active: employees.filter(e => e.status === 'active').length,
    inactive: employees.filter(e => e.status === 'inactive').length,
    terminated: employees.filter(e => e.status === 'terminated').length,
    onLeave: employees.filter(e => e.status === 'on-leave').length,
    permanent: employees.filter(e => e.employmentType === 'permanent').length,
    contract: employees.filter(e => e.employmentType === 'contract').length,
    intern: employees.filter(e => e.employmentType === 'intern').length,
    consultant: employees.filter(e => e.employmentType === 'consultant').length,
    totalSalary: employees.reduce((sum, e) => sum + e.basicSalary, 0),
    avgSalary: employees.length > 0 ? employees.reduce((sum, e) => sum + e.basicSalary, 0) / employees.length : 0
  }), [employees]);

  const uniqueDepartments = useMemo(() => [...new Set(employees.map(e => e.department).filter(Boolean))], [employees]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleViewEmployee = (employee: Employee) => {
    navigate(`/hrms-employee-360?id=${employee.id}&name=${encodeURIComponent(employee.firstName + ' ' + employee.lastName)}`);
  };

  const handleEditEmployee = (employee: Employee) => {
    navigate(`/hrms-employee-360?id=${employee.id}&edit=true`);
  };

  const handleDeleteEmployee = (employee: Employee) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${employee.firstName} ${employee.lastName}? This action cannot be undone.`
    );
    
    if (confirmDelete) {
      try {
        // Update employees using the centralized function
        const allEmployees = getEmployees();
        const updatedEmployees = allEmployees.filter(emp => emp.id !== employee.id);
        saveEmployees(updatedEmployees);
        
        // Update local state
        setEmployees(updatedEmployees);
        
        toast.success(`${employee.firstName} ${employee.lastName} deleted successfully`);
      } catch (error) {
        console.error('Error deleting employee:', error);
        toast.error('Failed to delete employee. Please try again.');
      }
    }
  };

  const handleToggleStatus = (employee: Employee) => {
    const newStatus = employee.status === 'active' ? 'inactive' : 'active';
    const action = newStatus === 'active' ? 'activated' : 'deactivated';
    
    try {
      // Update employee status
      const updatedEmployee = {
        ...employee,
        status: newStatus,
        updatedAt: new Date().toISOString(),
        updatedBy: 'current-user@ramnirmalchits.com'
      };
      
      // Update employees using the centralized function
      const allEmployees = getEmployees();
      const updatedEmployees = allEmployees.map(emp => 
        emp.id === employee.id ? updatedEmployee : emp
      );
      saveEmployees(updatedEmployees);
      
      // Update local state
      setEmployees(updatedEmployees);
      
      toast.success(`${employee.firstName} ${employee.lastName} ${action} successfully`);
    } catch (error) {
      console.error('Error updating employee status:', error);
      toast.error('Failed to update employee status. Please try again.');
    }
  };

  const handleAddEmployee = () => {
    navigate('/hrms-new-employee');
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-yellow-400/30 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">Employee Directory</h1>
          <p className="mt-1 text-sm text-slate-400">
            Comprehensive employee management with profiles and organizational structure
          </p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handleForceRefresh}
            className="inline-flex items-center px-4 py-2 border border-green-400/30 text-sm font-medium rounded-lg text-green-400 bg-slate-700/50 hover:bg-slate-700 transition-all backdrop-blur-sm"
          >
            🔄 Force Refresh ({employees.length})
          </button>
          <button 
            onClick={handleCheckStorage}
            className="inline-flex items-center px-4 py-2 border border-blue-400/30 text-sm font-medium rounded-lg text-blue-400 bg-slate-700/50 hover:bg-slate-700 transition-all backdrop-blur-sm"
          >
            🔍 Check Storage
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-yellow-400/30 text-sm font-medium rounded-lg text-slate-50 bg-slate-700/50 hover:bg-slate-700 transition-all backdrop-blur-sm">
            <Upload className="h-4 w-4 mr-2" />
            Import Employees
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-yellow-400/30 text-sm font-medium rounded-lg text-slate-50 bg-slate-700/50 hover:bg-slate-700 transition-all backdrop-blur-sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button 
            onClick={handleAddEmployee}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-all"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Employee
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-none">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-10 gap-4">
          <div className="bg-slate-800/40 backdrop-blur-xl p-4 rounded-xl border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Employees</p>
                <p className="text-2xl font-bold text-slate-50">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl p-4 rounded-xl border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Active</p>
                <p className="text-2xl font-bold text-green-400">{stats.active}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl p-4 rounded-xl border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Inactive</p>
                <p className="text-2xl font-bold text-gray-400">{stats.inactive}</p>
              </div>
              <XCircle className="h-8 w-8 text-gray-400" />
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl p-4 rounded-xl border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">On Leave</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.onLeave}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-400" />
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl p-4 rounded-xl border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Permanent</p>
                <p className="text-2xl font-bold text-blue-400">{stats.permanent}</p>
              </div>
              <Shield className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl p-4 rounded-xl border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Contract</p>
                <p className="text-2xl font-bold text-purple-400">{stats.contract}</p>
              </div>
              <CreditCard className="h-8 w-8 text-purple-400" />
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl p-4 rounded-xl border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Interns</p>
                <p className="text-2xl font-bold text-green-400">{stats.intern}</p>
              </div>
              <Star className="h-8 w-8 text-green-400" />
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl p-4 rounded-xl border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Consultants</p>
                <p className="text-2xl font-bold text-orange-400">{stats.consultant}</p>
              </div>
              <Briefcase className="h-8 w-8 text-orange-400" />
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl p-4 rounded-xl border border-yellow-400/30 md:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Avg Salary</p>
                <p className="text-xl font-bold text-emerald-400">{formatCurrency(stats.avgSalary)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-800/40 backdrop-blur-xl rounded-xl p-4 border border-yellow-400/30">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
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
            <select
              value={filterEmploymentType}
              onChange={(e) => setFilterEmploymentType(e.target.value)}
              className="px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm"
            >
              <option value="all">All Types</option>
              <option value="permanent">Permanent</option>
              <option value="contract">Contract</option>
              <option value="intern">Intern</option>
              <option value="consultant">Consultant</option>
            </select>
            <div className="text-sm text-slate-400">
              Showing: <span className="font-semibold text-slate-50">{filteredEmployees.length}</span> employees
            </div>
          </div>
        </div>

        {/* Employees Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => (
            <EmployeeCard 
              key={employee.id} 
              employee={employee}
              onView={handleViewEmployee}
              onEdit={handleEditEmployee}
              onDelete={handleDeleteEmployee}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>

        {filteredEmployees.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 mx-auto text-slate-500 mb-4" />
            <h3 className="text-lg font-medium text-slate-50 mb-2">No employees found</h3>
            <p className="text-sm text-slate-400">Try adjusting your search criteria or add a new employee.</p>
          </div>
        )}
      </div>
    </div>
  );
};