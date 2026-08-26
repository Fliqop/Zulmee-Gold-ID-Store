import React, { useState } from 'react';
import { X, XCircle, AlertTriangle, Check, RefreshCw } from 'lucide-react';
import { Order } from '../../types';

interface RejectOrderModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmReject: (orderId: string, reason: string) => Promise<void> | void;
}

const PRESET_REASONS = [
  '❌ Invalid or unverified UTR reference number',
  '❌ Payment not received / credited in bank account',
  '❌ Fake / edited payment screenshot attached',
  '❌ Incomplete / incorrect amount paid',
  '❌ Duplicate transaction ID submitted',
];

export const RejectOrderModal: React.FC<RejectOrderModalProps> = ({
  order,
  isOpen,
  onClose,
  onConfirmReject,
}) => {
  const [selectedReason, setSelectedReason] = useState<string>(PRESET_REASONS[0]);
  const [customReason, setCustomReason] = useState<string>(PRESET_REASONS[0]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen || !order) return null;

  const handleSelectPreset = (reason: string) => {
    setSelectedReason(reason);
    setCustomReason(reason);
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirmReject(order.id, customReason || 'Payment rejected by administrator.');
      setIsSubmitting(false);
      onClose();
    } catch (e) {
      setIsSubmitting(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md bg-[#0f1523] border border-red-500/35 rounded-3xl shadow-2xl shadow-black overflow-hidden my-4 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-[#18131d] p-4 sm:p-5 border-b border-red-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white">Reject Order Payment</h3>
              <p className="text-[11px] text-gray-400 font-mono">{order.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white flex items-center justify-center transition-colors min-h-[32px]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 space-y-4 text-xs">
          {/* Order Details Mini Banner */}
          <div className="bg-[#070a10] p-3 rounded-2xl border border-gray-800 grid grid-cols-3 gap-2 text-center">
            <div>
              <span className="text-[10px] text-gray-400 uppercase font-bold block">Amount</span>
              <span className="font-mono font-black text-yellow-400 text-sm">₹{order.price}</span>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 uppercase font-bold block">Buyer</span>
              <span className="font-bold text-cyan-400 truncate block text-[11px]">
                {order.telegram_username}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 uppercase font-bold block">UTR No.</span>
              <span className="font-mono text-gray-300 truncate block text-[11px]">
                {order.utr_number || 'None'}
              </span>
            </div>
          </div>

          {/* Preset Reason Quick Buttons */}
          <div>
            <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-2">
              Select Quick Reason
            </label>
            <div className="space-y-1.5">
              {PRESET_REASONS.map((reason) => {
                const isSelected = selectedReason === reason;
                return (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => handleSelectPreset(reason)}
                    className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between border ${
                      isSelected
                        ? 'bg-red-950/50 border-red-500/60 text-red-200 shadow-sm'
                        : 'bg-[#0a0e17] border-gray-800 text-gray-400 hover:text-gray-200 hover:border-gray-700'
                    }`}
                  >
                    <span>{reason}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-red-400 shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Reason Textarea */}
          <div>
            <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5">
              Rejection Note / Reason
            </label>
            <textarea
              rows={2}
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder="Provide reason for rejecting this payment..."
              className="w-full bg-[#0a0e17] text-white p-3 rounded-xl border border-gray-700 focus:border-red-400 outline-none text-xs leading-relaxed"
            />
          </div>

          {/* Notice info */}
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-2.5 text-amber-300 text-[11px] leading-snug">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              Rejecting this order releases the reserved Gold ID back to Available stock in the store.
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#0a0e17] border-t border-gray-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold rounded-xl text-xs transition-all min-h-[40px]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-red-600/30 active:scale-95 min-h-[40px] disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Rejecting...</span>
              </>
            ) : (
              <>
                <XCircle className="w-3.5 h-3.5" />
                <span>Confirm Rejection</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
