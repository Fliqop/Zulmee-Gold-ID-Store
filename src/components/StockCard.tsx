import React from 'react';
import { BGMIStockItem } from '../types';
import { Zap, Eye, ShieldCheck, CheckCircle2, Sparkles, AtSign, ArrowRight } from 'lucide-react';

interface StockCardProps {
  availableCount: number;
  price: number;
  sampleItem?: BGMIStockItem | null;
  onSelect: (item: BGMIStockItem) => void;
  onBuyNow: (item: BGMIStockItem) => void;
}

export const StockCard: React.FC<StockCardProps> = ({
  availableCount,
  price,
  sampleItem,
  onSelect,
  onBuyNow,
}) => {
  const isAvailable = availableCount > 0 && !!sampleItem;

  return (
    <div className="w-full max-w-lg mx-auto rounded-3xl bg-gradient-to-b from-[#151e33] via-[#101728] to-[#0a0f1b] border border-yellow-500/35 p-5 sm:p-7 md:p-8 shadow-2xl shadow-yellow-500/10 hover:border-yellow-400/70 transition-all duration-300">
      {/* Top Header: Title & Availability Count */}
      <div className="flex items-center justify-between gap-3 pb-4 sm:pb-5 border-b border-gray-800/80">
        <div>
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-yellow-400/90 block mb-0.5">
            Verified BGMI Account
          </span>
          <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            GOLD ID
          </h3>
        </div>

        {/* Live Available Status */}
        <div>
          {isAvailable ? (
            <div className="px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm shrink-0">
              <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0"></span>
              <span>Available ({availableCount})</span>
            </div>
          ) : (
            <div className="px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-red-500/15 border border-red-500/40 text-red-300 font-bold text-xs sm:text-sm shrink-0">
              Sold Out / Restocking
            </div>
          )}
        </div>
      </div>

      {/* Account Specs & Details */}
      <div className="py-4 sm:py-6 space-y-3.5 sm:space-y-4">
        {/* Login Method Tag */}
        <div className="flex items-center justify-between bg-[#070b13]/80 p-2.5 sm:p-3 rounded-2xl border border-gray-800/90">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Login Method</span>
          <span className="px-2.5 py-1 rounded-lg bg-[#1da1f2]/15 text-[#1da1f2] border border-[#1da1f2]/40 font-bold text-xs flex items-center gap-1.5">
            <AtSign className="w-3.5 h-3.5" />
            <span>Twitter</span>
          </span>
        </div>

        {/* Value Highlights */}
        <div className="bg-[#070b13]/80 rounded-2xl p-3.5 sm:p-4 border border-gray-800/90 space-y-2.5 text-xs text-gray-300">
          <div className="flex items-center gap-2.5 text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium text-xs">100% Clean Single Link Twitter / X Login</span>
          </div>
          <div className="flex items-center gap-2.5 text-yellow-300">
            <ShieldCheck className="w-4 h-4 text-yellow-400 shrink-0" />
            <span className="font-medium text-xs">Instant Dynamic UPI QR Payment & 3-Min Delivery</span>
          </div>
          <div className="flex items-center gap-2.5 text-cyan-300">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="font-medium text-xs">Zero Ban Risk with 24/7 Admin Telegram Support</span>
          </div>
        </div>
      </div>

      {/* Pricing & CTA Section */}
      <div className="pt-4 sm:pt-5 border-t border-gray-800/80">
        <div className="flex items-baseline justify-between mb-4 sm:mb-5">
          <div>
            <span className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-wider block">Payable Price</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl sm:text-4xl font-black text-yellow-400 tracking-tight font-mono">₹{price}</span>
              <span className="text-xs text-gray-400 font-semibold">INR</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] sm:text-xs text-emerald-400 font-bold block">⚡ Auto UPI Fast Unlock</span>
            <span className="text-[10px] sm:text-[11px] text-gray-400">All UPI Apps Supported</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
          {sampleItem && (
            <button
              onClick={() => onSelect(sampleItem)}
              id="view-gold-id-details-btn"
              className="sm:col-span-1 py-3 px-4 rounded-xl bg-gray-800/90 hover:bg-gray-700 text-gray-200 text-xs font-bold border border-gray-700 flex items-center justify-center gap-1.5 transition-all active:scale-95 min-h-[44px]"
            >
              <Eye className="w-4 h-4 text-gray-400" />
              <span>Details</span>
            </button>
          )}

          <button
            onClick={() => sampleItem && onBuyNow(sampleItem)}
            disabled={!isAvailable}
            id="buy-gold-id-btn"
            className={`${
              sampleItem ? 'sm:col-span-2' : 'sm:col-span-3'
            } py-3 px-5 sm:px-6 rounded-xl text-xs sm:text-sm font-black tracking-wide flex items-center justify-center gap-2 transition-all shadow-xl active:scale-95 min-h-[44px] ${
              isAvailable
                ? 'bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-black hover:from-yellow-300 hover:to-amber-400 shadow-yellow-500/25 cursor-pointer'
                : 'bg-gray-800 text-gray-500 border border-gray-800 cursor-not-allowed'
            }`}
          >
            <Zap className="w-4 h-4 fill-current shrink-0" />
            <span>{isAvailable ? `Buy with UPI (₹${price})` : 'Sold Out / Restocking'}</span>
            {isAvailable && <ArrowRight className="w-4 h-4 shrink-0" />}
          </button>
        </div>
      </div>
    </div>
  );
};
