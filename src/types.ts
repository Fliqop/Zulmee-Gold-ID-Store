export type AccountTier = 
  | 'Gold' 
  | 'Gold I' 
  | 'Gold II' 
  | 'Gold III' 
  | 'Gold IV' 
  | 'Gold V' 
  | 'Platinum' 
  | 'Diamond' 
  | 'Crown' 
  | 'Ace' 
  | 'Ace Master' 
  | 'Ace Dominator' 
  | 'Conqueror';

export type AccountStatus = 'available' | 'reserved' | 'sold';

export type PaymentStatus = 'pending' | 'completed' | 'rejected';

export interface SkinDetails {
  glacierM416?: string; // e.g. "Level 7 (Max) with On-hit & Loot Crate"
  xSuit?: string; // e.g. "Pharaoh X-Suit 6-Star"
  gunLabs?: string[]; // e.g. ["Fool M416 Lv 4", "Godzilla AWM Lv 4"]
  mythicOutfits?: number;
  vehicles?: string[]; // e.g. ["Koenigsegg Jesko", "Lamborghini Aventador"]
  titles?: string[]; // e.g. ["Season 14 Conqueror", "Collector", "Mythic Fashion"]
  bindType?: string; // e.g. "Single Link (Twitter)", "Google Play Only"
}

export interface UserAccount {
  username: string;
  password?: string;
  secret_phrase: string;
  created_at: string;
  email?: string;
  phone?: string;
}

export interface BGMIStockItem {
  id: string;
  bgmi_id: string; // In-game Character ID e.g. 5182940291
  in_game_name?: string; // e.g. "⚡SOUL・Viper"
  password: string; // Secret credentials revealed upon completion
  login_method?: string; // e.g. "Twitter / X", "Email / Phone", "Google Play"
  price: number; // in INR
  original_price?: number;
  tier: AccountTier;
  level: number;
  uc_balance: number;
  achievement_points?: number;
  popularity?: string;
  status: AccountStatus;
  image_url: string;
  highlight_badge?: string; // e.g. "BESTSELLER", "GLACIER MAX", "HOT DEAL"
  skins: SkinDetails;
  description?: string;
  created_at: string;
  sold_at?: string;
}

export interface Order {
  id: string; // e.g. "ORD-94821"
  bgmi_id: string; // Character ID
  stock_item_id: string;
  stock_title: string;
  stock_tier: AccountTier;
  price: number;
  telegram_username: string;
  buyer_username?: string; // Linked User Account
  buyer_phone?: string;
  buyer_email?: string;
  payment_method: 'upi';
  payment_status: PaymentStatus;
  payment_proof?: string; // base64 screenshot or image URL
  utr_number?: string;
  order_date: string;
  delivery_date?: string;
  admin_notes?: string;
}

export interface StoreSettings {
  upi_id: string;
  upi_name: string;
  telegram_admin_username: string;
  telegram_channel_url?: string;
  whatsapp_support_number?: string;
  announcement_text: string;
  currency_symbol: string;
  auto_refresh_orders: boolean;
  gold_id_price: number;
  admin_username?: string;
  admin_password?: string;
}
