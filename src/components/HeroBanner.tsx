import React from 'react';
import { Shield, Zap, RefreshCw, Trophy, Flame } from 'lucide-react';

interface HeroBannerProps {
  totalAvailable?: number;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ totalAvailable = 0 }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#0e1424] via-[#090d16] to-[#070a10] border-b border-yellow-500/20 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      {/* Background glowing ambient effects */}
      <div className="absolute top-0 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2"></div>
      <div className="absolute top-1/2 right-10 w-64 sm:w-80 h-64 sm:h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-[11px] sm:text-xs font-semibold mb-3.5 sm:mb-4 shadow-inner">
            <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 fill-amber-400" />
            <span className="tracking-wide uppercase font-bold">INSTANT UPI DELIVERY • LIFETIME TRANSFER WARRANTY</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-3 sm:mb-4">
            India's #1 Marketplace for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500">
              BGMI Gold Tier Accounts
            </span>
          </h1>

          <p className="text-gray-300 text-xs sm:text-sm lg:text-base leading-relaxed max-w-2xl mx-auto">
            100% verified BGMI Gold accounts with clean single-bind Twitter logins, zero ban risk, instant dynamic UPI QR payment, and 3-minute delivery with @zulmeecheat verification.
          </p>

          {/* Trust Value Badges Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 mt-5 sm:mt-6 pt-4 border-t border-gray-800/80">
            <div className="flex items-center gap-2 text-left bg-gray-900/60 p-2.5 rounded-xl border border-gray-800/90 shadow-sm">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-gray-200">100% Anti-Ban</p>
                <p className="text-[10px] text-gray-400">Clean single bind IDs</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-left bg-gray-900/60 p-2.5 rounded-xl border border-gray-800/90 shadow-sm">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-gray-200">Instant UPI QR</p>
                <p className="text-[10px] text-gray-400">GPay, PhonePe, Paytm</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-left bg-gray-900/60 p-2.5 rounded-xl border border-gray-800/90 shadow-sm">
              <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-gray-200">3-Min Delivery</p>
                <p className="text-[10px] text-gray-400">Fast Admin Verification</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-left bg-gray-900/60 p-2.5 rounded-xl border border-gray-800/90 shadow-sm">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-gray-200">Gold Tier IDs</p>
                <p className="text-[10px] text-gray-400">Ranked & Ready to Play</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
