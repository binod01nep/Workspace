import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ROLES } from '../data/mockData';
import { LogIn, UserPlus, Key, Check } from 'lucide-react';
import { cn } from '../lib/utils';

export const Login = () => {
  const { login, signup, users, resetPassword } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [error, setError] = useState('');
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState(ROLES.VIEWER);

  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const res = login(email, password);
      if (!res.success) setError(res.error);
    } else {
      if (!name || !email || !password) {
        setError('Please fill in all required fields');
        return;
      }
      const res = signup(name, email, password, role);
      if (!res.success) setError(res.error);
    }
  };

  const handleFillMockUser = () => {
    // Helper to quick fill first mock user for testing
    const firstUser = users[0] || { email: 'alice@example.com' };
    setEmail(firstUser.email);
    setPassword('password123');
    setIsLogin(true);
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setForgotError('');

    if (forgotStep === 1) {
      if (!forgotEmail) {
        setForgotError('Please enter your email address');
        return;
      }
      const exists = users.some(u => u.email.toLowerCase() === forgotEmail.toLowerCase());
      if (!exists) {
        setForgotError('Email address not found');
        return;
      }
      // Generate simulated OTP
      const otp = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedOtp(otp);
      setForgotStep(2);
    } else if (forgotStep === 2) {
      if (!otpInput) {
        setForgotError('Please enter the OTP code');
        return;
      }
      if (otpInput === generatedOtp || otpInput === '1234') {
        setForgotStep(3);
      } else {
        setForgotError('Invalid OTP code. Please try again.');
      }
    } else if (forgotStep === 3) {
      if (newPassword.length < 6) {
        setForgotError('Password must be at least 6 characters long');
        return;
      }
      if (newPassword !== confirmPassword) {
        setForgotError('Passwords do not match');
        return;
      }
      const res = resetPassword(forgotEmail, newPassword);
      if (res.success) {
        setForgotSuccess('Password updated successfully! Please login with your new password.');
        setIsForgotPassword(false);
        setIsLogin(true);
        setForgotStep(1);
        setEmail(forgotEmail);
        setPassword(newPassword);
      } else {
        setForgotError(res.error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#18181b] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#242424] rounded-3xl shadow-xl border border-slate-200 dark:border-zinc-800 p-8 w-full max-w-md">
        
        {isForgotPassword ? (
          <div>
            {/* Forgot Password Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 dark:bg-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Key className="w-8 h-8 text-blue-600 dark:text-indigo-400" />
              </div>
              <h1 className="text-3xl font-bold text-slate-800 dark:text-zinc-100">
                Reset Password
              </h1>
              <p className="text-slate-500 dark:text-zinc-400 mt-2">
                {forgotStep === 1 && 'Enter your registered email to receive an OTP code'}
                {forgotStep === 2 && 'Enter the 4-digit code sent to your email'}
                {forgotStep === 3 && 'Choose a strong new password for your account'}
              </p>
            </div>

            {forgotError && (
              <div className="bg-red-500/10 text-red-400 p-3 rounded-lg text-sm mb-4 border border-red-500/20">
                {forgotError}
              </div>
            )}

            {forgotStep === 2 && generatedOtp && (
              <div className="bg-emerald-500/10 text-emerald-500 p-3 rounded-lg text-sm mb-4 border border-emerald-500/20 font-medium">
                [SIMULATION] OTP code sent: <span className="font-bold text-lg">{generatedOtp}</span> (or enter 1234)
              </div>
            )}

            <form onSubmit={handleForgotSubmit} className="space-y-4">
              {forgotStep === 1 && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-indigo-500/20 focus:border-blue-500 dark:focus:border-blue-600 dark:border-indigo-500 transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              )}

              {forgotStep === 2 && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1">Enter OTP Code</label>
                  <input
                    type="text"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    maxLength={4}
                    className="w-full px-4 py-2 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-800 dark:text-zinc-100 text-center tracking-widest font-bold text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-indigo-500/20 focus:border-blue-500 dark:focus:border-blue-600 dark:border-indigo-500 transition-all"
                    placeholder="••••"
                  />
                </div>
              )}

              {forgotStep === 3 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-indigo-500/20 focus:border-blue-500 dark:focus:border-blue-600 dark:border-indigo-500 transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-indigo-500/20 focus:border-blue-500 dark:focus:border-blue-600 dark:border-indigo-500 transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 dark:bg-indigo-600 text-white font-medium rounded-xl hover:bg-blue-700 dark:hover:bg-indigo-700 transition-colors shadow-sm mt-2"
              >
                {forgotStep === 1 && 'Send Verification Code'}
                {forgotStep === 2 && 'Verify Code'}
                {forgotStep === 3 && 'Reset Password'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button 
                onClick={() => {
                  setIsForgotPassword(false);
                  setForgotStep(1);
                  setForgotError('');
                }}
                className="text-sm text-blue-600 dark:text-indigo-400 hover:underline"
              >
                Back to Sign In
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 dark:bg-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                {isLogin ? <LogIn className="w-8 h-8 text-blue-600 dark:text-indigo-400" /> : <UserPlus className="w-8 h-8 text-blue-600 dark:text-indigo-400" />}
              </div>
              <h1 className="text-3xl font-bold text-slate-800 dark:text-zinc-100">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p className="text-slate-500 dark:text-zinc-400 mt-2">
                {isLogin ? 'Enter your credentials to access your account' : 'Sign up to get started'}
              </p>
            </div>

            {/* Tabs */}
            <div className="flex p-1 bg-slate-100 dark:bg-zinc-900 rounded-xl mb-6">
              <button
                onClick={() => {
                  setIsLogin(true);
                  setError('');
                }}
                className={cn(
                  "flex-1 py-2 text-sm font-medium rounded-lg transition-all",
                  isLogin ? "bg-white dark:bg-[#242424] text-blue-600 dark:text-indigo-400 shadow-sm" : "text-slate-400 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-slate-700 dark:text-zinc-300"
                )}
              >
                Login
              </button>
              <button
                onClick={() => {
                  setIsLogin(false);
                  setError('');
                }}
                className={cn(
                  "flex-1 py-2 text-sm font-medium rounded-lg transition-all",
                  !isLogin ? "bg-white dark:bg-[#242424] text-blue-600 dark:text-indigo-400 shadow-sm" : "text-slate-400 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-slate-700 dark:text-zinc-300"
                )}
              >
                Sign Up
              </button>
            </div>

            {forgotSuccess && (
              <div className="bg-emerald-500/10 text-emerald-500 p-3 rounded-lg text-sm mb-4 border border-emerald-500/20 flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>{forgotSuccess}</span>
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 text-red-400 p-3 rounded-lg text-sm mb-4 border border-red-500/20">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-indigo-500/20 focus:border-blue-500 dark:focus:border-blue-600 dark:border-indigo-500 transition-all"
                    placeholder="John Doe"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-indigo-500/20 focus:border-blue-500 dark:focus:border-blue-600 dark:border-indigo-500 transition-all"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300">Password</label>
                  {isLogin && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotPassword(true);
                        setForgotStep(1);
                        setForgotError('');
                        setForgotSuccess('');
                        setForgotEmail(email);
                      }}
                      className="text-xs text-blue-600 dark:text-indigo-400 hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-indigo-500/20 focus:border-blue-500 dark:focus:border-blue-600 dark:border-indigo-500 transition-all"
                  placeholder="••••••••"
                />
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-indigo-500/20 focus:border-blue-500 dark:focus:border-blue-600 dark:border-indigo-500 transition-all"
                  >
                    {Object.values(ROLES).map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 dark:bg-indigo-600 text-white font-medium rounded-xl hover:bg-blue-700 dark:hover:bg-indigo-700 transition-colors shadow-sm shadow-blue-500/30 dark:shadow-indigo-500/30 mt-2"
              >
                {isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            {isLogin && (
              <div className="mt-6 text-center">
                <button 
                  onClick={handleFillMockUser}
                  className="text-sm text-slate-400 hover:text-slate-600 underline"
                >
                  Quick fill mock credentials
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
