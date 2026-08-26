import React from 'react';
import { Award, Shield, Zap, Send, Lock, MessageSquare } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface FooterProps {
  onOpenTracker: () => void;
  onOpenAdmin: () => void;
  onOpenSupport: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenTracker, onOpenAdmin, onOpenSupport }) => {
  const { settings } = useStore();

  return (
    <footer className="bg-[#060910] border-t border-yellow-500/20 text-gray-400 text-xs mt-12 sm:mt-16">
      {/* Upper Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-yellow-500 flex items-center justify-center text-black font-black">
                <Award className="w-5 h-5" />
              </div>
              <span className="text-base sm:text-lg font-black text-white tracking-wider">
                BGMI <span className="text-yellow-400">GOLD STORE</span>
              </span>
            </div>

            <p className="text-gray-400 text-xs leading-relaxed max-w-md">
              India's premier marketplace exclusively for verified Battlegrounds Mobile India Gold Tier accounts. All accounts are 100% Gold tier with clean single link binds, instant dynamic UPI QR delivery, and lifetime transfer warranty verified by @zulmeecheat.
            </p>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-2 text-xs font-semibold text-gray-300">
              <span className="flex items-center gap-1 text-emerald-400">
                <Shield className="w-4 h-4" /> 100% Anti-Ban Guarantee
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1 text-yellow-400">
                <Zap className="w-4 h-4" /> Instant UPI Delivery
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-3">Customer Portal</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={onOpenTracker}
                  className="hover:text-yellow-400 transition-colors text-left"
                >
                  Track Existing Order
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenSupport}
                  className="hover:text-[#229ED9] transition-colors flex items-center gap-1.5 text-left"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Telegram Live Support</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAdmin}
                  className="hover:text-yellow-400 transition-colors flex items-center gap-1.5 text-left"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Admin Control Panel</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-3">Support & Telegram</h4>
            <p className="text-gray-400 text-xs">
              For instant payment verification, custom ID requests, or warranty support:
            </p>
            <div className="pt-1">
              <a
                href={`https://t.me/${settings.telegram_admin_username.replace('@', '')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#229ED9]/15 border border-[#229ED9]/40 text-[#229ED9] font-bold text-xs hover:bg-[#229ED9]/25 transition-all min-h-[38px]"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Contact {settings.telegram_admin_username}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="mt-8 pt-6 border-t border-gray-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-gray-500 text-center sm:text-left">
          <p>
            © {new Date().getFullYear()} BGMI Gold ID Store. All trademarks and game logos belong to Krafton / BGMI.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>All Systems Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
