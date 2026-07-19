import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowRight, FolderKanban, CheckSquare, Users, BarChart2, Mail, Phone, MapPin, Sparkles, Shield } from 'lucide-react';

export const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#121214] text-slate-800 dark:text-zinc-100 transition-colors duration-300 font-sans overflow-x-hidden">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[100px] pointer-events-none"></div>
      <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none"></div>
      
      {/* Header / Nav */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-50/70 dark:bg-[#121214]/70 border-b border-slate-200 dark:border-zinc-800 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-black text-xl shadow-md">
              W
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              WorkSpace
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600 dark:text-zinc-300">
            <a href="#features" className="hover:text-blue-600 dark:hover:text-indigo-400 transition-colors">Features</a>
            <a href="#benefits" className="hover:text-blue-600 dark:hover:text-indigo-400 transition-colors">Benefits</a>
            <a href="#contact" className="hover:text-blue-600 dark:hover:text-indigo-400 transition-colors">Contact</a>
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <Link 
                to="/" 
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md transition-all flex items-center gap-2 hover:scale-[1.02]"
              >
                Go to Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  to="/login"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md transition-all hover:scale-[1.02]"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 md:pt-32 md:pb-36">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-indigo-500/10 border border-blue-100 dark:border-indigo-500/20 text-xs font-semibold text-blue-700 dark:text-indigo-300 mb-6">
            <Sparkles className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span>Introducing WorkSpace Pro Platform</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-zinc-50 tracking-tight leading-[1.1] mb-8">
            Collaborate, Manage & <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Elevate Your Projects
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-zinc-400 mb-10 leading-relaxed">
            The next-generation workspace for team task management, project execution, and interactive training workflows. Empower your managers, trainees, and admins with a unified operations dashboard.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {user ? (
              <Link 
                to="/" 
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-semibold rounded-2xl shadow-xl hover:shadow-blue-500/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
              >
                Go to Dashboard <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-semibold rounded-2xl shadow-xl hover:shadow-blue-500/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
                >
                  Get Started for Free <ArrowRight className="w-5 h-5" />
                </Link>
                <a 
                  href="#features" 
                  className="w-full sm:w-auto px-8 py-4 border border-slate-300 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-200 font-semibold rounded-2xl transition-all"
                >
                  Explore Features
                </a>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Website Introduction Section */}
      <section className="py-20 bg-slate-100/50 dark:bg-[#161619] border-y border-slate-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-zinc-50 mb-6">
              A Fully Integrated Platform Built for Professional Workflows
            </h2>
            <p className="text-slate-600 dark:text-zinc-400 mb-6 leading-relaxed">
              Workspace was crafted to streamline how organizations design, assign, and approve projects. Rather than juggling separate tools for communication, performance metrics, and review flows, our system combines them into one dashboard.
            </p>
            <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">
              Admins retain total control over permissions, Managers drive project priorities and approve submissions, while Trainees easily access their work items in clean visual kanban boards.
            </p>
          </div>
          <div className="relative">
            <div className="w-full h-80 rounded-3xl bg-gradient-to-tr from-blue-600/20 to-indigo-600/20 border border-blue-500/20 dark:border-indigo-500/20 p-6 flex flex-col justify-between backdrop-blur-xl">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-white dark:bg-zinc-800 rounded-2xl flex items-center justify-center shadow-md">
                  <Shield className="w-6 h-6 text-blue-500" />
                </div>
                <div className="px-3 py-1 bg-emerald-500/20 text-emerald-500 text-xs font-semibold rounded-full border border-emerald-500/20">
                  Role Restructured
                </div>
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-zinc-50 mb-2">Granular Role System</h4>
                <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                  Toggle views between Super Admins, Admins, Managers, Trainees, and Viewers. Experience system workflows exactly as your stakeholders see them.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-zinc-50 mb-4">Core Feature Ecosystem</h2>
          <p className="text-slate-500 dark:text-zinc-400 max-w-lg mx-auto">Everything you need to deliver, supervise, and improve collaboration across your teams.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-white dark:bg-[#1c1c1f] rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 dark:bg-indigo-500/20 rounded-xl flex items-center justify-center text-blue-600 dark:text-indigo-400 mb-6">
              <FolderKanban className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">Project Execution</h3>
            <p className="text-sm text-slate-500 dark:text-zinc-400">Managers create project plans, define timelines, configure details, and select priorities.</p>
          </div>

          <div className="p-6 bg-white dark:bg-[#1c1c1f] rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6">
              <CheckSquare className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">Interactive Tasks</h3>
            <p className="text-sm text-slate-500 dark:text-zinc-400">Drag-and-drop kanban boards to map backlogs, progress status, and final reviews seamlessly.</p>
          </div>

          <div className="p-6 bg-white dark:bg-[#1c1c1f] rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">Group Routing</h3>
            <p className="text-sm text-slate-500 dark:text-zinc-400">Instantly generate sequential group IDs (GR001) and bulk-assign teams for streamlined actions.</p>
          </div>

          <div className="p-6 bg-white dark:bg-[#1c1c1f] rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-500/20 rounded-xl flex items-center justify-center text-orange-600 dark:text-orange-400 mb-6">
              <BarChart2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">Submissions Flow</h3>
            <p className="text-sm text-slate-500 dark:text-zinc-400">Operational approval triggers that automatically log statuses and update progress across roles.</p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-24 bg-slate-100/50 dark:bg-[#161619] border-y border-slate-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-zinc-50 mb-4">Core Platform Benefits</h2>
            <p className="text-slate-500 dark:text-zinc-400 max-w-lg mx-auto">Why choose WorkSpace to manage your projects and training pipelines?</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex gap-4">
              <div className="shrink-0 w-8 h-8 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                ✓
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">Absolute Control</h4>
                <p className="text-sm text-slate-500 dark:text-zinc-400">Separate permissions for Viewers, Trainees, Managers, Admins, and Super Admins prevent security leaks.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                ✓
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">Operational Transparency</h4>
                <p className="text-sm text-slate-500 dark:text-zinc-400">All submissions are updated in real-time, allowing team leaders to provide approval or reject instantly.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                ✓
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">Fluid Engagement</h4>
                <p className="text-sm text-slate-500 dark:text-zinc-400">Interactive live chats, notifications feed, and responsive profile systems keep everyone connected.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-4xl font-bold text-slate-900 dark:text-zinc-50 mb-6">Get In Touch</h2>
            <p className="text-slate-500 dark:text-zinc-400 mb-8 leading-relaxed">
              Have questions about Workspace? Whether you are a Manager wanting to onboard your teams, or an Admin setting up enterprise settings, our team is happy to assist.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-zinc-800 text-blue-600 dark:text-indigo-400 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Email us at</p>
                  <p className="text-sm font-semibold">support@workspace-pro.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-zinc-800 text-blue-600 dark:text-indigo-400 flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Call our hotline</p>
                  <p className="text-sm font-semibold">+1 (555) 382-9021</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-zinc-800 text-blue-600 dark:text-indigo-400 flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Headquarters</p>
                  <p className="text-sm font-semibold">One Infinite Loop, Cupertino, CA</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1c1c1f] p-8 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-sm">
            <h3 className="text-xl font-bold mb-6">Send a Quick Message</h3>
            <form onSubmit={e => e.preventDefault()} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Your Name</label>
                  <input type="text" className="w-full px-4 py-2 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="John" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Email</label>
                  <input type="email" className="w-full px-4 py-2 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="john@example.com" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Subject</label>
                <input type="text" className="w-full px-4 py-2 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="How can we help?" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Message</label>
                <textarea rows={4} className="w-full px-4 py-2 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Type your message details here..."></textarea>
              </div>
              <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors shadow-sm">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white font-black text-base shadow-sm">
              W
            </div>
            <span className="text-lg font-bold text-white">WorkSpace Pro</span>
          </div>

          <p>© 2026 WorkSpace Pro, Inc. All rights reserved.</p>

          <div className="flex space-x-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
