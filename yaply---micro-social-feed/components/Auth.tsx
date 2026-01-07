
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { BRAND_AVATAR } from '../constants';
import { login, signUp } from '../utils/auth';

interface AuthProps {
  users: UserProfile[];
  onLogin: (user: UserProfile) => void;
  onRegister: (user: UserProfile) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin, onRegister }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        // Use email field as username for local login
        const user = await login(email, password);
        onLogin(user);
      } else {
        const user = await signUp(email, password, {
          username: username.trim().toLowerCase(),
          displayName: displayName.trim(),
          avatarUrl: BRAND_AVATAR,
        });
        onRegister(user);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-50 dark:bg-[#020617] flex items-center justify-center p-4 z-[999] overflow-y-auto">
      <div className="max-w-[440px] w-full bg-white dark:bg-slate-900 rounded-[4rem] p-10 md:p-14 shadow-2xl border border-slate-200 dark:border-slate-800 text-center animate-in fade-in zoom-in duration-700">
        
        <div className="flex flex-col items-center mb-10">
           <div className="w-20 h-20 mb-6">
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xl">
                <defs>
                  <linearGradient id="authLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" /><stop offset="60%" stopColor="#3b82f6" /><stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
                <path d="M15,45 C15,22.35 30.67,4 50,4 C69.33,4 85,22.35 85,45 C85,67.65 69.33,86 50,86 C46.12,86 42.41,85.39 38.93,84.27 L22,94 L27.4,78.2 C19.86,70.52 15,60.1 15,45 Z" fill="url(#authLogoGradient)" />
                <circle cx="35" cy="45" r="4.5" fill="white" /><circle cx="50" cy="45" r="4.5" fill="white" /><circle cx="65" cy="45" r="4.5" fill="white" />
              </svg>
           </div>
           <h1 className="text-3xl font-[1000] tracking-tighter gradient-text uppercase">Yaply Local</h1>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-3">Zero-Config Social.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            required type="text" placeholder={isLogin ? "Username or Handle" : "Email"}
            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-full px-8 py-4 focus:ring-4 focus:ring-blue-500/10 outline-none text-slate-700 dark:text-slate-200 font-semibold shadow-inner"
            value={email} onChange={e => setEmail(e.target.value)}
          />

          {!isLogin && (
            <>
              <input 
                required type="text" placeholder="Username"
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-full px-8 py-4 focus:ring-4 focus:ring-blue-500/10 outline-none text-slate-700 dark:text-slate-200 font-semibold shadow-inner"
                value={username} onChange={e => setUsername(e.target.value)}
              />
              <input 
                required type="text" placeholder="Full Name"
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-full px-8 py-4 focus:ring-4 focus:ring-blue-500/10 outline-none text-slate-700 dark:text-slate-200 font-semibold shadow-inner"
                value={displayName} onChange={e => setDisplayName(e.target.value)}
              />
            </>
          )}

          <input 
            required type="password" placeholder="Password"
            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-full px-8 py-4 focus:ring-4 focus:ring-blue-500/10 outline-none text-slate-700 dark:text-slate-200 font-semibold shadow-inner"
            value={password} onChange={e => setPassword(e.target.value)}
          />

          {error && <p className="text-[10px] font-black uppercase text-rose-500 px-2">{error}</p>}

          <button 
            type="submit" disabled={isLoading}
            className="w-full py-4 gradient-bg animate-gradient text-white rounded-full font-black text-lg shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 mt-2"
          >
            {isLoading ? '...' : isLogin ? 'Enter' : 'Create Account'}
          </button>
        </form>

        <button 
          onClick={() => { setIsLogin(!isLogin); setError(''); }}
          className="mt-8 text-blue-500 text-[10px] font-black uppercase tracking-widest hover:underline"
        >
          {isLogin ? "New here? Sign Up" : "Back to Sign In"}
        </button>
      </div>
    </div>
  );
};

export default Auth;
