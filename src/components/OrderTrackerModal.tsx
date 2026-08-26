import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  Search, 
  ShieldCheck, 
  Lock, 
  Eye, 
  EyeOff, 
  Copy, 
  Check, 
  AlertCircle, 
  Clock, 
  Send, 
  CheckCircle2, 
  XCircle, 
  Sparkles,
  HelpCircle,
  Key,
  Smartphone
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface OrderTrackerModalProps {
  initialOrderId?: string;
  onClose: () => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps & { onOpenAuth?: () => void }> = ({ 
  initialOrderId = '', 
  onClose,
  onOpenAuth,
}) => {
  const { getOrderById, getOrdersByTelegram, getStockItemById, getStockItemByBgmiId, settings, currentUser, getUserOrders } = useStore();

  const [query, setQuery] = useState(initialOrderId);
  const [activeOrder, setActiveOrder] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const myOrders = currentUser ? getUserOrders(currentUser.username) : [];

  // Initial lookup if initialOrderId is provided
  useEffect(() => {
    if (initialOrderId) {
      handleSearch(initialOrderId);
    } else if (myOrders.length > 0 && !activeOrder) {
      // Auto-load most recent user order if available
      setActiveOrder(myOrders[0]);
    }
  }, [initialOrderId]);

  const handleSearch = (searchQuery = query) => {
    setErrorMessage('');
    const clean = searchQuery.trim();
    if (!clean) {
      setErrorMessage('Please enter an Order ID or Telegram Username.');
      return;
    }

    if (clean.startsWith('@') || !clean.toUpperCase().startsWith('ORD-')) {
      const results = getOrdersByTelegram(clean);
      if (results.length > 0) {
        setActiveOrder(results[0]);
        if (results[0].payment_status === 'completed') {
          triggerCelebration();
        }
        return;
      }
    }

    const order = getOrderById(clean);
    if (order) {
      setActiveOrder(order);
      if (order.payment_status === 'completed') {
        triggerCelebration();
      }
    } else {
      setActiveOrder(null);
      setErrorMessage(`No order found for "${clean}". Please verify your Order ID (e.g. ORD-89421) or Telegram username.`);
    }
  };

  const triggerCelebration = () => {
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.5 },
    });
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const associatedStock = activeOrder
    ? getStockItemById(activeOrder.stock_item_id) || getStockItemByBgmiId(activeOrder.bgmi_id)
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#0f1523] border border-yellow-500/30 rounded-2xl shadow-2xl shadow-black overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#141b2c] p-4 sm:p-5 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center text-yellow-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Track Order & ID Delivery</h3>
              <p className="text-xs text-gray-400">Enter your Order ID or Telegram username</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 sm:p-5 border-b border-gray-800 bg-[#0a0e17]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Order ID (e.g. ORD-89421) or @YourUsername"
                className="w-full bg-[#121826] text-white pl-9 pr-3 py-2.5 rounded-xl border border-gray-700 focus:border-yellow-400 outline-none text-xs font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl text-xs flex items-center gap-1 transition-all active:scale-95 shadow-md shadow-yellow-500/20"
            >
              <span>Search</span>
            </button>
          </form>

          {/* Quick Select My Orders if logged in */}
          {currentUser && myOrders.length > 0 && (
            <div className="mt-3 pt-2.5 border-t border-gray-800 flex items-center gap-2 overflow-x-auto text-xs pb-1">
              <span className="text-[11px] text-gray-400 font-semibold shrink-0">Your Orders:</span>
              {myOrders.map((ord) => (
                <button
                  key={ord.id}
                  type="button"
                  onClick={() => {
                    setQuery(ord.id);
                    setActiveOrder(ord);
                    setErrorMessage('');
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all shrink-0 ${
                    activeOrder?.id === ord.id
                      ? 'bg-yellow-500 text-black shadow'
                      : 'bg-gray-800/80 text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  {ord.id} {ord.payment_status === 'completed' ? '✓' : '⏳'}
                </button>
              ))}
            </div>
          )}

          {!currentUser && onOpenAuth && (
            <div className="mt-3 pt-2 border-t border-gray-800/60 flex items-center justify-between text-[11px] text-gray-400">
              <span>Have an account?</span>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAuth();
                }}
                className="text-yellow-400 hover:underline font-bold"
              >
                Sign In to view all your purchased IDs
              </button>
            </div>
          )}

          {errorMessage && (
            <div className="mt-3 p-2.5 rounded-lg bg-red-950/50 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Order Details Body */}
        <div className="p-4 sm:p-6 max-h-[65vh] overflow-y-auto space-y-4 scrollbar-thin">
          {activeOrder ? (
            <div className="space-y-4">
              {/* Order Status Header Card */}
              <div className="bg-[#121826] p-4 rounded-xl border border-gray-800 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">Order Reference</span>
                  <h4 className="text-base font-black text-yellow-400 font-mono">{activeOrder.id}</h4>
                  <span className="text-xs text-gray-400">Placed on: {new Date(activeOrder.order_date).toLocaleString()}</span>
                </div>

                {/* Status Badge */}
                <div>
                  {activeOrder.payment_status === 'completed' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-black shadow-lg shadow-emerald-500/10">
                      <CheckCircle2 className="w-4 h-4" /> APPROVED & DELIVERED
                    </span>
                  )}
                  {activeOrder.payment_status === 'pending' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 text-xs font-black animate-pulse">
                      <Clock className="w-4 h-4" /> PAYMENT IN VERIFICATION
                    </span>
                  )}
                  {activeOrder.payment_status === 'rejected' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-black">
                      <XCircle className="w-4 h-4" /> PAYMENT REJECTED
                    </span>
                  )}
                </div>
              </div>

              {/* Progress Timeline */}
              <div className="bg-[#0a0e17] p-4 rounded-xl border border-gray-800">
                <div className="relative flex items-center justify-between">
                  {/* Step 1 */}
                  <div className="flex flex-col items-center text-center z-10">
                    <div className="w-7 h-7 rounded-full bg-emerald-500 text-black flex items-center justify-center text-xs font-bold mb-1 shadow">
                      ✓
                    </div>
                    <span className="text-[11px] font-bold text-gray-200">Order Placed</span>
                  </div>

                  {/* Connecting Line 1 */}
                  <div className="flex-1 h-0.5 mx-2 bg-emerald-500"></div>

                  {/* Step 2 */}
                  <div className="flex flex-col items-center text-center z-10">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-1 ${
                      activeOrder.payment_status === 'completed' 
                        ? 'bg-emerald-500 text-black' 
                        : activeOrder.payment_status === 'rejected' 
                        ? 'bg-red-500 text-white' 
                        : 'bg-yellow-500 text-black animate-pulse'
                    }`}>
                      {activeOrder.payment_status === 'completed' ? '✓' : activeOrder.payment_status === 'rejected' ? '✕' : '⏳'}
                    </div>
                    <span className="text-[11px] font-bold text-gray-200">UPI Verified</span>
                  </div>

                  {/* Connecting Line 2 */}
                  <div className={`flex-1 h-0.5 mx-2 ${
                    activeOrder.payment_status === 'completed' ? 'bg-emerald-500' : 'bg-gray-800'
                  }`}></div>

                  {/* Step 3 */}
                  <div className="flex flex-col items-center text-center z-10">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-1 ${
                      activeOrder.payment_status === 'completed' 
                        ? 'bg-emerald-500 text-black' 
                        : 'bg-gray-800 text-gray-500'
                    }`}>
                      {activeOrder.payment_status === 'completed' ? '✓' : '🔒'}
                    </div>
                    <span className="text-[11px] font-bold text-gray-200">ID Delivered</span>
                  </div>
                </div>
              </div>

              {/* UNLOCKED CREDENTIALS VAULT CARD (If Completed) */}
              {activeOrder.payment_status === 'completed' && associatedStock && (
                <div className="bg-gradient-to-br from-emerald-950/40 via-[#0a1914] to-[#0a0e17] border-2 border-emerald-500/50 rounded-2xl p-5 shadow-2xl shadow-emerald-500/10 space-y-4">
                  <div className="flex items-center justify-between border-b border-emerald-500/30 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <Key className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-white">BGMI Account Credentials Unlocked</h4>
                        <p className="text-[10px] text-emerald-300">Delivered on {new Date(activeOrder.delivery_date || '').toLocaleTimeString()}</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-500/40">
                      SECURE VAULT
                    </span>
                  </div>

                  {/* Credentials Fields */}
                  <div className="space-y-2.5 text-xs">
                    {/* Secret Login Credentials / Password */}
                    <div className="bg-black/70 p-3.5 rounded-xl border border-emerald-500/40 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Login Method & Secret Password
                        </span>
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-[11px] text-gray-400 hover:text-white flex items-center gap-1"
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          <span>{showPassword ? 'Hide' : 'Show'}</span>
                        </button>
                      </div>

                      <div className="p-2.5 rounded-lg bg-gray-900 font-mono text-xs text-emerald-300 break-all select-all border border-gray-800">
                        {showPassword ? associatedStock.password : '••••••••••••••••••••••••••••••••••••••••••••'}
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={() => copyToClipboard(associatedStock.password, 'password')}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-black font-extrabold text-xs rounded-lg flex items-center gap-1 shadow active:scale-95"
                        >
                          {copiedKey === 'password' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedKey === 'password' ? 'Credentials Copied!' : 'Copy Login Details'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Transfer & Security Instructions */}
                  <div className="bg-emerald-950/30 p-3 rounded-xl border border-emerald-800/50 text-[11px] text-emerald-200 space-y-1">
                    <p className="font-bold text-emerald-300">Recommended Security Steps:</p>
                    <ol className="list-decimal list-inside space-y-0.5 text-emerald-300/80">
                      <li>Log in to BGMI using the provided credentials above.</li>
                      <li>Go to in-game Settings → Link your personal Email / Second Social Network.</li>
                      <li>Enable 2FA (Two Factor Authentication) on your linked account.</li>
                      <li>Enjoy your new BGMI Gold Account with Lifetime Safe Guarantee!</li>
                    </ol>
                  </div>
                </div>
              )}

              {/* PENDING VERIFICATION NOTICE (If Pending) */}
              {activeOrder.payment_status === 'pending' && (
                <div className="bg-yellow-950/30 border border-yellow-500/40 rounded-xl p-4 text-xs space-y-3">
                  <div className="flex items-center gap-2 text-yellow-300 font-bold">
                    <Clock className="w-4 h-4 text-yellow-400 animate-spin" />
                    <span>Admin Review In Progress (Usually takes 2–5 mins)</span>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    Our team is currently verifying the UPI payment screenshot for Order <strong className="text-yellow-400 font-mono">{activeOrder.id}</strong>. 
                    Once approved, your account password will automatically appear right on this screen.
                  </p>
                  
                  {activeOrder.admin_notes && (
                    <div className="p-2.5 bg-black/40 rounded-lg text-gray-300 text-[11px] border border-gray-800">
                      <span className="font-bold text-gray-400 block mb-0.5">Status Note:</span>
                      {activeOrder.admin_notes}
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      onClick={() => {
                        const admin = settings.telegram_admin_username.replace('@', '');
                        const text = encodeURIComponent(`Hi Admin! Please expedite verification for Order ${activeOrder.id}`);
                        window.open(`https://t.me/${admin}?text=${text}`, '_blank');
                      }}
                      className="w-full py-2.5 bg-[#229ED9] hover:bg-[#1f8ec4] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow active:scale-95"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Ping Admin on TG for Instant Approval ({settings.telegram_admin_username})</span>
                    </button>
                  </div>
                </div>
              )}

              {/* REJECTED NOTICE (If Rejected) */}
              {activeOrder.payment_status === 'rejected' && (
                <div className="bg-red-950/30 border border-red-500/40 rounded-xl p-4 text-xs space-y-3">
                  <div className="flex items-center gap-2 text-red-300 font-bold">
                    <XCircle className="w-4 h-4 text-red-400" />
                    <span>Payment Verification Unsuccessful</span>
                  </div>
                  <p className="text-gray-300">
                    The payment screenshot or UTR provided could not be validated. If you believe this is a mistake, please reach out to our Telegram support immediately.
                  </p>
                  {activeOrder.admin_notes && (
                    <div className="p-2.5 bg-black/40 rounded-lg text-red-300 text-[11px] border border-red-900/60">
                      <span className="font-bold text-gray-400 block mb-0.5">Admin Note:</span>
                      {activeOrder.admin_notes}
                    </div>
                  )}
                  <button
                    onClick={() => {
                      const admin = settings.telegram_admin_username.replace('@', '');
                      window.open(`https://t.me/${admin}`, '_blank');
                    }}
                    className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Contact Telegram Admin ({settings.telegram_admin_username})</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400 space-y-2">
              <Search className="w-10 h-10 mx-auto text-gray-600 mb-2" />
              <p className="text-sm font-semibold text-gray-300">Look up your BGMI ID Order</p>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Enter your Order Reference (e.g. ORD-89421) or your Telegram username above to view live order status and secret credentials.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
