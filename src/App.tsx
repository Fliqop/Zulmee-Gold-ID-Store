import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { StockCard } from './components/StockCard';
import { StockDetailModal } from './components/StockDetailModal';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { AuthModal } from './components/AuthModal';
import { UserAccountModal } from './components/UserAccountModal';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { TelegramSupportButton } from './components/TelegramSupportButton';
import { Footer } from './components/Footer';
import { BGMIStockItem, Order } from './types';

function MainStore() {
  const { stock, settings, isAdmin, currentUser } = useStore();

  // Modals State
  const [selectedItemForDetail, setSelectedItemForDetail] = useState<BGMIStockItem | null>(null);
  const [selectedItemForCheckout, setSelectedItemForCheckout] = useState<BGMIStockItem | null>(null);
  const [pendingItemForCheckout, setPendingItemForCheckout] = useState<BGMIStockItem | null>(null);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [activeTrackerOrderId, setActiveTrackerOrderId] = useState<string>('');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'signin' | 'signup'>('signin');
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isInAdminView, setIsInAdminView] = useState(false);

  // Available stock list
  const availableStock = stock.filter((s) => s.status === 'available');
  const availableCount = availableStock.length;
  const currentGlobalPrice = settings.gold_id_price || 80;

  // Next available item to sell
  const nextItemToSell = availableStock[0] || stock[0] || null;

  // Handler to enforce login before opening checkout
  const handleBuyNowClick = (item: BGMIStockItem) => {
    if (!currentUser) {
      setPendingItemForCheckout(item);
      setAuthInitialMode('signin');
      setIsAuthOpen(true);
      return;
    }
    setSelectedItemForCheckout(item);
  };

  // Handler for successful order placement
  const handleOrderSuccess = (order: Order) => {
    setActiveTrackerOrderId(order.id);
    setIsTrackerOpen(true);
  };

  // If Admin is in Dashboard view
  if (isInAdminView && isAdmin) {
    return <AdminDashboard onBackToStore={() => setIsInAdminView(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#070a10] text-gray-100 flex flex-col selection:bg-yellow-500 selection:text-black">
      {/* Navbar */}
      <Navbar
        onOpenTracker={() => {
          setActiveTrackerOrderId('');
          setIsTrackerOpen(true);
        }}
        onOpenAdmin={() => {
          if (isAdmin) {
            setIsInAdminView(true);
          } else {
            setIsAdminLoginOpen(true);
          }
        }}
        onOpenSupport={() => {
          const btn = document.getElementById('floating-tg-support-btn');
          btn?.click();
        }}
        onOpenAuth={() => {
          setAuthInitialMode('signin');
          setIsAuthOpen(true);
        }}
        onOpenAccount={() => {
          setIsAccountOpen(true);
        }}
      />

      {/* Hero Banner */}
      <HeroBanner totalAvailable={availableCount} />

      {/* Main Stock Catalog Section - Unified Single Card */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col items-center justify-center">
        {/* Single Product Card */}
        <StockCard
          availableCount={availableCount}
          price={currentGlobalPrice}
          sampleItem={nextItemToSell}
          onSelect={(selected) => setSelectedItemForDetail(selected)}
          onBuyNow={handleBuyNowClick}
        />
      </main>

      {/* Footer */}
      <Footer
        onOpenTracker={() => {
          setActiveTrackerOrderId('');
          setIsTrackerOpen(true);
        }}
        onOpenAdmin={() => {
          if (isAdmin) {
            setIsInAdminView(true);
          } else {
            setIsAdminLoginOpen(true);
          }
        }}
        onOpenSupport={() => {
          const btn = document.getElementById('floating-tg-support-btn');
          btn?.click();
        }}
      />

      {/* Floating Telegram Support Widget */}
      <TelegramSupportButton />

      {/* MODALS */}
      {/* 1. Account Detail Modal */}
      <StockDetailModal
        item={selectedItemForDetail}
        onClose={() => setSelectedItemForDetail(null)}
        onBuyNow={handleBuyNowClick}
      />

      {/* 2. Instant UPI Checkout Modal */}
      <CheckoutModal
        item={selectedItemForCheckout}
        onClose={() => setSelectedItemForCheckout(null)}
        onOrderSuccess={handleOrderSuccess}
        onOpenAuth={() => {
          setAuthInitialMode('signin');
          setIsAuthOpen(true);
        }}
      />

      {/* 3. Order Tracker & Delivery Modal */}
      {isTrackerOpen && (
        <OrderTrackerModal
          initialOrderId={activeTrackerOrderId}
          onClose={() => {
            setIsTrackerOpen(false);
            setActiveTrackerOrderId('');
          }}
          onOpenAuth={() => {
            setAuthInitialMode('signin');
            setIsAuthOpen(true);
          }}
        />
      )}

      {/* 4. User Sign In / Sign Up Modal */}
      {isAuthOpen && (
        <AuthModal
          initialMode={authInitialMode}
          onClose={() => {
            setIsAuthOpen(false);
            setPendingItemForCheckout(null);
          }}
          onSuccess={() => {
            setIsAuthOpen(false);
            if (pendingItemForCheckout) {
              setSelectedItemForCheckout(pendingItemForCheckout);
              setPendingItemForCheckout(null);
            }
          }}
        />
      )}

      {/* 5. User Account & Purchased Orders Modal */}
      {isAccountOpen && (
        <UserAccountModal
          onClose={() => setIsAccountOpen(false)}
          onTrackOrder={(orderId) => {
            setIsAccountOpen(false);
            setActiveTrackerOrderId(orderId);
            setIsTrackerOpen(true);
          }}
          onBrowseStore={() => {
            setIsAccountOpen(false);
            window.scrollTo({ top: 400, behavior: 'smooth' });
          }}
        />
      )}

      {/* 6. Admin Login Modal */}
      {isAdminLoginOpen && (
        <AdminLoginModal
          onClose={() => setIsAdminLoginOpen(false)}
          onSuccess={() => {
            setIsAdminLoginOpen(false);
            setIsInAdminView(true);
          }}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <MainStore />
    </StoreProvider>
  );
}
