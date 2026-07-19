import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { ROLES } from '../data/mockData';
import { FolderKanban, MoreVertical, Plus, Calendar, Users, Edit2, Trash2, ShieldAlert, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Projects = () => {
  const { projects, createProject, updateProject, deleteProject } = useApp();
  const { user, users } = useAuth();

  // Modal / Form state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectStatus, setProjectStatus] = useState('Planning');
  const [projectPriority, setProjectPriority] = useState('Medium');
  const [projectMembers, setProjectMembers] = useState([]);

  // Dropdown menus state
  const [activeDropdown, setActiveDropdown] = useState(null); // projectId
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const openCreateModal = () => {
    setProjectName('');
    setProjectDescription('');
    setProjectStatus('Planning');
    setProjectPriority('Medium');
    setProjectMembers([]);
    setShowCreateModal(true);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!projectName.trim()) return;
    createProject({
      name: projectName,
      description: projectDescription,
      status: projectStatus,
      priority: projectPriority,
      members: projectMembers
    });
    setShowCreateModal(false);
  };

  const openEditModal = (proj) => {
    setEditingProject(proj);
    setProjectName(proj.name);
    setProjectDescription(proj.description || '');
    setProjectStatus(proj.status);
    setProjectPriority(proj.priority || 'Medium');
    setProjectMembers(proj.members || []);
    setShowEditModal(true);
    setActiveDropdown(null);
  };

  const handleEdit = (e) => {
    e.preventDefault();
    if (!projectName.trim() || !editingProject) return;
    updateProject(editingProject.id, {
      name: projectName,
      description: projectDescription,
      status: projectStatus,
      priority: projectPriority,
      members: projectMembers
    });
    setShowEditModal(false);
    setEditingProject(null);
  };

  const handleDelete = (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      deleteProject(projectId);
    }
    setActiveDropdown(null);
  };

  const handlePriorityChange = (projectId, priority) => {
    updateProject(projectId, { priority });
    setActiveDropdown(null);
  };

  const toggleMember = (memberId) => {
    setProjectMembers(prev => 
      prev.includes(memberId) ? prev.filter(id => id !== memberId) : [...prev, memberId]
    );
  };

  const trainees = users.filter(u => u.role === ROLES.TRAINEE);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-zinc-100">Projects</h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-1">Manage all your active and upcoming projects.</p>
        </div>
        {user?.role === ROLES.MANAGER && (
          <button 
            onClick={openCreateModal}
            className="bg-blue-600 dark:bg-indigo-600 hover:bg-blue-700 dark:hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-medium transition-colors shadow-sm flex items-center space-x-2 cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span>Create Project</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map(project => {
          const projectMembersList = project.members.map(mId => users.find(u => u.id === mId)).filter(Boolean);
          
          return (
            <div key={project.id} className="relative block bg-white dark:bg-[#242424] p-4 rounded-2xl border border-slate-200 dark:border-zinc-700 shadow-sm hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-4">
                <Link to={`/projects/${project.id}`} className="p-3 bg-blue-50 dark:bg-zinc-800 text-blue-600 dark:text-indigo-400 rounded-xl">
                  <FolderKanban className="w-6 h-6" />
                </Link>
                
                {user?.role === ROLES.MANAGER && (
                  <div className="relative">
                    <button 
                      onClick={() => setActiveDropdown(activeDropdown === project.id ? null : project.id)}
                      className="text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300 p-1 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    
                    {activeDropdown === project.id && (
                      <div 
                        ref={dropdownRef}
                        className="absolute right-0 mt-1 w-48 bg-white dark:bg-[#2e2e32] border border-slate-200 dark:border-zinc-700 rounded-xl shadow-xl py-1.5 z-40"
                      >
                        <button 
                          onClick={() => openEditModal(project)}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800/40 text-left font-medium"
                        >
                          <Edit2 className="w-4 h-4 text-blue-500" />
                          <span>Edit Project</span>
                        </button>
                        
                        <div className="border-t border-slate-100 dark:border-zinc-700 my-1"></div>
                        
                        <div className="px-4 py-1 text-[11px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Priority</div>
                        {(['High', 'Medium', 'Low']).map(p => (
                          <button
                            key={p}
                            onClick={() => handlePriorityChange(project.id, p)}
                            className={`flex items-center justify-between w-full px-4 py-1.5 text-xs text-left font-medium ${project.priority === p ? 'text-blue-600 dark:text-indigo-400 bg-blue-50/50 dark:bg-zinc-800' : 'text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800/40'}`}
                          >
                            <span>{p}</span>
                            {project.priority === p && <span className="w-1.5 h-1.5 bg-blue-600 dark:bg-indigo-400 rounded-full"></span>}
                          </button>
                        ))}
                        
                        <div className="border-t border-slate-100 dark:border-zinc-700 my-1"></div>
                        
                        <button 
                          onClick={() => handleDelete(project.id)}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 text-left font-semibold"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete Project</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <Link to={`/projects/${project.id}`} className="block">
                <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-indigo-400 transition-colors truncate">{project.name}</h3>
              </Link>
              
              <div className="flex items-center space-x-4 text-xs text-slate-500 dark:text-zinc-400 mb-4">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Due in 2 weeks</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{project.members.length} members</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-600 dark:text-zinc-400">Progress</span>
                  <span className="text-blue-600 dark:text-indigo-400">{project.progress}%</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 dark:bg-indigo-500 rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-zinc-800 flex justify-between items-center">
                <div className="flex -space-x-2">
                  {projectMembersList.slice(0, 4).map((member, idx) => (
                    <img 
                      key={idx} 
                      src={member.avatar || `https://i.pravatar.cc/150?u=${member.id}`} 
                      className="w-8 h-8 rounded-full border-2 border-white dark:border-[#242424] aspect-square object-cover" 
                      title={member.name}
                      alt={member.name} 
                    />
                  ))}
                  {projectMembersList.length > 4 && (
                    <div className="w-8 h-8 rounded-full border-2 border-white dark:border-[#242424] bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-zinc-400">
                      +{projectMembersList.length - 4}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    project.priority === 'High' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                    project.priority === 'Medium' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' :
                    'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                  }`}>
                    {project.priority || 'Medium'}
                  </span>
                  
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    project.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                    project.status === 'Active' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                    'bg-slate-100 dark:bg-zinc-800 text-slate-500 border border-slate-200 dark:border-zinc-700'
                  }`}>
                    {project.status}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Creation Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#242424] border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold text-slate-800 dark:text-zinc-100">Create New Project</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-zinc-400 mb-1">Project Name</label>
                <input 
                  type="text"
                  required
                  value={projectName}
                  onChange={e => setProjectName(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Mobile Application Launch"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-zinc-400 mb-1">Description</label>
                <textarea 
                  rows={3}
                  value={projectDescription}
                  onChange={e => setProjectDescription(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Describe project details..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-zinc-400 mb-1">Status</label>
                  <select 
                    value={projectStatus}
                    onChange={e => setProjectStatus(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Planning">Planning</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-zinc-400 mb-1">Priority</label>
                  <select 
                    value={projectPriority}
                    onChange={e => setProjectPriority(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-zinc-400 mb-2">Assign Trainees</label>
                <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto border border-slate-100 dark:border-zinc-800 p-2 rounded-xl">
                  {trainees.map(t => (
                    <label key={t.id} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800/40 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={projectMembers.includes(t.id)} 
                        onChange={() => toggleMember(t.id)}
                        className="accent-blue-600"
                      />
                      <span className="text-xs text-slate-855 dark:text-zinc-200">{t.name}</span>
                    </label>
                  ))}
                  {trainees.length === 0 && (
                    <p className="text-xs text-slate-400 col-span-2 italic p-2">No trainees registered yet.</p>
                  )}
                </div>
              </div>

              <div className="flex space-x-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowCreateModal(false)} 
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 font-medium text-sm hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-medium text-sm transition-colors shadow-sm"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {showEditModal && editingProject && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#242424] border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold text-slate-800 dark:text-zinc-100">Edit Project</h3>
              <button onClick={() => { setShowEditModal(false); setEditingProject(null); }} className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-zinc-400 mb-1">Project Name</label>
                <input 
                  type="text"
                  required
                  value={projectName}
                  onChange={e => setProjectName(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-zinc-400 mb-1">Description</label>
                <textarea 
                  rows={3}
                  value={projectDescription}
                  onChange={e => setProjectDescription(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-zinc-400 mb-1">Status</label>
                  <select 
                    value={projectStatus}
                    onChange={e => setProjectStatus(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Planning">Planning</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-zinc-400 mb-1">Priority</label>
                  <select 
                    value={projectPriority}
                    onChange={e => setProjectPriority(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-zinc-400 mb-2">Assign Trainees</label>
                <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto border border-slate-100 dark:border-zinc-800 p-2 rounded-xl">
                  {trainees.map(t => (
                    <label key={t.id} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800/40 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={projectMembers.includes(t.id)} 
                        onChange={() => toggleMember(t.id)}
                        className="accent-blue-600"
                      />
                      <span className="text-xs text-slate-800 dark:text-zinc-200">{t.name}</span>
                    </label>
                  ))}
                  {trainees.length === 0 && (
                    <p className="text-xs text-slate-400 col-span-2 italic p-2">No trainees registered yet.</p>
                  )}
                </div>
              </div>

              <div className="flex space-x-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => { setShowEditModal(false); setEditingProject(null); }} 
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 font-medium text-sm hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-medium text-sm transition-colors shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
