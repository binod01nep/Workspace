import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ROLES } from '../data/mockData';
import { Mail, Shield, User as UserIcon, Save, X, Camera } from 'lucide-react';
import { cn } from '../lib/utils';

export const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, updateProfile, users } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: currentUser?.name || '', email: currentUser?.email || '', avatar: currentUser?.avatar || '' });
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const displayedUser = id ? users.find(u => u.id === id) : currentUser;
  const isMyProfile = !id || id === currentUser?.id;

  useEffect(() => {
    if (currentUser && isMyProfile) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        avatar: currentUser.avatar || ''
      });
    }
  }, [currentUser, isMyProfile]);

  if (!displayedUser) return <div className="p-8 text-center text-slate-500">User not found</div>;

  const handleSave = () => {
    if (!formData.name || !formData.email) {
      setError('Name and Email are required');
      return;
    }
    const res = updateProfile(formData);
    if (res.success) {
      setIsEditing(false);
      setError('');
    } else {
      setError(res.error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({ name: currentUser.name, email: currentUser.email, avatar: currentUser.avatar });
    setError('');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="bg-white dark:bg-[#242424] rounded-3xl shadow-sm border border-slate-200 dark:border-zinc-800 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="relative group shrink-0">
              <img 
                src={isEditing ? formData.avatar : displayedUser.avatar} 
                alt={displayedUser.name} 
                className={cn("w-24 h-24 rounded-full aspect-square object-cover shrink-0 border-4 border-slate-200 dark:border-[#242424] shadow-lg bg-white dark:bg-[#242424]", isEditing && "opacity-80")}
              />
              {isEditing && (
                <div 
                  className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/40 rounded-full border-4 border-transparent"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="w-8 h-8 text-white" />
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>
            {isMyProfile && !isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 bg-blue-600 dark:bg-indigo-600 text-white font-medium rounded-xl hover:bg-blue-700 dark:hover:bg-indigo-700 transition-colors shadow-sm shadow-blue-500/30 dark:shadow-indigo-500/30"
              >
                Edit Profile
              </button>
            )}
            {isMyProfile && isEditing && (
              <div className="flex space-x-3">
                <button 
                  onClick={handleCancel}
                  className="px-4 py-2 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 font-medium rounded-xl hover:bg-slate-100 dark:hover:bg-slate-100 dark:bg-zinc-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <button 
                  onClick={handleSave}
                  className="px-6 py-2 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors shadow-sm flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-500 dark:text-zinc-400 mb-1">Full Name</label>
                    <input 
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full max-w-md px-4 py-2 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-indigo-500/50"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-3xl font-bold text-slate-800 dark:text-zinc-100">{displayedUser.name}</h1>
                  <div className="flex items-center gap-2 text-slate-500 dark:text-zinc-400 mt-2">
                    <Shield className="w-4 h-4 text-indigo-500" />
                    <span className="font-medium text-slate-700 dark:text-zinc-300">{displayedUser.role}</span>
                  </div>
                </>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-slate-200 dark:border-zinc-800">
              <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-[#1e1e1e] rounded-2xl border border-slate-100 dark:border-zinc-800/50">
                <div className="w-12 h-12 bg-slate-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-slate-500 dark:text-zinc-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-400 dark:text-zinc-500">Email Address</p>
                  {isEditing ? (
                    <input 
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full mt-1 px-3 py-1 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg text-slate-800 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-indigo-500/50"
                    />
                  ) : (
                    <p className="font-semibold text-slate-800 dark:text-zinc-100 truncate">
                      {isMyProfile || [ROLES?.SUPER_ADMIN, ROLES?.ADMIN].includes(currentUser?.role) ? displayedUser.email : 'Hidden for privacy'}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-[#1e1e1e] rounded-2xl border border-slate-100 dark:border-zinc-800/50">
                <div className="w-12 h-12 bg-slate-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-slate-500 dark:text-zinc-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-400 dark:text-zinc-500">Account ID</p>
                  <p className="font-semibold text-slate-800 dark:text-zinc-100">{displayedUser.id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
