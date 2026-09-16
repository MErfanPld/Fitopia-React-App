/**
 * Entry tickets (بلیت ورود) — generate one universal ticket for all accessible gyms
 * Route: /gym-access/tokens
 * API: /subscriptions/my/, /subscriptions/subscriptions/me/gyms/,
 *      /tokens/my/, POST /tokens/request/
 */

import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Copy,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Clock,
  Download,
  Loader2,
  X,
  Building2,
  Ticket,
  RefreshCw,
  ChevronLeft,
} from "lucide-react";
import { Header } from "../components/Header";
import { BottomNavigation } from "../components/BottomNavigation";
import apiService from "../services/api";
import { formatPersianNumber } from "../utils/formatting";

interface Token {
  id: number;
  token_code: string;
  user: string;
  gym: number | null;
  gym_name?: string;
  gym_address?: string;
  status: "active" | "used" | "expired";
  is_valid: boolean;
  issued_at: string;
  valid_until: string;
  used_at: string | null;
  qr_code: string;
}

interface ExpandedToken extends Token {
  timeRemaining: string;
}

interface Gym {
  id: number;
  name: string;
  address: string;
  phone: string;
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

function calculateTimeRemaining(validUntil: string): string {
  try {
    const now = new Date();
    const expiryTime = new Date(validUntil);
    const diff = expiryTime.getTime() - now.getTime();
    if (diff <= 0) return "منقضی شده";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${formatPersianNumber(hours)}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  } catch {
    return "—";
  }
}

function statusMeta(status: string) {
  switch (status) {
    case "active":
      return {
        label: "فعال",
        className: "bg-emerald-500/15 text-emerald-300 border-emerald-500/25",
        Icon: CheckCircle2,
      };
    case "used":
      return {
        label: "استفاده‌شده",
        className: "bg-white/8 text-white/55 border-white/10",
        Icon: Clock,
      };
    case "expired":
      return {
        label: "منقضی",
        className: "bg-red-500/15 text-red-300 border-red-500/25",
        Icon: AlertCircle,
      };
    default:
      return {
        label: status,
        className: "bg-white/8 text-white/55 border-white/10",
        Icon: Clock,
      };
  }
}

export function GymAccessTokenPage() {
  const navigate = useNavigate();
  const [accessibleGyms, setAccessibleGyms] = useState<Gym[]>([]);
  const [activeToken, setActiveToken] = useState<ExpandedToken | null>(null);
  const [pastTokens, setPastTokens] = useState<ExpandedToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [subscriptionInfo, setSubscriptionInfo] = useState<Subscription | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const subscription = await apiService.get<Subscription>("/subscriptions/my/");
      if (!subscription || !subscription.is_active) {
        setError("هیچ اشتراک فعالی وجود ندارد");
        setSubscriptionInfo(null);
        setAccessibleGyms([]);
        setActiveToken(null);
        setPastTokens([]);
        return;
      }
      setSubscriptionInfo(subscription);

      const subscriptionGymsData = await apiService.get<{ gyms?: Gym[] }>(
        "/subscriptions/subscriptions/me/gyms/",
      );
      setAccessibleGyms(subscriptionGymsData?.gyms ?? []);

      const tokens = await apiService.get<Token[]>("/tokens/my/");
      const expanded: ExpandedToken[] = (tokens || []).map((token) => ({
        ...token,
        timeRemaining: calculateTimeRemaining(token.valid_until),
      }));

      const active = expanded.find((t) => t.status === "active" && t.is_valid) || null;
      const past = expanded
        .filter((t) => t.status !== "active")
        .sort((a, b) => new Date(b.issued_at).getTime() - new Date(a.issued_at).getTime())
        .slice(0, 8);

      setActiveToken(active);
      setPastTokens(past);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "خطا در بارگذاری اطلاعات";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = "FITOPIA | بلیت‌های ورود";
    loadData();
    const interval = window.setInterval(() => {
      setActiveToken((prev) =>
        prev
          ? { ...prev, timeRemaining: calculateTimeRemaining(prev.valid_until) }
          : null,
      );
    }, 10000);
    return () => window.clearInterval(interval);
  }, [loadData]);

  useEffect(() => {
    if (!showQRModal && !showCopyModal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowQRModal(false);
        setShowCopyModal(false);
      }
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [showQRModal, showCopyModal]);

  /** One ticket for all accessible gyms (not per-gym). */
  const requestUniversalToken = async () => {
    try {
      setRequesting(true);
      setError(null);

      let newToken: Token | null = null;
      try {
        newToken = await apiService.post<Token>("/tokens/request/", {});
      } catch {
        if (accessibleGyms.length > 0) {
          newToken = await apiService.post<Token>("/tokens/request/", {
            gym_id: accessibleGyms[0].id,
          });
        } else {
          throw new Error("باشگاه قابل دسترسی برای صدور بلیت یافت نشد");
        }
      }

      if (!newToken) throw new Error("پاسخ نامعتبر از سرور");

      const expanded: ExpandedToken = {
        ...newToken,
        timeRemaining: calculateTimeRemaining(newToken.valid_until),
      };

      setActiveToken(expanded);

      if (subscriptionInfo) {
        setSubscriptionInfo({
          ...subscriptionInfo,
          tokens_remaining: Math.max(0, subscriptionInfo.tokens_remaining - 1),
          tokens_used: subscriptionInfo.tokens_used + 1,
        });
      }

      setShowQRModal(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "خطا در دریافت بلیت";
      setError(msg);
    } finally {
      setRequesting(false);
    }
  };

  const copyToClipboard = async () => {
    if (!activeToken) return;
    try {
      await navigator.clipboard.writeText(activeToken.token_code);
      setCopyFeedback(true);
      window.setTimeout(() => {
        setCopyFeedback(false);
        setShowCopyModal(false);
      }, 1400);
    } catch {
      /* ignore */
    }
  };

  const downloadQr = (token: ExpandedToken) => {
    if (!token.qr_code) return;
    const link = document.createElement("a");
    link.href = token.qr_code;
    link.download = `ticket-${token.token_code}.png`;
    link.click();
  };

  const remaining = subscriptionInfo?.tokens_remaining ?? 0;
  const canGenerate = remaining > 0 && !activeToken && !requesting;

  return (
    <div className="min-h-dvh bg-[#07070A] text-right home-with-rail">
      <Header />

      <main className="relative z-10 home-shell home-pad pb-[calc(6.75rem+env(safe-area-inset-bottom))] md:pb-12">
        <div className="mx-auto flex w-full max-w-lg flex-col gap-4 sm:gap-5">
          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.07]"
              aria-label="بازگشت"
            >
              <ArrowRight size={20} aria-hidden />
            </button>
            <div className="min-w-0 flex-1 text-right">
              <h1 className="text-lg font-extrabold tracking-tight text-white sm:text-xl">
                بلیت‌های ورود
              </h1>
              <p className="text-[11px] text-white/45 mt-0.5">
                یک بلیت برای همه باشگاه‌های قابل دسترس
              </p>
            </div>
            <button
              type="button"
              onClick={loadData}
              disabled={loading}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/80 disabled:opacity-50"
              aria-label="بروزرسانی"
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} aria-hidden />
            </button>
          </div>

          {loading ? (
            <div className="space-y-3" aria-busy="true" aria-label="در حال بارگذاری">
              <div className="skeleton h-24 w-full rounded-2xl" />
              <div className="skeleton h-36 w-full rounded-2xl" />
              <div className="skeleton h-14 w-full rounded-2xl" />
            </div>
          ) : null}

          {!loading && error && !subscriptionInfo ? (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 px-5 py-10 text-center space-y-3">
              <AlertCircle className="mx-auto h-9 w-9 text-red-300/80" aria-hidden />
              <p className="text-sm font-semibold text-white">{error}</p>
              <div className="flex flex-wrap justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={loadData}
                  className="btn btn-primary min-h-11 px-5 text-sm inline-flex items-center gap-2"
                >
                  <RefreshCw size={16} aria-hidden />
                  تلاش مجدد
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/subscriptions")}
                  className="min-h-11 rounded-xl border border-white/12 bg-white/[0.04] px-5 text-sm font-semibold text-white/80"
                >
                  مشاهده اشتراک‌ها
                </button>
              </div>
            </div>
          ) : null}

          {!loading && subscriptionInfo ? (
            <section className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/[0.12] to-[#121216] p-4">
              <div
                aria-hidden
                className="pointer-events-none absolute -left-6 top-0 h-20 w-20 rounded-full bg-primary/20 blur-3xl"
              />
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-bold text-emerald-300">
                  <Ticket size={12} aria-hidden />
                  {subscriptionInfo.plan_name || "اشتراک فعال"}
                </span>
                {subscriptionInfo.days_remaining != null ? (
                  <span className="text-xs font-semibold text-primary">
                    {formatPersianNumber(subscriptionInfo.days_remaining)} روز باقی
                  </span>
                ) : null}
              </div>
              <div className="relative z-10 mt-3 grid grid-cols-3 gap-2">
                <div className="rounded-xl bg-black/25 px-2 py-2 text-center">
                  <p className="text-[10px] text-white/40">باقی‌مانده</p>
                  <p className="text-base font-black text-white tabular-nums mt-0.5">
                    {formatPersianNumber(subscriptionInfo.tokens_remaining ?? 0)}
                  </p>
                </div>
                <div className="rounded-xl bg-black/25 px-2 py-2 text-center">
                  <p className="text-[10px] text-white/40">مصرف‌شده</p>
                  <p className="text-base font-black text-white tabular-nums mt-0.5">
                    {formatPersianNumber(subscriptionInfo.tokens_used ?? 0)}
                  </p>
                </div>
                <div className="rounded-xl bg-black/25 px-2 py-2 text-center">
                  <p className="text-[10px] text-white/40">کل بلیت</p>
                  <p className="text-base font-black text-white tabular-nums mt-0.5">
                    {formatPersianNumber(subscriptionInfo.tokens_total ?? 0)}
                  </p>
                </div>
              </div>
            </section>
          ) : null}

          {!loading && error && subscriptionInfo ? (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200"
            >
              <AlertCircle size={18} className="shrink-0 mt-0.5" aria-hidden />
              <p>{error}</p>
            </div>
          ) : null}

          {!loading && subscriptionInfo ? (
            <section className="space-y-3">
              {activeToken ? (
                <article className="rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.06] p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden />
                      بلیت فعال
                    </span>
                    <span className="font-mono text-xs text-white/70 tabular-nums">
                      {activeToken.timeRemaining}
                    </span>
                  </div>

                  <p className="text-[11px] text-white/50 text-center leading-relaxed">
                    این بلیت برای همه باشگاه‌های قابل دسترس شما معتبر است
                  </p>

                  <div className="flex items-center gap-2 rounded-xl bg-black/30 px-3 py-2.5">
                    <code
                      className="flex-1 min-w-0 truncate text-sm font-mono text-white text-left"
                      dir="ltr"
                    >
                      {activeToken.token_code}
                    </code>
                    <button
                      type="button"
                      onClick={() => setShowCopyModal(true)}
                      className="inline-flex min-h-9 min-w-9 items-center justify-center rounded-lg text-primary hover:bg-white/5"
                      aria-label="کپی بلیت"
                    >
                      <Copy size={16} aria-hidden />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setShowQRModal(true)}
                      className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-primary/15 text-sm font-semibold text-primary border border-primary/25"
                    >
                      <QrCode size={16} aria-hidden />
                      نمایش QR
                    </button>
                    <button
                      type="button"
                      onClick={() => downloadQr(activeToken)}
                      className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] text-sm font-semibold text-white/80"
                    >
                      <Download size={16} aria-hidden />
                      دانلود
                    </button>
                  </div>
                </article>
              ) : (
                <article className="rounded-2xl border border-white/[0.08] bg-[#121216] p-5 text-center space-y-4">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                    <Ticket size={28} aria-hidden />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-base font-extrabold text-white">دریافت بلیت ورود</h2>
                    <p className="text-xs text-white/50 leading-relaxed max-w-xs mx-auto">
                      یک بلیت صادر می‌شود و در همه باشگاه‌های قابل دسترس شما قابل استفاده است.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={requestUniversalToken}
                    disabled={!canGenerate}
                    className="btn btn-primary w-full min-h-12 text-sm inline-flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {requesting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" aria-hidden />
                        در حال صدور…
                      </>
                    ) : remaining <= 0 ? (
                      "بلیت باقی‌مانده ندارید"
                    ) : (
                      <>
                        <Ticket size={18} aria-hidden />
                        صدور بلیت ورود
                      </>
                    )}
                  </button>
                  {remaining <= 0 ? (
                    <button
                      type="button"
                      onClick={() => navigate("/subscriptions")}
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      تمدید یا خرید اشتراک
                    </button>
                  ) : null}
                </article>
              )}
            </section>
          ) : null}

          {!loading && subscriptionInfo ? (
            <button
              type="button"
              onClick={() => navigate("/gym/all?access=mine")}
              className="flex w-full items-center justify-between gap-3 rounded-2xl border border-white/[0.08] bg-[#121216] px-4 py-3.5 text-right active:scale-[0.99] transition-transform"
            >
              <ChevronLeft size={18} className="shrink-0 text-white/35" aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-white">باشگاه‌های قابل دسترس</p>
                <p className="text-[11px] text-white/45 mt-0.5">
                  {accessibleGyms.length > 0
                    ? `${formatPersianNumber(accessibleGyms.length)} باشگاه در اشتراک شما`
                    : "مشاهده لیست باشگاه‌ها"}
                </p>
              </div>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <Building2 size={18} aria-hidden />
              </span>
            </button>
          ) : null}

          {!loading && pastTokens.length > 0 ? (
            <section className="space-y-2" aria-label="سوابق بلیت">
              <h2 className="flex items-center gap-2 text-[0.9rem] font-bold text-white">
                <span className="inline-block h-3.5 w-1 rounded-full bg-primary-container" aria-hidden />
                سوابق اخیر
              </h2>
              <div className="space-y-1.5">
                {pastTokens.map((t) => {
                  const meta = statusMeta(t.status);
                  const Icon = meta.Icon;
                  return (
                    <div
                      key={t.id}
                      className="flex items-center justify-between gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5"
                    >
                      <code className="text-[11px] font-mono text-white/50 truncate" dir="ltr">
                        {t.token_code}
                      </code>
                      <span
                        className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold ${meta.className}`}
                      >
                        <Icon size={11} aria-hidden />
                        {meta.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>
          ) : null}
        </div>
      </main>

      {showQRModal && activeToken ? (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="کد QR بلیت"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            aria-label="بستن"
            onClick={() => setShowQRModal(false)}
          />
          <div className="relative z-10 w-full max-w-sm rounded-t-3xl sm:rounded-2xl border border-white/10 bg-[#121216] p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-white">کد QR ورود</h3>
              <button
                type="button"
                onClick={() => setShowQRModal(false)}
                className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-xl border border-white/10 text-white/70"
                aria-label="بستن"
              >
                <X size={18} aria-hidden />
              </button>
            </div>
            <p className="text-xs text-white/50 text-center">
              معتبر برای همه باشگاه‌های قابل دسترس
            </p>
            <div className="mx-auto flex aspect-square w-52 items-center justify-center rounded-2xl border border-white/10 bg-white p-3">
              {activeToken.qr_code ? (
                <img
                  src={activeToken.qr_code}
                  alt="QR Code"
                  className="h-full w-full object-contain"
                />
              ) : (
                <QrCode className="h-16 w-16 text-black/30" aria-hidden />
              )}
            </div>
            <code className="block text-center font-mono text-sm text-white tracking-wide" dir="ltr">
              {activeToken.token_code}
            </code>
            <p className="text-center text-[11px] text-white/45">
              اعتبار تا:{" "}
              <span className="font-mono text-white/70">{activeToken.timeRemaining}</span>
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowQRModal(false);
                  setShowCopyModal(true);
                }}
                className="min-h-11 rounded-xl border border-white/12 bg-white/[0.04] text-sm font-semibold text-white/85 inline-flex items-center justify-center gap-1.5"
              >
                <Copy size={15} aria-hidden />
                کپی
              </button>
              <button
                type="button"
                onClick={() => downloadQr(activeToken)}
                className="btn btn-primary min-h-11 text-sm inline-flex items-center justify-center gap-1.5"
              >
                <Download size={15} aria-hidden />
                دانلود
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {showCopyModal && activeToken ? (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="کپی بلیت"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            aria-label="بستن"
            onClick={() => setShowCopyModal(false)}
          />
          <div className="relative z-10 w-full max-w-sm rounded-t-3xl sm:rounded-2xl border border-white/10 bg-[#121216] p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-white">کپی کد بلیت</h3>
              <button
                type="button"
                onClick={() => setShowCopyModal(false)}
                className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-xl border border-white/10 text-white/70"
                aria-label="بستن"
              >
                <X size={18} aria-hidden />
              </button>
            </div>
            <input
              type="text"
              readOnly
              value={activeToken.token_code}
              dir="ltr"
              className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-center font-mono text-sm text-white outline-none"
              onFocus={(e) => e.currentTarget.select()}
            />
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setShowCopyModal(false)}
                className="min-h-11 rounded-xl border border-white/12 bg-white/[0.04] text-sm font-semibold text-white/80"
              >
                بستن
              </button>
              <button
                type="button"
                onClick={copyToClipboard}
                className={`min-h-11 rounded-xl text-sm font-bold inline-flex items-center justify-center gap-1.5 ${
                  copyFeedback
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : "btn btn-primary"
                }`}
              >
                {copyFeedback ? (
                  <>
                    <CheckCircle2 size={16} aria-hidden />
                    کپی شد
                  </>
                ) : (
                  <>
                    <Copy size={16} aria-hidden />
                    کپی کن
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <BottomNavigation />
    </div>
  );
}
