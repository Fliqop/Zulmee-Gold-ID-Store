import React, { useState } from 'react';
import { Lock, User, Key, AlertCircle, X, ShieldAlert, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface AdminLoginModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onClose, onSuccess }) => {
  const { adminLogin } = useStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const res = adminLogin(username, password);
      setLoading(false);
      if (res.success) {
        onSuccess();
        onClose();
      } else {
        setError(res.error || 'Invalid credentials');
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#121826] border-2 border-yellow-500/40 rounded-2xl shadow-2xl shadow-black p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo Icon */}
        <div className="w-14 h-14 rounded-2xl bg-yellow-500/15 border border-yellow-500/30 flex items-center justify-center mx-auto text-yellow-400 mb-4 shadow-lg shadow-yellow-500/10">
          <Lock className="w-7 h-7" />
        </div>

        <h2 className="text-2xl font-black text-white text-center tracking-tight">
          Admin Control Portal
        </h2>
        <p className="text-xs text-gray-400 text-center mt-1 mb-6">
          Access stock manager, orders verification, and store settings
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1">Username</label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#0a0e17] text-white pl-10 pr-4 py-2.5 rounded-xl border border-gray-700 focus:border-yellow-400 outline-none text-xs font-medium"
                placeholder="admin"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1">Password</label>
            <div className="relative">
              <Key className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0a0e17] text-white pl-10 pr-10 py-2.5 rounded-xl border border-gray-700 focus:border-yellow-400 outline-none text-xs font-medium"
                placeholder="Enter admin password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-black font-black text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 hover:from-yellow-300 hover:to-amber-400 transition-all shadow-lg shadow-yellow-500/20 active:scale-95 disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Admin Panel'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
