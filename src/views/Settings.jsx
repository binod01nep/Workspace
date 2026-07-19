import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Settings as SettingsIcon, Bell, Shield, Palette, User, Mail, Lock, Eye, Trash2, X, Check } from 'lucide-react';

export const Settings = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user: currentUser, updateProfile, users, resetPassword, deleteUser } = useAuth();
  
  // Account Form state
  const [profileName, setProfileName] = useState(currentUser?.name || '');
  const [profileEmail, setProfileEmail] = useState(currentUser?.email || '');
  
  // Password Form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Notification states
  const [emailNotif, setEmailNotif] = useState(true);
  const [projNotif, setProjNotif] = useState(true);
  const [subNotif, setSubNotif] = useState(false);
  
  // Privacy states
  const [profileVisible, setProfileVisible] = useState(true);
  
  // Alerts and Modals state
  const [accountError, setAccountError] = useState('');
  const [accountSuccess, setAccountSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setAccountError('');
    setAccountSuccess('');
    
    if (!profileName || !profileEmail) {
      setAccountError('Name and email are required');
      return;
    }

    const res = updateProfile({ name: profileName, email: profileEmail });
    if (res.success) {
      setAccountSuccess('Account information updated successfully!');
    } else {
      setAccountError(res.error);
    }
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill in all password fields');
      return;
    }

    // Retrieve user record with password
    const userRecord = users.find(u => u.id === currentUser.id);
    if (!userRecord || userRecord.password !== currentPassword) {
      setPasswordError('Incorrect current password');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    const res = resetPassword(currentUser.email, newPassword);
    if (res.success) {
      setPasswordSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPasswordError(res.error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 text-blue-600 dark:text-indigo-500" />
          Settings
        </h1>
        <p className="text-slate-500 dark:text-zinc-400 mt-2">Manage your workspace preferences and profile settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Navigation Quicklinks */}
        <div className="space-y-3 lg:col-span-1">
          <div className="bg-white dark:bg-[#242424] rounded-2xl p-4 border border-slate-200 dark:border-zinc-800 shadow-sm flex flex-col gap-1">
            <a href="#account" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800/50 text-slate-700 dark:text-zinc-300 font-medium transition-colors">
              <User className="w-4 h-4 text-blue-500" />
              <span>Account Settings</span>
            </a>
            <a href="#notifications" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800/50 text-slate-700 dark:text-zinc-300 font-medium transition-colors">
              <Bell className="w-4 h-4 text-indigo-500" />
              <span>Notifications</span>
            </a>
            <a href="#privacy" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800/50 text-slate-700 dark:text-zinc-300 font-medium transition-colors">
              <Eye className="w-4 h-4 text-emerald-500" />
              <span>Privacy</span>
            </a>
            <a href="#appearance" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800/50 text-slate-700 dark:text-zinc-300 font-medium transition-colors">
              <Palette className="w-4 h-4 text-purple-500" />
              <span>Appearance</span>
            </a>
          </div>
        </div>

        {/* Right Side: Settings Forms */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Account Settings Section */}
          <section id="account" className="bg-white dark:bg-[#242424] rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 p-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-800 dark:text-zinc-100 flex items-center gap-2 mb-1">
                <User className="w-5 h-5 text-blue-500" /> Account Settings
              </h2>
              <p className="text-sm text-slate-500 dark:text-zinc-400">Update your profile details and email address.</p>
            </div>

            {accountSuccess && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 p-3 rounded-xl text-sm flex items-center gap-2">
                <Check className="w-4 h-4" /> {accountSuccess}
              </div>
            )}
            {accountError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm">
                {accountError}
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-zinc-400 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    value={profileName}
                    onChange={e => setProfileName(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-zinc-400 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    value={profileEmail}
                    onChange={e => setProfileEmail(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-medium rounded-xl text-sm transition-colors shadow-sm">
                Save Account Info
              </button>
            </form>

            <div className="h-px bg-slate-100 dark:bg-zinc-800 my-6"></div>

            {/* Change Password Form */}
            <div>
              <h3 className="text-lg font-medium text-slate-800 dark:text-zinc-100 flex items-center gap-2 mb-4">
                <Lock className="w-4 h-4 text-blue-500" /> Change Password
              </h3>
              {passwordSuccess && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 p-3 rounded-xl text-sm flex items-center gap-2 mb-4">
                  <Check className="w-4 h-4" /> {passwordSuccess}
                </div>
              )}
              {passwordError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm mb-4">
                  {passwordError}
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-zinc-400 mb-1">Current Password</label>
                  <input 
                    type="password" 
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    className="w-full max-w-md px-4 py-2 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="••••••••"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-zinc-400 mb-1">New Password</label>
                    <input 
                      type="password" 
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-zinc-400 mb-1">Confirm New Password</label>
                    <input 
                      type="password" 
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-medium rounded-xl text-sm transition-colors shadow-sm">
                  Change Password
                </button>
              </form>
            </div>
          </section>

          {/* Notification Settings Section */}
          <section id="notifications" className="bg-white dark:bg-[#242424] rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 p-6 space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-800 dark:text-zinc-100 flex items-center gap-2 mb-1">
                <Bell className="w-5 h-5 text-indigo-500" /> Notification Settings
              </h2>
              <p className="text-sm text-slate-500 dark:text-zinc-400">Control how you want to receive alerts and notifications.</p>
            </div>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[#1e1e1e] rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-zinc-800/40 transition-colors">
                <div>
                  <p className="font-medium text-slate-800 dark:text-zinc-100 text-sm">Email Notifications</p>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">Receive platform activity updates via email.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={emailNotif} 
                  onChange={e => setEmailNotif(e.target.checked)} 
                  className="w-5 h-5 accent-blue-600 dark:accent-indigo-600 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[#1e1e1e] rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-zinc-800/40 transition-colors">
                <div>
                  <p className="font-medium text-slate-800 dark:text-zinc-100 text-sm">Project Notifications</p>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">Get updates when you are added to a project or project changes occur.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={projNotif} 
                  onChange={e => setProjNotif(e.target.checked)} 
                  className="w-5 h-5 accent-blue-600 dark:accent-indigo-600 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[#1e1e1e] rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-zinc-800/40 transition-colors">
                <div>
                  <p className="font-medium text-slate-800 dark:text-zinc-100 text-sm">Submission Notifications</p>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">Notify immediately when reviews or submissions change status.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={subNotif} 
                  onChange={e => setSubNotif(e.target.checked)} 
                  className="w-5 h-5 accent-blue-600 dark:accent-indigo-600 cursor-pointer"
                />
              </label>
            </div>
          </section>

          {/* Privacy Settings Section */}
          <section id="privacy" className="bg-white dark:bg-[#242424] rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 p-6 space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-800 dark:text-zinc-100 flex items-center gap-2 mb-1">
                <Shield className="w-5 h-5 text-emerald-500" /> Privacy Settings
              </h2>
              <p className="text-sm text-slate-500 dark:text-zinc-400">Manage account visibility and account deletion preferences.</p>
            </div>

            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[#1e1e1e] rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-zinc-800/40 transition-colors">
                <div>
                  <p className="font-medium text-slate-800 dark:text-zinc-100 text-sm">Profile Visibility</p>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">Make your profile discoverable in the team directory list.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={profileVisible} 
                  onChange={e => setProfileVisible(e.target.checked)} 
                  className="w-5 h-5 accent-blue-600 dark:accent-indigo-600 cursor-pointer"
                />
              </label>

              <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-semibold text-red-600 dark:text-red-400 text-sm">Account Deletion</p>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">Permanently close and delete your workspace account.</p>
                </div>
                <button 
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Account</span>
                </button>
              </div>
            </div>
          </section>

          {/* Appearance Settings Section */}
          <section id="appearance" className="bg-white dark:bg-[#242424] rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 p-6 space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-800 dark:text-zinc-100 flex items-center gap-2 mb-1">
                <Palette className="w-5 h-5 text-purple-500" /> Appearance Preferences
              </h2>
              <p className="text-sm text-slate-500 dark:text-zinc-400">Configure theme settings and view modes.</p>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => theme === 'dark' && toggleTheme()}
                className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-colors ${theme === 'light' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 dark:border-zinc-700 hover:border-slate-300 dark:hover:border-zinc-600 text-slate-500 dark:text-zinc-400'}`}
              >
                Light Theme
              </button>
              <button 
                onClick={() => theme === 'light' && toggleTheme()}
                className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-colors ${theme === 'dark' ? 'border-indigo-500 bg-indigo-500/20 text-indigo-400 animate-pulse-subtle' : 'border-slate-200 hover:border-slate-300 text-slate-500'}`}
              >
                Dark Theme
              </button>
            </div>
          </section>

        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#242424] border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-800 dark:text-zinc-100">Delete Account?</h3>
              <button onClick={() => setShowDeleteModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-slate-500 dark:text-zinc-400 mb-6">Are you sure you want to delete your account permanently? This action cannot be undone and you will be signed out instantly.</p>
            <div className="flex space-x-3">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 font-medium hover:bg-slate-100 dark:hover:bg-[#2a2a2d] transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  deleteUser(currentUser.id);
                  setShowDeleteModal(false);
                  navigate('/home');
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
