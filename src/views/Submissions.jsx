import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { Check, X, FileText, Clock, Send, Sparkles } from 'lucide-react';
import { ROLES } from '../data/mockData';

export const Submissions = () => {
  const { submissions, updateSubmissionStatus, addSubmission, tasks } = useApp();
  const { user, users } = useAuth();

  // Trainee Submission form states
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [submissionContent, setSubmissionContent] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [formError, setFormError] = useState('');

  // Find all active tasks assigned to this trainee (not in Done or Review column)
  const allTasks = Object.entries(tasks).flatMap(([columnId, columnTasks]) => 
    (columnTasks || []).map(t => ({ ...t, columnId }))
  );
  const traineeTasks = allTasks.filter(t => 
    t.assignee === user?.id && 
    t.columnId !== 'done' && 
    t.columnId !== 'review'
  );

  // Filter submissions so trainees only see their own submissions in the logs
  const filteredSubmissions = submissions.filter(sub => {
    if (user?.role === ROLES.TRAINEE) {
      return sub.traineeId === user.id;
    }
    return true;
  });

  const handleSubmitWork = (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!selectedTaskId) {
      setFormError('Please select a task to submit work for');
      return;
    }
    if (!submissionContent.trim()) {
      setFormError('Please write description content for your submission');
      return;
    }

    addSubmission({
      taskId: selectedTaskId,
      traineeId: user.id,
      content: submissionContent
    });

    setFormSuccess('Work submitted successfully for review!');
    setSelectedTaskId('');
    setSubmissionContent('');
  };

  const getTraineeName = (traineeId) => {
    const found = users.find(u => u.id === traineeId);
    return found ? found.name : `Trainee ID: ${traineeId}`;
  };

  const getTraineeAvatar = (traineeId) => {
    const found = users.find(u => u.id === traineeId);
    return found ? found.avatar : `https://i.pravatar.cc/150?u=${traineeId}`;
  };

  const getTaskTitle = (taskId) => {
    const found = allTasks.find(t => t.id === taskId);
    return found ? found.title : `Task #${taskId}`;
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-zinc-100">Work Submissions</h1>
        <p className="text-slate-500 dark:text-zinc-400 mt-1">
          {user?.role === ROLES.MANAGER 
            ? 'Review, approve, or request changes on trainee work submissions.' 
            : 'Submit your completed tasks and view feedback logs.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Submit Work Form (Trainees Only) */}
        {user?.role === ROLES.TRAINEE && (
          <div className="lg:col-span-1 bg-white dark:bg-[#242424] p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm h-fit">
            <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              <span>Submit Completed Task</span>
            </h3>

            {formSuccess && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 p-3 rounded-xl text-xs mb-4 flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>{formSuccess}</span>
              </div>
            )}
            {formError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-xs mb-4">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmitWork} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">Select Task</label>
                <select 
                  value={selectedTaskId}
                  onChange={e => setSelectedTaskId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="">-- Choose Assigned Task --</option>
                  {traineeTasks.map(t => (
                    <option key={t.id} value={t.id}>{t.title}</option>
                  ))}
                </select>
                {traineeTasks.length === 0 && (
                  <p className="text-[11px] text-slate-400 mt-1.5 italic">No pending tasks assigned to you.</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">Submission Notes</label>
                <textarea 
                  rows={4}
                  value={submissionContent}
                  onChange={e => setSubmissionContent(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Describe your solution, link repository branch, etc."
                />
              </div>

              <button 
                type="submit" 
                disabled={traineeTasks.length === 0}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-medium rounded-xl text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit For Review</span>
              </button>
            </form>
          </div>
        )}

        {/* Right Side: List of Submissions */}
        <div className={user?.role === ROLES.TRAINEE ? "lg:col-span-2 space-y-4" : "col-span-3 space-y-4"}>
          <div className="bg-white dark:bg-[#242424] p-4 rounded-xl border border-slate-100 dark:border-zinc-800 flex justify-between items-center shadow-xs">
            <h3 className="font-semibold text-slate-855 text-sm">Review Logs ({filteredSubmissions.length})</h3>
            <div className="text-xs text-slate-400">Instantly synced</div>
          </div>

          {filteredSubmissions.map(sub => (
            <div key={sub.id} className="bg-white dark:bg-[#242424] p-6 rounded-2xl border border-slate-200 dark:border-zinc-700 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
              <div className="flex items-start space-x-4 flex-1 min-w-0">
                <div className={`p-3 rounded-xl shrink-0 ${sub.status === 'Approved' ? 'bg-emerald-100 text-emerald-600' : sub.status === 'Rejected' ? 'bg-red-100 text-red-600' : 'bg-blue-100 dark:bg-indigo-500/20 text-blue-600 dark:text-indigo-400'}`}>
                  <FileText className="w-6 h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-100 truncate">{getTaskTitle(sub.taskId)}</h3>
                  <p className="text-slate-500 dark:text-zinc-400 mt-1 text-sm leading-relaxed whitespace-pre-wrap">{sub.content}</p>
                  
                  <div className="flex items-center space-x-4 mt-3 text-xs text-slate-500 dark:text-zinc-400">
                    <div className="flex items-center space-x-1.5">
                      <img src={getTraineeAvatar(sub.traineeId)} className="w-5 h-5 rounded-full aspect-square object-cover" alt="Trainee" />
                      <span className="font-semibold text-slate-700 dark:text-zinc-300">{getTraineeName(sub.traineeId)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(sub.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 w-full md:w-auto shrink-0 border-t md:border-t-0 pt-4 md:pt-0">
                {sub.status === 'Pending' && user?.role === ROLES.MANAGER ? (
                  <>
                    <button 
                      onClick={() => updateSubmissionStatus(sub.id, 'Approved')}
                      className="flex-1 md:flex-none flex items-center justify-center space-x-1.5 px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 rounded-xl transition-colors font-medium text-xs cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>Approve</span>
                    </button>
                    <button 
                      onClick={() => updateSubmissionStatus(sub.id, 'Rejected')}
                      className="flex-1 md:flex-none flex items-center justify-center space-x-1.5 px-4 py-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-xl transition-colors font-medium text-xs cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  </>
                ) : (
                  <span className={`px-4 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wider ${
                    sub.status === 'Approved' ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : 
                    sub.status === 'Rejected' ? 'bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400' : 
                    'bg-slate-100 dark:bg-zinc-800 text-slate-655 dark:text-zinc-300'
                  }`}>
                    {sub.status}
                  </span>
                )}
              </div>
            </div>
          ))}
          {submissions.length === 0 && (
            <div className="bg-white dark:bg-[#242424] p-12 text-center text-slate-500 rounded-2xl border border-slate-100 dark:border-zinc-850 italic">No submissions logs logged in system.</div>
          )}
        </div>
      </div>
    </div>
  );
};
