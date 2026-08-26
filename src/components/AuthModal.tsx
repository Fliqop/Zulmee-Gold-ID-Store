import React, { useState, useEffect } from 'react';
import { useStore, generatePassphraseToken } from '../context/StoreContext';
import {
  X,
  User,
  Lock,
  KeyRound,
  ShieldCheck,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  Eye,
  EyeOff,
  AlertCircle,
  Smartphone,
  Mail,
  ArrowRight,
  ClipboardPaste,
  HelpCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AuthModalProps {
  initialMode?: 'signin' | 'signup';
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  initialMode = 'signin',
  onClose,
  onSuccess,
}) => {
  const { signUp, signIn, currentUser } = useStore();

  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  
  // Sign In Form State
  const [signInUsername, setSignInUsername] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [signInSecretPhrase, setSignInSecretPhrase] = useState('');
  const [showSignInPassword, setShowSignInPassword] = useState(false);

  // Sign Up Form State
  const [signUpUsername, setSignUpUsername] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [generatedSecretPhrase, setGeneratedSecretPhrase] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);

  // UI state
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedToken, setCopiedToken] = useState(false);
  const [signUpSuccessToken, setSignUpSuccessToken] = useState<string | null>(null);

  // Generate an initial secret phrase token for sign up
  useEffect(() => {
    setGeneratedSecretPhrase(generatePassphraseToken());
  }, []);

  const handleRegeneratePhrase = () => {
    const newToken = generatePassphraseToken();
    setGeneratedSecretPhrase(newToken);
  };

  const handleCopyPhrase = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const handlePasteSignInToken = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setSignInSecretPhrase(text.trim().toUpperCase());
      }
    } catch {
      // ignore
    }
  };

  // Sign In Submit
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!signInUsername.trim()) {
      setErrorMsg('Please enter your username.');
      return;
    }
    if (!signInPassword) {
      setErrorMsg('Please enter your password.');
      return;
    }
    if (!signInSecretPhrase.trim()) {
      setErrorMsg('Please enter the Secret Passphrase Token you received during Sign Up.');
      return;
    }

    setLoading(true);
    const result = await signIn(signInUsername, signInPassword, signInSecretPhrase);
    setLoading(false);

    if (result.success) {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      if (onSuccess) onSuccess();
      onClose();
    } else {
      setErrorMsg(result.error || 'Failed to sign in. Please verify your credentials and secret phrase.');
    }
  };

  // Sign Up Submit
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanUsername = signUpUsername.trim().toLowerCase();
    if (cleanUsername.length < 3) {
      setErrorMsg('Username must be at least 3 characters long.');
      return;
    }
    if (signUpPassword.length < 4) {
      setErrorMsg('Password must be at least 4 characters long.');
      return;
    }
    if (signUpPassword !== signUpConfirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setLoading(true);
    const result = await signUp(
      cleanUsername,
      signUpPassword,
      generatedSecretPhrase,
      signUpEmail,
      signUpPhone
    );
    setLoading(false);

    if (result.success && result.user) {
      setSignUpSuccessToken(result.user.secret_phrase);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });
    } else {
      setErrorMsg(result.error || 'Failed to create account. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#0f1523] border border-yellow-500/30 rounded-2xl shadow-2xl shadow-black overflow-hidden my-4 sm:my-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-[#141b2c] p-4 sm:p-5 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center text-yellow-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                {signUpSuccessToken
                  ? 'Account Created Successfully!'
                  : mode === 'signin'
                  ? 'User Sign In'
                  : 'Create Buyer Account'}
              </h2>
              <p className="text-xs text-gray-400">
                {signUpSuccessToken
                  ? 'Save your Secret Passphrase Token'
                  : 'Track your BGMI Gold IDs & instant delivery'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* POST SIGN-UP SUCCESS SCREEN */}
        {signUpSuccessToken ? (
          <div className="p-5 sm:p-6 space-y-5">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Registration Complete!</h3>
              <p className="text-xs text-gray-300 max-w-sm mx-auto leading-relaxed">
                Here is your unique <strong className="text-yellow-400">Secret Passphrase Token</strong>. You will need your <strong className="text-white">Username</strong>, <strong className="text-white">Password</strong>, and this <strong className="text-yellow-400">Secret Token</strong> every time you Sign In.
              </p>
            </div>

            {/* Token display box */}
            <div className="bg-[#1a233a] border-2 border-yellow-500/40 rounded-xl p-4 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span className="flex items-center gap-1.5 font-semibold text-yellow-400 uppercase tracking-wider text-[11px]">
                  <KeyRound className="w-3.5 h-3.5" /> Secret Passphrase Token
                </span>
                <span className="text-[10px] text-gray-400 bg-black/40 px-2 py-0.5 rounded border border-gray-700">
                  Required for Login
                </span>
              </div>
              
              <div className="bg-black/60 border border-yellow-500/30 rounded-lg p-3 flex items-center justify-between gap-2">
                <code className="text-base sm:text-lg font-mono font-bold text-yellow-400 tracking-wider select-all break-all">
                  {signUpSuccessToken}
                </code>
                <button
                  type="button"
                  onClick={() => handleCopyPhrase(signUpSuccessToken)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
                    copiedToken
                      ? 'bg-emerald-600 text-white'
                      : 'bg-yellow-500 text-black hover:bg-yellow-400 font-bold'
                  }`}
                >
                  {copiedToken ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy Token
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-start gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-2.5 text-[11px] text-yellow-200/90">
                <AlertCircle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                <p>
                  <strong>Important:</strong> Please write down or screenshot this secret token. For security, you cannot sign in without it!
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (onSuccess) onSuccess();
                onClose();
              }}
              className="w-full py-3 px-4 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-bold rounded-xl transition-all shadow-lg shadow-yellow-500/20 flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" /> I Have Saved My Token • Continue
            </button>
          </div>
        ) : (
          <div>
            {/* Tab Switcher */}
            <div className="grid grid-cols-2 p-1.5 bg-[#141b2c] border-b border-gray-800 text-xs sm:text-sm font-semibold">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setErrorMsg('');
                }}
                className={`py-2 px-3 rounded-lg text-center transition-all ${
                  mode === 'signin'
                    ? 'bg-yellow-500 text-black font-bold shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorMsg('');
                }}
                className={`py-2 px-3 rounded-lg text-center transition-all ${
                  mode === 'signup'
                    ? 'bg-yellow-500 text-black font-bold shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Error Message Display */}
            {errorMsg && (
              <div className="m-4 mb-0 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* 1. SIGN IN FORM */}
            {mode === 'signin' && (
              <form onSubmit={handleSignInSubmit} className="p-4 sm:p-5 space-y-4">
                {/* Username */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. shadow_player"
                      value={signInUsername}
                      onChange={(e) => setSignInUsername(e.target.value)}
                      className="w-full bg-[#141b2c] border border-gray-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-500"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showSignInPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter your account password"
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      className="w-full bg-[#141b2c] border border-gray-700 rounded-xl pl-9 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignInPassword(!showSignInPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showSignInPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Secret Passphrase Token */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-yellow-400 flex items-center gap-1">
                      <KeyRound className="w-3.5 h-3.5" /> Secret Passphrase Token
                    </label>
                    <button
                      type="button"
                      onClick={handlePasteSignInToken}
                      className="text-[11px] text-gray-400 hover:text-yellow-400 flex items-center gap-1 transition-colors"
                    >
                      <ClipboardPaste className="w-3 h-3" /> Paste Token
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. GOLD-8491-TIGER"
                      value={signInSecretPhrase}
                      onChange={(e) => setSignInSecretPhrase(e.target.value.toUpperCase())}
                      className="w-full bg-[#141b2c] border border-yellow-500/40 rounded-xl px-3 py-2.5 text-sm text-yellow-300 font-mono focus:outline-none focus:border-yellow-400 uppercase tracking-wider"
                    />
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Enter the secret phrase token generated when you signed up.
                  </p>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-bold rounded-xl transition-all shadow-lg shadow-yellow-500/20 disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                >
                  {loading ? 'Verifying...' : 'Sign In to My Account'}
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Switch to Sign Up */}
                <div className="pt-2 text-center">
                  <p className="text-xs text-gray-400">
                    New buyer?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('signup');
                        setErrorMsg('');
                      }}
                      className="text-yellow-400 hover:underline font-semibold"
                    >
                      Create an account & get Secret Token
                    </button>
                  </p>
                </div>
              </form>
            )}

            {/* 2. SIGN UP FORM */}
            {mode === 'signup' && (
              <form onSubmit={handleSignUpSubmit} className="p-4 sm:p-5 space-y-3.5">
                {/* Username */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Choose Username <span className="text-yellow-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. viper_king"
                      value={signUpUsername}
                      onChange={(e) => setSignUpUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                      className="w-full bg-[#141b2c] border border-gray-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-500"
                    />
                  </div>
                </div>

                {/* Password & Confirm */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Password <span className="text-yellow-400">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type={showSignUpPassword ? 'text' : 'password'}
                        required
                        placeholder="Min 4 characters"
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        className="w-full bg-[#141b2c] border border-gray-700 rounded-xl pl-9 pr-8 py-2 text-sm text-white focus:outline-none focus:border-yellow-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Confirm Password <span className="text-yellow-400">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type={showSignUpPassword ? 'text' : 'password'}
                        required
                        placeholder="Repeat password"
                        value={signUpConfirmPassword}
                        onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                        className="w-full bg-[#141b2c] border border-gray-700 rounded-xl pl-9 pr-8 py-2 text-sm text-white focus:outline-none focus:border-yellow-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showSignUpPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Secret Passphrase Token Auto-Generator Display */}
                <div className="bg-[#141b2c] border border-yellow-500/30 rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-yellow-400 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Generated Secret Passphrase Token
                    </span>
                    <button
                      type="button"
                      onClick={handleRegeneratePhrase}
                      className="text-[11px] text-gray-400 hover:text-yellow-400 flex items-center gap-1 transition-colors"
                      title="Generate a different phrase"
                    >
                      <RefreshCw className="w-3 h-3" /> Regenerate
                    </button>
                  </div>

                  <div className="bg-black/50 border border-yellow-500/20 rounded-lg p-2 flex items-center justify-between gap-2">
                    <code className="text-sm font-mono font-bold text-yellow-300 tracking-wide select-all">
                      {generatedSecretPhrase}
                    </code>
                    <button
                      type="button"
                      onClick={() => handleCopyPhrase(generatedSecretPhrase)}
                      className="text-xs bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 border border-yellow-500/30 px-2 py-1 rounded flex items-center gap-1 font-semibold transition-colors"
                    >
                      {copiedToken ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Copy
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-[10.5px] text-gray-400">
                    🔒 This token is unique to you. Save it so you can sign in anytime and access your purchased IDs!
                  </p>
                </div>

                {/* Optional Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">
                      Email <span className="text-gray-500">(Optional)</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                      <input
                        type="email"
                        placeholder="buyer@gmail.com"
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        className="w-full bg-[#141b2c] border border-gray-800 rounded-xl pl-8 pr-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-yellow-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">
                      Phone / WhatsApp <span className="text-gray-500">(Optional)</span>
                    </label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={signUpPhone}
                        onChange={(e) => setSignUpPhone(e.target.value)}
                        className="w-full bg-[#141b2c] border border-gray-800 rounded-xl pl-8 pr-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-yellow-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-bold rounded-xl transition-all shadow-lg shadow-yellow-500/20 disabled:opacity-50 flex items-center justify-center gap-2 text-sm mt-2"
                >
                  {loading ? 'Creating Account...' : 'Sign Up & Save Secret Token'}
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Switch to Sign In */}
                <div className="pt-1 text-center">
                  <p className="text-xs text-gray-400">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('signin');
                        setErrorMsg('');
                      }}
                      className="text-yellow-400 hover:underline font-semibold"
                    >
                      Sign In with Secret Token
                    </button>
                  </p>
                </div>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
