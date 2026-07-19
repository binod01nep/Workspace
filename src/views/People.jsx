import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { ROLES } from '../data/mockData';
import { Search, Filter, Mail, Phone, Users as UsersIcon, Plus, Edit2, Trash2, X, Check, UserPlus, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

export const People = () => {
  const { user: currentUser, users, addUser, updateUser, deleteUser } = useAuth();
  const { groups, createGroup } = useApp();
  
  const [activeTab, setActiveTab] = useState('directory');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  
  // Group creation state
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedTrainees, setSelectedTrainees] = useState([]);

  // Admin user CRUD states
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [adminError, setAdminError] = useState('');
  const [adminSuccess, setAdminSuccess] = useState('');

  // Add/Edit user form states
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formRole, setFormRole] = useState(ROLES.VIEWER);
  const [formStatus, setFormStatus] = useState('Active');

  const generateNextGroupId = () => {
    const nextNum = groups.length + 1;
    return `GR${String(nextNum).padStart(3, '0')}`;
  };

  const handleOpenCreateGroup = () => {
    setNewGroupName(generateNextGroupId());
    setSelectedTrainees([]);
    setShowCreateGroup(!showCreateGroup);
  };

  const handleCreateGroupSubmit = () => {
    if (newGroupName && selectedTrainees.length > 0) {
      createGroup(newGroupName, selectedTrainees);
      setShowCreateGroup(false);
      setNewGroupName('');
      setSelectedTrainees([]);
    }
  };

  const toggleTrainee = (id) => {
    setSelectedTrainees(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  };

  const openAddUserModal = () => {
    setFormName('');
    setFormEmail('');
    setFormPassword('password123');
    setFormRole(ROLES.VIEWER);
    setFormStatus('Active');
    setAdminError('');
    setAdminSuccess('');
    setShowAddUserModal(true);
  };

  const handleAddUserSubmit = (e) => {
    e.preventDefault();
    setAdminError('');
    setAdminSuccess('');
    
    if (!formName || !formEmail || !formPassword) {
      setAdminError('Please fill in all required fields');
      return;
    }

    const res = addUser({
      name: formName,
      email: formEmail,
      password: formPassword,
      role: formRole,
      status: formStatus
    });

    if (res.success) {
      setAdminSuccess('User added successfully!');
      setShowAddUserModal(false);
    } else {
      setAdminError(res.error);
    }
  };

  const openEditUserModal = (targetUser) => {
    setEditingUser(targetUser);
    setFormName(targetUser.name);
    setFormEmail(targetUser.email);
    setFormRole(targetUser.role);
    setFormStatus(targetUser.status || 'Active');
    setAdminError('');
    setAdminSuccess('');
    setShowEditUserModal(true);
  };

  const handleEditUserSubmit = (e) => {
    e.preventDefault();
    setAdminError('');
    setAdminSuccess('');

    if (!formName || !formEmail) {
      setAdminError('Name and Email are required');
      return;
    }

    const res = updateUser(editingUser.id, {
      name: formName,
      email: formEmail,
      role: formRole,
      status: formStatus
    });

    if (res.success) {
      setAdminSuccess('User updated successfully!');
      setShowEditUserModal(false);
      setEditingUser(null);
    } else {
      setAdminError(res.error);
    }
  };

  const handleDeleteUser = (userId) => {
    if (userId === currentUser.id) {
      alert('You cannot delete your own account from the people directory. Please use account deletion in Settings.');
      return;
    }
    if (window.confirm('Are you sure you want to permanently remove this user?')) {
      deleteUser(userId);
    }
  };

  const filteredUsers = users.filter(userRecord => {
    const matchesSearch = userRecord.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          userRecord.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All' || userRecord.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const roles = ['All', ...new Set(users.map(u => u.role))];
  const trainees = users.filter(u => u.role === ROLES.TRAINEE);
  const isElevatedAdmin = [ROLES.SUPER_ADMIN, ROLES.ADMIN].includes(currentUser?.role);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-zinc-100">Team & Users</h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-1">Manage team members, directory records, and groups.</p>
        </div>
        
        <div className="flex items-center gap-3">
          {isElevatedAdmin && (
            <button 
              onClick={openAddUserModal}
              className="bg-blue-600 dark:bg-indigo-600 hover:bg-blue-700 dark:hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-medium flex items-center space-x-2 shadow-sm text-sm cursor-pointer"
            >
              <UserPlus className="w-4 h-4" /> <span>Add User</span>
            </button>
          )}

          {([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER]).includes(currentUser?.role) && (
            <div className="flex bg-slate-100 dark:bg-zinc-800 p-1 rounded-xl">
              <button 
                onClick={() => setActiveTab('directory')}
                className={`px-4 py-1.5 rounded-lg font-medium text-xs transition-colors ${activeTab === 'directory' ? 'bg-white dark:bg-[#242424] text-blue-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-zinc-400'}`}
              >
                Directory
              </button>
              <button 
                onClick={() => setActiveTab('groups')}
                className={`px-4 py-1.5 rounded-lg font-medium text-xs transition-colors ${activeTab === 'groups' ? 'bg-white dark:bg-[#242424] text-blue-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-zinc-400'}`}
              >
                Groups
              </button>
            </div>
          )}
        </div>
      </div>

      {activeTab === 'directory' ? (
        <>
          {/* Filters Bar */}
          <div className="bg-white dark:bg-[#242424] p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 dark:text-zinc-500 absolute left-3 top-3" />
              <input 
                type="text" 
                placeholder="Search by name or email..." 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative md:w-64">
              <Filter className="w-5 h-5 text-slate-400 dark:text-zinc-500 absolute left-3 top-3" />
              <select 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none cursor-pointer"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Super Admin Dashboard View: Administrative Users Table */}
          {currentUser?.role === ROLES.SUPER_ADMIN ? (
            <div className="bg-white dark:bg-[#242424] rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/20">
                <h3 className="font-bold text-slate-800 dark:text-zinc-100 text-sm">System Users Directory (Super Admin Access)</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-zinc-800 text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider bg-slate-50/20 dark:bg-zinc-800/10">
                      <th className="px-6 py-4">User</th>
                      <th className="px-6 py-4">Email Address</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                    {filteredUsers.map(u => (
                      <tr key={u.id} className="hover:bg-slate-50/40 dark:hover:bg-zinc-800/10 transition-colors text-sm">
                        <td className="px-6 py-4 flex items-center gap-3">
                          <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-full aspect-square object-cover" />
                          <span className="font-semibold text-slate-855 dark:text-zinc-100">{u.name}</span>
                        </td>
                        <td className="px-6 py-4 text-slate-600 dark:text-zinc-400 font-mono text-xs">{u.email}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-500">
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${u.status === 'Suspended' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}`}>
                            {u.status || 'Active'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => openEditUserModal(u)}
                              className="p-1.5 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 dark:bg-zinc-800 dark:hover:bg-zinc-700/50 rounded-lg transition-colors text-slate-500 dark:text-zinc-400 cursor-pointer"
                              title="Edit User"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(u.id)}
                              className="p-1.5 bg-slate-50 hover:bg-red-50 hover:text-red-600 dark:bg-zinc-800 dark:hover:bg-zinc-700/50 rounded-lg transition-colors text-slate-500 dark:text-zinc-400 cursor-pointer"
                              title="Remove User"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center p-8 text-slate-500 dark:text-zinc-500">No team members match the criteria.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Standard Grid Card Directory for Admin and other roles */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredUsers.map(directoryUser => (
                <div key={directoryUser.id} className="relative block bg-white dark:bg-[#242424] p-4 rounded-2xl border border-slate-200 dark:border-zinc-700 shadow-sm hover:shadow-md transition-all text-center group">
                  
                  {/* Admin edit controls inside user cards */}
                  {isElevatedAdmin && (
                    <div className="absolute top-3 right-3 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => openEditUserModal(directoryUser)}
                        className="p-1.5 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 dark:bg-zinc-800 dark:hover:bg-zinc-700/50 rounded-lg transition-colors text-slate-500 dark:text-zinc-400 cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(directoryUser.id)}
                        className="p-1.5 bg-slate-50 hover:bg-red-50 hover:text-red-600 dark:bg-zinc-800 dark:hover:bg-zinc-700/50 rounded-lg transition-colors text-slate-500 dark:text-zinc-400 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <Link to={`/profile/${directoryUser.id}`} className="block">
                    <div className="relative inline-block mb-4">
                      <img src={directoryUser.avatar} alt={directoryUser.name} className="w-24 h-24 rounded-full aspect-square object-cover border-4 border-slate-50 shadow-sm mx-auto group-hover:scale-105 transition-transform" />
                      <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-indigo-400 truncate">{directoryUser.name}</h3>
                  </Link>

                  <p className="text-sm font-medium text-blue-600 dark:text-indigo-400 mb-2">{directoryUser.role}</p>
                  
                  {isElevatedAdmin && (
                    <p className="text-xs font-mono text-slate-400 dark:text-zinc-500 mb-4 truncate">{directoryUser.email}</p>
                  )}
                  
                  <div className="flex justify-center space-x-2">
                    <a href={`mailto:${directoryUser.email}`} className="p-2 bg-slate-50 dark:bg-zinc-850 text-slate-500 dark:text-zinc-400 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-zinc-800 rounded-full transition-colors">
                      <Mail className="w-4 h-4" />
                    </a>
                    <button className="p-2 bg-slate-50 dark:bg-zinc-850 text-slate-500 dark:text-zinc-400 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-zinc-800 rounded-full transition-colors">
                      <Phone className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {filteredUsers.length === 0 && (
                <div className="col-span-full text-center py-12 text-slate-500">No team members match this criteria.</div>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800 dark:text-zinc-100">Trainee Groups</h2>
            {currentUser?.role === ROLES.MANAGER && (
              <button 
                onClick={handleOpenCreateGroup}
                className="bg-blue-600 dark:bg-indigo-600 hover:bg-blue-700 dark:hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-medium flex items-center space-x-2 cursor-pointer shadow-sm text-sm"
              >
                <Plus className="w-5 h-5" /> <span>Create Group</span>
              </button>
            )}
          </div>

          {showCreateGroup && (
            <div className="bg-white dark:bg-[#242424] p-6 rounded-2xl border border-slate-200 dark:border-zinc-700 shadow-sm space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-100">New Trainee Group</h3>
                <p className="text-xs text-slate-400">Group names are automatically generated in order, but you can customize it.</p>
              </div>

              <input 
                type="text" 
                placeholder="Group Name" 
                className="w-full px-4 py-2 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-zinc-100 text-sm font-semibold"
                value={newGroupName}
                onChange={e => setNewGroupName(e.target.value)}
              />
              
              <div>
                <p className="text-sm font-semibold text-slate-600 dark:text-zinc-400 mb-2">Select Group Members (Trainees)</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-40 overflow-y-auto border border-slate-100 dark:border-zinc-800 p-2 rounded-xl">
                  {trainees.map(t => (
                    <label key={t.id} className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800/40 cursor-pointer">
                      <input type="checkbox" checked={selectedTrainees.includes(t.id)} onChange={() => toggleTrainee(t.id)} className="accent-blue-600" />
                      <span className="text-xs text-slate-800 dark:text-zinc-200">{t.name}</span>
                    </label>
                  ))}
                  {trainees.length === 0 && (
                    <p className="text-xs text-slate-400 col-span-full italic">No Trainees found to assign.</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button onClick={() => setShowCreateGroup(false)} className="px-4 py-2 text-slate-500 hover:text-slate-700 dark:hover:text-zinc-300 text-sm font-medium">Cancel</button>
                <button onClick={handleCreateGroupSubmit} className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl font-medium text-sm">Save Group</button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {groups.map(g => (
              <div key={g.id} className="bg-white dark:bg-[#242424] p-4 rounded-2xl border border-slate-200 dark:border-zinc-700 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-50 dark:bg-zinc-800 text-blue-600 dark:text-indigo-400 rounded-xl">
                    <UsersIcon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-100">{g.name}</h3>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-400 dark:text-zinc-500">Members ({g.members.length})</p>
                  <div className="flex -space-x-2 overflow-hidden">
                    {g.members.map(mId => {
                      const member = users.find(u => u.id === mId);
                      return member ? <img key={mId} src={member.avatar} title={member.name} className="w-8 h-8 rounded-full border-2 border-white dark:border-[#242424] aspect-square object-cover" alt="" /> : null;
                    })}
                  </div>
                </div>
              </div>
            ))}
            {groups.length === 0 && (
              <div className="col-span-full text-center py-12 text-slate-500 italic">No groups created yet. Autogenerate them now!</div>
            )}
          </div>
        </div>
      )}

      {/* Admin Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#242424] border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold text-slate-800 dark:text-zinc-100">Add New User</h3>
              <button onClick={() => setShowAddUserModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {adminError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm mb-4">
                {adminError}
              </div>
            )}

            <form onSubmit={handleAddUserSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-zinc-400 mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-850 rounded-xl text-sm text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Alice Smith"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-zinc-400 mb-1">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={formEmail}
                  onChange={e => setFormEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-850 rounded-xl text-sm text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="alice@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-zinc-400 mb-1">Password</label>
                <input 
                  type="text" 
                  required
                  value={formPassword}
                  onChange={e => setFormPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-850 rounded-xl text-sm text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-zinc-400 mb-1">System Role</label>
                  <select 
                    value={formRole}
                    onChange={e => setFormRole(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.values(ROLES).map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-zinc-400 mb-1">Status</label>
                  <select 
                    value={formStatus}
                    onChange={e => setFormStatus(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowAddUserModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 font-medium text-sm hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-medium text-sm transition-colors shadow-sm"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Edit User Modal */}
      {showEditUserModal && editingUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#242424] border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold text-slate-800 dark:text-zinc-100">Edit User Profile</h3>
              <button onClick={() => { setShowEditUserModal(false); setEditingUser(null); }} className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {adminError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm mb-4">
                {adminError}
              </div>
            )}

            <form onSubmit={handleEditUserSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-zinc-400 mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-850 rounded-xl text-sm text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-zinc-400 mb-1">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={formEmail}
                  onChange={e => setFormEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-850 rounded-xl text-sm text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-zinc-400 mb-1">System Role</label>
                  <select 
                    value={formRole}
                    onChange={e => setFormRole(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.values(ROLES).map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-zinc-400 mb-1">Status</label>
                  <select 
                    value={formStatus}
                    onChange={e => setFormStatus(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => { setShowEditUserModal(false); setEditingUser(null); }}
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
