import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Header } from '../components/Header';
import { BottomNavigation } from '../components/BottomNavigation';
import { ShaderBackground } from '../components/ShaderBackground';
import { ParticleOverlay } from '../components/ParticleOverlay';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, CreditCard, Wallet, Building2, Loader } from 'lucide-react';
import apiService from '../services/api';
import { SubscriptionPlan } from '../types/subscription';

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}

export function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();
  
  const [selectedMethod, setSelectedMethod] = useState<string>('bank');
  const [useDiscount, setUseDiscount] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    document.title = 'FITOPIA | درخواست پرداخت';
    
    // Get plan from navigation state
    const state = location.state as { planId: number; plan: SubscriptionPlan } | null;
    if (state?.plan) {
      setPlan(state.plan);
    } else {
      // Fallback if no plan provided
      navigate('/subscriptions', { replace: true });
    }

    // Load discount
    loadDiscount();
  }, []);

  const loadDiscount = async () => {
    try {
      const response = await apiService.get('/subscriptions/my-discount/');
      if (response?.discount_remaining) {
        setDiscount(response.discount_remaining);
      }
    } catch (err) {
      console.error('Error loading discount:', err);
    }
  };

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'bank',
      name: 'کارت بانکی',
      icon: <CreditCard className="w-6 h-6" />,
      description: 'پرداخت مستقیم از حساب بانکی شما',
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 'wallet',
      name: 'کیف پول دیجیتال',
      icon: <Wallet className="w-6 h-6" />,
      description: 'استفاده از موجودی کیف پول شخصی',
      color: 'from-green-500 to-green-600',
    },
    {
      id: 'gateway',
      name: 'درگاه پرداخت آنلاین',
      icon: <Building2 className="w-6 h-6" />,
      description: 'پرداخت از طریق درگاه‌های معتبر',
      color: 'from-purple-500 to-purple-600',
    },
  ];

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('fa-IR').format(price) + ' تومان';

  const finalPrice = plan ? (useDiscount ? Math.max(0, plan.price - discount) : plan.price) : 0;

  const handlePayment = async () => {
    if (!plan) {
      setError('لطفاً ابتدا یک پلن را انتخاب کنید');
      return;
    }

    // ✅ اضافی: چک کن که plan.id معتبر است
    if (!plan.id) {
      setError('شناسه پلن نامعتبر است');
      console.error('Invalid plan.id:', plan.id);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // ✅ بهتر: Body صحیح شامل تمام فیلدهای مورد نیاز
      const paymentData = {
        plan_id: Number(plan.id), // اطمینان حاصل کن که عدد است
        payment_method: selectedMethod, // اضافه کن روش پرداخت
        use_discount: useDiscount,
        discount_amount: useDiscount ? discount : 0, // اضافه کن میزان تخفیف
      };

      console.log('📤 Sending payment request:', paymentData);

      const response = await apiService.post('/subscriptions/purchase/', paymentData);

      console.log('✅ Payment response:', response);

      setSuccess(true);
      setTimeout(() => {
        navigate('/subscriptions/history', { replace: true });
      }, 2000);
    } catch (err: any) {
      console.error('❌ Payment error:', err);
      
      // بهتر: خطای واضح‌تر برای کاربر
      const errorMessage = err.message || 'خطا در پردازش پرداخت';
      const detailedError = err.data?.detail || err.data?.message || errorMessage;
      
      setError(`${detailedError}. لطفاً دوباره تلاش کنید.`);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <>
        <ShaderBackground />
        <ParticleOverlay />
        <Header />
        <main className="relative z-10 pt-24 pb-32 px-4 max-w-2xl mx-auto h-screen flex items-center justify-center">
          <div className="glass-panel rounded-3xl p-12 text-center flex flex-col items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">پرداخت موفق!</h2>
              <p className="text-on-surface-variant">پلن شما فعال شد. تا لحظاتی منتقل می‌شوید...</p>
            </div>
          </div>
        </main>
        <BottomNavigation />
      </>
    );
  }

  if (!plan) {
    return (
      <>
        <ShaderBackground />
        <ParticleOverlay />
        <Header />
        <main className="relative z-10 pt-24 pb-32 px-4 max-w-2xl mx-auto h-screen flex items-center justify-center">
          <Loader className="w-8 h-8 animate-spin text-primary" />
        </main>
        <BottomNavigation />
      </>
    );
  }

  return (
    <>
      <ShaderBackground />
      <ParticleOverlay />
      <Header />

      <main className="relative z-10 pt-24 pb-32 px-4 max-w-2xl mx-auto">
        {/* Header */}
        <header className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors active:scale-95"
            title="برگشت"
          >
            <ArrowLeft className="w-5 h-5 text-on-surface" />
          </button>
          <h1 className="text-2xl font-bold text-white">درخواست پرداخت</h1>
        </header>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3">
            <svg className="w-6 h-6 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Plan Info */}
        <section className="mb-8 glass-panel rounded-xl p-5 bg-primary/5 border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-on-surface-variant mb-1">پلن انتخاب شده</p>
              <h2 className="text-lg font-bold text-white">{plan.name}</h2>
              <p className="text-xs text-on-surface-variant mt-1">{plan.token_count} توکن • {plan.gyms_count} باشگاه</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-on-surface-variant">قیمت</p>
              <p className="text-2xl font-bold text-primary">{formatPrice(plan.price)}</p>
            </div>
          </div>
        </section>

        {/* Payment Methods */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">روش پرداخت</h2>
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  selectedMethod === method.id
                    ? 'border-primary bg-primary/10'
                    : 'border-white/10 bg-surface-container hover:border-white/20'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${method.color} flex items-center justify-center flex-shrink-0 text-white`}>
                    {method.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-white">{method.name}</p>
                    <p className="text-sm text-on-surface-variant mt-1">{method.description}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    selectedMethod === method.id
                      ? 'border-primary bg-primary'
                      : 'border-white/20'
                  }`}>
                    {selectedMethod === method.id && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Discount Option */}
        {discount > 0 && (
          <section className="mb-8">
            <div className="glass-panel rounded-xl p-4 flex items-center justify-between border-primary/20 bg-primary/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M5.5 4h13a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-1l1.5 6a1 1 0 0 1-1 1.18H5a1 1 0 0 1-1-1.18l1.5-6h-1a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-on-surface font-semibold">استفاده از تخفیف موجود</p>
                  <p className="text-xs text-on-surface-variant">{formatPrice(discount)} تخفیف دارید</p>
                </div>
              </div>
              <button
                onClick={() => setUseDiscount(!useDiscount)}
                className={`w-11 h-6 rounded-full p-1 transition-all ${
                  useDiscount ? 'bg-primary' : 'bg-surface-container'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                  useDiscount ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </section>
        )}

        {/* Order Summary */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">خلاصه سفارش</h2>
          <div className="glass-panel rounded-xl p-5 space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <span className="text-on-surface-variant">قیمت پلن</span>
              <span className="font-semibold text-white">{formatPrice(plan.price)}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <span className="text-on-surface-variant">روش پرداخت</span>
              <span className="font-semibold text-white capitalize">{selectedMethod}</span>
            </div>
            {useDiscount && discount > 0 && (
              <div className="flex justify-between items-center pb-3 border-b border-white/10 text-green-400">
                <span>تخفیف</span>
                <span className="font-semibold">-{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-3 bg-gradient-to-r from-primary/10 to-transparent p-3 rounded-lg">
              <span className="font-semibold text-white">مبلغ نهایی</span>
              <span className="text-xl font-bold text-primary">{formatPrice(finalPrice)}</span>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 py-3 rounded-xl border border-white/10 text-on-surface font-semibold hover:bg-white/5 transition-all"
          >
            انصراف
          </button>
          <button
            onClick={handlePayment}
            disabled={loading}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary to-yellow-500 text-on-primary font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                در حال پردازش...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                تأیید و پرداخت
              </>
            )}
          </button>
        </div>
      </main>

      <BottomNavigation />
    </>
  );
}
