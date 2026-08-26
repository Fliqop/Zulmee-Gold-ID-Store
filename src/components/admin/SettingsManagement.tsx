import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { useStore } from '../../context/StoreContext';
import { QrCode, Save, RefreshCw, Send, Check, AlertCircle, Sparkles, Tag, DollarSign, Key, Shield, Eye, EyeOff, Lock } from 'lucide-react';

export const SettingsManagement: React.FC = () => {
  const { settings, updateSettings, resetAllData } = useStore();

  const [formData, setFormData] = useState({
    upi_id: settings.upi_id,
    upi_name: settings.upi_name,
    telegram_admin_username: settings.telegram_admin_username,
    telegram_channel_url: settings.telegram_channel_url || '',
    whatsapp_support_number: settings.whatsapp_support_number || '',
    announcement_text: settings.announcement_text,
    currency_symbol: settings.currency_symbol || '₹',
    gold_id_price: settings.gold_id_price || 80,
    admin_username: settings.admin_username || 'admin',
    admin_password: settings.admin_password || 'admin@123',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [testAmount, setTestAmount] = useState(settings.gold_id_price || 80);
  const [testQrUrl, setTestQrUrl] = useState('');

  // Update live test QR
  useEffect(() => {
    const upiLink = `upi://pay?pa=${encodeURIComponent(formData.upi_id)}&pn=${encodeURIComponent(
      formData.upi_name
    )}&am=${formData.gold_id_price || 80}&cu=INR&tn=BGMI_GOLD_ID`;

    QRCode.toDataURL(upiLink, { width: 220, margin: 1 })
      .then((url) => setTestQrUrl(url))
      .catch((err) => console.error(err));
  }, [formData.upi_id, formData.upi_name, formData.gold_id_price]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      ...formData,
      gold_id_price: Number(formData.gold_id_price) || 80,
      admin_username: formData.admin_username.trim() || 'admin',
      admin_password: formData.admin_password.trim() || 'admin@123',
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleReset = () => {
    if (window.confirm('Reset all stock, orders, and settings back to factory demo defaults?')) {
      resetAllData();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-[#141b2c] p-4 sm:p-5 rounded-2xl border border-gray-800 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-white">Store & Admin Control Settings</h2>
          <p className="text-xs text-gray-400">Configure receiver UPI ID, Telegram Support, Admin Password & Global Pricing</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Form */}
        <div className="lg:col-span-2 bg-[#121826] p-5 sm:p-6 rounded-2xl border border-gray-800 shadow-xl space-y-4">
          {savedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Settings and Admin Credentials saved successfully across store & database!</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            {/* Admin Security / Password Section */}
            <div className="p-4 rounded-xl bg-[#0a0e17] border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-amber-400 flex items-center gap-1.5 text-sm">
                  <Shield className="w-4 h-4" /> Admin Portal Security & Password
                </h3>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold border border-amber-500/30 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Secure Auth
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block font-bold text-gray-300 mb-1">Admin Username *</label>
                  <input
                    type="text"
                    required
                    value={formData.admin_username}
                    onChange={(e) => setFormData({ ...formData, admin_username: e.target.value })}
                    placeholder="admin"
                    className="w-full bg-[#121826] text-amber-300 font-mono px-3 py-2 rounded-xl border border-gray-700 focus:border-amber-400 outline-none"
                  />
                  <p className="text-[10px] text-gray-500 mt-1">Username to access the admin management portal.</p>
                </div>

                <div>
                  <label className="block font-bold text-gray-300 mb-1">Admin Password *</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.admin_password}
                      onChange={(e) => setFormData({ ...formData, admin_password: e.target.value })}
                      placeholder="Enter new admin password"
                      className="w-full bg-[#121826] text-amber-300 font-mono pl-3 pr-10 py-2 rounded-xl border border-gray-700 focus:border-amber-400 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">Change password anytime to secure your control panel.</p>
                </div>
              </div>
            </div>

            {/* Global Gold ID Price Setting */}
            <div className="p-4 rounded-xl bg-[#0a0e17] border border-yellow-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-yellow-400 flex items-center gap-1.5 text-sm">
                  <Tag className="w-4 h-4" /> Global Gold ID Price (Unified Rate)
                </h3>
                <span className="px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-300 font-mono text-[10px] font-bold border border-yellow-500/30">
                  Current: ₹{formData.gold_id_price}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block font-bold text-gray-300 mb-1">Price per Gold ID (₹) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-yellow-400 font-bold text-sm">₹</span>
                    <input
                      type="number"
                      min="1"
                      required
                      value={formData.gold_id_price}
                      onChange={(e) => setFormData({ ...formData, gold_id_price: Number(e.target.value) || 0 })}
                      placeholder="80"
                      className="w-full bg-[#121826] text-yellow-300 font-bold font-mono pl-8 pr-3 py-2 rounded-xl border border-gray-700 focus:border-yellow-400 outline-none text-base"
                    />
                  </div>
                </div>

                <div className="bg-[#141b2c] p-3 rounded-xl border border-gray-800 text-[11px] text-gray-400 space-y-1">
                  <p className="font-bold text-gray-300 flex items-center gap-1">
                    ⚡ Auto Bulk Price Sync
                  </p>
                  <p className="text-[10px] text-gray-400 leading-tight">
                    All Gold IDs across storefront, live stock, and UPI checkout will be updated to this exact price automatically.
                  </p>
                </div>
              </div>
            </div>

            {/* UPI Settings */}
            <div className="p-4 rounded-xl bg-[#0a0e17] border border-gray-800 space-y-3">
              <h3 className="font-bold text-yellow-400 flex items-center gap-1.5">
                <QrCode className="w-4 h-4" /> UPI Payment Configuration
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-300 mb-1">Receiver UPI ID *</label>
                  <input
                    type="text"
                    required
                    value={formData.upi_id}
                    onChange={(e) => setFormData({ ...formData, upi_id: e.target.value })}
                    placeholder="merchant@okhdfcbank"
                    className="w-full bg-[#121826] text-yellow-300 font-mono px-3 py-2 rounded-xl border border-gray-700 focus:border-yellow-400 outline-none"
                  />
                  <p className="text-[10px] text-gray-500 mt-1">All QR codes will dynamically route funds to this UPI address.</p>
                </div>

                <div>
                  <label className="block font-bold text-gray-300 mb-1">Merchant / Payee Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.upi_name}
                    onChange={(e) => setFormData({ ...formData, upi_name: e.target.value })}
                    placeholder="BGMI Official Store"
                    className="w-full bg-[#121826] text-white px-3 py-2 rounded-xl border border-gray-700 focus:border-yellow-400 outline-none"
                  />
                  <p className="text-[10px] text-gray-500 mt-1">Displayed to the buyer on their UPI app checkout screen.</p>
                </div>
              </div>
            </div>

            {/* Telegram Support Configuration */}
            <div className="p-4 rounded-xl bg-[#0a0e17] border border-gray-800 space-y-3">
              <h3 className="font-bold text-[#229ED9] flex items-center gap-1.5">
                <Send className="w-4 h-4" /> Telegram Admin Support
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-300 mb-1">Telegram Admin Username *</label>
                  <input
                    type="text"
                    required
                    value={formData.telegram_admin_username}
                    onChange={(e) => setFormData({ ...formData, telegram_admin_username: e.target.value })}
                    placeholder="@AdminSupport"
                    className="w-full bg-[#121826] text-cyan-300 font-mono px-3 py-2 rounded-xl border border-gray-700 focus:border-yellow-400 outline-none"
                  />
                  <p className="text-[10px] text-gray-500 mt-1">
                    Buyers are directed here for order approvals, payment verification, and questions.
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-gray-300 mb-1">Telegram Channel / Group Link</label>
                  <input
                    type="url"
                    value={formData.telegram_channel_url}
                    onChange={(e) => setFormData({ ...formData, telegram_channel_url: e.target.value })}
                    placeholder="https://t.me/bgmigoldidstore"
                    className="w-full bg-[#121826] text-white px-3 py-2 rounded-xl border border-gray-700 focus:border-yellow-400 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Store Announcement */}
            <div>
              <label className="block font-bold text-gray-300 mb-1">Store Announcement Bar Text</label>
              <textarea
                rows={2}
                value={formData.announcement_text}
                onChange={(e) => setFormData({ ...formData, announcement_text: e.target.value })}
                className="w-full bg-[#0a0e17] text-white px-3 py-2 rounded-xl border border-gray-700 focus:border-yellow-400 outline-none text-xs"
              />
            </div>

            {/* Buttons */}
            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-2 bg-red-950/40 hover:bg-red-900/50 text-red-400 border border-red-900/40 rounded-xl font-bold text-xs"
              >
                Reset Demo Stock & Orders
              </button>

              <button
                type="submit"
                id="save-settings-btn"
                className="px-6 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-black rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-yellow-500/20 active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>Save All Settings</span>
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview Panel */}
        <div className="bg-[#121826] p-5 rounded-2xl border border-gray-800 shadow-xl flex flex-col items-center justify-between text-center">
          <div className="w-full">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block mb-2">
              Live Dynamic UPI QR Preview
            </span>

            <div className="bg-white p-3 rounded-xl border-2 border-yellow-400 shadow-lg mx-auto inline-block">
              {testQrUrl ? (
                <img src={testQrUrl} alt="Live QR Preview" className="w-44 h-44 object-contain" />
              ) : (
                <div className="w-44 h-44 flex items-center justify-center text-gray-400 text-xs">Generating...</div>
              )}
            </div>

            <div className="mt-3 space-y-1 text-xs">
              <p className="font-bold text-white">{formData.upi_name || 'Store Name'}</p>
              <p className="font-mono text-yellow-400 text-[11px]">{formData.upi_id || 'upi@bank'}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-800 text-left text-[11px] text-gray-400 space-y-2">
              <div className="flex justify-between">
                <span>Test Price:</span>
                <span className="text-yellow-400 font-bold">₹{formData.gold_id_price}</span>
              </div>
              <div className="flex justify-between">
                <span>Support Handle:</span>
                <span className="text-cyan-400 font-bold">{formData.telegram_admin_username}</span>
              </div>
              <div className="flex justify-between">
                <span>Admin Login:</span>
                <span className="text-amber-400 font-mono font-bold">{formData.admin_username}</span>
              </div>
            </div>
          </div>

          <div className="w-full mt-4 p-2.5 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 text-[11px]">
            ⚡ Changes take effect instantaneously across all customer checkout modals.
          </div>
        </div>
      </div>
    </div>
  );
};
