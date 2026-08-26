import React from 'react';
import { ShieldCheck, Zap, MessageSquare, Lock, Award, User, UserCheck, KeyRound } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface NavbarProps {
  onOpenTracker: () => void;
  onOpenAdmin: () => void;
  onOpenSupport: () => void;
  onOpenAuth: () => void;
  onOpenAccount: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenTracker,
  onOpenAdmin,
  onOpenSupport,
  onOpenAuth,
  onOpenAccount,
}) => {
  const { settings, stats, isAdmin, currentUser, getUserOrders } = useStore();

  const userOrdersCount = currentUser ? getUserOrders(currentUser.username).length : 0;

  const handleTelegramClick = () => {
    const username = settings.telegram_admin_username.replace('@', '');
    window.open(`https://t.me/${username}`, '_blank');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#070a12]/95 backdrop-blur-lg border-b border-yellow-500/20 shadow-xl shadow-black/50">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-yellow-950/80 via-amber-900/60 to-yellow-950/80 border-b border-yellow-500/20 text-xs py-1.5 px-3 sm:px-4 text-yellow-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 overflow-hidden">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-300 font-bold tracking-wider text-[10px] border border-yellow-500/30 shrink-0">
              <Zap className="w-3 h-3 text-yellow-400 fill-yellow-400" /> OFFICIAL
            </span>
            <p className="truncate font-medium text-[11px] sm:text-xs text-yellow-100/90">
              {settings.announcement_text}
            </p>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-semibold text-gray-300 shrink-0">
            <span className="hidden xs:flex items-center gap-1 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{stats.availableStock} in Stock</span>
            </span>
            <button
              onClick={handleTelegramClick}
              className="text-yellow-400 hover:text-yellow-300 flex items-center gap-1 hover:underline transition-colors text-[11px]"
            >
              <MessageSquare className="w-3 h-3" /> <span className="hidden sm:inline">TG:</span> {settings.telegram_admin_username}
            </button>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 p-0.5 shadow-lg shadow-yellow-500/20 flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-[#0a0e17] rounded-[10px] flex items-center justify-center">
              <Award className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 fill-yellow-400/20" />
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <span className="text-base sm:text-xl font-black tracking-wider text-white truncate">
                BGMI <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500">GOLD STORE</span>
              </span>
              <span className="hidden xs:inline-block px-1.5 py-0.5 text-[9px] font-bold rounded bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                PRO ID
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-gray-400 font-medium truncate">
              Instant UPI Delivery • Clean Twitter Binds
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          
          {/* USER ACCOUNT OR SIGN IN BUTTON */}
          {currentUser ? (
            <button
              onClick={onOpenAccount}
              id="nav-user-account-btn"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-yellow-500/15 hover:bg-yellow-500/25 text-yellow-400 border border-yellow-500/40 text-xs sm:text-sm font-semibold transition-all active:scale-95 min-h-[38px]"
              title={`Logged in as @${currentUser.username}`}
            >
              <UserCheck className="w-4 h-4 text-yellow-400 shrink-0" />
              <span className="font-bold truncate max-w-[100px] sm:max-w-[130px]">
                @{currentUser.username}
              </span>
              {userOrdersCount > 0 && (
                <span className="bg-yellow-500 text-black text-[10px] font-black px-1.5 py-0.2 rounded-full min-w-[18px] text-center">
                  {userOrdersCount}
                </span>
              )}
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              id="nav-signin-btn"
              className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-2 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black text-xs sm:text-sm font-bold transition-all shadow-md shadow-yellow-500/20 active:scale-95 min-h-[38px]"
            >
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black shrink-0" />
              <span>Sign In</span>
            </button>
          )}

          {/* Order Tracker */}
          <button
            onClick={onOpenTracker}
            id="nav-track-order-btn"
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-gray-900/90 hover:bg-gray-800 text-gray-200 border border-gray-700 hover:border-yellow-500/50 text-xs sm:text-sm font-semibold transition-all shadow-sm active:scale-95 min-h-[38px]"
          >
            <ShieldCheck className="w-4 h-4 text-yellow-400 shrink-0" />
            <span className="hidden sm:inline">Track Order</span>
            <span className="sm:hidden text-xs">Track</span>
          </button>

          {/* Telegram Support Button */}
          <button
            onClick={onOpenSupport}
            id="nav-tg-support-btn"
            className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#229ED9]/15 hover:bg-[#229ED9]/25 text-[#229ED9] border border-[#229ED9]/40 text-xs sm:text-sm font-semibold transition-all shadow-sm active:scale-95 min-h-[38px]"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Support</span>
          </button>

          {/* Admin Panel Toggle */}
          <button
            onClick={onOpenAdmin}
            id="nav-admin-btn"
            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md active:scale-95 min-h-[38px] ${
              isAdmin
                ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-black hover:from-yellow-400 hover:to-amber-400 shadow-yellow-500/20 ring-2 ring-yellow-400/40'
                : 'bg-gray-800/90 hover:bg-gray-700 text-gray-400 hover:text-yellow-400 border border-gray-700 hover:border-yellow-500/30'
            }`}
            title="Admin Login"
          >
            <Lock className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden md:inline">{isAdmin ? 'Admin Panel' : 'Admin'}</span>
            {isAdmin && stats.pendingOrders > 0 && (
              <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-red-600 text-white text-[9px] sm:text-[10px] flex items-center justify-center font-black animate-pulse">
                {stats.pendingOrders}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
