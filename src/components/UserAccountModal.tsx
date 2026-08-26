import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  User,
  KeyRound,
  ShieldCheck,
  Package,
  Eye,
  EyeOff,
  Copy,
  Check,
  Clock,
  CheckCircle2,
  XCircle,
  ExternalLink,
  LogOut,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface UserAccountModalProps {
  onClose: () => void;
  onTrackOrder?: (orderId: string) => void;
  onBrowseStore?: () => void;
}

export const UserAccountModal: React.FC<UserAccountModalProps> = ({
  onClose,
  onTrackOrder,
  onBrowseStore,
}) => {
  const { currentUser, signOut, getUserOrders, getStockItemById, getStockItemByBgmiId, settings } = useStore();

  const [showSecret, setShowSecret] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [revealedOrderId, setRevealedOrderId] = useState<string | null>(null);

  if (!currentUser) return null;

  const userOrders = getUserOrders(currentUser.username);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSignOut = () => {
    signOut();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0f1523] border border-yellow-500/30 rounded-2xl shadow-2xl shadow-black overflow-hidden my-4 sm:my-6 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-[#141b2c] p-4 sm:p-5 border-b border-gray-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center text-yellow-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  @{currentUser.username}
                </h2>
                <span className="bg-yellow-500/20 text-yellow-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-yellow-500/30">
                  Buyer Account
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Manage your profile, secret phrase, and purchased BGMI IDs
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* Secret Passphrase Card */}
          <div className="bg-[#141b2c] border border-yellow-500/30 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-yellow-400" />
                <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider">
                  Your Secret Passphrase Token
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowSecret(!showSecret)}
                className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                {showSecret ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" /> Hide
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" /> Reveal
                  </>
                )}
              </button>
            </div>

            <div className="bg-black/60 border border-gray-800 rounded-lg p-2.5 sm:p-3 flex items-center justify-between gap-2">
              <code className="text-sm sm:text-base font-mono font-bold text-yellow-400 tracking-wider select-all">
                {showSecret ? currentUser.secret_phrase : '••••••••-••••-••••'}
              </code>
              <button
                type="button"
                onClick={() => copyToClipboard(currentUser.secret_phrase, 'token')}
                className="px-2.5 py-1.5 rounded bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 border border-yellow-500/30 text-xs font-semibold flex items-center gap-1 transition-all shrink-0"
              >
                {copiedKey === 'token' ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" /> Copy
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-gray-400">
              Keep this secret token safe. You need it along with your password whenever you sign in to this store.
            </p>
          </div>

          {/* Orders Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Package className="w-4 h-4 text-yellow-400" />
                My Purchased BGMI IDs ({userOrders.length})
              </h3>
              {userOrders.length > 0 && onTrackOrder && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onTrackOrder('');
                  }}
                  className="text-xs text-yellow-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  Open Full Order Tracker <ExternalLink className="w-3 h-3" />
                </button>
              )}
            </div>

            {userOrders.length === 0 ? (
              <div className="bg-[#141b2c] border border-gray-800 rounded-xl p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-gray-800/80 text-gray-400 flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-gray-200">No orders yet</h4>
                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                  You haven't placed any BGMI ID orders with this account yet. Grab a verified Gold Tier ID now for only ₹{settings.gold_id_price || 80}!
                </p>
                {onBrowseStore && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onBrowseStore();
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-xs rounded-lg transition-colors shadow"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Browse Gold IDs
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {userOrders.map((order) => {
                  const stockItem =
                    getStockItemById(order.stock_item_id) ||
                    getStockItemByBgmiId(order.bgmi_id);
                  const isCompleted = order.payment_status === 'completed';
                  const isPending = order.payment_status === 'pending';
                  const isRejected = order.payment_status === 'rejected';
                  const isRevealed = revealedOrderId === order.id;

                  return (
                    <div
                      key={order.id}
                      className="bg-[#141b2c] border border-gray-800 rounded-xl p-4 space-y-3 hover:border-gray-700 transition-colors"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-yellow-400">
                              {order.id}
                            </span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs font-bold text-gray-200">
                              ₹{order.price}
                            </span>
                          </div>
                        </div>

                        {/* Status badge */}
                        <div>
                          {isCompleted && (
                            <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold px-2.5 py-1 rounded-full">
                              <CheckCircle2 className="w-3 h-3" /> Unlocked & Delivered
                            </span>
                          )}
                          {isPending && (
                            <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs font-bold px-2.5 py-1 rounded-full">
                              <Clock className="w-3 h-3" /> Verifying Payment
                            </span>
                          )}
                          {isRejected && (
                            <span className="inline-flex items-center gap-1 bg-red-500/20 text-red-400 border border-red-500/40 text-xs font-bold px-2.5 py-1 rounded-full">
                              <XCircle className="w-3 h-3" /> Verification Rejected
                            </span>
                          )}
                        </div>
                      </div>

                      {/* UNLOCKED CREDENTIALS FOR COMPLETED ORDERS */}
                      {isCompleted && stockItem && (
                        <div className="bg-black/50 border border-emerald-500/30 rounded-lg p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5" /> BGMI Account Credentials
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setRevealedOrderId(isRevealed ? null : order.id)
                              }
                              className="text-xs text-gray-300 hover:text-white flex items-center gap-1"
                            >
                              {isRevealed ? (
                                <>
                                  <EyeOff className="w-3 h-3" /> Hide Details
                                </>
                              ) : (
                                <>
                                  <Eye className="w-3 h-3" /> View Login Details
                                </>
                              )}
                            </button>
                          </div>

                          {isRevealed ? (
                            <div className="space-y-2 pt-1">
                              <div className="bg-black/80 rounded p-2 text-xs font-mono text-emerald-300 select-all break-all border border-emerald-500/20">
                                <strong>Login:</strong> {stockItem.password}
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    copyToClipboard(stockItem.password, `pass-${order.id}`)
                                  }
                                  className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center gap-1 hover:bg-emerald-500/30"
                                >
                                  {copiedKey === `pass-${order.id}` ? (
                                    <>
                                      <Check className="w-3 h-3 text-white" /> Copied!
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3 h-3" /> Copy Login Credentials
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-[11px] text-gray-400">
                              Credentials verified and ready for instant transfer. Click "View Login Details" to copy.
                            </p>
                          )}
                        </div>
                      )}

                      {/* Action buttons for pending orders */}
                      {isPending && onTrackOrder && (
                        <div className="flex items-center justify-between pt-1">
                          <p className="text-[11px] text-gray-400">
                            Our team (@zulmeecheat) is verifying your payment screenshot.
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onTrackOrder(order.id);
                            }}
                            className="text-xs bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 border border-yellow-500/30 px-3 py-1 rounded font-semibold transition-colors"
                          >
                            Track Status
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-[#141b2c] p-4 border-t border-gray-800 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={handleSignOut}
            className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1.5 font-semibold py-1.5 px-3 rounded-lg hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
          
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
