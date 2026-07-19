import React, { useState } from 'react';
import { MOCK_USERS } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { Send, Image as ImageIcon, Smile } from 'lucide-react';
import { cn } from '../lib/utils';

export const Messaging = () => {
  const { user } = useAuth();
  const { messages, addMessage } = useApp();
  const [newMessage, setNewMessage] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const newMsg = {
      id: Date.now().toString(),
      senderId: user.id,
      text: newMessage,
      timestamp: new Date()
    };
    
    addMessage(newMsg);
    setNewMessage('');
  };

  const getUser = (id) => MOCK_USERS.find(u => u.id === id);

  return (
    <div className="h-[calc(100vh-8rem)] flex bg-white dark:bg-[#242424] rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden text-slate-800 dark:text-zinc-100">
      <div className="w-80 border-r border-slate-200 dark:border-zinc-800 flex flex-col bg-slate-50 dark:bg-[#1e1e1e]">
        <div className="p-4 border-b border-slate-200 dark:border-zinc-800">
          <h2 className="font-bold text-lg">Chats</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {MOCK_USERS.filter(u => u.id !== user?.id).map(contact => (
            <div key={contact.id} className="flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-100 dark:bg-zinc-800 cursor-pointer transition-colors">
              <div className="relative">
                <img src={contact.avatar} className="w-10 h-10 rounded-full border border-slate-200 dark:border-zinc-700" alt={contact.name} />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#1e1e1e] rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold truncate">{contact.name}</h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 truncate">Available</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-white dark:bg-[#242424]">
        <div className="p-4 border-b border-slate-200 dark:border-zinc-800 flex items-center space-x-3">
          <img src={getUser('3')?.avatar} className="w-10 h-10 rounded-full border border-slate-200 dark:border-zinc-700" alt="Chat" />
          <div>
            <h3 className="font-bold">Team Chat</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">3 members online</p>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {messages.map((msg) => {
            const isMe = msg.senderId === user?.id;
            const sender = getUser(msg.senderId) || user; // Fallback to current user if not in mock data
            
            return (
              <div key={msg.id} className={cn("flex items-end space-x-2", isMe && "flex-row-reverse space-x-reverse")}>
                {!isMe && <img src={sender?.avatar} className="w-8 h-8 rounded-full border border-slate-200 dark:border-zinc-700" alt={sender?.name} />}
                <div className={cn(
                  "max-w-[70%] p-4 shadow-sm",
                  isMe ? "bg-blue-600 dark:bg-indigo-600 text-white rounded-2xl rounded-br-sm" : "bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-100 rounded-2xl rounded-bl-sm"
                )}>
                  {!isMe && <p className="text-xs font-semibold mb-1 opacity-70 text-slate-700 dark:text-zinc-300">{sender?.name}</p>}
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 bg-slate-50 dark:bg-[#1e1e1e] border-t border-slate-200 dark:border-zinc-800">
          <form onSubmit={handleSend} className="flex items-center space-x-2">
            <button type="button" className="p-2 text-slate-400 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-slate-700 dark:text-zinc-300 transition-colors">
              <ImageIcon className="w-5 h-5" />
            </button>
            <input 
              type="text" 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..." 
              className="flex-1 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-full px-4 py-2.5 text-sm text-slate-800 dark:text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-indigo-500/50 focus:border-blue-500 dark:focus:border-blue-600 dark:border-indigo-500 transition-all"
            />
            <button type="button" className="p-2 text-slate-400 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-slate-700 dark:text-zinc-300 transition-colors hidden sm:block">
              <Smile className="w-5 h-5" />
            </button>
            <button type="submit" className="p-2.5 bg-blue-600 dark:bg-indigo-600 text-white rounded-full hover:bg-blue-700 dark:hover:bg-indigo-700 transition-colors shadow-sm">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
