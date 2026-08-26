import React from 'react';
import { BGMIStockItem } from '../types';
import { X, ShieldCheck, Trophy, Zap, AtSign, ArrowRight, CheckCircle2 } from 'lucide-react';

interface StockDetailModalProps {
  item: BGMIStockItem | null;
  onClose: () => void;
  onBuyNow: (item: BGMIStockItem) => void;
}

export const StockDetailModal: React.FC<StockDetailModalProps> = ({ item, onClose, onBuyNow }) => {
  if (!item) return null;

  const isAvailable = item.status === 'available';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#0f1523] border border-yellow-500/35 rounded-3xl shadow-2xl shadow-black overflow-hidden my-4 sm:my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-[#141b2c] p-4 sm:p-6 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center text-yellow-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">BGMI GOLD ID</h3>
              <p className="text-[11px] sm:text-xs text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> 100% Verified Account
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white flex items-center justify-center transition-all min-h-[32px]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-4 text-xs">
          {/* Account Attributes Grid */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            <div className="bg-[#070b13] p-3 sm:p-3.5 rounded-2xl border border-gray-800">
              <span className="text-[10px] text-gray-400 uppercase font-bold block mb-1">Login Method</span>
              <div className="flex items-center gap-1.5 text-sky-400 font-bold text-xs sm:text-sm">
                <AtSign className="w-4 h-4" />
                <span>Twitter / X</span>
              </div>
            </div>

            <div className="bg-[#070b13] p-3 sm:p-3.5 rounded-2xl border border-gray-800">
              <span className="text-[10px] text-gray-400 uppercase font-bold block mb-1">Rank Tier</span>
              <span className="font-extrabold text-yellow-400 text-xs sm:text-sm">Gold Tier</span>
            </div>
          </div>

          {/* Guarantee Highlights */}
          <div className="bg-[#070b13] rounded-2xl p-3.5 sm:p-4 border border-gray-800 space-y-3 text-gray-300">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white text-xs">100% Single Link Twitter</p>
                <p className="text-[11px] text-gray-400">Clean single bind with no secondary links attached or locked.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Zap className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white text-xs">Instant UPI QR & Fast Delivery</p>
                <p className="text-[11px] text-gray-400">Scan via GPay, PhonePe, Paytm, or BHIM. Credentials unlock upon UTR verification.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white text-xs">Zero Ban & Safety Warranty</p>
                <p className="text-[11px] text-gray-400">Pristine account history with direct support via Telegram admin.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-[#070b13] border-t border-gray-800 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-gray-400 block uppercase font-bold">Total Price</span>
            <span className="text-xl sm:text-2xl font-black text-yellow-400 font-mono">₹{item.price}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 sm:px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold text-xs transition-all min-h-[40px]"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onBuyNow(item);
              }}
              disabled={!isAvailable}
              className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-lg active:scale-95 min-h-[40px] ${
                isAvailable
                  ? 'bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-black hover:from-yellow-300 hover:to-amber-400 shadow-yellow-500/20'
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>{isAvailable ? 'Proceed to UPI Pay' : 'Not Available'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
