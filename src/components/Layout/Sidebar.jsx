import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { ROLES } from '../../data/mockData';
import { LayoutDashboard, FolderKanban, CheckSquare, Send, MessageSquare, Users, BarChart2, Settings } from 'lucide-react';
import { cn } from '../../lib/utils';

export const Sidebar = () => {
  const { user } = useAuth();
  const { isSidebarOpen } = useApp();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, roles: Object.values(ROLES) },
    { name: 'Projects', path: '/projects', icon: FolderKanban, roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare, roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.TRAINEE] },
    { name: 'Submissions', path: '/submissions', icon: Send, roles: [ROLES.MANAGER, ROLES.TRAINEE] },
    { name: 'Messaging', path: '/messaging', icon: MessageSquare, roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.TRAINEE] },
    { name: 'People', path: '/people', icon: Users, roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.TRAINEE] },
    { name: 'Analytics', path: '/analytics', icon: BarChart2, roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  ];

  const allowedNavItems = navItems.filter(item => item.roles.includes(user?.role));

  return (
    <div className={cn(
      "bg-slate-50 dark:bg-[#1e1e1e] text-slate-800 dark:text-zinc-100 flex flex-col h-screen fixed top-0 left-0 transition-all duration-300 z-50 border-r border-slate-200 dark:border-zinc-800",
      isSidebarOpen ? "w-64" : "w-20"
    )}>
      <div className="p-6 flex items-center justify-center">
        {isSidebarOpen ? (
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent truncate">
            WorkSpace
          </h1>
        ) : (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center justify-center text-white font-bold">
            W
          </div>
        )}
      </div>
      
      <nav className="flex-1 px-3 space-y-2 mt-4 overflow-y-auto">
        {allowedNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center px-3 py-3 rounded-xl transition-all duration-200",
              isSidebarOpen ? "space-x-3" : "justify-center",
              isActive 
                ? "bg-white text-blue-600 dark:text-indigo-600 shadow-sm" 
                : "text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-zinc-100"
            )}
            title={!isSidebarOpen ? item.name : undefined}
          >
            <item.icon className={cn("shrink-0", isSidebarOpen ? "w-5 h-5" : "w-6 h-6")} />
            {isSidebarOpen && <span className="font-medium truncate">{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-zinc-800">
        <NavLink 
          to="/settings"
          className={({ isActive }) => cn(
            "flex items-center px-3 py-3 w-full rounded-xl transition-colors",
            isSidebarOpen ? "space-x-3" : "justify-center",
            isActive 
              ? "bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-100" 
              : "text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-zinc-100"
          )}
          title={!isSidebarOpen ? "Settings" : undefined}
        >
          <Settings className={cn("shrink-0", isSidebarOpen ? "w-5 h-5" : "w-6 h-6")} />
          {isSidebarOpen && <span className="font-medium truncate">Settings</span>}
        </NavLink>
      </div>
    </div>
  );
};
