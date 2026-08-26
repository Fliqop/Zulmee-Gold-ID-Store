import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Settings, 
  LogOut, 
  ArrowLeft, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  TrendingUp, 
  ShieldCheck, 
  Sparkles,
  RefreshCw,
  Send,
  Lock
} from 'lucide-react';
import { StockManagement } from './StockManagement';
import { OrdersManagement } from './OrdersManagement';
import { SettingsManagement } from './SettingsManagement';

interface AdminDashboardProps {
  onBackToStore: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToStore }) => {
  const { stats, adminLogout, adminUsername, settings, orders, stock } = useStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'stock' | 'orders' | 'settings'>('overview');

  return (
    <div className="min-h-screen bg-[#0a0e17] text-white flex flex-col">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-30 bg-[#121826]/95 backdrop-blur-md border-b border-yellow-500/20 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToStore}
              className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-xs font-bold flex items-center gap-1 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Store</span>
            </button>

            <div className="h-5 w-[1px] bg-gray-700 hidden sm:block"></div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center text-yellow-400 font-black text-xs">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <span className="font-black text-sm text-white tracking-wide flex items-center gap-1.5">
                  ADMIN CONTROL PANEL
                  <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-mono border border-emerald-500/30">
                    ONLINE
                  </span>
                </span>
                <p className="text-[10px] text-gray-400">
                  Signed in as <strong className="text-yellow-400">{adminUsername || 'admin'}</strong>
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={adminLogout}
              className="px-3 py-1.5 bg-red-950/50 hover:bg-red-900/60 text-red-300 hover:text-white border border-red-900/60 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 sm:gap-2 overflow-x-auto border-t border-gray-800/80 scrollbar-none py-1.5">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'overview'
                ? 'bg-yellow-500 text-black shadow-md shadow-yellow-500/20'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>📊 Overview & Stats</span>
          </button>

          <button
            onClick={() => setActiveTab('stock')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'stock'
                ? 'bg-yellow-500 text-black shadow-md shadow-yellow-500/20'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>📦 Stock Inventory ({stats.totalStock})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 relative ${
              activeTab === 'orders'
                ? 'bg-yellow-500 text-black shadow-md shadow-yellow-500/20'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>📋 Orders & Verification ({stats.totalOrders})</span>
            {stats.pendingOrders > 0 && (
              <span className="w-5 h-5 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center font-black animate-pulse">
                {stats.pendingOrders}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'settings'
                ? 'bg-yellow-500 text-black shadow-md shadow-yellow-500/20'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>⚙️ UPI & Store Settings</span>
          </button>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Top Revenue & Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {/* Total Revenue */}
              <div className="col-span-2 md:col-span-3 lg:col-span-2 bg-gradient-to-br from-yellow-950/40 via-[#182030] to-[#101624] p-5 rounded-2xl border border-yellow-500/30 shadow-xl">
                <span className="text-[11px] font-bold text-yellow-400 uppercase tracking-wider block">
                  Total Verified Revenue
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-4xl font-black text-yellow-400">
                    ₹{stats.totalRevenue.toLocaleString()}
                  </span>
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-0.5">
                    <TrendingUp className="w-3.5 h-3.5" /> 100% UPI
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 mt-2">
                  From {stats.completedOrders} completed transactions
                </p>
              </div>

              {/* Total Stock */}
              <div className="bg-[#121826] p-4 rounded-2xl border border-gray-800 shadow-lg">
                <span className="text-gray-400 text-xs font-bold block">Total Stock</span>
                <span className="text-2xl font-black text-white mt-1 block">{stats.totalStock}</span>
                <span className="text-[10px] text-emerald-400 font-semibold">{stats.availableStock} available</span>
              </div>

              {/* Available */}
              <div className="bg-[#121826] p-4 rounded-2xl border border-gray-800 shadow-lg">
                <span className="text-gray-400 text-xs font-bold block">Available IDs</span>
                <span className="text-2xl font-black text-emerald-400 mt-1 block">{stats.availableStock}</span>
                <span className="text-[10px] text-gray-500">{stats.soldStock} sold so far</span>
              </div>

              {/* Pending Orders */}
              <div className="bg-[#121826] p-4 rounded-2xl border border-yellow-500/30 shadow-lg">
                <span className="text-yellow-400 text-xs font-bold block">Pending Review</span>
                <span className="text-2xl font-black text-yellow-400 mt-1 block animate-pulse">
                  {stats.pendingOrders}
                </span>
                <span className="text-[10px] text-gray-400">Needs proof check</span>
              </div>

              {/* Total Orders */}
              <div className="bg-[#121826] p-4 rounded-2xl border border-gray-800 shadow-lg">
                <span className="text-gray-400 text-xs font-bold block">Total Orders</span>
                <span className="text-2xl font-black text-cyan-400 mt-1 block">{stats.totalOrders}</span>
                <span className="text-[10px] text-gray-400">{stats.completedOrders} approved</span>
              </div>
            </div>

            {/* Quick Actions & Live Queues */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Pending Orders Action Card */}
              <div className="lg:col-span-2 bg-[#121826] p-5 sm:p-6 rounded-2xl border border-gray-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Clock className="w-4 h-4 text-yellow-400" />
                      <span>Pending Orders Awaiting Verification</span>
                    </h3>
                    <p className="text-xs text-gray-400">Inspect screenshot and release credentials</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-yellow-400 hover:underline font-bold"
                  >
                    View All →
                  </button>
                </div>

                {orders.filter((o) => o.payment_status === 'pending').length > 0 ? (
                  <div className="space-y-2.5">
                    {orders
                      .filter((o) => o.payment_status === 'pending')
                      .slice(0, 4)
                      .map((order) => (
                        <div
                          key={order.id}
                          className="bg-[#0a0e17] p-3 rounded-xl border border-yellow-500/20 flex items-center justify-between gap-3 text-xs"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-black text-yellow-400">{order.id}</span>
                              <span className="font-bold text-white">{order.stock_title}</span>
                            </div>
                            <span className="text-gray-400 text-[11px]">
                              Buyer: <strong className="text-cyan-400">{order.telegram_username}</strong> • BGMI: {order.bgmi_id}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="font-black text-yellow-400 text-sm">₹{order.price}</span>
                            <button
                              onClick={() => setActiveTab('orders')}
                              className="px-3 py-1.5 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-xs shadow"
                            >
                              Inspect Proof
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-[#0a0e17] rounded-xl border border-gray-800 text-gray-400 text-xs">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                    All caught up! No pending payment verifications in queue.
                  </div>
                )}
              </div>

              {/* Quick Info & Store Health */}
              <div className="bg-[#121826] p-5 sm:p-6 rounded-2xl border border-gray-800 shadow-xl space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Store Gateway Config</span>
                </h3>

                <div className="bg-[#0a0e17] p-3.5 rounded-xl border border-gray-800 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Receiver UPI:</span>
                    <span className="font-mono font-bold text-yellow-400">{settings.upi_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Payee Name:</span>
                    <span className="font-semibold text-white">{settings.upi_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">TG Admin Handle:</span>
                    <span className="font-bold text-cyan-400">{settings.telegram_admin_username}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Currency:</span>
                    <span className="font-bold text-white">INR (₹)</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setActiveTab('settings')}
                    className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-yellow-400 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Edit Store & UPI Settings</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STOCK INVENTORY TAB */}
        {activeTab === 'stock' && <StockManagement />}

        {/* ORDERS & VERIFICATIONS TAB */}
        {activeTab === 'orders' && <OrdersManagement />}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && <SettingsManagement />}
      </main>
    </div>
  );
};
