import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Calendar, Users, CheckSquare } from 'lucide-react';

export const ProjectDetails = () => {
  const { id } = useParams();
  const { projects, tasks } = useApp();
  const { users } = useAuth();
  
  const project = projects.find(p => p.id === id);
  const projectTasks = Object.values(tasks).flat().filter(t => t.projectId === id);
  const teamMembers = project?.members.map(mId => users.find(u => u.id === mId) || { id: mId, name: 'Unknown User' }) || [];

  if (!project) {
    return <div className="p-8 text-center text-slate-500">Project not found</div>;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/projects" className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
          <ArrowLeft className="w-6 h-6 text-slate-600 dark:text-zinc-400" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-zinc-100">{project.name}</h1>
          <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
            project.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
            project.status === 'Active' ? 'bg-blue-100 dark:bg-indigo-500/20 text-blue-700 dark:text-indigo-300' :
            'bg-slate-100 dark:bg-zinc-900 text-slate-700 dark:text-zinc-300'
          }`}>
            {project.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-[#242424] rounded-2xl p-6 border border-slate-200 dark:border-zinc-700 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 dark:text-zinc-100 mb-4">Description</h2>
            <p className="text-slate-600 dark:text-zinc-400 leading-relaxed whitespace-pre-wrap">
              {project.description || "No description provided by the manager yet. This project focuses on delivering high-quality results for the associated goals."}
            </p>
          </div>

          <div className="bg-white dark:bg-[#242424] rounded-2xl p-6 border border-slate-200 dark:border-zinc-700 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 dark:text-zinc-100 mb-4 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-blue-600 dark:text-indigo-500" /> Associated Tasks
            </h2>
            {projectTasks.length === 0 ? (
              <p className="text-slate-500 dark:text-zinc-500 italic">No tasks assigned yet.</p>
            ) : (
              <div className="space-y-3">
                {projectTasks.map(task => (
                  <div key={task.id} className="p-4 rounded-xl border border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-[#1e1e1e] flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-slate-800 dark:text-zinc-100">{task.title}</h4>
                      <p className="text-sm text-slate-500 dark:text-zinc-400">{task.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-[#242424] rounded-2xl p-6 border border-slate-200 dark:border-zinc-700 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 dark:text-zinc-100 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600 dark:text-indigo-500" /> Team Members
            </h2>
            <div className="space-y-4">
              {teamMembers.map((member, idx) => (
                <Link to={`/profile/${member.id}`} key={idx} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <img src={member.avatar || `https://i.pravatar.cc/150?u=${member.id}`} alt={member.name} className="w-10 h-10 rounded-full" />
                  <div>
                    <h4 className="font-medium text-slate-800 dark:text-zinc-100 text-sm">{member.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">{member.role || 'Member'}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-[#242424] rounded-2xl p-6 border border-slate-200 dark:border-zinc-700 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 dark:text-zinc-100 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600 dark:text-indigo-500" /> Timeline
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-zinc-400">Created</span>
                <span className="font-medium text-slate-800 dark:text-zinc-100">Oct 12, 2026</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-zinc-400">Deadline</span>
                <span className="font-medium text-slate-800 dark:text-zinc-100">Nov 25, 2026</span>
              </div>
            </div>
            
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-slate-700 dark:text-zinc-300">Progress</span>
                <span className="font-bold text-blue-600 dark:text-indigo-400">{project.progress}%</span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 dark:bg-indigo-500 rounded-full" style={{ width: `${project.progress}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
