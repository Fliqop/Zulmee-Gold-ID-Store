import React, { useState } from 'react';
import { X, Check, XCircle, ExternalLink, Download, User, DollarSign, Calendar, Hash, ZoomIn, ZoomOut, RotateCcw, Copy, CheckCheck, Send } from 'lucide-react';
import { Order } from '../../types';

interface PaymentProofModalProps {
  order: Order | null;
  onClose: () => void;
  onApprove: (orderId: string) => void;
  onReject: (orderId: string) => void;
}

export const PaymentProofModal: React.FC<PaymentProofModalProps> = ({
  order,
  onClose,
  onApprove,
  onReject,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [copiedUtr, setCopiedUtr] = useState<boolean>(false);

  if (!order) return null;

  const handleCopyUtr = (utr: string) => {
    navigator.clipboard.writeText(utr);
    setCopiedUtr(true);
    setTimeout(() => setCopiedUtr(false), 2000);
  };

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.3, 2.5));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.3, 0.7));
  const handleResetZoom = () => setZoomLevel(1);

  const proofSrc = order.payment_proof || (order as any).payment_proof_url;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0f1523] border border-yellow-500/30 rounded-2xl shadow-2xl shadow-black overflow-hidden my-4 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#141b2c] p-4 border-b border-gray-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
              <span className="text-yellow-400">Payment Proof Inspection</span>
              <span className="font-mono text-gray-300 text-xs font-normal">({order.id})</span>
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Target ID: <span className="font-mono text-white font-bold">{order.bgmi_id}</span> • Buyer:{' '}
              <span className="text-cyan-400 font-bold">{order.telegram_username}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-4 max-h-[75vh] overflow-y-auto scrollbar-thin">
          {/* Order Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-[#0a0e17] p-3.5 rounded-xl border border-gray-800 text-xs">
            <div>
              <span className="text-gray-400 text-[10px] block font-semibold uppercase">Account Price</span>
              <span className="font-mono font-black text-yellow-400 text-sm">₹{order.price}</span>
            </div>
            <div>
              <span className="text-gray-400 text-[10px] block font-semibold uppercase">Telegram Buyer</span>
              <a
                href={`https://t.me/${order.telegram_username.replace('@', '')}`}
                target="_blank"
                rel="noreferrer"
                className="font-bold text-cyan-400 hover:underline flex items-center gap-1 mt-0.5"
              >
                <span>{order.telegram_username}</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <div>
              <span className="text-gray-400 text-[10px] block font-semibold uppercase">Payment Status</span>
              {order.payment_status === 'pending' && (
                <span className="font-bold text-yellow-400 flex items-center gap-1 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping" /> Pending Review
                </span>
              )}
              {order.payment_status === 'completed' && (
                <span className="font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                  ✓ Verified & Delivered
                </span>
              )}
              {order.payment_status === 'rejected' && (
                <span className="font-bold text-red-400 flex items-center gap-1 mt-0.5">
                  ✕ Rejected
                </span>
              )}
            </div>
            <div>
              <span className="text-gray-400 text-[10px] block font-semibold uppercase">UTR / Ref No.</span>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="font-mono font-bold text-white truncate max-w-[100px]">
                  {order.utr_number || 'N/A'}
                </span>
                {order.utr_number && (
                  <button
                    type="button"
                    onClick={() => handleCopyUtr(order.utr_number!)}
                    className="p-1 text-gray-400 hover:text-yellow-400 transition-colors"
                    title="Copy UTR Reference"
                  >
                    {copiedUtr ? <CheckCheck className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Screenshot Preview Container with Zoom Controls */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-400 px-1">
              <span className="font-bold text-gray-300 flex items-center gap-1.5">
                <span>UPI Payment Screenshot</span>
              </span>
              {proofSrc && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleZoomOut}
                    className="p-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-300"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-mono text-[10px] px-1 text-gray-400">{Math.round(zoomLevel * 100)}%</span>
                  <button
                    onClick={handleZoomIn}
                    className="p-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-300"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleResetZoom}
                    className="p-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-300"
                    title="Reset Zoom"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <a
                    href={proofSrc}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 rounded bg-gray-800 hover:bg-gray-700 text-yellow-400 ml-1 flex items-center gap-1 text-[11px] font-semibold px-2"
                    title="Open Original in New Tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open</span>
                  </a>
                </div>
              )}
            </div>

            <div className="bg-black/90 rounded-2xl p-4 border border-gray-800 flex flex-col items-center justify-center min-h-[300px] overflow-hidden relative">
              {proofSrc ? (
                <div className="overflow-auto max-h-[420px] w-full flex items-center justify-center">
                  <img
                    src={proofSrc}
                    alt={`Payment proof for ${order.id}`}
                    style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.15s ease-out' }}
                    className="max-h-[400px] w-auto max-w-full rounded-xl object-contain border border-yellow-500/20 shadow-xl"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                <div className="text-gray-500 text-xs text-center py-12 space-y-2">
                  <p>No screenshot uploaded for this order yet.</p>
                  <p className="text-[11px] text-gray-600">The buyer has not attached an image file with their order.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#0a0e17] border-t border-gray-800 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-semibold"
          >
            Close
          </button>

          {order.payment_status === 'pending' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onReject(order.id);
                  onClose();
                }}
                className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject</span>
              </button>

              <button
                onClick={() => {
                  onApprove(order.id);
                  onClose();
                }}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-black rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-600/30 active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>Approve & Deliver ID</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

