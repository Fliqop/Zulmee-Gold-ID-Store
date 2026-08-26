import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { BGMIStockItem, Order, StoreSettings, UserAccount, AccountTier, AccountStatus, PaymentStatus } from '../types';
import { INITIAL_STOCK, INITIAL_ORDERS, DEFAULT_SETTINGS } from '../data/initialStock';

interface StoreContextType {
  stock: BGMIStockItem[];
  orders: Order[];
  settings: StoreSettings;
  isAdmin: boolean;
  adminUsername: string | null;
  adminLogin: (username: string, pass: string) => { success: boolean; error?: string };
  adminLogout: () => void;
  // User Auth operations
  currentUser: UserAccount | null;
  signUp: (username: string, password: string, secretPhrase?: string, email?: string, phone?: string) => Promise<{ success: boolean; user?: UserAccount; secretPhrase?: string; error?: string }>;
  signIn: (username: string, password: string, secretPhrase: string) => Promise<{ success: boolean; user?: UserAccount; error?: string }>;
  signOut: () => void;
  generateSecretPhrase: () => string;
  getUserOrders: (username?: string) => Order[];
  // Stock operations
  addStockItem: (item: Omit<BGMIStockItem, 'id' | 'created_at'>) => Promise<BGMIStockItem>;
  updateStockItem: (id: string, updates: Partial<BGMIStockItem>) => Promise<void>;
  deleteStockItem: (id: string) => Promise<void>;
  getStockItemById: (id: string) => BGMIStockItem | undefined;
  getStockItemByBgmiId: (bgmiId: string) => BGMIStockItem | undefined;
  // Order operations
  createOrder: (data: {
    stock_item_id: string;
    telegram_username: string;
    buyer_phone?: string;
    buyer_email?: string;
    buyer_username?: string;
  }) => Promise<{ success: boolean; order?: Order; error?: string }>;
  uploadPaymentProof: (orderId: string, proofDataUrl: string, utrNumber?: string) => Promise<{ success: boolean; error?: string }>;
  approveOrder: (orderId: string, notes?: string) => Promise<{ success: boolean; error?: string }>;
  rejectOrder: (orderId: string, notes?: string) => Promise<{ success: boolean; error?: string }>;
  getOrderById: (orderId: string) => Order | undefined;
  getOrdersByTelegram: (username: string) => Order[];
  // Settings operations
  updateSettings: (newSettings: Partial<StoreSettings>) => Promise<void>;
  resetAllData: () => Promise<void>;
  refreshData: () => Promise<void>;
  // Computed stats
  stats: {
    totalStock: number;
    availableStock: number;
    reservedStock: number;
    soldStock: number;
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    rejectedOrders: number;
    totalRevenue: number;
  };
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  STOCK: 'bgmi_gold_store_stock_v2',
  ORDERS: 'bgmi_gold_store_orders_v2',
  SETTINGS: 'bgmi_gold_store_settings_v2',
  ADMIN_AUTH: 'bgmi_gold_store_admin_auth_v2',
  CURRENT_USER: 'bgmi_gold_store_current_user_v2',
  LOCAL_USERS: 'bgmi_gold_store_local_users_v2',
};

// Secret Passphrase Generator
export function generatePassphraseToken(): string {
  const words1 = ['GOLD', 'VIPER', 'TIGER', 'SHADOW', 'ROYAL', 'DRAGON', 'PHARAOH', 'GLACIER', 'TITAN', 'CYBER', 'APEX', 'STORM'];
  const words2 = ['ALPHA', 'STRIKE', 'VALOR', 'LEGEND', 'MASTER', 'HUNTER', 'ELITE', 'PRIME', 'FORCE', 'KNIGHT', 'BLAZE', 'WARRIOR'];
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const w1 = words1[Math.floor(Math.random() * words1.length)];
  const w2 = words2[Math.floor(Math.random() * words2.length)];
  return `${w1}-${randomNum}-${w2}`;
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stock, setStock] = useState<BGMIStockItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STOCK);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load stock from localStorage', e);
    }
    return INITIAL_STOCK;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load orders from localStorage', e);
    }
    return INITIAL_ORDERS;
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load settings from localStorage', e);
    }
    return DEFAULT_SETTINGS;
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH);
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const [adminUsername, setAdminUsername] = useState<string | null>(() => {
    return isAdmin ? 'admin' : null;
  });

  // User Auth State
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load current user from storage', e);
    }
    return null;
  });

  // Local registered users cache for offline / fallback
  const [localUsers, setLocalUsers] = useState<UserAccount[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LOCAL_USERS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load local users', e);
    }
    return [];
  });

  // Save current user to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      }
    } catch (e) {
      console.error('Failed to persist current user', e);
    }
  }, [currentUser]);

  // Save local users list to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LOCAL_USERS, JSON.stringify(localUsers));
    } catch (e) {
      console.error('Failed to persist local users', e);
    }
  }, [localUsers]);

  // Fetch data from MongoDB backend API
  const refreshData = useCallback(async () => {
    try {
      // 1. Fetch Stock
      const stockRes = await fetch('/api/stock');
      if (stockRes.ok) {
        const stockData = await stockRes.json();
        if (Array.isArray(stockData) && stockData.length > 0) {
          setStock(stockData);
          localStorage.setItem(STORAGE_KEYS.STOCK, JSON.stringify(stockData));
        }
      }

      // 2. Fetch Orders
      const ordersRes = await fetch('/api/orders');
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        if (Array.isArray(ordersData)) {
          setOrders(ordersData);
          localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(ordersData));
        }
      }

      // 3. Fetch Settings
      const settingsRes = await fetch('/api/settings');
      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        if (settingsData && settingsData.telegram_admin_username) {
          setSettings(settingsData);
          localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settingsData));
        }
      }
    } catch (err) {
      console.log('MongoDB API sync active; using local cached state if offline.');
    }
  }, []);

  // Initial load from backend API
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Synchronize to localStorage as local cache
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STOCK, JSON.stringify(stock));
    } catch (e) {
      console.error('Failed to cache stock', e);
    }
  }, [stock]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.warn('Failed to cache full orders (likely quota limit), saving compact list');
      try {
        // Strip large base64 screenshot strings in local storage fallback to save quota
        const compactOrders = orders.map((o) => ({
          ...o,
          payment_proof: o.payment_proof && o.payment_proof.length > 500 ? '[SCREENSHOT_STORED]' : o.payment_proof,
        }));
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(compactOrders));
      } catch (innerErr) {
        console.error('Storage quota reached', innerErr);
      }
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to cache settings', e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, isAdmin ? 'true' : 'false');
    } catch (e) {
      console.error('Failed to save admin auth', e);
    }
  }, [isAdmin]);

  // Admin Auth handler
  const adminLogin = (user: string, pass: string) => {
    const cleanUser = user.trim().toLowerCase();
    const cleanPass = pass.trim();
    const targetUser = (settings.admin_username || 'admin').trim().toLowerCase();
    const targetPass = (settings.admin_password || 'admin@123').trim();

    if (cleanUser === targetUser && cleanPass === targetPass) {
      setIsAdmin(true);
      setAdminUsername(settings.admin_username || 'admin');
      return { success: true };
    }
    return { success: false, error: 'Invalid admin username or password.' };
  };

  const adminLogout = () => {
    setIsAdmin(false);
    setAdminUsername(null);
  };

  // User Sign-Up handler
  const signUp = async (
    username: string,
    password: string,
    secretPhrase?: string,
    email?: string,
    phone?: string
  ): Promise<{ success: boolean; user?: UserAccount; secretPhrase?: string; error?: string }> => {
    const cleanUsername = username.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanUsername || cleanUsername.length < 3) {
      return { success: false, error: 'Username must be at least 3 characters long.' };
    }

    if (!cleanPassword || cleanPassword.length < 4) {
      return { success: false, error: 'Password must be at least 4 characters long.' };
    }

    const token = secretPhrase ? secretPhrase.trim().toUpperCase() : generatePassphraseToken();

    const newUser: UserAccount = {
      username: cleanUsername,
      password: cleanPassword,
      secret_phrase: token,
      email: email?.trim(),
      phone: phone?.trim(),
      created_at: new Date().toISOString(),
    };

    // Check local existing
    if (localUsers.some((u) => u.username.toLowerCase() === cleanUsername)) {
      return { success: false, error: 'Username already exists. Please choose a different username or Sign In.' };
    }

    // Save to local cache
    setLocalUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: cleanUsername,
          password: cleanPassword,
          secret_phrase: token,
          email: email?.trim(),
          phone: phone?.trim(),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setCurrentUser(data.user);
          return { success: true, user: data.user, secretPhrase: data.user.secret_phrase };
        }
      } else {
        const errData = await res.json().catch(() => ({}));
        if (errData.error) {
          // If server rejects (e.g. duplicate in MongoDB), roll back local
          setLocalUsers((prev) => prev.filter((u) => u.username !== cleanUsername));
          return { success: false, error: errData.error };
        }
      }
    } catch (e) {
      console.error('Backend sign-up sync error, using local registration', e);
    }

    return { success: true, user: newUser, secretPhrase: token };
  };

  // User Sign-In handler (requires Username, Password, AND Secret Passphrase Token)
  const signIn = async (
    username: string,
    password: string,
    secretPhrase: string
  ): Promise<{ success: boolean; user?: UserAccount; error?: string }> => {
    const cleanUsername = username.trim().toLowerCase();
    const cleanPassword = password.trim();
    const cleanSecret = secretPhrase.trim().toUpperCase();

    if (!cleanUsername || !cleanPassword || !cleanSecret) {
      return { success: false, error: 'Please provide Username, Password, and your Secret Passphrase Token.' };
    }

    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: cleanUsername,
          password: cleanPassword,
          secret_phrase: cleanSecret,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setCurrentUser(data.user);
          return { success: true, user: data.user };
        }
      } else {
        const errData = await res.json().catch(() => ({}));
        if (errData.error) {
          return { success: false, error: errData.error };
        }
      }
    } catch (e) {
      console.error('Backend sign-in sync error, checking local store', e);
    }

    // Local fallback check
    const matched = localUsers.find((u) => u.username.toLowerCase() === cleanUsername);
    if (matched) {
      if (matched.password !== cleanPassword) {
        return { success: false, error: 'Incorrect password.' };
      }
      if (matched.secret_phrase.toUpperCase() !== cleanSecret) {
        return { success: false, error: 'Invalid Secret Passphrase Token. Please check your token.' };
      }
      setCurrentUser(matched);
      return { success: true, user: matched };
    }

    return { success: false, error: 'No account found matching this username and secret passphrase token.' };
  };

  const signOut = () => {
    setCurrentUser(null);
  };

  // Get orders linked to a user
  const getUserOrders = (customUsername?: string) => {
    const targetUser = (customUsername || currentUser?.username || '').trim().toLowerCase();
    if (!targetUser) return [];

    return orders.filter((o) => {
      const buyerMatch = o.buyer_username && o.buyer_username.toLowerCase() === targetUser;
      const tgMatch = o.telegram_username && o.telegram_username.toLowerCase().replace('@', '') === targetUser.replace('@', '');
      return buyerMatch || tgMatch;
    });
  };

  // Stock CRUD Operations
  const addStockItem = async (itemData: Omit<BGMIStockItem, 'id' | 'created_at'>): Promise<BGMIStockItem> => {
    const defaultPrice = settings.gold_id_price || 80;
    const newItem: BGMIStockItem = {
      ...itemData,
      price: itemData.price || defaultPrice,
      original_price: itemData.original_price || (defaultPrice + 200),
      id: `bgmi-gold-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`,
      created_at: new Date().toISOString(),
      status: itemData.status || 'available',
    };

    // Optimistic local update
    setStock((prev) => [newItem, ...prev]);

    try {
      const res = await fetch('/api/stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
      if (res.ok) {
        const created = await res.json();
        setStock((prev) => prev.map((s) => (s.id === newItem.id ? created : s)));
        return created;
      }
    } catch (e) {
      console.error('Backend stock post error', e);
    }
    return newItem;
  };

  const updateStockItem = async (id: string, updates: Partial<BGMIStockItem>) => {
    setStock((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));

    try {
      await fetch(`/api/stock/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    } catch (e) {
      console.error('Backend stock update error', e);
    }
  };

  const deleteStockItem = async (id: string) => {
    setStock((prev) => prev.filter((item) => item.id !== id));

    try {
      await fetch(`/api/stock/${id}`, {
        method: 'DELETE',
      });
    } catch (e) {
      console.error('Backend stock delete error', e);
    }
  };

  const getStockItemById = (id: string) => {
    return stock.find((item) => item.id === id);
  };

  const getStockItemByBgmiId = (bgmiId: string) => {
    return stock.find((item) => item.bgmi_id === bgmiId);
  };

  // Orders Operations
  const createOrder = async ({
    stock_item_id,
    telegram_username,
    buyer_phone,
    buyer_email,
    buyer_username,
  }: {
    stock_item_id: string;
    telegram_username: string;
    buyer_phone?: string;
    buyer_email?: string;
    buyer_username?: string;
  }) => {
    const targetItem = stock.find((i) => i.id === stock_item_id);
    if (!targetItem) {
      return { success: false, error: 'BGMI Gold ID not found.' };
    }
    if (targetItem.status === 'sold') {
      return { success: false, error: 'This BGMI Gold ID has already been sold.' };
    }

    const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const effectiveUsername = buyer_username || currentUser?.username || undefined;

    const newOrder: Order = {
      id: orderId,
      bgmi_id: targetItem.bgmi_id,
      stock_item_id: targetItem.id,
      stock_title: targetItem.in_game_name || `BGMI ${targetItem.tier} ID`,
      stock_tier: targetItem.tier,
      price: targetItem.price,
      telegram_username: telegram_username.startsWith('@') ? telegram_username : `@${telegram_username}`,
      buyer_username: effectiveUsername,
      buyer_phone: buyer_phone?.trim() || currentUser?.phone || undefined,
      buyer_email: buyer_email?.trim() || currentUser?.email || undefined,
      payment_method: 'upi',
      payment_status: 'pending',
      order_date: new Date().toISOString(),
    };

    // Optimistically update stock & orders
    setStock((prev) =>
      prev.map((item) => (item.id === targetItem.id ? { ...item, status: 'reserved' } : item))
    );
    setOrders((prev) => [newOrder, ...prev]);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stock_item_id,
          telegram_username,
          buyer_phone: newOrder.buyer_phone,
          buyer_email: newOrder.buyer_email,
          buyer_username: effectiveUsername,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.order) {
          setOrders((prev) => prev.map((o) => (o.id === orderId ? data.order : o)));
          return { success: true, order: data.order };
        }
      }
    } catch (e) {
      console.error('Backend order creation sync error', e);
    }

    return { success: true, order: newOrder };
  };

  const uploadPaymentProof = async (orderId: string, proofDataUrl: string, utrNumber?: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              payment_proof: proofDataUrl,
              utr_number: utrNumber || o.utr_number,
              admin_notes: 'Payment screenshot submitted by buyer. Awaiting verification by @zulmeecheat.',
            }
          : o
      )
    );

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      await fetch(`/api/orders/${orderId}/proof`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          payment_proof: proofDataUrl,
          utr_number: utrNumber,
        }),
      });

      clearTimeout(timeoutId);
    } catch (e: any) {
      console.warn('Backend payment proof sync notice:', e?.message || e);
    }

    return { success: true };
  };

  const approveOrder = async (orderId: string, notes?: string) => {
    const deliveryDate = new Date().toISOString();

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              payment_status: 'completed',
              delivery_date: deliveryDate,
              admin_notes: notes || 'Payment verified by Admin (@zulmeecheat). BGMI ID & Login credentials unlocked!',
            }
          : o
      )
    );

    const order = orders.find((o) => o.id === orderId);
    if (order) {
      setStock((prev) =>
        prev.map((s) =>
          s.id === order.stock_item_id || s.bgmi_id === order.bgmi_id
            ? { ...s, status: 'sold', sold_at: deliveryDate }
            : s
        )
      );
    }

    try {
      await fetch(`/api/orders/${orderId}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });
    } catch (e) {
      console.error('Backend order approve error', e);
    }

    return { success: true };
  };

  const rejectOrder = async (orderId: string, notes?: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              payment_status: 'rejected',
              admin_notes: notes || 'Payment proof was rejected or unverified. Stock returned to store.',
            }
          : o
      )
    );

    const order = orders.find((o) => o.id === orderId);
    if (order) {
      setStock((prev) =>
        prev.map((s) =>
          (s.id === order.stock_item_id || s.bgmi_id === order.bgmi_id) && s.status === 'reserved'
            ? { ...s, status: 'available' }
            : s
        )
      );
    }

    try {
      await fetch(`/api/orders/${orderId}/reject`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });
    } catch (e) {
      console.error('Backend order reject error', e);
    }

    return { success: true };
  };

  const getOrderById = (orderId: string) => {
    const cleanId = orderId.trim().toUpperCase();
    return orders.find((o) => o.id.toUpperCase() === cleanId || o.bgmi_id === cleanId);
  };

  const getOrdersByTelegram = (username: string) => {
    const clean = username.trim().toLowerCase().replace('@', '');
    return orders.filter((o) => o.telegram_username.toLowerCase().replace('@', '') === clean);
  };

  const updateSettings = async (newSettings: Partial<StoreSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));

    if (newSettings.gold_id_price !== undefined) {
      const newPrice = Number(newSettings.gold_id_price) || 80;
      setStock((prev) =>
        prev.map((item) => ({
          ...item,
          price: newPrice,
          original_price: newPrice + 200,
        }))
      );
    }

    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });
    } catch (e) {
      console.error('Backend settings sync error', e);
    }
  };

  const resetAllData = async () => {
    setStock(INITIAL_STOCK);
    setOrders(INITIAL_ORDERS);
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.STOCK);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);

    try {
      await fetch('/api/reset', { method: 'POST' });
    } catch (e) {
      console.error('Backend reset sync error', e);
    }
  };

  // Compute live stats
  const totalStock = stock.length;
  const availableStock = stock.filter((s) => s.status === 'available').length;
  const reservedStock = stock.filter((s) => s.status === 'reserved').length;
  const soldStock = stock.filter((s) => s.status === 'sold').length;

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.payment_status === 'pending').length;
  const completedOrders = orders.filter((o) => o.payment_status === 'completed').length;
  const rejectedOrders = orders.filter((o) => o.payment_status === 'rejected').length;

  const totalRevenue = orders
    .filter((o) => o.payment_status === 'completed')
    .reduce((sum, o) => sum + (Number(o.price) || 0), 0);

  return (
    <StoreContext.Provider
      value={{
        stock,
        orders,
        settings,
        isAdmin,
        adminUsername,
        adminLogin,
        adminLogout,
        currentUser,
        signUp,
        signIn,
        signOut,
        generateSecretPhrase: generatePassphraseToken,
        getUserOrders,
        addStockItem,
        updateStockItem,
        deleteStockItem,
        getStockItemById,
        getStockItemByBgmiId,
        createOrder,
        uploadPaymentProof,
        approveOrder,
        rejectOrder,
        getOrderById,
        getOrdersByTelegram,
        updateSettings,
        resetAllData,
        refreshData,
        stats: {
          totalStock,
          availableStock,
          reservedStock,
          soldStock,
          totalOrders,
          pendingOrders,
          completedOrders,
          rejectedOrders,
          totalRevenue,
        },
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
