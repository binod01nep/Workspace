import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { MOCK_USERS } from '../../data/mockData';
import { Bell, Search, Star, LogOut, Menu, X, Users, FolderKanban, CheckSquare } from 'lucide-react';
import { cn } from '../../lib/utils';

export const TopNav = () => {
  const navigate = useNavigate();
  const { user, logout, users } = useAuth();
  const { notifications, markNotificationRead, xp, toggleSidebar, projects, tasks } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    logout();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getSearchResults = () => {
    if (!searchTerm) return [];
    const lowerTerm = searchTerm.toLowerCase();
    
    const matchedProjects = projects.filter(p => p.name.toLowerCase().includes(lowerTerm)).map(p => ({ ...p, type: 'project' }));
    
    // Flatten tasks object to array
    const allTasks = Object.values(tasks).flat();
    const matchedTasks = allTasks.filter(t => t.title.toLowerCase().includes(lowerTerm)).map(t => ({ ...t, type: 'task' }));
    
    const matchedUsers = users.filter(u => u.name.toLowerCase().includes(lowerTerm)).map(u => ({ ...u, type: 'user' }));
    
    return [...matchedProjects, ...matchedTasks, ...matchedUsers].slice(0, 8); // top 8 results
  };

  const handleResultClick = (result) => {
    setShowSearchResults(false);
    setSearchTerm('');
    if (result.type === 'project') navigate(`/projects/${result.id}`);
    if (result.type === 'user') navigate(`/profile/${result.id}`);
    if (result.type === 'task') navigate(`/tasks`);
  };

  const results = getSearchResults();

  return (
    <>
      <header className="h-20 bg-slate-50 dark:bg-[#18181b]/80 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800 sticky top-0 z-40 flex items-center justify-between px-8 text-slate-800 dark:text-zinc-100">
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleSidebar}
            className="p-2 text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-slate-800 dark:text-zinc-100 hover:bg-slate-100 dark:hover:bg-slate-100 dark:bg-zinc-800 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center w-96 relative hidden md:flex" ref={searchRef}>
            <Search className="w-5 h-5 text-slate-400 dark:text-zinc-500 absolute left-3" />
            <input 
              type="text" 
              placeholder="Search everywhere..." 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-full text-sm text-slate-800 dark:text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-indigo-500/50 focus:border-blue-500 dark:focus:border-blue-600 dark:focus:border-indigo-500 transition-all"
            />
            {showSearchResults && searchTerm && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#242424] border border-slate-200 dark:border-zinc-800 rounded-xl shadow-xl overflow-hidden max-h-96 overflow-y-auto">
                {results.length === 0 ? (
                  <div className="p-4 text-center text-sm text-slate-500 dark:text-zinc-400">No results found for "{searchTerm}"</div>
                ) : (
                  <div className="py-2">
                    {results.map(r => (
                      <div 
                        key={`${r.type}-${r.id}`} 
                        className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-zinc-800/50 cursor-pointer flex items-center gap-3 transition-colors"
                        onClick={() => handleResultClick(r)}
                      >
                        <div className="p-2 bg-slate-100 dark:bg-zinc-900 rounded-lg">
                          {r.type === 'project' && <FolderKanban className="w-4 h-4 text-blue-500 dark:text-indigo-400" />}
                          {r.type === 'task' && <CheckSquare className="w-4 h-4 text-emerald-500" />}
                          {r.type === 'user' && <Users className="w-4 h-4 text-purple-500" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800 dark:text-zinc-100">{r.name || r.title}</p>
                          <p className="text-xs text-slate-500 dark:text-zinc-400 capitalize">{r.type}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-slate-100 dark:bg-zinc-800 hover:text-slate-900 dark:hover:text-slate-800 dark:text-zinc-100 rounded-full transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#18181b]"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-[#242424] rounded-2xl shadow-xl border border-slate-200 dark:border-zinc-800 py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-200 dark:border-zinc-800 flex justify-between items-center">
                  <h3 className="font-semibold text-slate-800 dark:text-zinc-100">Notifications</h3>
                  <span className="text-xs bg-blue-100 dark:bg-indigo-500/20 text-blue-700 dark:text-indigo-300 px-2 py-0.5 rounded-full">{unreadCount} new</span>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map(notif => (
                    <div 
                      key={notif.id} 
                      className={cn("px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-100 dark:bg-zinc-800 cursor-pointer transition-colors", !notif.isRead && "bg-slate-50 dark:bg-zinc-800/50")}
                      onClick={() => {
                        markNotificationRead(notif.id);
                        if (notif.type === 'message') {
                          navigate('/messaging');
                          setShowNotifications(false);
                        }
                      }}
                    >
                      <p className="text-sm font-medium text-slate-800 dark:text-zinc-100">{notif.title}</p>
                      <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">{notif.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="h-8 w-px bg-slate-100 dark:bg-zinc-800"></div>

          <div className="flex items-center space-x-3">
            <Link to="/profile" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-800 dark:text-zinc-100">{user?.name}</p>
                <p className="text-xs text-slate-400 dark:text-zinc-500">{user?.role}</p>
              </div>
              <img src={user?.avatar} alt={user?.name} className="w-10 h-10 rounded-full border-2 border-slate-200 dark:border-zinc-800 shadow-sm" />
            </Link>
            <button 
              onClick={() => setShowLogoutModal(true)} 
              className="p-2 text-slate-400 dark:text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors ml-2" 
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#242424] border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl transform transition-all">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold text-slate-800 dark:text-zinc-100">Confirm Logout</h3>
              <button onClick={() => setShowLogoutModal(false)} className="text-slate-400 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-slate-700 dark:text-zinc-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-slate-500 dark:text-zinc-400 mb-6">Are you sure you want to end your current session and sign out?</p>
            <div className="flex space-x-3">
              <button 
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-100 dark:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmLogout}
                className="flex-1 py-2.5 px-4 rounded-xl bg-red-600/90 hover:bg-red-600 text-white font-medium shadow-sm transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
