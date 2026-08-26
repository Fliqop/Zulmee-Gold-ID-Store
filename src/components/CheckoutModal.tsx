import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { BGMIStockItem, Order } from '../types';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  Check, 
  Copy, 
  Upload, 
  QrCode, 
  ShieldCheck, 
  Smartphone, 
  Send, 
  AlertCircle, 
  MessageSquare,
  ArrowRight,
  Sparkles,
  ArrowLeft,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CheckoutModalProps {
  item: BGMIStockItem | null;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps & { onOpenAuth?: () => void }> = ({
  item,
  onClose,
  onOrderSuccess,
  onOpenAuth,
}) => {
  const { settings, createOrder, uploadPaymentProof, currentUser } = useStore();

  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Buyer details & UPI QR, 2: Upload Proof, 3: Success Confirmation
  const [telegramUsername, setTelegramUsername] = useState(() => currentUser?.username || '');
  const [buyerPhone, setBuyerPhone] = useState(() => currentUser?.phone || '');
  const [buyerEmail, setBuyerEmail] = useState(() => currentUser?.email || '');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [upiPaymentUri, setUpiPaymentUri] = useState<string>('');
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  
  // Payment Proof state
  const [proofImage, setProofImage] = useState<string>('');
  const [utrNumber, setUtrNumber] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate UPI payment URI & QR Code
  useEffect(() => {
    if (!item) return;

    const upiLink = `upi://pay?pa=${encodeURIComponent(settings.upi_id)}&pn=${encodeURIComponent(
      settings.upi_name
    )}&am=${item.price}&cu=INR&tn=BGMI_GOLD_ID_${item.bgmi_id}`;

    setUpiPaymentUri(upiLink);

    QRCode.toDataURL(upiLink, {
      width: 280,
      margin: 1.5,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    })
      .then((url) => setQrCodeDataUrl(url))
      .catch((err) => console.error('Error generating QR code', err));
  }, [item, settings]);

  // Sync user details if logged in
  useEffect(() => {
    if (currentUser) {
      if (currentUser.username && !telegramUsername) {
        setTelegramUsername(currentUser.username);
      }
      if (currentUser.phone && !buyerPhone) {
        setBuyerPhone(currentUser.phone);
      }
      if (currentUser.email && !buyerEmail) {
        setBuyerEmail(currentUser.email);
      }
    }
  }, [currentUser]);

  if (!item) return null;

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleOpenUpiApp = () => {
    if (upiPaymentUri) {
      window.location.href = upiPaymentUri;
    }
  };

  const handleCreateOrderAndProceed = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!currentUser) {
      if (onOpenAuth) {
        onOpenAuth();
      }
      setErrorMsg('Please Sign In / Register your account before completing this purchase.');
      return;
    }

    if (!telegramUsername.trim()) {
      setErrorMsg('Please enter your Telegram Username (e.g. @YourUsername) so we can verify and deliver your credentials.');
      return;
    }

    const result = await createOrder({
      stock_item_id: item.id,
      telegram_username: telegramUsername,
      buyer_phone: buyerPhone,
      buyer_email: buyerEmail,
    });

    if (result.success && result.order) {
      setCreatedOrder(result.order);
      setStep(2);
    } else {
      setErrorMsg(result.error || 'Failed to initialize order.');
    }
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const maxWidth = 1000;
          const maxHeight = 1000;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.8));
          } else {
            resolve(e.target?.result as string);
          }
        };
        img.onerror = () => {
          resolve(e.target?.result as string);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file);
        setProofImage(compressed);
      } catch {
        const reader = new FileReader();
        reader.onloadend = () => {
          setProofImage(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleUseDemoProof = () => {
    // Generate an authentic sample UPI receipt screenshot for demo testing
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, 400, 300);
      ctx.fillStyle = '#10b981';
      ctx.fillRect(0, 0, 400, 50);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('✓ Payment Successful to ' + settings.upi_name, 20, 32);
      ctx.font = 'bold 24px sans-serif';
      ctx.fillStyle = '#fbbf24';
      ctx.fillText(`₹${item.price}.00`, 20, 100);
      ctx.font = '14px sans-serif';
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(`To: ${settings.upi_id}`, 20, 140);
      ctx.fillText(`For: BGMI Character ID ${item.bgmi_id}`, 20, 170);
      ctx.fillText(`UTR / Ref No: ${Math.floor(100000000000 + Math.random() * 900000000000)}`, 20, 200);
      ctx.fillText(`Time: ${new Date().toLocaleString()}`, 20, 230);
      setProofImage(canvas.toDataURL());
      setUtrNumber(String(Math.floor(100000000000 + Math.random() * 900000000000)));
    }
  };

  const handleSubmitProof = async () => {
    if (!createdOrder) return;
    if (!proofImage) {
      setErrorMsg('Please upload your payment screenshot/receipt.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await uploadPaymentProof(createdOrder.id, proofImage, utrNumber);
      setIsSubmitting(false);

      if (res.success) {
        setStep(3);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } else {
        setErrorMsg(res.error || 'Failed to submit proof.');
      }
    } catch (e: any) {
      setIsSubmitting(false);
      setErrorMsg(e?.message || 'Failed to submit proof.');
    }
  };

  const handleFinish = () => {
    if (createdOrder) {
      onOrderSuccess(createdOrder);
    }
    onClose();
  };

  const handleOpenTelegramAdmin = () => {
    const adminUser = settings.telegram_admin_username.replace('@', '');
    const text = encodeURIComponent(
      `Hello Admin! I have submitted payment for BGMI ID ${item.bgmi_id} (Order ${createdOrder?.id || ''}). Please verify and deliver credentials. My TG: ${telegramUsername}`
    );
    window.open(`https://t.me/${adminUser}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#0e1422] border border-yellow-500/35 rounded-3xl shadow-2xl shadow-black overflow-hidden my-4 sm:my-6 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#141b2c] p-4 sm:p-5 border-b border-gray-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center text-yellow-400">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white">Instant UPI Checkout</h3>
              <p className="text-[11px] text-gray-400">
                {step === 1 && 'Scan QR or Pay with UPI App'}
                {step === 2 && 'Upload Payment Screenshot'}
                {step === 3 && 'Payment Submitted for Fast Delivery'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white flex items-center justify-center transition-colors min-h-[32px]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div className="grid grid-cols-3 bg-gray-950/80 p-1 border-b border-gray-800 text-[10px] sm:text-[11px] font-bold text-center shrink-0">
          <div className={`py-1.5 rounded-lg ${step >= 1 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 font-extrabold' : 'text-gray-500'}`}>
            1. Pay UPI
          </div>
          <div className={`py-1.5 rounded-lg ${step >= 2 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 font-extrabold' : 'text-gray-500'}`}>
            2. Upload Proof
          </div>
          <div className={`py-1.5 rounded-lg ${step >= 3 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-extrabold' : 'text-gray-500'}`}>
            3. Instant Delivery
          </div>
        </div>

        {/* Scrollable Container */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-4">
          {/* Error Alert */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: Scan QR & Form */}
          {step === 1 && (
            <form onSubmit={handleCreateOrderAndProceed} className="space-y-4">
              {/* Account Summary Strip */}
              <div className="bg-[#070b13] p-3 sm:p-3.5 rounded-2xl border border-gray-800 flex items-center justify-between">
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-white">BGMI GOLD ID</h4>
                  <span className="text-[10px] sm:text-[11px] text-emerald-400 font-medium">Twitter Login • Single Link</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">Payable Amount</span>
                  <span className="text-lg sm:text-xl font-black text-yellow-400 font-mono">₹{item.price}</span>
                </div>
              </div>

              {/* Mobile 1-Tap Pay Button */}
              <div className="block sm:hidden">
                <button
                  type="button"
                  onClick={handleOpenUpiApp}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all min-h-[44px]"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Tap to Pay with GPay / PhonePe / Paytm</span>
                </button>
              </div>

              {/* QR Code Card */}
              <div className="bg-white rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-lg border border-yellow-400/50">
                <div className="mb-2">
                  <span className="text-[11px] sm:text-xs font-black tracking-wider text-gray-900 uppercase">
                    Scan with GPay / PhonePe / Paytm / BHIM
                  </span>
                </div>
                
                {qrCodeDataUrl ? (
                  <div className="p-1 bg-white rounded-xl border-2 border-gray-900 shadow-inner">
                    <img src={qrCodeDataUrl} alt="UPI QR Code" className="w-40 h-40 sm:w-48 sm:h-48 object-contain" />
                  </div>
                ) : (
                  <div className="w-40 h-40 sm:w-48 sm:h-48 bg-gray-100 flex items-center justify-center text-xs text-gray-500 animate-pulse rounded-xl">
                    Generating UPI QR...
                  </div>
                )}

                <div className="mt-2 text-center">
                  <span className="text-xs font-extrabold text-gray-900 block font-mono">Amount: ₹{item.price} INR</span>
                  <span className="text-[11px] text-gray-600">{settings.upi_name}</span>
                </div>
              </div>

              {/* Copy UPI Details Card */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between bg-[#070b13] p-2.5 sm:p-3 rounded-xl border border-gray-800">
                  <div>
                    <span className="text-gray-400 text-[10px] block font-bold">UPI ID</span>
                    <span className="font-mono font-bold text-yellow-400 text-xs sm:text-sm">{settings.upi_id}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(settings.upi_id, 'upi_id')}
                    className="px-2.5 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 font-semibold text-[11px] flex items-center gap-1 transition-all min-h-[32px]"
                  >
                    {copiedField === 'upi_id' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === 'upi_id' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="flex items-center justify-between bg-[#070b13] p-2.5 sm:p-3 rounded-xl border border-gray-800">
                  <div>
                    <span className="text-gray-400 text-[10px] block font-bold">Payee Name</span>
                    <span className="font-semibold text-gray-200 text-xs sm:text-sm">{settings.upi_name}</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800">
                    Verified Merchant
                  </span>
                </div>
              </div>

              {/* Buyer Contact Inputs */}
              <div className="space-y-3 pt-2 border-t border-gray-800">
                {currentUser ? (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      <span className="text-gray-300">
                        Signed in as <strong className="text-yellow-400">@{currentUser.username}</strong>
                      </span>
                    </div>
                    <span className="text-[10px] text-yellow-300 bg-yellow-500/20 px-2 py-0.5 rounded font-semibold">
                      Auto-Linked
                    </span>
                  </div>
                ) : onOpenAuth ? (
                  <div className="bg-[#070b13] border border-gray-800 rounded-xl p-2.5 flex items-center justify-between text-xs">
                    <span className="text-gray-400 text-[11px]">
                      Want instant order tracking in your account?
                    </span>
                    <button
                      type="button"
                      onClick={onOpenAuth}
                      className="text-yellow-400 hover:underline font-bold text-xs shrink-0"
                    >
                      Sign In / Sign Up
                    </button>
                  </div>
                ) : null}

                <div>
                  <label className="block text-xs font-bold text-gray-200 mb-1">
                    Telegram Username <span className="text-yellow-400">* (Required for Delivery)</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">@</span>
                    <input
                      type="text"
                      required
                      value={telegramUsername.replace(/^@/, '')}
                      onChange={(e) => setTelegramUsername(e.target.value)}
                      placeholder="YourTelegramUsername"
                      className="w-full bg-[#070b13] text-white pl-8 pr-4 py-2.5 rounded-xl border border-gray-700 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none text-xs font-medium min-h-[42px]"
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">
                    Our admin verifies and delivers credentials to this Telegram handle.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-300 mb-1">WhatsApp / Phone (Optional)</label>
                    <input
                      type="text"
                      value={buyerPhone}
                      onChange={(e) => setBuyerPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-[#070b13] text-white px-3 py-2 rounded-xl border border-gray-700 focus:border-yellow-400 outline-none text-xs font-medium min-h-[38px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-300 mb-1">Email (Optional)</label>
                    <input
                      type="email"
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      placeholder="buyer@gmail.com"
                      className="w-full bg-[#070b13] text-white px-3 py-2 rounded-xl border border-gray-700 focus:border-yellow-400 outline-none text-xs font-medium min-h-[38px]"
                    />
                  </div>
                </div>
              </div>

              {/* Next Button */}
              <button
                type="submit"
                id="proceed-to-proof-btn"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-black font-black text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 hover:from-yellow-300 hover:to-amber-400 transition-all shadow-lg shadow-yellow-500/20 active:scale-95 min-h-[44px]"
              >
                <span>I Have Made The Payment → Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 2: Upload Proof Screenshot */}
          {step === 2 && createdOrder && (
            <div className="space-y-4">
              <div className="bg-[#070b13] p-3 sm:p-3.5 rounded-2xl border border-yellow-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 block font-bold uppercase">Order Reference</span>
                  <span className="font-mono font-black text-yellow-400 text-xs sm:text-sm">{createdOrder.id}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 block font-bold uppercase">Amount Paid</span>
                  <span className="font-black text-white text-xs sm:text-sm font-mono">₹{createdOrder.price}</span>
                </div>
              </div>

              {/* Upload Area */}
              <div>
                <label className="block text-xs font-bold text-gray-200 mb-1.5">
                  Upload Payment Screenshot / Proof <span className="text-yellow-400">*</span>
                </label>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {proofImage ? (
                  <div className="relative rounded-2xl border-2 border-yellow-500/50 bg-[#070b13] p-2.5 flex flex-col items-center">
                    <img
                      src={proofImage}
                      alt="Payment Proof"
                      className="max-h-48 rounded-xl object-contain"
                    />
                    <div className="mt-2.5 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-xs text-gray-300 rounded-lg font-semibold min-h-[32px]"
                      >
                        Change Image
                      </button>
                      <button
                        type="button"
                        onClick={() => setProofImage('')}
                        className="px-3 py-1.5 bg-red-900/50 hover:bg-red-800 text-xs text-red-300 rounded-lg font-semibold min-h-[32px]"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-700 hover:border-yellow-400/70 bg-[#070b13] rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors text-center"
                  >
                    <Upload className="w-8 h-8 text-yellow-400 mb-2" />
                    <p className="text-xs font-bold text-gray-200">Click to Select Payment Screenshot</p>
                    <p className="text-[10px] text-gray-400 mt-1">Supports Gallery, Camera, PNG, JPG Screenshots</p>
                  </div>
                )}

                {/* Demo Helper Button */}
                {!proofImage && (
                  <div className="mt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={handleUseDemoProof}
                      className="text-[11px] text-yellow-400/90 hover:text-yellow-300 underline flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" /> Auto-generate demo payment receipt for testing
                    </button>
                  </div>
                )}
              </div>

              {/* UTR / Transaction Reference (Optional) */}
              <div>
                <label className="block text-xs font-bold text-gray-200 mb-1">
                  UPI Reference / UTR Number (Optional)
                </label>
                <input
                  type="text"
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  placeholder="e.g. 329184029102"
                  className="w-full bg-[#070b13] text-white px-3 py-2.5 rounded-xl border border-gray-700 focus:border-yellow-400 outline-none text-xs font-mono min-h-[42px]"
                />
                <p className="text-[10px] text-gray-400 mt-1">
                  12-digit transaction ID on your payment app receipt.
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold text-xs min-h-[44px]"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmitProof}
                  disabled={isSubmitting || !proofImage}
                  id="submit-payment-proof-btn"
                  className={`w-2/3 py-3 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 min-h-[44px] ${
                    isSubmitting || !proofImage
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black hover:from-yellow-300 hover:to-amber-400 shadow-yellow-500/20'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Submitting...' : 'Submit Payment Proof'}</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Success Confirmation */}
          {step === 3 && createdOrder && (
            <div className="text-center space-y-4 py-2">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-500/50 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <Check className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-black text-white">Payment Proof Submitted!</h3>
                <p className="text-xs text-gray-300 mt-1 max-w-sm mx-auto">
                  Your order is now <span className="text-yellow-400 font-bold">In Verification</span>. Our admin will verify your payment and release account credentials within 2–5 minutes.
                </p>
              </div>

              <div className="bg-[#070b13] p-3.5 rounded-2xl border border-gray-800 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Order ID:</span>
                  <span className="font-mono font-bold text-yellow-400">{createdOrder.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Telegram Handle:</span>
                  <span className="font-bold text-cyan-400">{createdOrder.telegram_username}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className="px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-400 font-bold text-[10px] border border-yellow-500/30">
                    ⏳ Awaiting Admin Approval
                  </span>
                </div>
              </div>

              {/* Telegram Instant Ping CTA */}
              <div className="bg-[#229ED9]/15 border border-[#229ED9]/40 p-3.5 rounded-2xl text-xs text-left">
                <p className="font-bold text-[#229ED9] flex items-center gap-1.5 mb-1">
                  <MessageSquare className="w-4 h-4" /> Fast-Track Verification via Telegram:
                </p>
                <p className="text-gray-300 text-[11px] mb-2.5">
                  Message our admin directly on Telegram with your Order ID for instant credentials release.
                </p>
                <button
                  type="button"
                  onClick={handleOpenTelegramAdmin}
                  className="w-full py-2.5 bg-[#229ED9] hover:bg-[#1f8ec4] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow active:scale-95 min-h-[40px]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Message Admin: {settings.telegram_admin_username}</span>
                </button>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleFinish}
                  className="w-full py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-bold text-xs transition-all min-h-[44px]"
                >
                  Done • Track Order Status
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
