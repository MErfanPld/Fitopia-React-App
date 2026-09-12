/**
 * Subscription payment checkout
 * Route: /subscriptions/payment
 * Expects location.state: { planId, plan }
 * API: GET /subscriptions/my-discount/ + POST /subscriptions/purchase/
 */

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowRight,
  CreditCard,
  Wallet,
  Building2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Coins,
  CalendarDays,
  Tag,
  ShieldCheck,
} from "lucide-react";
import { Header } from "../components/Header";
import { BottomNavigation } from "../components/BottomNavigation";
import apiService from "../services/api";
import type { SubscriptionPlan } from "../types/subscription";

type MethodId = "bank" | "wallet" | "gateway";

interface PaymentMethod {
  id: MethodId;
  name: string;
  description: string;
  icon: ReactNode;
}

const METHODS: PaymentMethod[] = [
  {
    id: "bank",
    name: "کارت بانکی",
    description: "پرداخت مستقیم با کارت شتاب",
    icon: <CreditCard size={20} aria-hidden />,
  },
  {
    id: "wallet",
    name: "کیف پول",
    description: "برداشت از موجودی کیف پول",
    icon: <Wallet size={20} aria-hidden />,
  },
  {
    id: "gateway",
    name: "درگاه آنلاین",
    description: "پرداخت امن از درگاه معتبر",
    icon: <Building2 size={20} aria-hidden />,
  },
];

function formatPrice(price: number) {
  return new Intl.NumberFormat("fa-IR").format(Math.max(0, Math.round(price)));
}

function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-white/[0.08] bg-[#121216] p-4 sm:p-5 ${className}`}
    >
      {children}
    </section>
  );
}

export function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedMethod, setSelectedMethod] = useState<MethodId>("bank");
  const [useDiscount, setUseDiscount] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    document.title = "FITOPIA | پرداخت اشتراک";

    const state = location.state as { planId?: number; plan?: SubscriptionPlan } | null;
    if (state?.plan) {
      setPlan(state.plan);
    } else {
      navigate("/subscriptions", { replace: true });
      return;
    }

    const loadDiscount = async () => {
      try {
        const response = await apiService.get<{
          discount_remaining?: number;
          discount_amount?: number;
        }>("/subscriptions/my-discount/");
        const amount =
          response?.discount_remaining ?? response?.discount_amount ?? 0;
        setDiscount(typeof amount === "number" ? amount : 0);
      } catch {
        setDiscount(0);
      }
    };

    loadDiscount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const finalPrice = useMemo(() => {
    if (!plan) return 0;
    if (useDiscount && discount > 0) return Math.max(0, plan.price - discount);
    return plan.price;
  }, [plan, useDiscount, discount]);

  const handlePayment = async () => {
    if (!plan?.id) {
      setError("لطفاً ابتدا یک پلن را انتخاب کنید");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const paymentData = {
        plan_id: Number(plan.id),
        payment_method: selectedMethod,
        use_discount: useDiscount && discount > 0,
        discount_amount: useDiscount && discount > 0 ? discount : 0,
      };

      await apiService.post("/subscriptions/purchase/", paymentData);
      setSuccess(true);
      window.setTimeout(() => {
        navigate("/subscriptions/history", { replace: true });
      }, 1800);
    } catch (err: unknown) {
      const anyErr = err as {
        message?: string;
        data?: { detail?: string; message?: string };
      };
      const detailed =
        anyErr?.data?.detail ||
        anyErr?.data?.message ||
        anyErr?.message ||
        "خطا در پردازش پرداخت";
      setError(`${detailed}. لطفاً دوباره تلاش کنید.`);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-dvh bg-[#07070A] text-right home-with-rail">
        <Header />
        <main className="relative z-10 home-shell home-pad flex min-h-[70dvh] items-center justify-center pb-[calc(6.75rem+env(safe-area-inset-bottom))]">
          <div className="mx-auto w-full max-w-md rounded-2xl border border-emerald-500/25 bg-[#121216] px-6 py-10 text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/30">
              <CheckCircle2 className="h-8 w-8 text-emerald-300" aria-hidden />
            </div>
            <h2 className="text-xl font-extrabold text-white">پرداخت موفق</h2>
            <p className="text-sm text-white/55 leading-relaxed">
              اشتراک شما فعال شد. در حال انتقال به تاریخچه…
            </p>
            <div className="fitopia-loader-ring mx-auto opacity-70" aria-hidden />
          </div>
        </main>
        <BottomNavigation />
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-dvh bg-[#07070A] home-with-rail flex items-center justify-center">
        <div className="fitopia-loader-ring" aria-label="در حال بارگذاری" />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[#07070A] text-right home-with-rail">
      <Header />

      <main className="relative z-10 home-shell home-pad pb-[calc(6.75rem+env(safe-area-inset-bottom))] md:pb-12">
        <div className="mx-auto flex w-full max-w-lg flex-col gap-4 sm:gap-5">
          {/* Title row */}
          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.07] transition-colors"
              aria-label="بازگشت"
            >
              <ArrowRight size={20} aria-hidden />
            </button>
            <div className="min-w-0 text-right flex-1">
              <h1 className="text-lg font-extrabold tracking-tight text-white sm:text-xl">
                پرداخت اشتراک
              </h1>
              <p className="text-[11px] text-white/45 mt-0.5">تأیید نهایی و انتخاب روش پرداخت</p>
            </div>
            <ShieldCheck className="h-5 w-5 text-primary/70 shrink-0" aria-hidden />
          </div>

          {error ? (
            <div
              className="flex items-start gap-2 rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200"
              role="alert"
            >
              <AlertCircle size={18} className="shrink-0 mt-0.5" aria-hidden />
              <p className="leading-relaxed">{error}</p>
            </div>
          ) : null}

          {/* Selected plan */}
          <Card className="border-primary/25 bg-gradient-to-br from-primary/[0.1] to-[#121216]">
            <p className="text-[11px] font-medium text-white/45 mb-1">پلن انتخاب‌شده</p>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 text-right">
                <h2 className="text-base font-extrabold text-white leading-snug">{plan.name}</h2>
                <ul className="mt-2 space-y-1">
                  <li className="flex items-center justify-end gap-1.5 text-[12px] text-white/65">
                    <span>{plan.token_count.toLocaleString("fa-IR")} توکن</span>
                    <Coins size={13} className="text-primary/80" aria-hidden />
                  </li>
                  <li className="flex items-center justify-end gap-1.5 text-[12px] text-white/65">
                    <span>{plan.duration_days.toLocaleString("fa-IR")} روز اعتبار</span>
                    <CalendarDays size={13} className="text-primary/80" aria-hidden />
                  </li>
                  {plan.gyms_count > 0 ? (
                    <li className="flex items-center justify-end gap-1.5 text-[12px] text-white/65">
                      <span>تا {plan.gyms_count.toLocaleString("fa-IR")} باشگاه</span>
                      <Building2 size={13} className="text-primary/80" aria-hidden />
                    </li>
                  ) : null}
                </ul>
              </div>
              <div className="text-left shrink-0">
                <p className="text-[10px] text-white/40">قیمت پایه</p>
                <p className="text-lg font-black text-primary tabular-nums leading-none mt-0.5">
                  {formatPrice(plan.price)}
                </p>
                <p className="text-[10px] text-white/40 mt-0.5">تومان</p>
              </div>
            </div>
          </Card>

          {/* Payment methods */}
          <Card>
            <h2 className="mb-3 flex items-center gap-2 text-[0.95rem] font-bold text-white">
              <span className="inline-block h-4 w-1 rounded-full bg-primary-container" aria-hidden />
              روش پرداخت
            </h2>
            <div className="space-y-2" role="radiogroup" aria-label="روش پرداخت">
              {METHODS.map((method) => {
                const active = selectedMethod === method.id;
                return (
                  <button
                    key={method.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`flex w-full items-center gap-3 rounded-xl border px-3.5 py-3 text-right transition-colors min-h-[3.5rem] ${
                      active
                        ? "border-primary/45 bg-primary/10"
                        : "border-white/10 bg-white/[0.03] hover:bg-white/[0.05]"
                    }`}
                  >
                    <span
                      className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        active
                          ? "bg-primary/20 text-primary"
                          : "bg-white/[0.05] text-white/70"
                      }`}
                    >
                      {method.icon}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold text-white">{method.name}</span>
                      <span className="block text-[11px] text-white/45 mt-0.5">
                        {method.description}
                      </span>
                    </span>
                    <span
                      className={`h-4 w-4 shrink-0 rounded-full border-2 ${
                        active
                          ? "border-primary bg-primary shadow-[0_0_0_3px_rgba(255,106,0,0.2)]"
                          : "border-white/25"
                      }`}
                      aria-hidden
                    />
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Discount */}
          {discount > 0 ? (
            <Card className="border-primary/20">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                    <Tag size={18} aria-hidden />
                  </span>
                  <div className="text-right min-w-0">
                    <p className="text-sm font-bold text-white">استفاده از تخفیف</p>
                    <p className="text-[11px] text-white/50 mt-0.5">
                      {formatPrice(discount)} تومان اعتبار تخفیف دارید
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={useDiscount}
                  onClick={() => setUseDiscount((v) => !v)}
                  className={`relative h-7 w-12 shrink-0 rounded-full p-0.5 transition-colors ${
                    useDiscount ? "bg-primary" : "bg-white/15"
                  }`}
                >
                  <span
                    className={`block h-6 w-6 rounded-full bg-white shadow transition-transform ${
                      useDiscount ? "-translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </Card>
          ) : null}

          {/* Order summary */}
          <Card>
            <h2 className="mb-3 flex items-center gap-2 text-[0.95rem] font-bold text-white">
              <span className="inline-block h-4 w-1 rounded-full bg-primary-container" aria-hidden />
              خلاصه سفارش
            </h2>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white tabular-nums">
                  {formatPrice(plan.price)} تومان
                </span>
                <span className="text-white/50">قیمت پلن</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">
                  {METHODS.find((m) => m.id === selectedMethod)?.name}
                </span>
                <span className="text-white/50">روش پرداخت</span>
              </div>
              {useDiscount && discount > 0 ? (
                <div className="flex items-center justify-between text-emerald-300">
                  <span className="font-semibold tabular-nums">
                    −{formatPrice(Math.min(discount, plan.price))} تومان
                  </span>
                  <span className="text-emerald-300/80">تخفیف</span>
                </div>
              ) : null}
              <div className="h-px bg-white/[0.08] my-1" aria-hidden />
              <div className="flex items-center justify-between">
                <span className="text-lg font-black text-primary tabular-nums">
                  {formatPrice(finalPrice)}
                  <span className="text-xs font-medium text-white/45 mr-1"> تومان</span>
                </span>
                <span className="text-white/70 font-semibold">مبلغ قابل پرداخت</span>
              </div>
            </div>
          </Card>

          {/* CTA */}
          <button
            type="button"
            onClick={handlePayment}
            disabled={loading}
            className="btn btn-primary w-full min-h-12 text-sm inline-flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" aria-hidden />
                در حال پردازش…
              </>
            ) : (
              <>
                <CreditCard size={18} aria-hidden />
                تأیید و پرداخت {formatPrice(finalPrice)} تومان
              </>
            )}
          </button>

          <p className="text-center text-[11px] text-white/35 leading-relaxed px-2">
            با تأیید پرداخت، شرایط استفاده از اشتراک فیتوپیا را می‌پذیرید.
          </p>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}
