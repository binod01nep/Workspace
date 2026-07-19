import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { MOCK_TASKS, MOCK_PROJECTS, MOCK_NOTIFICATIONS, MOCK_MESSAGES, MOCK_SUBMISSIONS, ROLES } from '../data/mockData';
import { useAuth } from './AuthContext';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const { user, users } = useAuth() || {};
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('app_tasks');
    return saved ? JSON.parse(saved) : MOCK_TASKS;
  });

  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('app_projects');
    if (saved) return JSON.parse(saved);
    // Ensure mock projects have a default priority attribute
    return MOCK_PROJECTS.map(p => ({
      priority: p.id === 'p1' ? 'High' : p.id === 'p2' ? 'Medium' : 'Low',
      description: '',
      ...p
    }));
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('app_notifications');
    return saved ? JSON.parse(saved) : MOCK_NOTIFICATIONS;
  });

  const [xp, setXp] = useState(() => {
    const saved = localStorage.getItem('app_xp');
    return saved ? parseInt(saved, 10) : 150; // default starting XP
  });

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('app_messages');
    return saved ? JSON.parse(saved) : MOCK_MESSAGES;
  });

  const [groups, setGroups] = useState(() => {
    const saved = localStorage.getItem('app_groups');
    return saved ? JSON.parse(saved) : [];
  });

  const [submissions, setSubmissions] = useState(() => {
    const saved = localStorage.getItem('app_submissions');
    return saved ? JSON.parse(saved) : MOCK_SUBMISSIONS;
  });

  const [traineeApplications, setTraineeApplications] = useState(() => {
    const saved = localStorage.getItem('app_trainee_applications');
    return saved ? JSON.parse(saved) : [];
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    localStorage.setItem('app_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('app_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('app_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('app_xp', xp.toString());
  }, [xp]);

  useEffect(() => {
    localStorage.setItem('app_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('app_groups', JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem('app_submissions', JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem('app_trainee_applications', JSON.stringify(traineeApplications));
  }, [traineeApplications]);

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'app_messages' && e.newValue) {
        setMessages(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const prevMessagesRef = useRef(messages);
  useEffect(() => {
    if (messages.length > prevMessagesRef.current.length) {
      const newMsgs = messages.slice(prevMessagesRef.current.length);
      newMsgs.forEach(msg => {
        if (user && msg.senderId !== user.id && window.location.pathname !== '/messaging') {
          const sender = users.find(u => u.id === msg.senderId);
          const senderName = sender ? sender.name : 'Someone';
          setNotifications(prev => [
            {
              id: `msg_notif_${msg.id}`,
              title: 'New Message',
              message: `${senderName} has sent a message`,
              isRead: false,
              date: new Date().toISOString(),
              type: 'message'
            },
            ...prev
          ]);
        }
      });
    }
    prevMessagesRef.current = messages;
  }, [messages, user, users]);

  const moveTask = (taskId, sourceCol, destCol, sourceIdx, destIdx) => {
    setTasks(prev => {
      const newTasks = { ...prev };
      
      const sourceList = [...(newTasks[sourceCol] || [])];
      const taskIndex = sourceList.findIndex(t => t.id === taskId);
      if (taskIndex === -1) return prev;
      
      const [movedTask] = sourceList.splice(taskIndex, 1);
      newTasks[sourceCol] = sourceList;
      
      const destList = [...(newTasks[destCol] || [])];
      
      const isTrainee = user?.role === ROLES.TRAINEE;
      
      let insertIndex = destIdx;
      if (isTrainee) {
        const filteredDestTasks = destList.filter(t => {
          if (t.id === taskId) return false;
          if (t.assignee === user?.id) return true;
          if (t.assignee && t.assignee.startsWith('group_')) {
            const groupId = t.assignee.replace('group_', '');
            const group = (groups || []).find(g => g.id === groupId);
            if (group && group.members.includes(user?.id)) return true;
          }
          return false;
        });
        
        if (destIdx < filteredDestTasks.length) {
          const targetTask = filteredDestTasks[destIdx];
          const idx = destList.findIndex(t => t.id === targetTask.id);
          if (idx !== -1) {
            insertIndex = idx;
          } else {
            insertIndex = destList.length;
          }
        } else {
          insertIndex = destList.length;
        }
      }
      
      destList.splice(insertIndex, 0, movedTask);
      newTasks[destCol] = destList;
      
      // Add XP if moved to done
      if (destCol === 'done' && sourceCol !== 'done') {
        addXp(50);
      }
      
      return newTasks;
    });
  };

  const addXp = (amount) => {
    setXp(prev => prev + amount);
  };

  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const addMessage = (message) => {
    setMessages(prev => [...prev, message]);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const createGroup = (name, members) => {
    setGroups(prev => [...prev, { id: Date.now().toString(), name, members }]);
  };

  const createProject = (projectData) => {
    const newProject = {
      id: `p${Date.now()}`,
      progress: 0,
      members: projectData.members || [],
      status: projectData.status || 'Planning',
      priority: projectData.priority || 'Medium',
      description: projectData.description || '',
      ...projectData
    };
    setProjects(prev => [...prev, newProject]);
  };

  const updateProject = (projectId, updates) => {
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, ...updates } : p));
  };

  const deleteProject = (projectId) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
  };

  const addSubmission = (newSub) => {
    const createdSub = {
      id: `s${Date.now()}`,
      status: 'Pending',
      date: new Date().toISOString(),
      ...newSub
    };
    setSubmissions(prev => [createdSub, ...prev]);

    // Move task to review status when work is submitted
    setTasks(prevTasks => {
      const newTasks = { ...prevTasks };
      let foundTask = null;
      let sourceCol = null;
      let taskIndex = -1;

      for (const col of Object.keys(newTasks)) {
        const idx = newTasks[col].findIndex(t => t.id === newSub.taskId);
        if (idx !== -1) {
          foundTask = newTasks[col][idx];
          sourceCol = col;
          taskIndex = idx;
          break;
        }
      }

      if (foundTask && sourceCol && sourceCol !== 'review') {
        newTasks[sourceCol].splice(taskIndex, 1);
        foundTask.status = 'Review';
        newTasks['review'].push(foundTask);
      }

      return newTasks;
    });

    // Add a notification for submissions
    setNotifications(prev => [
      {
        id: `n${Date.now()}`,
        title: 'New Submission',
        message: `Task submission received for task #${newSub.taskId}`,
        isRead: false,
        date: new Date().toISOString()
      },
      ...prev
    ]);
  };

  const updateSubmissionStatus = (submissionId, newStatus) => {
    setSubmissions(prev => prev.map(sub => {
      if (sub.id === submissionId) {
        const updatedSub = { ...sub, status: newStatus };
        
        // Update task status on submission approval or rejection
        setTasks(prevTasks => {
          const newTasks = { ...prevTasks };
          let foundTask = null;
          let sourceCol = null;
          let taskIndex = -1;

          for (const col of Object.keys(newTasks)) {
            const idx = newTasks[col].findIndex(t => t.id === sub.taskId);
            if (idx !== -1) {
              foundTask = newTasks[col][idx];
              sourceCol = col;
              taskIndex = idx;
              break;
            }
          }

          if (foundTask && sourceCol) {
            const targetCol = newStatus === 'Approved' ? 'done' : 'inProgress';
            if (sourceCol !== targetCol) {
              newTasks[sourceCol].splice(taskIndex, 1);
              foundTask.status = newStatus === 'Approved' ? 'Done' : 'In Progress';
              newTasks[targetCol].push(foundTask);
            }
          }

          return newTasks;
        });

        return updatedSub;
      }
      return sub;
    }));
  };

  const applyForTrainee = (userId) => {
    setTraineeApplications(prev => {
      if (prev.some(app => app.userId === userId && app.status === 'Pending')) return prev;
      return [
        ...prev.filter(app => app.userId !== userId),
        { userId, status: 'Pending', date: new Date().toISOString() }
      ];
    });
  };

  const reviewApplication = (userId, action, updateUser) => {
    setTraineeApplications(prev => prev.map(app => 
      app.userId === userId ? { ...app, status: action === 'Approve' ? 'Approved' : 'Rejected' } : app
    ));

    if (action === 'Approve') {
      updateUser(userId, { role: 'Trainee' });
    }
  };

  return (
    <AppContext.Provider value={{
      tasks, setTasks, moveTask,
      projects, setProjects, createProject, updateProject, deleteProject,
      notifications, markNotificationRead,
      xp, addXp,
      messages, addMessage,
      groups, createGroup,
      submissions, setSubmissions, addSubmission, updateSubmissionStatus,
      traineeApplications, applyForTrainee, reviewApplication,
      isSidebarOpen, toggleSidebar
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
