import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { MOCK_USERS, ROLES } from '../data/mockData';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { MoreHorizontal, MessageSquare, Paperclip, Clock, X } from 'lucide-react';

const columns = [
  { id: 'backlog', title: 'Backlog', color: 'bg-slate-200' },
  { id: 'todo', title: 'To Do', color: 'bg-blue-100 dark:bg-indigo-500/20' },
  { id: 'inProgress', title: 'In Progress', color: 'bg-yellow-100' },
  { id: 'review', title: 'Review', color: 'bg-purple-100' },
  { id: 'done', title: 'Done', color: 'bg-emerald-100' },
];

export const Tasks = () => {
  const { tasks, setTasks, moveTask, groups } = useApp();
  const { user, users } = useAuth();
  
  const [showNewTask, setShowNewTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('');

  const handleCreateTask = () => {
    if (!newTaskTitle) return;
    const newTask = {
      id: `t${Date.now()}`,
      title: newTaskTitle,
      projectId: 'p1',
      status: 'To Do',
      assignee: newTaskAssignee || user.id
    };
    
    setTasks(prev => ({
      ...prev,
      todo: [newTask, ...(prev.todo || [])]
    }));
    
    setShowNewTask(false);
    setNewTaskTitle('');
  };

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;
    moveTask(draggableId, source.droppableId, destination.droppableId, source.index, destination.index);
  };

  const getFilteredTasksForBoard = () => {
    if (user?.role !== ROLES.TRAINEE) {
      return tasks;
    }
    const traineeTasks = {};
    for (const colId of Object.keys(tasks)) {
      traineeTasks[colId] = (tasks[colId] || []).filter(t => {
        if (t.assignee === user.id) return true;
        if (t.assignee && t.assignee.startsWith('group_')) {
          const groupId = t.assignee.replace('group_', '');
          const group = (groups || []).find(g => g.id === groupId);
          if (group && group.members.includes(user.id)) return true;
        }
        return false;
      });
    }
    return traineeTasks;
  };

  const boardTasks = getFilteredTasksForBoard();

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-zinc-100">Task Board</h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-1">Manage your team's tasks and progress.</p>
        </div>
        {user?.role === ROLES.MANAGER && (
          <button 
            onClick={() => setShowNewTask(true)}
            className="bg-blue-600 dark:bg-indigo-600 hover:bg-blue-700 dark:hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-medium transition-colors shadow-sm"
          >
            + New Task
          </button>
        )}
      </div>

      {showNewTask && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#242424] p-6 rounded-2xl border border-slate-200 dark:border-zinc-700 shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-800 dark:text-zinc-100">Create New Task</h2>
              <button onClick={() => setShowNewTask(false)} className="text-slate-500 hover:text-slate-700 dark:hover:text-zinc-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Task Title" 
                className="w-full px-4 py-2 bg-slate-50 dark:bg-[#1e1e1e] border border-slate-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-zinc-100"
                value={newTaskTitle}
                onChange={e => setNewTaskTitle(e.target.value)}
              />
              <select 
                className="w-full px-4 py-2 bg-slate-50 dark:bg-[#1e1e1e] border border-slate-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-zinc-100"
                value={newTaskAssignee}
                onChange={e => setNewTaskAssignee(e.target.value)}
              >
                <option value="">Unassigned</option>
                <optgroup label="Groups">
                  {groups.map(g => (
                    <option key={`group_${g.id}`} value={`group_${g.id}`}>Group: {g.name}</option>
                  ))}
                </optgroup>
                <optgroup label="People">
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </optgroup>
              </select>
              <button onClick={handleCreateTask} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-xl transition-colors">
                Save Task
              </button>
            </div>
          </div>
        </div>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-1 space-x-4 overflow-x-auto pb-4">
          {columns.map(col => (
            <div key={col.id} className="flex flex-col bg-slate-50 dark:bg-[#1e1e1e]/50 rounded-2xl p-3 min-w-[280px] w-[280px] border border-slate-200 dark:border-zinc-700 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                  <span className={`w-3 h-3 rounded-full ${col.color.replace('bg-', 'bg-').replace('100', '400').replace('200', '400')}`}></span>
                  <h2 className="font-semibold text-slate-700 dark:text-zinc-300">{col.title}</h2>
                  <span className="text-xs bg-slate-200 text-slate-500 dark:text-zinc-400 px-2 py-0.5 rounded-full">{boardTasks[col.id]?.length || 0}</span>
                </div>
                <button className="text-slate-400 dark:text-zinc-500 hover:text-slate-500 dark:text-zinc-400 transition-colors">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              <Droppable droppableId={col.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 overflow-y-auto space-y-3 transition-colors ${snapshot.isDraggingOver ? 'bg-slate-100 dark:bg-zinc-900/80 rounded-xl' : ''}`}
                  >
                    {boardTasks[col.id]?.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`bg-white dark:bg-[#242424] p-4 rounded-xl shadow-sm border border-slate-200 dark:border-zinc-700 ${snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-500/20 rotate-2' : 'hover:border-blue-300'} transition-all`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <span className={`text-xs font-medium px-2 py-1 rounded-md ${col.color} ${col.color.replace('bg-', 'text-').replace('100', '700').replace('200', '700')}`}>
                                {task.projectId === 'p1' ? 'Design' : 'Engineering'}
                              </span>
                            </div>
                            <p className="font-medium text-slate-800 dark:text-zinc-100 mb-3">{task.title}</p>
                            <div className="flex justify-between items-center text-slate-400 dark:text-zinc-500 text-sm">
                              <div className="flex items-center space-x-3">
                                <div className="flex items-center space-x-1 hover:text-slate-500 dark:text-zinc-400 cursor-pointer transition-colors">
                                  <MessageSquare className="w-4 h-4" />
                                  <span className="text-xs">2</span>
                                </div>
                                <div className="flex items-center space-x-1 hover:text-slate-500 dark:text-zinc-400 cursor-pointer transition-colors">
                                  <Paperclip className="w-4 h-4" />
                                  <span className="text-xs">1</span>
                                </div>
                              </div>
                              <img src={`https://i.pravatar.cc/150?u=${task.assignee}`} alt="Assignee" className="w-6 h-6 rounded-full ring-2 ring-white" />
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};
