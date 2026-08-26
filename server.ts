import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Global process error handlers to ensure high availability on Cloud Run
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Body parser with support for base64 image payment proofs
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// MongoDB Connection String provided by user
const MONGODB_URI =
  process.env.MONGODB_URL ||
  process.env.MONGODB_URI ||
  'mongodb+srv://Kvn:Ansh2010ak@cluster0.weanvqx.mongodb.net/?appName=Cluster0';

// Default initial data
const DEFAULT_INITIAL_SETTINGS = {
  key: 'main_store_settings',
  upi_id: 'paytm.s1atusa@pty',
  upi_name: 'ANIKET KUSHWAHA',
  telegram_admin_username: '@zulmeecheat',
  telegram_channel_url: 'https://t.me/zulmeecheat',
  whatsapp_support_number: '+919876543210',
  announcement_text: '🔥 OFFICIAL GOLD ID STORE: 100% Verified BGMI Gold Tier Accounts Only! Clean Single Link, Zero Ban Risk & 3-Min UPI Delivery. Contact @zulmeecheat on Telegram.',
  currency_symbol: '₹',
  auto_refresh_orders: true,
  gold_id_price: 80,
  admin_username: 'admin',
  admin_password: 'admin@123',
};

const DEFAULT_INITIAL_STOCK = [
  {
    id: 'bgmi-gold-001',
    bgmi_id: '5129841029',
    in_game_name: 'GOLD ID',
    password: 'Login: twitter_gold_viper / Pass: GoldBgmi#9921! (Backup Code: 849201)',
    login_method: 'Twitter',
    price: 80,
    original_price: 280,
    tier: 'Gold I',
    level: 54,
    uc_balance: 360,
    achievement_points: 3800,
    popularity: '150K+',
    status: 'available',
    image_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    highlight_badge: 'GOLD I • AVAILABLE',
    skins: {
      glacierM416: 'Classic M416 Golden Sand Finish',
      gunLabs: ['M416 Golden Sand', 'SCAR-L Desert Camo Lv 1', 'AKM Hellfire Classic'],
      mythicOutfits: 4,
      vehicles: ['Dacia Golden Feather', 'Buggy Desert Nomad'],
      titles: ['Overachiever', 'Season 22 Gold I Ranked'],
      bindType: 'Single Link (Twitter) - 100% Clean'
    },
    description: 'Clean single-bind Gold I starter account, pristine clean reputation, and instant transfer warranty.',
    created_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
  },
  {
    id: 'bgmi-gold-002',
    bgmi_id: '5284719203',
    in_game_name: 'GOLD ID',
    password: 'Login: twitter_gold_striker / Pass: StrikeGold#991! (2FA Disabled)',
    login_method: 'Twitter',
    price: 80,
    original_price: 280,
    tier: 'Gold II',
    level: 61,
    uc_balance: 660,
    achievement_points: 4400,
    popularity: '280K+',
    status: 'available',
    image_url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80',
    highlight_badge: 'GOLD II • AVAILABLE',
    skins: {
      glacierM416: 'M416 Roaring Tiger Special',
      gunLabs: ['M416 Roaring Tiger', 'AWM Rainbow Drake Lv 1', 'Kar98k Moonlit Special'],
      mythicOutfits: 6,
      vehicles: ['UAZ Cyber Beast', 'Motorcycle Dragon Rider'],
      titles: ['Sharpshooter', 'Weapon Master', 'Season 23 Gold II'],
      bindType: 'Single Link (Twitter)'
    },
    description: 'Gold II account with clean match history and zero ban record.',
    created_at: new Date(Date.now() - 3600000 * 24 * 4).toISOString(),
  },
  {
    id: 'bgmi-gold-003',
    bgmi_id: '5391029481',
    in_game_name: 'GOLD ID',
    password: 'Login: twitter_gold_hunter / Pass: HunterPower#777! (Clean Transfer)',
    login_method: 'Twitter',
    price: 80,
    original_price: 280,
    tier: 'Gold III',
    level: 66,
    uc_balance: 720,
    achievement_points: 4900,
    popularity: '420K+',
    status: 'available',
    image_url: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&auto=format&fit=crop&q=80',
    highlight_badge: 'GOLD III • AVAILABLE',
    skins: {
      glacierM416: 'M416 Viper Strike Edition',
      gunLabs: ['M416 Viper Strike', 'M762 8-Bit Lv 1', 'UMP45 Marine Classic'],
      mythicOutfits: 9,
      vehicles: ['Dacia Speedster Gold', 'UAZ Armored Beast'],
      titles: ['Well Liked', 'Perfectionist', 'Season 24 Gold III'],
      bindType: 'Single Link (Twitter)'
    },
    description: 'Gold III account fully transferable single link Twitter login and instant delivery.',
    created_at: new Date(Date.now() - 3600000 * 24 * 6).toISOString(),
  },
  {
    id: 'bgmi-gold-004',
    bgmi_id: '5401928374',
    in_game_name: 'GOLD ID',
    password: 'Login: twitter_acc_goldsnip / Pass: SnipHeadshot#44 (Clean Twitter Included)',
    login_method: 'Twitter',
    price: 80,
    original_price: 280,
    tier: 'Gold IV',
    level: 48,
    uc_balance: 240,
    achievement_points: 3200,
    popularity: '90K+',
    status: 'available',
    image_url: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80',
    highlight_badge: 'GOLD IV • AVAILABLE',
    skins: {
      glacierM416: 'M416 Desert Warfare Finish',
      gunLabs: ['M416 Desert Warfare', 'AWM Field Hunter Lv 1'],
      mythicOutfits: 3,
      vehicles: ['UAZ Night Hunter', 'Motorcycle Gilded Speed'],
      titles: ['Season 25 Gold IV Ranked'],
      bindType: 'Single Link (Twitter)'
    },
    description: 'Clean Gold IV starter ID. Ideal for smurf, casual tournaments, or fresh competitive push.',
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'bgmi-gold-005',
    bgmi_id: '5519827364',
    in_game_name: 'GOLD ID',
    password: 'Login: twitter_gold_phoenix / Pass: PhoenixGold#8888 (Clean Twitter)',
    login_method: 'Twitter',
    price: 80,
    original_price: 280,
    tier: 'Gold V',
    level: 70,
    uc_balance: 900,
    achievement_points: 5400,
    popularity: '650K+',
    status: 'available',
    image_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
    highlight_badge: 'GOLD V • AVAILABLE',
    skins: {
      glacierM416: 'M416 Golden Dragon Edition',
      gunLabs: ['M416 Golden Dragon', 'Vector Gold Rush', 'DP-28 Gilded Jade'],
      mythicOutfits: 11,
      vehicles: ['Mirado Golden Mirage', 'Coupe RB Inferno Gold'],
      titles: ['Sharpshooter', 'Weapon Master', 'Season 26 Gold V'],
      bindType: 'Single Link Twitter'
    },
    description: 'Gold V account with 100% clean Twitter single link login.',
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
  {
    id: 'bgmi-gold-006',
    bgmi_id: '5629104829',
    in_game_name: 'GOLD ID',
    password: 'Login: twitter_titan_gold / Pass: TitanGoldPass#1010 (Single Link)',
    login_method: 'Twitter',
    price: 80,
    original_price: 280,
    tier: 'Gold I',
    level: 73,
    uc_balance: 1200,
    achievement_points: 5800,
    popularity: '850K+',
    status: 'available',
    image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    highlight_badge: 'GOLD I • AVAILABLE',
    skins: {
      glacierM416: 'M416 Gilded Sovereign Special',
      gunLabs: ['M416 Gilded Sovereign', 'Groza Golden Styx', 'AWM Gilded Hunter'],
      mythicOutfits: 14,
      vehicles: ['Dacia Ice Dragon Gold', 'UAZ Golden Cyber'],
      titles: ['Gold I Ranked S25-S27', 'Mythic Collector', 'Perfectionist'],
      bindType: 'Single Link Twitter'
    },
    description: 'Gold I account, single link Twitter login, and 100% transfer safety guarantee.',
    created_at: new Date(Date.now() - 3600000 * 72).toISOString(),
  }
];

const DEFAULT_INITIAL_ORDERS = [
  {
    id: 'ORD-89421',
    bgmi_id: '5129841029',
    stock_item_id: 'bgmi-gold-001',
    stock_title: '亗・GOLD・VIPER・亗 (Gold I ID)',
    stock_tier: 'Gold I',
    price: 499,
    telegram_username: '@rohit_gamer_bgmi',
    buyer_phone: '+919876512345',
    buyer_email: 'rohit.gamer@gmail.com',
    payment_method: 'upi',
    payment_status: 'completed',
    payment_proof: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=60',
    utr_number: '329184029102',
    order_date: new Date(Date.now() - 3600000 * 3).toISOString(),
    delivery_date: new Date(Date.now() - 3600000 * 2.8).toISOString(),
    admin_notes: 'Verified via Axis Bank UPI ref 329184029102. Gold ID credentials unlocked by @zulmeecheat.'
  }
];

// Mongoose Schemas & Models
const StockItemSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  bgmi_id: { type: String, required: true, index: true },
  in_game_name: String,
  password: { type: String, required: true },
  login_method: String,
  price: { type: Number, required: true },
  original_price: Number,
  tier: { type: String, default: 'Gold I' },
  level: { type: Number, default: 55 },
  uc_balance: { type: Number, default: 600 },
  achievement_points: { type: Number, default: 3500 },
  popularity: String,
  status: { type: String, enum: ['available', 'reserved', 'sold'], default: 'available', index: true },
  image_url: String,
  highlight_badge: String,
  skins: {
    glacierM416: String,
    xSuit: String,
    gunLabs: [String],
    mythicOutfits: Number,
    vehicles: [String],
    titles: [String],
    bindType: String,
  },
  description: String,
  created_at: { type: String, default: () => new Date().toISOString() },
  sold_at: String,
});

const OrderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  bgmi_id: { type: String, required: true },
  stock_item_id: { type: String, required: true },
  stock_title: String,
  stock_tier: String,
  price: { type: Number, required: true },
  telegram_username: { type: String, required: true, index: true },
  buyer_username: { type: String, index: true },
  buyer_phone: String,
  buyer_email: String,
  payment_method: { type: String, default: 'upi' },
  payment_status: { type: String, enum: ['pending', 'completed', 'rejected'], default: 'pending', index: true },
  payment_proof: String,
  utr_number: String,
  order_date: { type: String, default: () => new Date().toISOString() },
  delivery_date: String,
  admin_notes: String,
});

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  secret_phrase: { type: String, required: true, index: true, uppercase: true, trim: true },
  email: String,
  phone: String,
  created_at: { type: String, default: () => new Date().toISOString() },
});

const SettingsSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, default: 'main_store_settings' },
  upi_id: String,
  upi_name: String,
  telegram_admin_username: String,
  telegram_channel_url: String,
  whatsapp_support_number: String,
  announcement_text: String,
  currency_symbol: String,
  auto_refresh_orders: Boolean,
  gold_id_price: { type: Number, default: 80 },
  admin_username: { type: String, default: 'admin' },
  admin_password: { type: String, default: 'admin@123' },
});

const StockItemModel = mongoose.model('StockItem', StockItemSchema);
const OrderModel = mongoose.model('Order', OrderSchema);
const UserModel = mongoose.model('User', UserSchema);
const SettingsModel = mongoose.model('Settings', SettingsSchema);

let isDbConnected = false;

// Mongoose connection event listeners to avoid unhandled crash
mongoose.connection.on('error', (err) => {
  console.warn('MongoDB connection issue (fallback mode active):', err.message);
  isDbConnected = false;
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected (fallback mode active).');
  isDbConnected = false;
});

// Connect to MongoDB and seed default records if needed
async function connectDb() {
  try {
    console.log('Connecting to MongoDB database...');
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    isDbConnected = true;
    console.log('✅ Successfully connected to MongoDB Atlas!');

    // Initialize/Seed settings if empty
    const settingsCount = await SettingsModel.countDocuments();
    if (settingsCount === 0) {
      await SettingsModel.create(DEFAULT_INITIAL_SETTINGS);
      console.log('Seeded initial Store Settings to MongoDB');
    } else {
      // Ensure telegram admin username is updated to @zulmeecheat
      await SettingsModel.updateOne(
        { key: 'main_store_settings' },
        { 
          $set: { 
            telegram_admin_username: '@zulmeecheat',
            telegram_channel_url: 'https://t.me/zulmeecheat',
            upi_id: 'paytm.s1atusa@pty',
            upi_name: 'ANIKET KUSHWAHA'
          } 
        }
      );
    }

    // Initialize/Seed stock if empty
    const stockCount = await StockItemModel.countDocuments();
    if (stockCount === 0) {
      await StockItemModel.insertMany(DEFAULT_INITIAL_STOCK);
      console.log('Seeded initial Gold Tier BGMI Stock to MongoDB');
    }

    // Initialize/Seed orders if empty
    const orderCount = await OrderModel.countDocuments();
    if (orderCount === 0) {
      await OrderModel.insertMany(DEFAULT_INITIAL_ORDERS);
      console.log('Seeded initial sample Order to MongoDB');
    }
  } catch (error) {
    console.error('⚠️ MongoDB Connection Error:', error);
    isDbConnected = false;
  }
}

connectDb();

// ---------------- API ROUTES ----------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    mongodb: isDbConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

// GET /api/stock - List all BGMI stock
app.get('/api/stock', async (req, res) => {
  try {
    if (!isDbConnected) {
      return res.json(DEFAULT_INITIAL_STOCK);
    }
    const items = await StockItemModel.find().lean();
    res.json(items);
  } catch (err: any) {
    console.error('Error fetching stock:', err);
    res.status(500).json({ error: 'Failed to fetch stock items', details: err.message });
  }
});

// POST /api/stock - Add new BGMI ID to stock
app.post('/api/stock', async (req, res) => {
  try {
    const itemData = req.body;
    const newItem = {
      ...itemData,
      id: itemData.id || `bgmi-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`,
      created_at: new Date().toISOString(),
      status: itemData.status || 'available',
    };

    if (isDbConnected) {
      const created = await StockItemModel.create(newItem);
      res.status(201).json(created);
    } else {
      res.status(201).json(newItem);
    }
  } catch (err: any) {
    console.error('Error creating stock item:', err);
    res.status(500).json({ error: 'Failed to create stock item', details: err.message });
  }
});

// PUT /api/stock/:id - Update BGMI stock item
app.put('/api/stock/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (isDbConnected) {
      const updated = await StockItemModel.findOneAndUpdate({ id }, updates, { new: true }).lean();
      if (!updated) {
        return res.status(404).json({ error: 'Stock item not found' });
      }
      res.json(updated);
    } else {
      res.json({ id, ...updates });
    }
  } catch (err: any) {
    console.error('Error updating stock item:', err);
    res.status(500).json({ error: 'Failed to update stock item', details: err.message });
  }
});

// DELETE /api/stock/:id - Delete BGMI stock item
app.delete('/api/stock/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (isDbConnected) {
      await StockItemModel.findOneAndDelete({ id });
    }
    res.json({ success: true, id });
  } catch (err: any) {
    console.error('Error deleting stock item:', err);
    res.status(500).json({ error: 'Failed to delete stock item', details: err.message });
  }
});

// GET /api/orders - List all orders
app.get('/api/orders', async (req, res) => {
  try {
    if (!isDbConnected) {
      return res.json(DEFAULT_INITIAL_ORDERS);
    }
    const orders = await OrderModel.find().sort({ order_date: -1 }).lean();
    res.json(orders);
  } catch (err: any) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: 'Failed to fetch orders', details: err.message });
  }
});

// POST /api/orders - Create new order
app.post('/api/orders', async (req, res) => {
  try {
    const { stock_item_id, telegram_username, buyer_phone, buyer_email, buyer_username } = req.body;

    let targetStock: any = null;
    if (isDbConnected) {
      targetStock = await StockItemModel.findOne({ id: stock_item_id }).lean();
    } else {
      targetStock = DEFAULT_INITIAL_STOCK.find((s) => s.id === stock_item_id);
    }

    if (!targetStock) {
      return res.status(404).json({ error: 'BGMI ID stock item not found' });
    }

    if (targetStock.status === 'sold') {
      return res.status(400).json({ error: 'This BGMI ID has already been sold.' });
    }

    const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder = {
      id: orderId,
      bgmi_id: targetStock.bgmi_id,
      stock_item_id: targetStock.id,
      stock_title: targetStock.in_game_name || `BGMI ${targetStock.tier} ID`,
      stock_tier: targetStock.tier,
      price: targetStock.price,
      telegram_username: telegram_username.startsWith('@') ? telegram_username : `@${telegram_username}`,
      buyer_username: buyer_username ? String(buyer_username).trim().toLowerCase() : undefined,
      buyer_phone: buyer_phone ? String(buyer_phone).trim() : undefined,
      buyer_email: buyer_email ? String(buyer_email).trim() : undefined,
      payment_method: 'upi',
      payment_status: 'pending' as const,
      order_date: new Date().toISOString(),
    };

    if (isDbConnected) {
      await StockItemModel.updateOne({ id: targetStock.id }, { status: 'reserved' });
      const created = await OrderModel.create(newOrder);
      res.status(201).json({ success: true, order: created });
    } else {
      res.status(201).json({ success: true, order: newOrder });
    }
  } catch (err: any) {
    console.error('Error creating order:', err);
    res.status(500).json({ error: 'Failed to create order', details: err.message });
  }
});

// PUT /api/orders/:id/proof - Upload payment proof screenshot / UTR
app.put('/api/orders/:id/proof', async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_proof, utr_number } = req.body;

    if (isDbConnected) {
      const updated = await OrderModel.findOneAndUpdate(
        { id },
        {
          $set: {
            payment_proof,
            utr_number,
            admin_notes: 'Payment screenshot submitted by buyer. Awaiting verification by @zulmeecheat.',
          }
        },
        { new: true }
      ).lean();

      res.json({ success: true, order: updated });
    } else {
      res.json({ success: true });
    }
  } catch (err: any) {
    console.warn('Backend payment proof save notice:', err.message);
    res.status(200).json({ success: true, warning: 'Saved locally' });
  }
});

// PUT /api/orders/:id/approve - Approve order & unlock credentials
app.put('/api/orders/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    const deliveryDate = new Date().toISOString();

    if (isDbConnected) {
      const order = await OrderModel.findOneAndUpdate(
        { id },
        {
          payment_status: 'completed',
          delivery_date: deliveryDate,
          admin_notes: notes || 'Payment verified by Admin (@zulmeecheat). BGMI ID & Login credentials unlocked!',
        },
        { new: true }
      ).lean();

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      // Mark stock item as sold
      await StockItemModel.updateOne(
        { $or: [{ id: order.stock_item_id }, { bgmi_id: order.bgmi_id }] },
        { status: 'sold', sold_at: deliveryDate }
      );

      res.json({ success: true, order });
    } else {
      res.json({ success: true });
    }
  } catch (err: any) {
    console.error('Error approving order:', err);
    res.status(500).json({ error: 'Failed to approve order', details: err.message });
  }
});

// PUT /api/orders/:id/reject - Reject order
app.put('/api/orders/:id/reject', async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    if (isDbConnected) {
      const order = await OrderModel.findOneAndUpdate(
        { id },
        {
          payment_status: 'rejected',
          admin_notes: notes || 'Payment proof was rejected or unverified. Stock returned to store.',
        },
        { new: true }
      ).lean();

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      // Release stock back to available
      await StockItemModel.updateOne(
        { $or: [{ id: order.stock_item_id }, { bgmi_id: order.bgmi_id }], status: 'reserved' },
        { status: 'available' }
      );

      res.json({ success: true, order });
    } else {
      res.json({ success: true });
    }
  } catch (err: any) {
    console.error('Error rejecting order:', err);
    res.status(500).json({ error: 'Failed to reject order', details: err.message });
  }
});

// GET /api/settings - Fetch store settings
app.get('/api/settings', async (req, res) => {
  try {
    if (isDbConnected) {
      let settings = await SettingsModel.findOne({ key: 'main_store_settings' }).lean();
      if (!settings) {
        settings = await SettingsModel.create(DEFAULT_INITIAL_SETTINGS);
      }
      res.json(settings);
    } else {
      res.json(DEFAULT_INITIAL_SETTINGS);
    }
  } catch (err: any) {
    console.error('Error fetching settings:', err);
    res.status(500).json({ error: 'Failed to fetch store settings', details: err.message });
  }
});

// PUT /api/settings - Update store settings
app.put('/api/settings', async (req, res) => {
  try {
    const updates = req.body;
    if (isDbConnected) {
      const updated = await SettingsModel.findOneAndUpdate(
        { key: 'main_store_settings' },
        updates,
        { new: true, upsert: true }
      ).lean();

      // If gold_id_price was updated, automatically update all existing stock item prices
      if (updates.gold_id_price !== undefined) {
        const newPrice = Number(updates.gold_id_price) || 80;
        await StockItemModel.updateMany(
          {},
          { $set: { price: newPrice, original_price: newPrice + 200 } }
        );
      }

      res.json(updated);
    } else {
      res.json({ ...DEFAULT_INITIAL_SETTINGS, ...updates });
    }
  } catch (err: any) {
    console.error('Error updating settings:', err);
    res.status(500).json({ error: 'Failed to update store settings', details: err.message });
  }
});

// Helper to generate a unique secret passphrase token
function generatePassphraseToken(): string {
  const words1 = ['GOLD', 'VIPER', 'TIGER', 'SHADOW', 'ROYAL', 'DRAGON', 'PHARAOH', 'GLACIER', 'TITAN', 'CYBER', 'APEX', 'STORM'];
  const words2 = ['ALPHA', 'STRIKE', 'VALOR', 'LEGEND', 'MASTER', 'HUNTER', 'ELITE', 'PRIME', 'FORCE', 'KNIGHT', 'BLAZE', 'WARRIOR'];
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const w1 = words1[Math.floor(Math.random() * words1.length)];
  const w2 = words2[Math.floor(Math.random() * words2.length)];
  return `${w1}-${randomNum}-${w2}`;
}

// ---------------- USER AUTHENTICATION ROUTES ----------------

// POST /api/auth/signup - Register new user & generate secret phrase token
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { username, password, email, phone, secret_phrase } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    const cleanUsername = String(username).trim().toLowerCase();
    const cleanPassword = String(password).trim();

    if (cleanUsername.length < 3) {
      return res.status(400).json({ error: 'Username must be at least 3 characters long.' });
    }

    if (cleanPassword.length < 4) {
      return res.status(400).json({ error: 'Password must be at least 4 characters long.' });
    }

    // Passphrase token (auto-generated or custom provided)
    const token = (secret_phrase ? String(secret_phrase).trim().toUpperCase() : generatePassphraseToken());

    if (isDbConnected) {
      const existing = await UserModel.findOne({ username: cleanUsername }).lean();
      if (existing) {
        return res.status(409).json({ error: 'Username already registered. Please choose another or sign in.' });
      }

      const created = await UserModel.create({
        username: cleanUsername,
        password: cleanPassword,
        secret_phrase: token,
        email: email ? String(email).trim() : undefined,
        phone: phone ? String(phone).trim() : undefined,
        created_at: new Date().toISOString(),
      });

      return res.status(201).json({
        success: true,
        user: {
          username: created.username,
          secret_phrase: created.secret_phrase,
          email: created.email,
          phone: created.phone,
          created_at: created.created_at,
        },
      });
    } else {
      // Offline / fallback response
      return res.status(201).json({
        success: true,
        user: {
          username: cleanUsername,
          secret_phrase: token,
          email: email ? String(email).trim() : undefined,
          phone: phone ? String(phone).trim() : undefined,
          created_at: new Date().toISOString(),
        },
      });
    }
  } catch (err: any) {
    console.error('Error during sign up:', err);
    res.status(500).json({ error: 'Failed to create user account', details: err.message });
  }
});

// POST /api/auth/signin - Sign in with username, password, and secret phrase token
app.post('/api/auth/signin', async (req, res) => {
  try {
    const { username, password, secret_phrase } = req.body;

    if (!username || !password || !secret_phrase) {
      return res.status(400).json({ error: 'Username, password, and secret phrase token are required.' });
    }

    const cleanUsername = String(username).trim().toLowerCase();
    const cleanPassword = String(password).trim();
    const cleanSecret = String(secret_phrase).trim().toUpperCase();

    if (isDbConnected) {
      const user = await UserModel.findOne({ username: cleanUsername }).lean();
      if (!user) {
        return res.status(401).json({ error: 'No account found with this username.' });
      }

      if (user.password !== cleanPassword) {
        return res.status(401).json({ error: 'Incorrect password.' });
      }

      if (user.secret_phrase.toUpperCase() !== cleanSecret) {
        return res.status(401).json({ error: 'Invalid secret passphrase token. Please check your token or contact support @zulmeecheat.' });
      }

      return res.json({
        success: true,
        user: {
          username: user.username,
          secret_phrase: user.secret_phrase,
          email: user.email,
          phone: user.phone,
          created_at: user.created_at,
        },
      });
    } else {
      return res.json({
        success: true,
        user: {
          username: cleanUsername,
          secret_phrase: cleanSecret,
          created_at: new Date().toISOString(),
        },
      });
    }
  } catch (err: any) {
    console.error('Error during sign in:', err);
    res.status(500).json({ error: 'Failed to sign in', details: err.message });
  }
});

// GET /api/user/orders/:username - Fetch all orders for a specific username
app.get('/api/user/orders/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const cleanUsername = String(username).trim().toLowerCase();

    if (isDbConnected) {
      const orders = await OrderModel.find({
        $or: [
          { buyer_username: cleanUsername },
          { telegram_username: cleanUsername },
          { telegram_username: `@${cleanUsername}` },
        ],
      }).sort({ order_date: -1 }).lean();

      return res.json(orders);
    } else {
      return res.json([]);
    }
  } catch (err: any) {
    console.error('Error fetching user orders:', err);
    res.status(500).json({ error: 'Failed to fetch user orders', details: err.message });
  }
});

// POST /api/reset - Reset Database to default Gold Tier data
app.post('/api/reset', async (req, res) => {
  try {
    if (isDbConnected) {
      await StockItemModel.deleteMany({});
      await OrderModel.deleteMany({});
      await SettingsModel.deleteMany({});

      await StockItemModel.insertMany(DEFAULT_INITIAL_STOCK);
      await OrderModel.insertMany(DEFAULT_INITIAL_ORDERS);
      await SettingsModel.create(DEFAULT_INITIAL_SETTINGS);
    }
    res.json({ success: true, message: 'Database reset to initial Gold Tier accounts successfully.' });
  } catch (err: any) {
    console.error('Error resetting database:', err);
    res.status(500).json({ error: 'Failed to reset database', details: err.message });
  }
});

// ---------------- VITE MIDDLEWARE & SERVER START ----------------

async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'Endpoint not found' });
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 BGMI Gold Store Server running on http://0.0.0.0:${PORT}`);
  });
}

start();
