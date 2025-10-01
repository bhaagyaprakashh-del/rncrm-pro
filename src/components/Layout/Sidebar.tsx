import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, ChevronRight, Shield } from 'lucide-react';
import { NavigationItem, navigation } from '../../config/navigation';
import { getRouteByPath } from '../../config/routes';
import { useAuth, AppRole } from '../../contexts/AuthContext';
import { useEffect, useMemo } from 'react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapsed: () => void;
}

interface FlyoutPanelProps {
  item: NavigationItem;
  isOpen: boolean;
  onClose: () => void;
  position: { top: number; left: number };
}

const getVisibleNavigation = (permissions: string[]): NavigationItem[] => {
  console.log('Sidebar: Filtering navigation with permissions:', permissions);
  
  // If user has admin permissions or wildcard, show everything
  if (permissions.includes('*') || permissions.includes('admin.*')) {
    console.log('Sidebar: User has admin access, showing all navigation');
    return navigation;
  }

  // Filter modules based on permissions
  const filteredNav = navigation.filter(module => {
    // Check if user has module-level access
    const hasModuleAccess = permissions.includes(`${module.id}.view`);
    
    // Check if user has access to any pages in this module
    const hasPageAccess = module.children?.some(page => 
      permissions.includes(`${page.id}.view`)
    );
    
    const shouldShow = hasModuleAccess || hasPageAccess;
    console.log(`Sidebar: Module ${module.name} - hasModuleAccess: ${hasModuleAccess}, hasPageAccess: ${hasPageAccess}, shouldShow: ${shouldShow}`);
    
    return shouldShow;
  });

  // Filter children based on page-level permissions
  const result = filteredNav.map(module => ({
    ...module,
    children: module.children?.filter(page => {
      const hasAccess = permissions.includes(`${page.id}.view`);
      console.log(`Sidebar: Page ${page.name} - hasAccess: ${hasAccess}`);
      return hasAccess;
    })
  }));
  
  console.log('Sidebar: Final filtered navigation:', result.map(m => ({ name: m.name, children: m.children?.length || 0 })));
  return result;
};

const FlyoutPanel: React.FC<FlyoutPanelProps> = ({ item, isOpen, onClose, position }) => {
  const navigate = useNavigate();
  const location = useLocation();

  if (!isOpen || !item.children) return null;

  const handleSubPageClick = (subPageId: string) => {
    const route = getRouteByPath(`/${subPageId}`);
    if (route) {
      navigate(route.path);
    } else {
      console.warn(`Route not found for: /${subPageId}`);
      navigate(`/${subPageId}`);
    }
    onClose();
  };

  const currentPath = location.pathname.slice(1);

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />
      
      {/* Flyout Panel */}
      <div 
        className="fixed z-50 w-80 bg-slate-800/80 backdrop-blur-xl border border-yellow-400/40 rounded-2xl shadow-2xl overflow-hidden"
        style={{
          top: position.top,
          left: position.left,
          maxHeight: 'calc(100vh - 100px)'
        }}
      >
        {/* Header */}
        <div className="p-4 border-b border-yellow-400/30">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 rounded-lg border border-yellow-400/30">
              <item.icon className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-slate-50 font-semibold">{item.name}</h3>
              <p className="text-slate-400 text-sm">{item.children.length} pages available</p>
            </div>
          </div>
        </div>

        {/* Sub-pages */}
        <div className="p-2 max-h-96 overflow-y-auto scrollbar-none">
          {item.children.map((subPage) => {
            const SubIcon = subPage.icon;
            const isActive = currentPath === subPage.id;
            
            return (
              <button
                key={subPage.id}
                onClick={() => handleSubPageClick(subPage.id)}
                className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all group ${
                  isActive 
                    ? 'bg-blue-500/20 text-blue-400 border border-yellow-400/50' 
                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-slate-50 border border-transparent hover:border-yellow-400/30'
                }`}
              >
                <div className={`p-2 rounded-lg transition-all ${
                  isActive 
                    ? 'bg-blue-500/30 border border-yellow-400/40' 
                    : 'bg-slate-700/50 border border-yellow-400/20 group-hover:bg-slate-600/50'
                }`}>
                  <SubIcon className={`h-4 w-4 ${isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-300'}`} />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium">{subPage.name}</p>
                </div>
                <ChevronRight className={`h-4 w-4 transition-all ${
                  isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'
                }`} />
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

const SidebarItem: React.FC<{
  item: NavigationItem;
  isCollapsed: boolean;
  onOpenFlyout: (item: NavigationItem, position: { top: number; left: number }) => void;
}> = ({ item, isCollapsed, onOpenFlyout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const Icon = item.icon;
  const currentPath = location.pathname.slice(1);
  const isActive = currentPath === item.id || (item.children && item.children.some(child => currentPath === child.id));

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (item.children && item.children.length > 0) {
      // Open flyout for modules with children
      const rect = event.currentTarget.getBoundingClientRect();
      const position = {
        top: rect.top,
        left: rect.right + 8
      };
      onOpenFlyout(item, position);
    } else {
      // Direct navigation for modules without children
      const route = getRouteByPath(`/${item.id}`);
      if (route) {
        navigate(route.path);
      } else {
        console.warn(`Route not found for: /${item.id}`);
        navigate(`/${item.id}`);
      }
    }
  };

  const itemClasses = `
    group flex items-center w-full text-left ${isCollapsed ? 'px-2 py-3 justify-center' : 'px-4 py-3'} text-sm font-medium rounded-xl transition-all duration-200 mb-2
    ${isActive 
      ? 'bg-blue-500/20 text-blue-400 border border-yellow-400/50 backdrop-blur-sm shadow-lg' 
      : 'text-slate-300 hover:bg-slate-700/50 hover:text-slate-50 border border-yellow-400/20 hover:border-yellow-400/40 backdrop-blur-sm'
    }
  `;

  const iconClasses = `
    flex-shrink-0 h-5 w-5 transition-colors duration-200 ${isCollapsed ? '' : 'mr-3'}
    ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}
  `;

  return (
    <button onClick={handleClick} className={itemClasses} title={isCollapsed ? item.name : undefined}>
      <Icon className={iconClasses} />
      {!isCollapsed && (
        <>
          <span className="flex-1 truncate text-left">{item.name}</span>
          {item.children && item.children.length > 0 && (
            <ChevronRight className={`h-4 w-4 transition-colors ${
              isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'
            }`} />
          )}
        </>
      )}
    </button>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapsed
}) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [flyoutItem, setFlyoutItem] = useState<NavigationItem | null>(null);
  const [flyoutPosition, setFlyoutPosition] = useState({ top: 0, left: 0 });
  const [userAvatar, setUserAvatar] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      const savedAvatar = localStorage.getItem(`user_avatar_${user.id}`);
      setUserAvatar(savedAvatar);
    }
  }, [user?.id]);

  // Listen for permission updates
  useEffect(() => {
    const handlePermissionUpdate = () => {
      console.log('Sidebar: Permissions updated, refreshing navigation...');
      // Force re-render by updating a state that triggers navigation recalculation
      setSearchTerm(prev => prev); // Trigger re-render
    };

    window.addEventListener('permissionsUpdated', handlePermissionUpdate);
    window.addEventListener('usersUpdated', handlePermissionUpdate);
    
    return () => {
      window.removeEventListener('permissionsUpdated', handlePermissionUpdate);
      window.removeEventListener('usersUpdated', handlePermissionUpdate);
    };
  }, []);

  const visibleNavigation = useMemo(() => {
    if (!user) {
      console.log('Sidebar: No user, showing empty navigation');
      return [];
    }
    
    console.log('Sidebar: User permissions:', user.permissions);
    return getVisibleNavigation(user.permissions);
  }, [user?.permissions, user?.id]);

  const handleOpenFlyout = (item: NavigationItem, position: { top: number; left: number }) => {
    setFlyoutItem(item);
    setFlyoutPosition(position);
  };

  const handleCloseFlyout = () => {
    setFlyoutItem(null);
  };

  const filteredNavigation = visibleNavigation.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  console.log('Sidebar: Rendering with filtered navigation:', filteredNavigation.map(n => n.name));

  return (
    <>
      <div className={`${isCollapsed ? 'w-16' : 'w-80'} bg-slate-900/95 border-r border-yellow-400/30 flex flex-col h-full shadow-xl backdrop-blur-xl transition-all duration-300`}>
        {/* User Profile Section */}
        <div className={`${isCollapsed ? 'p-3' : 'p-6'} border-b border-yellow-400/30 transition-all duration-300`}>
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} mb-4`}>
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={user?.name || 'User'}
                className="h-12 w-12 rounded-full object-cover border-2 border-yellow-400/40 shadow-lg"
              />
            ) : (
              <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center border border-yellow-400/40 shadow-lg">
                <span className="text-slate-50 text-lg font-semibold">
                  {user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'U'}
                </span>
              </div>
            )}
            {!isCollapsed && (
              <div className="transition-opacity duration-300">
                <h3 className="text-slate-50 font-semibold">{user?.name || 'User'}</h3>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-emerald-400 rounded-full shadow-sm"></div>
                  <span className="text-emerald-400 text-sm capitalize">{user?.role || 'User'}</span>
                </div>
              </div>
            )}
          </div>

          {/* Search */}
          {!isCollapsed && (
            <div className="relative transition-opacity duration-300">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 h-4 w-4" />
              <input
                type="text"
                placeholder="Search modules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-12 py-2.5 bg-slate-800/60 border border-yellow-400/30 rounded-lg text-sm text-slate-50 placeholder-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full transition-all backdrop-blur-sm"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <kbd className="px-2 py-1 text-xs font-semibold text-slate-300 bg-slate-700/60 border border-yellow-400/30 rounded shadow-sm backdrop-blur-sm">
                  ⌘K
                </kbd>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className={`flex-1 ${isCollapsed ? 'p-2' : 'p-4'} space-y-2 overflow-y-auto transition-all duration-300`}>
          {filteredNavigation.map((item) => (
            <SidebarItem
              key={item.id}
              item={item}
              isCollapsed={isCollapsed}
              onOpenFlyout={handleOpenFlyout}
            />
          ))}
          
          {filteredNavigation.length === 0 && !isCollapsed && (
            <div className="text-center py-8">
              <Shield className="h-8 w-8 mx-auto text-slate-500 mb-2" />
              <p className="text-slate-400 text-sm">No modules available</p>
              <p className="text-slate-500 text-xs">Contact admin for access</p>
            </div>
          )}
        </nav>

        {/* Footer */}
        {!isCollapsed && (
          <div className="p-4 border-t border-yellow-400/30 transition-opacity duration-300">
            <div className="text-center text-slate-400 text-xs">
              <p>Ramnirmalchits ERP & CRM</p>
              <p className="text-slate-500">v2.0.0 - Build 2024.1</p>
            </div>
          </div>
        )}
      </div>

      {/* Flyout Panel */}
      <FlyoutPanel
        item={flyoutItem!}
        isOpen={!!flyoutItem}
        onClose={handleCloseFlyout}
        position={flyoutPosition}
      />
    </>
  );
};