import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order } from '../../types';
import { Check, Eye, Search, Clock, FileText, Send, XCircle, Copy, CheckCheck, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { PaymentProofModal } from './PaymentProofModal';
import { RejectOrderModal } from './RejectOrderModal';

export const OrdersManagement: React.FC = () => {
  const { orders, approveOrder, rejectOrder, settings } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedProofOrder, setSelectedProofOrder] = useState<Order | null>(null);
  const [orderToReject, setOrderToReject] = useState<Order | null>(null);
  const [copiedUtrKey, setCopiedUtrKey] = useState<string | null>(null);

  const handleApprove = (orderId: string) => {
    approveOrder(orderId);
  };

  const handleOpenRejectModal = (order: Order) => {
    setOrderToReject(order);
  };

  const handleConfirmRejectOrder = async (orderId: string, reason: string) => {
    await rejectOrder(orderId, reason);
  };

  const handleCopyUtr = (utr: string, id: string) => {
    navigator.clipboard.writeText(utr);
    setCopiedUtrKey(id);
    setTimeout(() => setCopiedUtrKey(null), 2000);
  };

  const openTelegramUser = (username: string, orderId: string) => {
    const user = username.replace('@', '');
    const text = encodeURIComponent(`Hello! Reaching out regarding your BGMI Store Order ${orderId}.`);
    window.open(`https://t.me/${user}?text=${text}`, '_blank');
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.bgmi_id.includes(searchTerm) ||
      o.telegram_username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.utr_number && o.utr_number.includes(searchTerm));
    const matchesStatus = statusFilter === 'all' || o.payment_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = orders.filter((o) => o.payment_status === 'pending').length;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#141b2c] p-4 sm:p-5 rounded-2xl border border-gray-800">
        <div>
          <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2 flex-wrap">
            <span>Customer Orders & Verification</span>
            {pendingCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-red-500 text-white text-[11px] font-black animate-pulse shadow-md shadow-red-500/20">
                {pendingCount} Pending Review
              </span>
            )}
          </h2>
          <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5">
            Inspect uploaded UPI payment screenshots & UTR reference numbers to unlock buyer credentials
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Order ID, BGMI ID, Telegram Handle, or UTR..."
            className="w-full bg-[#0a0e17] text-white pl-10 pr-4 py-2.5 rounded-xl border border-gray-700 focus:border-yellow-400 outline-none text-xs"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { label: `All (${orders.length})`, val: 'all' },
            { label: `Pending (${pendingCount})`, val: 'pending' },
            { label: 'Completed', val: 'completed' },
            { label: 'Rejected', val: 'rejected' },
          ].map((st) => (
            <button
              key={st.val}
              onClick={() => setStatusFilter(st.val)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                statusFilter === st.val
                  ? 'bg-yellow-500 text-black shadow-md'
                  : 'bg-gray-800/80 text-gray-400 hover:text-white'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Responsive Cards for Mobile View */}
      <div className="block md:hidden space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="p-8 text-center bg-[#121826] rounded-2xl border border-gray-800 text-gray-400 text-xs">
            No orders found matching your search.
          </div>
        ) : (
          filteredOrders.map((order) => {
            const proofSrc = order.payment_proof || (order as any).payment_proof_url;
            return (
              <div key={order.id} className="bg-[#121826] rounded-2xl border border-gray-800 p-4 space-y-3 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono font-black text-yellow-400 text-xs block">{order.id}</span>
                    <span className="text-gray-500 text-[10px]">
                      {new Date(order.order_date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </span>
                  </div>

                  <div>
                    {order.payment_status === 'pending' && (
                      <span className="px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 font-bold text-[10px] border border-yellow-500/30 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Pending Review
                      </span>
                    )}
                    {order.payment_status === 'completed' && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] border border-emerald-500/30">
                        ✓ Approved & Delivered
                      </span>
                    )}
                    {order.payment_status === 'rejected' && (
                      <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-bold text-[10px] border border-red-500/30">
                        ✕ Rejected
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-[#0a0e17] p-2.5 rounded-xl border border-gray-800">
                  <div>
                    <span className="text-gray-400 text-[10px] block font-medium">Buyer Telegram</span>
                    <button
                      onClick={() => openTelegramUser(order.telegram_username, order.id)}
                      className="font-bold text-cyan-400 hover:underline flex items-center gap-1 text-xs mt-0.5"
                    >
                      <span>{order.telegram_username}</span>
                      <Send className="w-2.5 h-2.5" />
                    </button>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] block font-medium">Amount / ID</span>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="font-bold text-yellow-400 font-mono">₹{order.price}</span>
                      <span className="text-gray-400 font-mono text-[11px]">{order.bgmi_id}</span>
                    </div>
                  </div>
                </div>

                {/* Mobile Payment Proof Preview */}
                {proofSrc ? (
                  <div className="bg-[#0a0e17] p-2.5 rounded-xl border border-yellow-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-yellow-400 flex items-center gap-1">
                        <ImageIcon className="w-3.5 h-3.5" /> Payment Proof Screenshot
                      </span>
                      {order.utr_number && (
                        <div className="flex items-center gap-1">
                          <span className="font-mono text-[10px] text-gray-300">UTR: {order.utr_number}</span>
                          <button
                            type="button"
                            onClick={() => handleCopyUtr(order.utr_number!, `m-utr-${order.id}`)}
                            className="text-gray-400 hover:text-yellow-400 p-0.5"
                          >
                            {copiedUtrKey === `m-utr-${order.id}` ? (
                              <CheckCheck className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                    <div
                      onClick={() => setSelectedProofOrder(order)}
                      className="relative rounded-lg overflow-hidden bg-black/80 border border-gray-800 cursor-pointer group flex items-center justify-center max-h-40"
                    >
                      <img
                        src={proofSrc}
                        alt={`Proof for ${order.id}`}
                        className="w-full h-36 object-contain rounded-lg group-hover:scale-105 transition-transform duration-200"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1.5 transition-opacity text-white text-xs font-bold">
                        <Eye className="w-4 h-4 text-yellow-400" />
                        <span>Tap to Inspect</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-xl bg-gray-900/50 border border-gray-800 text-center text-gray-500 text-xs">
                    No screenshot uploaded by buyer
                  </div>
                )}

                {/* Actions for Pending */}
                {order.payment_status === 'pending' && (
                  <div className="flex items-center gap-2 pt-1 border-t border-gray-800">
                    <button
                      type="button"
                      onClick={() => handleOpenRejectModal(order)}
                      className="w-1/2 py-2 bg-red-950/60 hover:bg-red-900/80 text-red-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1 active:scale-95 transition-all"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApprove(order.id)}
                      className="w-1/2 py-2 bg-emerald-600 hover:bg-emerald-500 text-black font-black rounded-xl text-xs flex items-center justify-center gap-1 shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve & Deliver</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-[#121826] rounded-2xl border border-gray-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-[#0a0e17] text-gray-400 uppercase text-[10px] tracking-wider border-b border-gray-800">
              <tr>
                <th className="p-3.5">Order ID / Date</th>
                <th className="p-3.5">Target BGMI ID</th>
                <th className="p-3.5">Buyer Telegram</th>
                <th className="p-3.5">Amount (₹)</th>
                <th className="p-3.5">Payment Proof & UTR</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">
                    No orders found matching your search.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const proofSrc = order.payment_proof || (order as any).payment_proof_url;
                  return (
                    <tr key={order.id} className="hover:bg-gray-800/40 transition-colors">
                      {/* Order ID & Date */}
                      <td className="p-3.5">
                        <span className="font-mono font-black text-yellow-400 text-xs block">{order.id}</span>
                        <span className="text-gray-500 text-[10px]">
                          {new Date(order.order_date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                        </span>
                      </td>

                      {/* Target BGMI ID */}
                      <td className="p-3.5">
                        <span className="font-mono font-bold text-white block">{order.bgmi_id}</span>
                        <span className="text-[10px] text-yellow-400/80 font-semibold">{order.stock_tier || 'Gold ID'}</span>
                      </td>

                      {/* Buyer Telegram */}
                      <td className="p-3.5">
                        <button
                          onClick={() => openTelegramUser(order.telegram_username, order.id)}
                          className="font-bold text-cyan-400 hover:underline flex items-center gap-1"
                        >
                          <span>{order.telegram_username}</span>
                          <Send className="w-3 h-3" />
                        </button>
                      </td>

                      {/* Amount */}
                      <td className="p-3.5">
                        <span className="font-mono font-black text-yellow-400 text-xs">₹{order.price}</span>
                      </td>

                      {/* Payment Proof & UTR Column */}
                      <td className="p-3.5">
                        {proofSrc ? (
                          <div className="flex items-center gap-2.5">
                            {/* Thumbnail Preview */}
                            <button
                              type="button"
                              onClick={() => setSelectedProofOrder(order)}
                              className="relative w-14 h-11 rounded-lg overflow-hidden border border-yellow-500/40 hover:border-yellow-400 bg-black shrink-0 group shadow-md"
                              title="Click to inspect full screenshot"
                            >
                              <img
                                src={proofSrc}
                                alt={`Proof ${order.id}`}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-yellow-400 transition-opacity">
                                <Eye className="w-3.5 h-3.5" />
                              </div>
                            </button>

                            <div>
                              <button
                                onClick={() => setSelectedProofOrder(order)}
                                className="text-yellow-400 hover:text-yellow-300 font-bold text-[11px] flex items-center gap-1 hover:underline text-left"
                              >
                                <Eye className="w-3 h-3" />
                                <span>Inspect Proof</span>
                              </button>
                              {order.utr_number ? (
                                <div className="flex items-center gap-1 mt-0.5">
                                  <span className="font-mono text-gray-400 text-[10px]">
                                    UTR: {order.utr_number}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleCopyUtr(order.utr_number!, `t-utr-${order.id}`)}
                                    className="text-gray-500 hover:text-yellow-400 transition-colors p-0.5"
                                    title="Copy UTR"
                                  >
                                    {copiedUtrKey === `t-utr-${order.id}` ? (
                                      <CheckCheck className="w-2.5 h-2.5 text-emerald-400" />
                                    ) : (
                                      <Copy className="w-2.5 h-2.5" />
                                    )}
                                  </button>
                                </div>
                              ) : (
                                <span className="text-gray-500 text-[10px] block">No UTR specified</span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-500 text-[11px]">No screenshot</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="p-3.5">
                        {order.payment_status === 'pending' && (
                          <span className="px-2.5 py-1 rounded-lg bg-yellow-500/20 text-yellow-400 font-bold text-[10px] border border-yellow-500/30 inline-flex items-center gap-1 animate-pulse">
                            <Clock className="w-3 h-3" /> Pending Review
                          </span>
                        )}
                        {order.payment_status === 'completed' && (
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-[10px] border border-emerald-500/30 inline-flex items-center gap-1">
                            ✓ Verified & Delivered
                          </span>
                        )}
                        {order.payment_status === 'rejected' && (
                          <span className="px-2.5 py-1 rounded-lg bg-red-500/20 text-red-400 font-bold text-[10px] border border-red-500/30 inline-flex items-center gap-1">
                            ✕ Rejected
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="p-3.5 text-right">
                        {order.payment_status === 'pending' && (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenRejectModal(order)}
                              className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 hover:text-white transition-all active:scale-95"
                              title="Reject Payment"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleApprove(order.id)}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-black font-black text-xs flex items-center gap-1 shadow-md shadow-emerald-600/20 transition-all active:scale-95"
                              title="Approve and Deliver Credentials"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                          </div>
                        )}
                        {order.payment_status === 'completed' && (
                          <span className="text-[11px] text-emerald-400 font-bold">Delivered</span>
                        )}
                        {order.payment_status === 'rejected' && (
                          <span className="text-[11px] text-red-400 font-bold">Rejected</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Proof Inspection Modal */}
      {selectedProofOrder && (
        <PaymentProofModal
          order={selectedProofOrder}
          onClose={() => setSelectedProofOrder(null)}
          onApprove={(id) => {
            handleApprove(id);
            setSelectedProofOrder(null);
          }}
          onReject={(id) => {
            const found = orders.find((o) => o.id === id) || selectedProofOrder;
            setSelectedProofOrder(null);
            if (found) {
              handleOpenRejectModal(found);
            }
          }}
        />
      )}

      {/* Rejection Confirmation Modal */}
      <RejectOrderModal
        order={orderToReject}
        isOpen={!!orderToReject}
        onClose={() => setOrderToReject(null)}
        onConfirmReject={handleConfirmRejectOrder}
      />
    </div>
  );
};

