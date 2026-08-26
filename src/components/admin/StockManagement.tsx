import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { BGMIStockItem, AccountTier, AccountStatus } from '../../types';
import { Plus, Edit2, Trash2, Eye, EyeOff, Search, Sparkles, Check, X, Trophy, Key, Tag, Copy, AtSign } from 'lucide-react';

export const StockManagement: React.FC = () => {
  const { stock, settings, addStockItem, updateStockItem, deleteStockItem } = useStore();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BGMIStockItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [visiblePasswords, setVisiblePasswords] = useState<{ [id: string]: boolean }>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Simple, clean form state for Add / Edit
  const [formData, setFormData] = useState<{
    bgmi_id: string;
    in_game_name: string;
    login_username: string;
    login_password: string;
    login_method: string;
    tier: AccountTier;
    status: AccountStatus;
  }>({
    bgmi_id: '',
    in_game_name: 'GOLD ID',
    login_username: '',
    login_password: '',
    login_method: 'Twitter',
    tier: 'Gold I',
    status: 'available',
  });

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      bgmi_id: `5${Math.floor(100000000 + Math.random() * 900000000)}`,
      in_game_name: 'GOLD ID',
      login_username: '',
      login_password: '',
      login_method: 'Twitter',
      tier: 'Gold I',
      status: 'available',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (item: BGMIStockItem) => {
    setEditingItem(item);
    
    // Parse username and password if formatted
    let lUser = '';
    let lPass = '';
    const match = item.password.match(/Login: (.*?) \/ Pass: (.*)/);
    if (match) {
      lUser = match[1];
      lPass = match[2];
    } else {
      lPass = item.password;
    }

    setFormData({
      bgmi_id: item.bgmi_id,
      in_game_name: item.in_game_name || 'GOLD ID',
      login_username: lUser,
      login_password: lPass,
      login_method: item.login_method || 'Twitter',
      tier: (item.tier as AccountTier) || 'Gold I',
      status: item.status || 'available',
    });
    setIsAddModalOpen(true);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    const combinedPassword = formData.login_username
      ? `Login: ${formData.login_username.trim()} / Pass: ${formData.login_password.trim()}`
      : formData.login_password.trim();

    const currentGlobalPrice = settings.gold_id_price || 80;

    const stockPayload = {
      bgmi_id: formData.bgmi_id?.trim() || `5${Math.floor(100000000 + Math.random() * 900000000)}`,
      in_game_name: formData.in_game_name?.trim() || 'GOLD ID',
      password: combinedPassword,
      login_method: formData.login_method?.trim() || 'Twitter',
      price: currentGlobalPrice,
      original_price: currentGlobalPrice + 200,
      tier: formData.tier || 'Gold I',
      level: 55,
      uc_balance: 360,
      achievement_points: 3500,
      popularity: '150K+',
      status: formData.status || 'available',
      image_url: '',
      highlight_badge: 'GOLD ID',
      description: 'Clean Gold Tier ID ready for instant play.',
      skins: {
        gunLabs: [],
        mythicOutfits: 0,
        vehicles: [],
        titles: [],
        bindType: formData.login_method?.trim() || 'Twitter',
      },
    };

    if (editingItem) {
      await updateStockItem(editingItem.id, stockPayload);
    } else {
      await addStockItem(stockPayload);
    }

    setIsAddModalOpen(false);
    setEditingItem(null);
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}" from stock?`)) {
      await deleteStockItem(id);
    }
  };

  // Filter stock
  const filteredStock = stock.filter((item) => {
    const matchesSearch =
      item.bgmi_id.includes(searchTerm) ||
      (item.in_game_name && item.in_game_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.tier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#141b2c] p-4 sm:p-5 rounded-2xl border border-gray-800">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <span>BGMI Stock Inventory</span>
            <span className="px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-400 text-xs font-mono">
              {stock.length} Total IDs
            </span>
          </h2>
          <p className="text-xs text-gray-400">Add, edit, manage credentials, and toggle account availability</p>
        </div>

        <button
          onClick={handleOpenAdd}
          id="admin-add-id-btn"
          className="px-4 py-2.5 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-black font-black rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-yellow-500/20 hover:from-yellow-300 hover:to-amber-400 transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New BGMI ID</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search stock by ID or Name..."
            className="w-full bg-[#0a0e17] text-white pl-10 pr-4 py-2.5 rounded-xl border border-gray-700 focus:border-yellow-400 outline-none text-xs"
          />
        </div>

        <div className="flex gap-2">
          {['all', 'available', 'reserved', 'sold'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                statusFilter === st
                  ? 'bg-yellow-500 text-black'
                  : 'bg-gray-800/80 text-gray-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Stock Table */}
      <div className="bg-[#121826] rounded-2xl border border-gray-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-[#0a0e17] text-gray-400 uppercase text-[10px] tracking-wider border-b border-gray-800">
              <tr>
                <th className="p-3.5">Account / ID</th>
                <th className="p-3.5">Price</th>
                <th className="p-3.5">Username / Password (Credentials)</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredStock.map((item) => {
                const isPasswordVisible = visiblePasswords[item.id];
                return (
                  <tr key={item.id} className="hover:bg-gray-800/40 transition-colors">
                    {/* Account / ID (No image, clean gold badge & quick copy) */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-yellow-500/15 border border-yellow-500/30 flex items-center justify-center text-yellow-400 shrink-0 font-black text-xs">
                          <Trophy className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white line-clamp-1">
                              {item.in_game_name || 'GOLD ID'}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/15 text-sky-400 border border-sky-500/30 font-semibold flex items-center gap-1">
                              <AtSign className="w-2.5 h-2.5" />
                              {item.login_method || 'Twitter'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="font-mono text-gray-400 text-[11px]">
                              ID: {item.bgmi_id}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopy(item.bgmi_id, `id-${item.id}`)}
                              className="text-gray-500 hover:text-yellow-400 transition-colors p-0.5"
                              title="Copy BGMI ID"
                            >
                              {copiedKey === `id-${item.id}` ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="p-3.5">
                      <span className="font-black text-yellow-400 text-sm font-mono">₹{item.price}</span>
                      {item.original_price && (
                        <span className="text-gray-500 line-through text-[10px] block font-mono">
                          ₹{item.original_price}
                        </span>
                      )}
                    </td>

                    {/* Username / Password (Credentials) */}
                    <td className="p-3.5 max-w-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[11px] truncate bg-black/60 px-2.5 py-1 rounded-lg border border-gray-800 max-w-[220px] select-all text-yellow-200">
                          {isPasswordVisible ? item.password : '••••••••••••••••'}
                        </span>
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility(item.id)}
                          className="p-1.5 hover:text-white text-gray-400 transition-colors rounded hover:bg-gray-800"
                          title={isPasswordVisible ? 'Hide Password' : 'Show Password'}
                        >
                          {isPasswordVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopy(item.password, `pass-${item.id}`)}
                          className="p-1.5 hover:text-yellow-400 text-gray-400 transition-colors rounded hover:bg-gray-800"
                          title="Copy Credentials"
                        >
                          {copiedKey === `pass-${item.id}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="p-3.5">
                      <select
                        value={item.status}
                        onChange={(e) => updateStockItem(item.id, { status: e.target.value as AccountStatus })}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border outline-none bg-[#0a0e17] cursor-pointer ${
                          item.status === 'available'
                            ? 'text-emerald-400 border-emerald-500/40'
                            : item.status === 'reserved'
                            ? 'text-yellow-400 border-yellow-500/40'
                            : 'text-red-400 border-red-500/40'
                        }`}
                      >
                        <option value="available">Available</option>
                        <option value="reserved">Reserved</option>
                        <option value="sold">Sold</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-all"
                          title="Edit ID"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.in_game_name || item.bgmi_id)}
                          className="p-1.5 rounded-lg bg-red-950/50 hover:bg-red-900 text-red-400 transition-all"
                          title="Delete ID"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredStock.length === 0 && (
            <div className="p-8 text-center text-gray-400">
              No BGMI IDs match your filter criteria.
            </div>
          )}
        </div>
      </div>

      {/* ADD / EDIT MODAL (Simple, original logic) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-xl bg-[#121826] border border-yellow-500/30 rounded-2xl shadow-2xl shadow-black overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-[#182032] p-4 sm:p-5 border-b border-gray-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span>{editingItem ? 'Edit BGMI ID' : 'Add New BGMI ID to Stock'}</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitForm} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto scrollbar-thin text-xs">
              <div>
                <label className="block font-bold text-gray-300 mb-1">Login Method / Bind Type</label>
                <select
                  value={formData.login_method}
                  onChange={(e) => setFormData({ ...formData, login_method: e.target.value })}
                  className="w-full bg-[#0a0e17] text-white px-3 py-2.5 rounded-xl border border-gray-700 focus:border-yellow-400 outline-none text-xs font-semibold"
                >
                  <option value="Twitter">Twitter (X)</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Google Play">Google Play</option>
                  <option value="Email">Email Link</option>
                </select>
              </div>

              {/* Password / Credentials (SECRET) */}
              <div className="bg-black/60 p-3.5 rounded-xl border border-yellow-500/30">
                <label className="block font-bold text-yellow-400 mb-1 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5" /> Username / Password (Credentials) *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">Username / ID</label>
                    <input
                      type="text"
                      required
                      value={formData.login_username}
                      onChange={(e) => setFormData({ ...formData, login_username: e.target.value })}
                      placeholder="e.g. twitter_username"
                      className="w-full bg-[#0a0e17] text-yellow-200 px-3 py-2 rounded-lg border border-gray-700 focus:border-yellow-400 outline-none font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">Password</label>
                    <input
                      type="text"
                      required
                      value={formData.login_password}
                      onChange={(e) => setFormData({ ...formData, login_password: e.target.value })}
                      placeholder="e.g. Password123!"
                      className="w-full bg-[#0a0e17] text-yellow-200 px-3 py-2 rounded-lg border border-gray-700 focus:border-yellow-400 outline-none font-mono text-xs"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 mt-2">
                  Auto-set: Account Name (GOLD ID), Tier (Gold I), Status (Available), BGMI ID (Auto-generated).
                </p>
              </div>

              {/* Global Price Notice */}
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl flex items-center justify-between">
                <div>
                  <span className="block font-bold text-yellow-400 text-xs flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" /> Account Price (Auto-set)
                  </span>
                  <span className="text-[10px] text-gray-400">
                    Managed globally in Admin Settings for all Gold IDs
                  </span>
                </div>
                <span className="text-base font-black text-yellow-300 font-mono">
                  ₹{settings.gold_id_price || 80}
                </span>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-gray-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-black rounded-xl shadow-lg shadow-yellow-500/20 active:scale-95"
                >
                  {editingItem ? 'Save Changes' : 'Add BGMI ID'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

