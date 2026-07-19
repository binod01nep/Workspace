import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { MOCK_PERFORMANCE_DATA, ROLES } from '../data/mockData';
import { Briefcase, CheckCircle2, Clock, Users as UsersIcon, Sparkles } from 'lucide-react';

export const Dashboard = () => {
  const { user, users, updateUser } = useAuth();
  const { projects, tasks, traineeApplications, applyForTrainee, reviewApplication } = useApp();

  const viewerApp = (traineeApplications || []).find(app => app.userId === user?.id);

  if (user?.role === ROLES.VIEWER) {
    return (
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl translate-x-20 -translate-y-20"></div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">Welcome to WorkSpace Pro, {user?.name.split(' ')[0]}! 👋</h1>
          <p className="text-blue-100 text-sm max-w-2xl leading-relaxed">
            You are currently logged in as a <strong>Visitor (Viewer)</strong>. Explore what our professional workspace offers and submit an application to join the team as an active trainee.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Explanation Card */}
          <div className="bg-white dark:bg-[#242424] p-6 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-slate-800 dark:text-zinc-100">What is this Platform?</h2>
            <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed">
              WorkSpace Pro is a state-of-the-art task management and project delivery portal. It provides managers with advanced control over priorities and groups, and allows trainees to collaborate and submit work inside interactive Kanban boards.
            </p>
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">How to join:</h3>
              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-zinc-300">
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-50 dark:bg-zinc-800 text-blue-600 dark:text-indigo-400 flex items-center justify-center font-bold text-[10px]">1</span>
                  <span>Click "Apply for Trainee Role" button on this page.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-50 dark:bg-zinc-800 text-blue-600 dark:text-indigo-400 flex items-center justify-center font-bold text-[10px]">2</span>
                  <span>An Administrator will review your account email and profile.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-50 dark:bg-zinc-800 text-blue-600 dark:text-indigo-400 flex items-center justify-center font-bold text-[10px]">3</span>
                  <span>Once approved, join trainee groups, view assigned projects, and claim tasks!</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Action Application Card */}
          <div className="bg-white dark:bg-[#242424] p-6 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-zinc-100 mb-2">Trainee Application</h2>
              <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">
                Submit your profile for administrative evaluation. You will immediately unlock role permissions upon acceptance.
              </p>
            </div>

            <div className="pt-6">
              {viewerApp ? (
                <div className="space-y-4">
                  <div className={`p-4 rounded-2xl border text-center font-semibold text-sm ${
                    viewerApp.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                    viewerApp.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                    'bg-red-500/10 text-red-500 border-red-500/20'
                  }`}>
                    Application Status: {viewerApp.status}
                  </div>
                  {viewerApp.status === 'Rejected' && (
                    <button 
                      onClick={() => applyForTrainee(user.id)}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-medium rounded-xl transition-all shadow-md cursor-pointer"
                    >
                      Re-apply for Trainee
                    </button>
                  )}
                </div>
              ) : (
                <button 
                  onClick={() => applyForTrainee(user.id)}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-medium rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
                >
                  Apply for Trainee Role
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalProjects = projects.length;
  const completedTasks = tasks.done.length;
  const pendingTasks = tasks.todo.length + tasks.inProgress.length + tasks.review.length;

  const stats = [
    { label: 'Active Projects', value: totalProjects, icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Completed Tasks', value: completedTasks, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'Pending Tasks', value: pendingTasks, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-100' },
    { label: 'Team Members', value: users.length, icon: UsersIcon, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  const pendingApps = (traineeApplications || []).filter(app => app.status === 'Pending');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-zinc-100">Welcome back, {user?.name.split(' ')[0]} 👋</h1>
        <p className="text-slate-500 dark:text-zinc-400 mt-1">Here's what's happening in your workspace today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-[#242424] p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm flex items-center space-x-4">
            <div className={`p-4 rounded-xl ${stat.bg.replace('100', '500/20')} ${stat.color.replace('600', '400')}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-zinc-100">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pending Trainee Applications (Admin Review Process) */}
      {user?.role === ROLES.ADMIN && (
        <div className="bg-white dark:bg-[#242424] rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden mt-8">
          <div className="p-4 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/20">
            <h3 className="font-bold text-slate-800 dark:text-zinc-100 text-sm">Viewer to Trainee Applications ({pendingApps.length})</h3>
          </div>
          
          <div className="divide-y divide-slate-100 dark:divide-zinc-800">
            {pendingApps.map(app => {
              const applicant = users.find(u => u.id === app.userId);
              if (!applicant) return null;
              
              return (
                <div key={app.userId} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src={applicant.avatar} className="w-10 h-10 rounded-full object-cover aspect-square" alt="" />
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-zinc-100 text-sm">{applicant.name}</p>
                      <p className="text-xs text-slate-500 font-mono">{applicant.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => reviewApplication(app.userId, 'Approve', updateUser)}
                      className="px-3.5 py-1.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/25 rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => reviewApplication(app.userId, 'Reject', updateUser)}
                      className="px-3.5 py-1.5 bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/25 rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              );
            })}
            
            {pendingApps.length === 0 && (
              <p className="text-center p-8 text-xs text-slate-400 dark:text-zinc-500 italic">No pending trainee applications to review.</p>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#242424] p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 dark:text-zinc-100 mb-6">Weekly Performance</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_PERFORMANCE_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3f3f46" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#a1a1aa' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#a1a1aa' }} />
                <Tooltip cursor={{ fill: '#27272a' }} contentStyle={{ borderRadius: '12px', border: '1px solid #3f3f46', backgroundColor: '#18181b', color: '#f4f4f5' }} />
                <Bar dataKey="tasks" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-[#242424] p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 dark:text-zinc-100 mb-6">Activity Overview</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MOCK_PERFORMANCE_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3f3f46" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#a1a1aa' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#a1a1aa' }} />
                <Tooltip cursor={{ stroke: '#3f3f46', strokeWidth: 2, strokeDasharray: '5 5' }} contentStyle={{ borderRadius: '12px', border: '1px solid #3f3f46', backgroundColor: '#18181b', color: '#f4f4f5' }} />
                <Line type="monotone" dataKey="tasks" stroke="#8b5cf6" strokeWidth={3} dot={{ strokeWidth: 2, r: 4, fill: '#18181b' }} activeDot={{ r: 6, fill: '#8b5cf6' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Activity Feed Placeholder */}
      <div className="bg-white dark:bg-[#242424] p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 dark:text-zinc-100 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-50 dark:bg-zinc-800/50 transition-colors">
             <div className="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
             <div>
                <p className="text-slate-800 dark:text-zinc-100 text-sm">Dave submitted <span className="font-semibold">Design Mockups</span></p>
                <p className="text-slate-400 dark:text-zinc-500 text-xs mt-1">2 hours ago</p>
             </div>
          </div>
          <div className="flex items-start space-x-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-50 dark:bg-zinc-800/50 transition-colors">
             <div className="w-2 h-2 mt-2 rounded-full bg-emerald-500"></div>
             <div>
                <p className="text-slate-800 dark:text-zinc-100 text-sm">Charlie approved <span className="font-semibold">Wireframes</span></p>
                <p className="text-slate-400 dark:text-zinc-500 text-xs mt-1">1 day ago</p>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};
