/**
 * @file GymAccessTokenPage.tsx
 * @description صفحه دریافت و مدیریت توکن‌های ورود به باشگاه‌های عضو اشتراک
 * - نمایش لیست توکن‌های فعال/منقضی
 * - دریافت توکن روزانه برای هر باشگاه
 * - نمایش QR Code
 * - کپی توکن به کلیپ‌بورد
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, QrCode, CheckCircle, AlertCircle, Clock, Download, Loader, X } from 'lucide-react';
import { Header } from '../components/Header';
import { BottomNavigation } from '../components/BottomNavigation';
import { ShaderBackground } from '../components/ShaderBackground';
import { ParticleOverlay } from '../components/ParticleOverlay';
import apiService from '../services/api';
import { formatPersianNumber, formatPersianDate, formatPersianDateShort } from '../utils/formatting';

interface Token {
  id: number;
  token_code: string;
  user: string;
  gym: number;
  gym_name: string;
  gym_address: string;
  status: 'active' | 'used' | 'expired';
  is_valid: boolean;
  issued_at: string;
  valid_until: string;
  used_at: string | null;
  qr_code: string;
}

interface ExpandedToken extends Token {
  timeRemaining: string;
  displayTime: string;
}

interface Gym {
  id: number;
  name: string;
  address: string;
  phone: string;
}

interface GymWithToken {
  gym: Gym;
  activeToken: ExpandedToken | null;
  inactiveTokens: ExpandedToken[];
}

interface Subscription {
  id: number;
  plan_name: string;
  status: string;
  tokens_total: number;
  tokens_used: number;
  tokens_remaining: number;
  is_active: boolean;
  days_remaining: number;
}

export function GymAccessTokenPage() {
  const navigate = useNavigate();
  const [gyms, setGyms] = useState<GymWithToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedToken, setSelectedToken] = useState<ExpandedToken | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [copyModalToken, setCopyModalToken] = useState<ExpandedToken | null>(null);
  const [requestingToken, setRequestingToken] = useState<number | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<number | null>(null);
  const [subscriptionInfo, setSubscriptionInfo] = useState<Subscription | null>(null);

  useEffect(() => {
    document.title = 'FITOPIA | توکن‌های دسترسی';
    loadData();
    
    // بروزرسانی مقدار زمان باقیمانده هر 10 ثانیه
    const interval = setInterval(updateTimeRemaining, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. دریافت اطلاعات اشتراک فعال
      const subscription = await apiService.get<Subscription>('/subscriptions/my/');
      console.log('📦 Subscription:', subscription);
      
      if (!subscription || !subscription.is_active) {
        setError('هیچ اشتراک فعالی وجود ندارد');
        setLoading(false);
        return;
      }

      setSubscriptionInfo(subscription);

      // 2. دریافت باشگاه‌های اشتراک
      const subscriptionGymsData = await apiService.get<any>('/subscriptions/subscriptions/me/gyms/');
      console.log('🏢 Subscription Gyms:', subscriptionGymsData);
      
      if (!subscriptionGymsData || !subscriptionGymsData.gyms || subscriptionGymsData.gyms.length === 0) {
        setError('هیچ باشگاهی برای این اشتراک موجود نیست');
        setLoading(false);
        return;
      }

      // 3. دریافت تمام توکن‌های کاربر
      const tokens = await apiService.get<Token[]>('/tokens/my/');
      console.log('📤 Tokens:', tokens);

      const expandedTokens: ExpandedToken[] = (tokens || []).map(token => ({
        ...token,
        timeRemaining: calculateTimeRemaining(token.valid_until),
        displayTime: formatDisplayTime(token.valid_until),
      }));

      // 4. ترکیب اطلاعات: برای هر باشگاه توکن‌های آن رو پیدا کن
      const gymsWithTokens: GymWithToken[] = subscriptionGymsData.gyms.map((gym: Gym) => {
        const gymTokens = expandedTokens.filter(t => t.gym === gym.id);
        const activeToken = gymTokens.find(t => t.status === 'active') || null;
        const inactiveTokens = gymTokens.filter(t => t.status !== 'active');

        return {
          gym,
          activeToken,
          inactiveTokens,
        };
      });

      setGyms(gymsWithTokens);
    } catch (err: any) {
      console.error('❌ Error loading data:', err);
      setError(err.message || 'خطا در بارگذاری اطلاعات');
    } finally {
      setLoading(false);
    }
  };

  const requestToken = async (gymId: number) => {
    try {
      setRequestingToken(gymId);
      setError(null);
      
      const newToken = await apiService.post<Token>('/tokens/request/', {
        gym_id: gymId,
      });
      
      console.log('✅ Token requested:', newToken);
      
      // اضافه کردن توکن جدید و بروزرسانی لیست
      const expandedToken: ExpandedToken = {
        ...newToken,
        timeRemaining: calculateTimeRemaining(newToken.valid_until),
        displayTime: formatDisplayTime(newToken.valid_until),
      };

      setGyms(prev => 
        prev.map(item => 
          item.gym.id === gymId 
            ? { ...item, activeToken: expandedToken, inactiveTokens: [] }
            : item
        )
      );

      // بروزرسانی توکن‌های باقی‌مانده
      if (subscriptionInfo) {
        setSubscriptionInfo({
          ...subscriptionInfo,
          tokens_remaining: Math.max(0, subscriptionInfo.tokens_remaining - 1),
          tokens_used: subscriptionInfo.tokens_used + 1,
        });
      }

      setSelectedToken(expandedToken);
      setShowQRModal(true);
      
    } catch (err: any) {
      console.error('❌ Error requesting token:', err);
      setError(err.message || 'خطا در دریافت توکن');
    } finally {
      setRequestingToken(null);
    }
  };

  const calculateTimeRemaining = (validUntil: string): string => {
    try {
      const now = new Date();
      const expiryTime = new Date(validUntil);
      const diff = expiryTime.getTime() - now.getTime();
      
      if (diff <= 0) return 'منقضی شده';
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      return `${formatPersianNumber(hours)}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    } catch (error) {
      return 'خطا';
    }
  };

  const formatDisplayTime = (validUntil: string): string => {
    try {
      const date = new Date(validUntil);
      const time = date.toLocaleTimeString('fa-IR', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: false 
      });
      return time;
    } catch (error) {
      return '';
    }
  };

  const updateTimeRemaining = () => {
    setGyms(prev => 
      prev.map(item => ({
        ...item,
        activeToken: item.activeToken 
          ? {
              ...item.activeToken,
              timeRemaining: calculateTimeRemaining(item.activeToken.valid_until),
            }
          : null,
      }))
    );
  };

  const openCopyModal = (token: ExpandedToken) => {
    setCopyModalToken(token);
    setShowCopyModal(true);
  };

  const copyToClipboard = async () => {
    if (!copyModalToken) return;
    
    try {
      await navigator.clipboard.writeText(copyModalToken.token_code);
      setCopyFeedback(copyModalToken.id);
      setTimeout(() => {
        setCopyFeedback(null);
        setShowCopyModal(false);
      }, 1500);
    } catch (err) {
      console.error('Error copying to clipboard:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'used':
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      case 'expired':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'فعال';
      case 'used':
        return 'استفاده‌شده';
      case 'expired':
        return 'منقضی‌شده';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'used':
        return <Clock className="w-4 h-4" />;
      case 'expired':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#07070A] z-50 flex flex-col justify-center items-center">
        <div className="relative w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 bg-primary/25 rounded-full blur-2xl animate-pulse" />
          <div className="w-16 h-16 rounded-full border-t-2 border-r-2 border-primary animate-spin" />
          <div className="absolute w-12 h-12 rounded-full border-b-2 border-l-2 border-[#FFB000]/60 animate-spin-[reverse_1.5s_linear_infinite]" />
        </div>
        <p className="mt-6 text-sm font-black font-vazir text-primary tracking-widest animate-pulse">FITOPIA</p>
      </div>
    );
  }

  return (
    <>
      <ShaderBackground />
      <ParticleOverlay />

      <Header />

      <main className="relative z-10 pt-24 pb-36 px-4 md:px-8 max-w-4xl mx-auto w-full">
        {/* Back Button & Title */}
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => navigate('/home')}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-on-surface" />
          </button>
          <div className="flex-1">
            <h1 className="text-display-lg-mobile font-bold text-white">دریافت توکن</h1>
            <p className="text-body-md text-on-surface-variant">
              اشتراک: {subscriptionInfo?.plan_name || '...'}
            </p>
          </div>
        </div>

        {/* Subscription Info */}
        {subscriptionInfo && (
          <div className="mb-6 glass-panel rounded-2xl p-4 border border-primary/20 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-label-sm text-on-surface-variant">توکن باقی‌مانده:</span>
              <span className="text-headline-md text-primary font-bold">
                {formatPersianNumber(subscriptionInfo.tokens_remaining || 0)} / {formatPersianNumber(subscriptionInfo.tokens_total || 0)}
              </span>
            </div>
            <div className="w-full bg-surface-container rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-primary to-[#FFB000] h-2 rounded-full transition-all"
                style={{
                  width: `${subscriptionInfo.tokens_total ? (subscriptionInfo.tokens_remaining / subscriptionInfo.tokens_total * 100) : 0}%`
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-on-surface-variant pt-2">
              <span>استفاده شده: {formatPersianNumber(subscriptionInfo.tokens_used || 0)}</span>
              <span>روزهای باقی: {formatPersianNumber(subscriptionInfo.days_remaining || 0)}</span>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-body-md">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {gyms.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <QrCode className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-headline-md text-white">هیچ باشگاهی دسترسی‌دار نیست</h2>
            <p className="text-body-md text-on-surface-variant max-w-xs mx-auto">
              برای این اشتراک هیچ باشگاهی تعریف نشده است.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Gym Cards */}
            {gyms.map((item) => (
              <div key={item.gym.id} className="glass-panel rounded-2xl p-6 space-y-4 border border-white/5">
                {/* Gym Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-headline-md text-white font-bold">{item.gym.name}</h3>
                    <div className="flex items-start gap-2 mt-1">
                      <span className="text-label-sm text-on-surface-variant mt-0.5">📍</span>
                      <p className="text-label-sm text-on-surface-variant">{item.gym.address}</p>
                    </div>
                    {item.gym.phone && (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-label-sm text-on-surface-variant">📞</span>
                        <a href={`tel:${item.gym.phone}`} className="text-label-sm text-primary hover:text-primary/80">
                          {item.gym.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Active Token */}
                {item.activeToken ? (
                  <div className="bg-gradient-to-r from-green-500/5 to-emerald-500/5 border border-green-500/20 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-label-sm font-bold text-green-400">توکن فعال</span>
                      </div>
                      <span className="text-label-sm text-on-surface-variant">
                        {item.activeToken.timeRemaining}
                      </span>
                    </div>

                    {/* Token Code Box */}
                    <div className="flex items-center gap-2 bg-surface-container rounded-lg p-3">
                      <input
                        type="text"
                        value={item.activeToken.token_code}
                        readOnly
                        className="flex-1 bg-transparent text-body-md text-white font-mono outline-none text-xs md:text-sm"
                      />
                      <button
                        onClick={() => openCopyModal(item.activeToken!)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-primary flex-shrink-0"
                        title="کپی توکن"
                      >
                        <Copy className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedToken(item.activeToken!);
                          setShowQRModal(true);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 bg-primary/20 text-primary py-2.5 rounded-lg hover:bg-primary/30 transition-colors font-label-sm"
                      >
                        <QrCode className="w-4 h-4" />
                        نمایش QR
                      </button>
                      <button
                        onClick={() => {
                          if (item.activeToken?.qr_code) {
                            const link = document.createElement('a');
                            link.href = item.activeToken.qr_code;
                            link.download = `token-${item.activeToken.token_code}.png`;
                            link.click();
                          }
                        }}
                        className="p-2.5 hover:bg-white/10 rounded-lg transition-colors text-on-surface-variant"
                        title="دانلود QR"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Token Info */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 text-xs text-on-surface-variant">
                      <div>
                        <p className="text-on-surface-variant/70">صادر شده:</p>
                        <p className="text-white font-vazir">{formatPersianDateShort(item.activeToken.issued_at)}</p>
                      </div>
                      <div className="text-left">
                        <p className="text-on-surface-variant/70">منقضی شدن:</p>
                        <p className="text-white font-vazir">{formatPersianDateShort(item.activeToken.valid_until)}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Request Token Button */
                  <button
                    onClick={() => requestToken(item.gym.id)}
                    disabled={requestingToken === item.gym.id || (subscriptionInfo?.tokens_remaining || 0) <= 0}
                    className="w-full amber-gradient py-3 rounded-xl font-headline-md text-white hover:shadow-lg hover:shadow-primary/30 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {requestingToken === item.gym.id ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        در حال دریافت...
                      </>
                    ) : (subscriptionInfo?.tokens_remaining || 0) <= 0 ? (
                      <>
                        <AlertCircle className="w-5 h-5" />
                        توکن باقی‌مانده نیست
                      </>
                    ) : (
                      <>
                        <QrCode className="w-5 h-5" />
                        دریافت توکن روزانه
                      </>
                    )}
                  </button>
                )}

                {/* Inactive Tokens */}
                {item.inactiveTokens.length > 0 && (
                  <details className="pt-2 border-t border-white/5">
                    <summary className="cursor-pointer text-label-sm text-on-surface-variant hover:text-on-surface transition-colors">
                      {item.inactiveTokens.length} توکن منقضی‌شده
                    </summary>
                    <div className="mt-3 space-y-2">
                      {item.inactiveTokens.map((token) => (
                        <div
                          key={token.id}
                          className={`flex items-center justify-between p-3 rounded-lg border ${getStatusColor(
                            token.status
                          )}`}
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            {getStatusIcon(token.status)}
                            <span className="text-label-sm font-mono text-xs truncate">
                              {token.token_code.substring(0, 8)}...
                            </span>
                          </div>
                          <span className="text-label-sm flex-shrink-0">{getStatusLabel(token.status)}</span>
                        </div>
                      ))}
                    </div>
                  </details>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* QR Modal */}
      {selectedToken && (
        <div
          className={`fixed inset-0 z-50 flex items-end justify-center transition-opacity duration-300 ${
            showQRModal ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setShowQRModal(false)}
          />
          <div className="relative w-full max-w-md glass-panel rounded-t-3xl p-6 space-y-6 transform transition-transform duration-300 max-h-[90vh] overflow-y-auto">
            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto" />

            {/* Header */}
            <div className="text-center space-y-2">
              <h3 className="text-display-lg-mobile text-white font-bold">تأییدیه ورود</h3>
              <p className="text-body-md text-on-surface-variant">
                QR کد را مقابل اسکنر باشگاه قرار دهید
              </p>
            </div>

            {/* Ticket-Style Card */}
            <div className="bg-white rounded-2xl p-6 space-y-4 text-black overflow-hidden relative">
              {/* QR Code */}
              {selectedToken.qr_code ? (
                <img
                  src={selectedToken.qr_code}
                  alt="QR Code"
                  className="w-full aspect-square bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 object-contain p-2"
                />
              ) : (
                <div className="aspect-square w-full bg-slate-100 flex items-center justify-center rounded-xl border-2 border-dashed border-slate-300">
                  <QrCode className="w-16 h-16 text-slate-300" />
                </div>
              )}

              {/* Token Info */}
              <div className="space-y-2 border-t border-slate-200 pt-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-label-sm text-slate-500 font-bold">باشگاه</p>
                    <p className="text-body-md font-bold">{selectedToken.gym_name}</p>
                  </div>
                  <div className="text-left">
                    <p className="text-label-sm text-slate-500 font-bold">وضعیت</p>
                    <div className="flex items-center gap-1 mt-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-label-sm font-bold text-green-600">
                        {getStatusLabel(selectedToken.status)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Time Info */}
              <div className="flex justify-between items-center border-t border-slate-200 pt-4">
                <div>
                  <p className="text-label-sm text-slate-500 font-bold">اعتبار تا</p>
                  <p className="text-body-md font-bold font-mono">{selectedToken.displayTime}</p>
                </div>
                <div className="text-left">
                  <p className="text-label-sm text-slate-500 font-bold">زمان باقی‌مانده</p>
                  <p className="text-body-md font-bold font-mono text-green-600">
                    {selectedToken.timeRemaining}
                  </p>
                </div>
              </div>

              {/* Ticket Notch Decorations */}
              <div className="absolute top-1/2 -left-4 w-8 h-8 bg-[#07070A] rounded-full -translate-y-1/2" />
              <div className="absolute top-1/2 -right-4 w-8 h-8 bg-[#07070A] rounded-full -translate-y-1/2" />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => openCopyModal(selectedToken)}
                className="flex-1 bg-surface-container-high text-white py-3 rounded-lg font-label-sm flex items-center justify-center gap-2 hover:bg-surface-variant transition-colors border border-white/5"
              >
                <Copy className="w-4 h-4" />
                کپی کد
              </button>
              <button
                onClick={() => {
                  if (selectedToken.qr_code) {
                    const link = document.createElement('a');
                    link.href = selectedToken.qr_code;
                    link.download = `token-${selectedToken.token_code}.png`;
                    link.click();
                  }
                }}
                className="flex-1 border border-primary/40 text-primary py-3 rounded-lg font-label-sm hover:bg-primary/10 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                ذخیره
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowQRModal(false)}
              className="w-full bg-surface-container text-on-surface py-3 rounded-lg font-label-sm hover:bg-surface-container-high transition-colors"
            >
              بستن
            </button>
          </div>
        </div>
      )}

      {/* Copy Token Modal */}
      {copyModalToken && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
            showCopyModal ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setShowCopyModal(false)}
          />
          <div className="relative w-full max-w-sm glass-panel rounded-3xl p-6 space-y-6 transform transition-transform duration-300">
            <div className="flex items-center justify-between">
              <h3 className="text-headline-md text-white font-bold">کپی توکن</h3>
              <button
                onClick={() => setShowCopyModal(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-on-surface" />
              </button>
            </div>

            {/* Token Code Display */}
            <div className="space-y-3">
              <p className="text-label-sm text-on-surface-variant">کد توکن ورود به باشگاه:</p>
              <div className="bg-surface-container rounded-xl p-4 space-y-3">
                <input
                  type="text"
                  value={copyModalToken.token_code}
                  readOnly
                  className="w-full bg-surface-container-high text-white font-mono text-sm p-3 rounded-lg border border-white/10 outline-none"
                  onClick={(e) => e.currentTarget.select()}
                />
                <p className="text-xs text-on-surface-variant text-center">
                  برای انتخاب تمام متن روی input کلیک کن
                </p>
              </div>
            </div>

            {/* Token Info */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-on-surface-variant">وضعیت:</span>
                <span className="text-green-400 font-bold">فعال</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-on-surface-variant">زمان باقی:</span>
                <span className="text-white font-mono">{copyModalToken.timeRemaining}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-on-surface-variant">باشگاه:</span>
                <span className="text-white font-vazir">{copyModalToken.gym_name}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={copyToClipboard}
                className={`flex-1 py-3 rounded-lg font-label-sm flex items-center justify-center gap-2 transition-all ${
                  copyFeedback === copyModalToken.id
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'amber-gradient text-white hover:shadow-lg hover:shadow-primary/30'
                }`}
              >
                {copyFeedback === copyModalToken.id ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    کپی شد ✓
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    کپی کن
                  </>
                )}
              </button>
              <button
                onClick={() => setShowCopyModal(false)}
                className="flex-1 bg-surface-container text-on-surface py-3 rounded-lg font-label-sm hover:bg-surface-container-high transition-colors"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNavigation />
    </>
  );
}
