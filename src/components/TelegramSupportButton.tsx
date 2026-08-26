import React, { useState } from 'react';
import { Send, X, ExternalLink } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const TelegramSupportButton: React.FC = () => {
  const { settings } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  const adminUsername = settings.telegram_admin_username.replace('@', '');

  const openTelegramWithPrompt = (prompt: string) => {
    const text = encodeURIComponent(prompt);
    window.open(`https://t.me/${adminUsername}?text=${text}`, '_blank');
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          id="floating-tg-support-btn"
          aria-label="Telegram Support"
          className="group relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-[#179cde] via-[#229ED9] to-[#37b8f5] text-white shadow-2xl shadow-[#229ED9]/50 hover:scale-105 active:scale-95 transition-all duration-300 ring-4 ring-[#229ED9]/30 min-h-[44px] min-w-[44px]"
        >
          {isOpen ? (
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          ) : (
            <>
              <Send className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-12 transition-transform" />
              <span className="absolute -inset-1 rounded-full bg-[#229ED9]/40 animate-ping pointer-events-none"></span>
              <span className="absolute top-0 right-0 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-emerald-400 border-2 border-[#0a0e17]"></span>
            </>
          )}
        </button>
      </div>

      {/* Support Popover */}
      {isOpen && (
        <div className="fixed bottom-20 sm:bottom-24 right-3 left-3 sm:left-auto sm:right-6 z-40 sm:w-96 bg-[#0e1424] border border-[#229ED9]/40 rounded-3xl shadow-2xl shadow-black/90 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1b2b46] to-[#121c2e] p-4 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#229ED9]/20 border border-[#229ED9]/40 flex items-center justify-center text-[#229ED9]">
                <Send className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                  Telegram Live Support
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </h4>
                <p className="text-[11px] text-cyan-300 font-mono">{settings.telegram_admin_username}</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3 text-xs">
            <p className="text-gray-300 leading-relaxed text-[11px] sm:text-xs">
              Need assistance with your BGMI ID purchase, payment verification, or custom account inquiry? Chat directly with our verified Admin.
            </p>

            {/* Quick Action Buttons */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                Quick Assistance Topics:
              </span>

              <button
                onClick={() => openTelegramWithPrompt("Hi Admin! I just completed a UPI payment for an order and want to verify it.")}
                className="w-full text-left p-2.5 rounded-xl bg-gray-900/90 hover:bg-[#229ED9]/15 hover:border-[#229ED9]/50 border border-gray-800 text-gray-200 transition-all flex items-center justify-between group min-h-[40px]"
              >
                <span className="text-[11px] sm:text-xs font-medium">⚡ Verify My Recent Payment</span>
                <ExternalLink className="w-3.5 h-3.5 text-gray-500 group-hover:text-[#229ED9]" />
              </button>

              <button
                onClick={() => openTelegramWithPrompt("Hi Admin! I want to request a custom BGMI ID (Specific Level / Gun Labs / Outfits).")}
                className="w-full text-left p-2.5 rounded-xl bg-gray-900/90 hover:bg-[#229ED9]/15 hover:border-[#229ED9]/50 border border-gray-800 text-gray-200 transition-all flex items-center justify-between group min-h-[40px]"
              >
                <span className="text-[11px] sm:text-xs font-medium">🎯 Request Custom BGMI Account</span>
                <ExternalLink className="w-3.5 h-3.5 text-gray-500 group-hover:text-[#229ED9]" />
              </button>

              <button
                onClick={() => openTelegramWithPrompt("Hi Admin! I have questions regarding account login / safe transfer.")}
                className="w-full text-left p-2.5 rounded-xl bg-gray-900/90 hover:bg-[#229ED9]/15 hover:border-[#229ED9]/50 border border-gray-800 text-gray-200 transition-all flex items-center justify-between group min-h-[40px]"
              >
                <span className="text-[11px] sm:text-xs font-medium">🔒 Safe Login & Account Security</span>
                <ExternalLink className="w-3.5 h-3.5 text-gray-500 group-hover:text-[#229ED9]" />
              </button>
            </div>

            {/* Direct Open Telegram Link */}
            <div className="pt-2 border-t border-gray-800">
              <a
                href={`https://t.me/${adminUsername}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl bg-[#229ED9] hover:bg-[#1f8ec4] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 min-h-[40px]"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Open Direct Chat in Telegram</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
