import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_USERS, ROLES } from '../data/mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('auth_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem('registered_users');
    if (savedUsers) return JSON.parse(savedUsers);
    return MOCK_USERS.map(u => ({ ...u, password: 'password123', status: 'Active' }));
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('auth_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('registered_users', JSON.stringify(users));
  }, [users]);

  const login = (email, password) => {
    const regUser = users.find(u => u.email === email);
    if (regUser && regUser.password === password) {
      const { password: _, ...userWithoutPassword } = regUser;
      setUser(userWithoutPassword);
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password' };
  };

  const signup = (name, email, password, role = ROLES.VIEWER) => {
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'Email already exists' };
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      role,
      status: 'Active',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
    };

    setUsers(prev => [...prev, newUser]);
    
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updates) => {
    if (!user) return { success: false, error: 'Not logged in' };
    
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    
    setUsers(prev => prev.map(u => 
      u.id === user.id ? { ...u, ...updates } : u
    ));
    
    return { success: true };
  };

  const updateUser = (userId, updates) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, ...updates } : u
    ));
    
    if (user && user.id === userId) {
      setUser(prev => ({ ...prev, ...updates }));
    }
    return { success: true };
  };

  const deleteUser = (userId) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    if (user && user.id === userId) {
      setUser(null);
    }
    return { success: true };
  };

  const addUser = (newUser) => {
    if (users.find(u => u.email === newUser.email)) {
      return { success: false, error: 'Email already exists' };
    }
    const createdUser = {
      id: Date.now().toString(),
      status: 'Active',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newUser.name)}&background=random`,
      ...newUser
    };
    setUsers(prev => [...prev, createdUser]);
    return { success: true, user: createdUser };
  };

  const resetPassword = (email, newPassword) => {
    const exists = users.some(u => u.email === email);
    if (!exists) return { success: false, error: 'Email address not found' };

    setUsers(prev => prev.map(u => 
      u.email === email ? { ...u, password: newPassword } : u
    ));
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      users, 
      login, 
      signup, 
      logout, 
      updateProfile, 
      updateUser, 
      deleteUser, 
      addUser, 
      resetPassword 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
