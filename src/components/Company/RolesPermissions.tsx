import React, { useState, useEffect } from 'react';
import { Shield, Plus, Search, CreditCard as Edit3, Trash2, Users, Key, Lock, Check, X, Save, Eye, ChevronDown, ChevronRight } from 'lucide-react';
import { navigation } from '../../config/navigation';
import toast from 'react-hot-toast';

interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
  page?: string;
  action: 'view' | 'edit' | 'delete' | 'create';
}

interface Role {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissions: string[];
  status: 'active' | 'inactive';
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ModulePermission {
  moduleId: string;
  moduleName: string;
  moduleIcon: any;
  hasAccess: boolean;
  pages: {
    pageId: string;
    pageName: string;
    pageIcon: any;
    permissions: {
      view: boolean;
      edit: boolean;
      delete: boolean;
      create: boolean;
    };
  }[];
}

// Generate comprehensive permissions from navigation structure
const generatePermissionsFromNavigation = (): Permission[] => {
  const permissions: Permission[] = [];
  
  navigation.forEach(module => {
    // Module-level view permission
    permissions.push({
      id: `${module.id}.view`,
      name: `View ${module.name}`,
      description: `Access to ${module.name} module`,
      module: module.name,
      action: 'view'
    });

    // Page-level permissions
    if (module.children) {
      module.children.forEach(page => {
        // View permission (always available)
        permissions.push({
          id: `${page.id}.view`,
          name: `View ${page.name}`,
          description: `View access to ${page.name}`,
          module: module.name,
          page: page.name,
          action: 'view'
        });

        // Edit permission
        permissions.push({
          id: `${page.id}.edit`,
          name: `Edit ${page.name}`,
          description: `Edit access to ${page.name}`,
          module: module.name,
          page: page.name,
          action: 'edit'
        });

        // Create permission
        permissions.push({
          id: `${page.id}.create`,
          name: `Create in ${page.name}`,
          description: `Create new records in ${page.name}`,
          module: module.name,
          page: page.name,
          action: 'create'
        });

        // Delete permission
        permissions.push({
          id: `${page.id}.delete`,
          name: `Delete in ${page.name}`,
          description: `Delete records in ${page.name}`,
          module: module.name,
          page: page.name,
          action: 'delete'
        });
      });
    }
  });

  return permissions;
};

const CreateRoleModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (roleData: any) => void;
  editingRole?: Role | null;
}> = ({ isOpen, onClose, onSave, editingRole }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active' as 'active' | 'inactive'
  });
  const [modulePermissions, setModulePermissions] = useState<ModulePermission[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isOpen) {
      if (editingRole) {
        setFormData({
          name: editingRole.name,
          description: editingRole.description,
          status: editingRole.status
        });
        loadExistingPermissions(editingRole.permissions);
      } else {
        setFormData({
          name: '',
          description: '',
          status: 'active'
        });
        initializeModulePermissions();
      }
      // Expand all modules by default for better UX
      setExpandedModules(new Set(navigation.map(m => m.id)));
    }
  }, [editingRole, isOpen]);

  const initializeModulePermissions = () => {
    const modulePerms: ModulePermission[] = navigation.map(module => ({
      moduleId: module.id,
      moduleName: module.name,
      moduleIcon: module.icon,
      hasAccess: false,
      pages: (module.children || []).map(page => ({
        pageId: page.id,
        pageName: page.name,
        pageIcon: page.icon,
        permissions: {
          view: false,
          edit: false,
          delete: false,
          create: false
        }
      }))
    }));
    setModulePermissions(modulePerms);
  };

  const loadExistingPermissions = (permissions: string[]) => {
    const modulePerms: ModulePermission[] = navigation.map(module => {
      const hasModuleAccess = permissions.includes(`${module.id}.view`);
      const pages = (module.children || []).map(page => ({
        pageId: page.id,
        pageName: page.name,
        pageIcon: page.icon,
        permissions: {
          view: permissions.includes(`${page.id}.view`),
          edit: permissions.includes(`${page.id}.edit`),
          delete: permissions.includes(`${page.id}.delete`),
          create: permissions.includes(`${page.id}.create`)
        }
      }));

      return {
        moduleId: module.id,
        moduleName: module.name,
        moduleIcon: module.icon,
        hasAccess: hasModuleAccess || pages.some(p => Object.values(p.permissions).some(Boolean)),
        pages
      };
    });
    setModulePermissions(modulePerms);
  };

  const handleModuleAccessToggle = (moduleId: string, hasAccess: boolean) => {
    setModulePermissions(prev => 
      prev.map(module => 
        module.moduleId === moduleId
          ? {
              ...module,
              hasAccess,
              pages: module.pages.map(page => ({
                ...page,
                permissions: {
                  view: hasAccess,
                  edit: hasAccess,
                  delete: hasAccess,
                  create: hasAccess
                }
              }))
            }
          : module
      )
    );
  };

  const handleModulePermissionToggle = (moduleId: string, action: 'view' | 'edit' | 'delete' | 'create', checked: boolean) => {
    setModulePermissions(prev => 
      prev.map(module => 
        module.moduleId === moduleId
          ? {
              ...module,
              pages: module.pages.map(page => ({
                ...page,
                permissions: {
                  ...page.permissions,
                  [action]: checked
                }
              }))
            }
          : module
      )
    );
  };

  const handlePagePermissionToggle = (moduleId: string, pageId: string, action: 'view' | 'edit' | 'delete' | 'create', checked: boolean) => {
    setModulePermissions(prev => 
      prev.map(module => 
        module.moduleId === moduleId
          ? {
              ...module,
              pages: module.pages.map(page => 
                page.pageId === pageId
                  ? {
                      ...page,
                      permissions: {
                        ...page.permissions,
                        [action]: checked
                      }
                    }
                  : page
              )
            }
          : module
      )
    );

    // Update module access based on page permissions
    setModulePermissions(prev => 
      prev.map(module => 
        module.moduleId === moduleId
          ? {
              ...module,
              hasAccess: module.pages.some(p => Object.values(p.permissions).some(Boolean))
            }
          : module
      )
    );
  };

  const toggleModuleExpansion = (moduleId: string) => {
    setExpandedModules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Role name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    // Collect all selected permissions
    const selectedPermissions: string[] = [];
    
    modulePermissions.forEach(module => {
      // Add module-level permission if module has access
      if (module.hasAccess) {
        selectedPermissions.push(`${module.moduleId}.view`);
      }
      
      // Add page-level permissions
      module.pages.forEach(page => {
        Object.entries(page.permissions).forEach(([action, enabled]) => {
          if (enabled) {
            selectedPermissions.push(`${page.pageId}.${action}`);
          }
        });
      });
    });

    const roleData = {
      ...formData,
      permissions: selectedPermissions,
      id: editingRole?.id || `role_${Date.now()}`,
      userCount: editingRole?.userCount || 0,
      isSystem: editingRole?.isSystem || false,
      createdAt: editingRole?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(roleData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="relative bg-slate-800/90 backdrop-blur-xl border border-yellow-400/40 rounded-2xl shadow-2xl p-6 w-full max-w-7xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-slate-50">
            {editingRole ? 'Edit Role' : 'Create New Role'}
          </h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-50 hover:bg-slate-700/50 rounded-lg transition-all">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Role Information */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-50 mb-2">Role Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={`w-full px-3 py-2 bg-slate-700/50 border rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm ${
                  errors.name ? 'border-red-500' : 'border-yellow-400/30'
                }`}
                placeholder="Enter role name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-50 mb-2">Description *</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className={`w-full px-3 py-2 bg-slate-700/50 border rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm ${
                  errors.description ? 'border-red-500' : 'border-yellow-400/30'
                }`}
                placeholder="Describe the role responsibilities"
              />
              {errors.description && <p className="mt-1 text-sm text-red-400">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-50 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' }))}
                className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Permission Summary</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p>Modules with Access: {modulePermissions.filter(m => m.hasAccess).length}</p>
                <p>Total Permissions: {modulePermissions.reduce((sum, m) => sum + m.pages.reduce((pageSum, p) => pageSum + Object.values(p.permissions).filter(Boolean).length, 0), 0)}</p>
                <p>Pages Accessible: {modulePermissions.reduce((sum, m) => sum + m.pages.filter(p => Object.values(p.permissions).some(Boolean)).length, 0)}</p>
              </div>
            </div>
          </div>

          {/* Permissions Grid */}
          <div className="lg:col-span-3">
            <h4 className="text-lg font-semibold text-slate-50 mb-4">Module & Page Permissions</h4>
            <div className="space-y-4 max-h-[600px] overflow-y-auto scrollbar-none">
              {modulePermissions.map((module) => {
                const isExpanded = expandedModules.has(module.moduleId);
                const ModuleIcon = module.moduleIcon;
                
                return (
                  <div key={module.moduleId} className="bg-slate-700/30 rounded-xl border border-yellow-400/20">
                    {/* Module Header */}
                    <div className="p-4 border-b border-yellow-400/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => toggleModuleExpansion(module.moduleId)}
                            className="flex items-center space-x-2 text-slate-50 hover:text-blue-400 transition-colors"
                          >
                            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                            <ModuleIcon className="h-5 w-5 text-blue-400" />
                            <span className="font-medium">{module.moduleName}</span>
                            <span className="text-xs text-slate-400">({module.pages.length} pages)</span>
                          </button>
                          
                          {/* Module Access Toggle */}
                          <label className="flex items-center space-x-2 ml-4">
                            <input
                              type="checkbox"
                              checked={module.hasAccess}
                              onChange={(e) => handleModuleAccessToggle(module.moduleId, e.target.checked)}
                              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                            <span className="text-green-400 text-sm font-medium">✓ Module Access</span>
                          </label>
                        </div>
                        
                        {/* Module-level permission controls */}
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <label className="flex items-center space-x-1 text-xs text-slate-300">
                              <input
                                type="checkbox"
                                checked={module.pages.every(p => p.permissions.view)}
                                onChange={(e) => handleModulePermissionToggle(module.moduleId, 'view', e.target.checked)}
                                className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <span>All View</span>
                            </label>
                            <label className="flex items-center space-x-1 text-xs text-slate-300">
                              <input
                                type="checkbox"
                                checked={module.pages.every(p => p.permissions.edit)}
                                onChange={(e) => handleModulePermissionToggle(module.moduleId, 'edit', e.target.checked)}
                                className="h-3 w-3 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                              />
                              <span>All Edit</span>
                            </label>
                            <label className="flex items-center space-x-1 text-xs text-slate-300">
                              <input
                                type="checkbox"
                                checked={module.pages.every(p => p.permissions.create)}
                                onChange={(e) => handleModulePermissionToggle(module.moduleId, 'create', e.target.checked)}
                                className="h-3 w-3 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                              />
                              <span>All Create</span>
                            </label>
                            <label className="flex items-center space-x-1 text-xs text-slate-300">
                              <input
                                type="checkbox"
                                checked={module.pages.every(p => p.permissions.delete)}
                                onChange={(e) => handleModulePermissionToggle(module.moduleId, 'delete', e.target.checked)}
                                className="h-3 w-3 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                              />
                              <span>All Delete</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Pages */}
                    {isExpanded && (
                      <div className="p-4 space-y-3">
                        {module.pages.map((page) => {
                          const PageIcon = page.pageIcon;
                          return (
                            <div key={page.pageId} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-yellow-400/20">
                              <div className="flex items-center space-x-3">
                                <PageIcon className="h-4 w-4 text-slate-400" />
                                <div>
                                  <p className="text-slate-50 font-medium text-sm">{page.pageName}</p>
                                  <p className="text-slate-400 text-xs">{page.pageId}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-4">
                                <label className="flex items-center space-x-1">
                                  <input
                                    type="checkbox"
                                    checked={page.permissions.view}
                                    onChange={(e) => handlePagePermissionToggle(module.moduleId, page.pageId, 'view', e.target.checked)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                  />
                                  <span className="text-blue-400 text-sm">View</span>
                                </label>
                                <label className="flex items-center space-x-1">
                                  <input
                                    type="checkbox"
                                    checked={page.permissions.edit}
                                    onChange={(e) => handlePagePermissionToggle(module.moduleId, page.pageId, 'edit', e.target.checked)}
                                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                  />
                                  <span className="text-green-400 text-sm">Edit</span>
                                </label>
                                <label className="flex items-center space-x-1">
                                  <input
                                    type="checkbox"
                                    checked={page.permissions.create}
                                    onChange={(e) => handlePagePermissionToggle(module.moduleId, page.pageId, 'create', e.target.checked)}
                                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                  />
                                  <span className="text-purple-400 text-sm">Create</span>
                                </label>
                                <label className="flex items-center space-x-1">
                                  <input
                                    type="checkbox"
                                    checked={page.permissions.delete}
                                    onChange={(e) => handlePagePermissionToggle(module.moduleId, page.pageId, 'delete', e.target.checked)}
                                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                  />
                                  <span className="text-red-400 text-sm">Delete</span>
                                </label>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-yellow-400/30">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700/50 border border-yellow-400/30 rounded-lg hover:bg-slate-700 transition-all backdrop-blur-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="inline-flex items-center px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 transition-all"
          >
            <Save className="h-4 w-4 mr-2" />
            {editingRole ? 'Update Role' : 'Create Role'}
          </button>
        </div>
      </div>
    </div>
  );
};

export const RolesPermissions: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [permissions] = useState<Permission[]>(() => generatePermissionsFromNavigation());
  const [roles, setRoles] = useState<Role[]>(() => {
    // Load roles from localStorage or initialize with defaults
    const saved = localStorage.getItem('roles_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : getDefaultRoles();
      } catch (error) {
        console.error('Failed to load roles:', error);
        return getDefaultRoles();
      }
    }
    return getDefaultRoles();
  });

  function getDefaultRoles(): Role[] {
    return [
      {
        id: 'role_admin',
        name: 'Super Admin',
        description: 'Full system access with all permissions',
        userCount: 2,
        permissions: permissions.map(p => p.id),
        status: 'active',
        isSystem: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      },
      {
        id: 'role_manager',
        name: 'Manager',
        description: 'Management level access for operations',
        userCount: 8,
        permissions: [
          'dashboard.view', 'leads.view', 'leads-all.view', 'leads-all.edit', 'leads-all.create',
          'subscribers.view', 'subscribers-all.view', 'subscribers-all.edit', 'chit-groups.view', 'chit-list.view',
          'employees-hrms.view', 'hrms-directory.view', 'reports-hub.view', 'reports-dashboard.view'
        ],
        status: 'active',
        isSystem: false,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      },
      {
        id: 'role_employee',
        name: 'Employee',
        description: 'Standard employee access',
        userCount: 25,
        permissions: [
          'dashboard.view', 'leads.view', 'leads-all.view', 'leads-all.create',
          'tasks.view', 'tasks-my.view', 'calendar.view', 'calendar-my.view', 
          'reports-hub.view', 'reports-dashboard.view'
        ],
        status: 'active',
        isSystem: false,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      },
      {
        id: 'role_agent',
        name: 'Agent',
        description: 'Field agent with limited access',
        userCount: 15,
        permissions: [
          'dashboard.view', 'leads.view', 'leads-all.view', 'leads-all.create',
          'agents.view', 'agents-directory.view', 'agents-diary.view', 'agents-diary.edit'
        ],
        status: 'active',
        isSystem: false,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      }
    ];
  }

  const filteredRoles = roles.filter(role => {
    const matchesSearch = role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         role.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || role.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getPermissionsByModule = () => {
    if (!selectedRole) return {};
    
    const role = roles.find(r => r.id === selectedRole);
    if (!role) return {};

    const grouped = permissions.reduce((acc, permission) => {
      if (role.permissions.includes(permission.id)) {
        if (!acc[permission.module]) {
          acc[permission.module] = [];
        }
        acc[permission.module].push(permission);
      }
      return acc;
    }, {} as Record<string, Permission[]>);
    
    return grouped;
  };

  const handleCreateRole = () => {
    setEditingRole(null);
    setShowCreateModal(true);
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setShowCreateModal(true);
  };

  const handleSaveRole = (roleData: any) => {
    let updatedRoles;
    
    if (editingRole) {
      // Update existing role
      updatedRoles = roles.map(role => 
        role.id === editingRole.id ? roleData : role
      );
      toast.success(`Role "${roleData.name}" updated successfully!`);
    } else {
      // Create new role
      updatedRoles = [...roles, roleData];
      toast.success(`Role "${roleData.name}" created successfully!`);
    }
    
    setRoles(updatedRoles);
    localStorage.setItem('roles_data', JSON.stringify(updatedRoles));
    
    // Update user permissions if they have this role
    updateUserPermissions(roleData);
    
    setShowCreateModal(false);
    setEditingRole(null);
  };

  const updateUserPermissions = (roleData: any) => {
    // Update users with this role to have the new permissions
    const usersData = localStorage.getItem('users_data');
    if (usersData) {
      try {
        const users = JSON.parse(usersData);
        const updatedUsers = users.map((user: any) => {
          if (user.role === roleData.name || user.category === roleData.name) {
            return {
              ...user,
              permissions: roleData.permissions
            };
          }
          return user;
        });
        localStorage.setItem('users_data', JSON.stringify(updatedUsers));
        window.dispatchEvent(new CustomEvent('usersUpdated'));
        window.dispatchEvent(new CustomEvent('permissionsUpdated'));
      } catch (error) {
        console.error('Failed to update user permissions:', error);
      }
    }
  };

  const handleDeleteRole = (role: Role) => {
    if (role.isSystem) {
      toast.error('Cannot delete system roles');
      return;
    }

    const confirmDelete = window.confirm(`Are you sure you want to delete the role "${role.name}"? This action cannot be undone.`);
    if (confirmDelete) {
      const updatedRoles = roles.filter(r => r.id !== role.id);
      setRoles(updatedRoles);
      localStorage.setItem('roles_data', JSON.stringify(updatedRoles));
      toast.success(`Role "${role.name}" deleted successfully!`);
    }
  };

  const stats = {
    total: roles.length,
    active: roles.filter(r => r.status === 'active').length,
    inactive: roles.filter(r => r.status === 'inactive').length,
    totalUsers: roles.reduce((sum, r) => sum + r.userCount, 0),
    totalPermissions: permissions.length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Roles & Permissions</h1>
          <p className="text-slate-400 mt-1">Manage user roles and granular access permissions</p>
        </div>
        <button 
          onClick={handleCreateRole}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition-colors font-medium"
        >
          <Plus className="h-4 w-4" />
          Create Role
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Roles</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <Shield className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Active Roles</p>
              <p className="text-2xl font-bold text-green-400">{stats.active}</p>
            </div>
            <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Permissions</p>
              <p className="text-2xl font-bold text-white">{stats.totalPermissions}</p>
            </div>
            <Key className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
            </div>
            <Users className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Modules</p>
              <p className="text-2xl font-bold text-white">{navigation.length}</p>
            </div>
            <Shield className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search roles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Roles List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Roles ({filteredRoles.length})</h2>
          
          {filteredRoles.map((role) => (
            <div 
              key={role.id} 
              className={`bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 hover:border-slate-600/50 transition-colors cursor-pointer ${
                selectedRole === role.id ? 'ring-2 ring-yellow-500/50' : ''
              }`}
              onClick={() => setSelectedRole(role.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-700/50 rounded-lg flex items-center justify-center">
                    <Shield className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      {role.name}
                      {role.isSystem && (
                        <Lock className="h-4 w-4 text-slate-400" title="System Role" />
                      )}
                    </h3>
                    <p className="text-slate-400 text-sm">{role.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${role.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-300 text-sm">{role.userCount} users</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Key className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-300 text-sm">{role.permissions.length} permissions</span>
                  </div>
                </div>

                {!role.isSystem && (
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditRole(role);
                      }}
                      className="p-1 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded transition-colors"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteRole(role);
                      }}
                      className="p-1 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Permissions Detail */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">
            {selectedRole ? `Permissions for ${roles.find(r => r.id === selectedRole)?.name}` : 'Select a role to view permissions'}
          </h2>
          
          {selectedRole ? (
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
              <div className="space-y-6">
                {Object.entries(getPermissionsByModule()).map(([module, modulePermissions]) => (
                  <div key={module}>
                    <h3 className="text-lg font-medium text-white mb-3 flex items-center">
                      <Shield className="h-4 w-4 mr-2 text-yellow-500" />
                      {module}
                    </h3>
                    <div className="space-y-2">
                      {modulePermissions.map((permission) => (
                        <div key={permission.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                          <div>
                            <p className="text-white text-sm font-medium">{permission.name}</p>
                            <p className="text-slate-400 text-xs">{permission.description}</p>
                            {permission.page && (
                              <p className="text-slate-500 text-xs">Page: {permission.page}</p>
                            )}
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            permission.action === 'view' ? 'bg-blue-100 text-blue-800' :
                            permission.action === 'edit' ? 'bg-green-100 text-green-800' :
                            permission.action === 'create' ? 'bg-purple-100 text-purple-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {permission.action.toUpperCase()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-12 text-center">
              <Shield className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-400">Select a role from the left to view its permissions</p>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Role Modal */}
      <CreateRoleModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setEditingRole(null);
        }}
        onSave={handleSaveRole}
        editingRole={editingRole}
      />
    </div>
  );
};